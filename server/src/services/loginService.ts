import {CustomResponse, LoginValidation} from "../types/commonTypes";
import {User} from "../models/user";
import {Op} from "sequelize";
import UserLoginAttempt from "../models/userLoginAttempt";
import Ip from "../models/ip";
import bcrypt from "bcryptjs";
import {Request} from "express";
import {getClientIp} from "../utils/utils";

export class LoginService{

    private config

    constructor() {
        this.config = {
            maxAttempts: 5,
            windowMin: 5,
            lockMin: 15
        }
    }

    public async login(req: Request){
        const {email, password} = req.body
        const ip = getClientIp(req)
        if (!Boolean(ip)){
            return {
                success: false,
                message: 'Unable to get ip'
            }
        }


        const [ipRecord] = await Ip.findOrCreate({
            where: {ipAddress: ip}
        });


        const validation = await this.validateLogin(email, password, ipRecord)

        await UserLoginAttempt.create({
            userId: validation.user?.id,
            ipId: ipRecord.id,
            success: validation.success
        })
        
        if (!validation.success){
           return  {
               success: false,
               message: validation.message
            }
        }

        req.session.user = validation.user

        return {
            success: true,
            message: 'Successfully login'
        }
    }


    public async validateLogin(email: string, password: string, ip: Ip): Promise<LoginValidation> {
        let response: LoginValidation = {
            success: false,
            message: 'Something went wrong!',
        }

        const isIpBlocked = await this.ipBlocked(ip);
        if (isIpBlocked){
            response.message = 'Ip temporarily blocked due to excessive failed login attempts.'
            return response
        }

        const validation = this.validateEmailAndPassword(email, password);
        if (!validation.success){
            response.message = validation.message
            return response
        }

        const user: any = await User.findOne({where: {email: email}})
        if (!user) {
            response.message = 'Account not found with email'
            return response
        }

        const userSuspension = await this.userSuspension(user)
        if (userSuspension){
            response.message = 'Account temporarily suspended due to too many failed attempts. '
            return response
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid){
            response.message = 'Provided invalid credentials'
            return response
        }
        response.success = true
        response.message = "Successfully Login"
        response.user = user
        return response
    }

    public validateEmailAndPassword(email: string, password: string): CustomResponse {
        if (email.length <= 0 || password.length <= 0) {
            return {
                success: false,
                message: 'Missing required fields'
            }
        }

        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailReg.test(email)){
            return {
                success: false,
                message: 'Invalid email'
            }
        }

        return {
            success: true,
            message: 'Successfully validated'
        }
    }

    private async userSuspension(user:any): Promise<boolean> {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - (5 * 60 * 1000));

        if (user.suspendedTill && user.suspendedTill >= now){
            return true;
        }

        const userAttempts = await UserLoginAttempt.findAll({
            where: {
                userId: user.id,
                success: false,
                createdAt:{
                    [Op.gte]: fiveMinutesAgo
                }
            }}
        )

        if (userAttempts.length > this.config.maxAttempts) {
            const fifteenMinutesLater = new Date(now.getTime() + (15 * 60 * 1000));
            await user.update({suspendedTill: fifteenMinutesLater})
            return true;
        }

        return false
    }

    private async ipBlocked(ip: Ip): Promise<boolean>{
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - (this.config.windowMin * 60 * 1000));

        if (ip.blockedTill && ip.blockedTill >= now){
            return true
        }

        const userAttempts = await UserLoginAttempt.findAll({
            where: {
                ipId: ip.id,
                success: false,
                createdAt:{
                    [Op.gte]: fiveMinutesAgo
                }
            }}
        )

        if (userAttempts.length > this.config.maxAttempts) {
            const fifteenMinutesLater = new Date(now.getTime() + (this.config.lockMin * 60 * 1000));
            await ip.update({blockedTill: fifteenMinutesLater})
            return true;
        }

        return false
    }

}