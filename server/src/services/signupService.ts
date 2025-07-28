import {User} from "../models/user";
import bcrypt from 'bcryptjs'
import {CustomResponse} from "../types/commonTypes";

export class SignupService{
   public async signup(email: string, password: string): Promise<CustomResponse> {
        let response: CustomResponse = {
            success: false,
            message: 'something went wrong'
        }

        const validation = this.validateEmailAndPassword(email, password)
        if (!validation.success){
            response.message = validation.message
            return response
        }

        const isAlreadyRegisteredUser = await this.isAlreadyRegisteredUser(email);
        if (isAlreadyRegisteredUser){
            response.message = 'User with the email is already registered'
            return response
        }

        const hashedPassword =await bcrypt.hash(password, 10)
        await User.create({
            email: email,
            password: hashedPassword,
        })

       response.success = true
       response.message = 'User registered successfully'
       return response
    }

    private async isAlreadyRegisteredUser(email: string): Promise<boolean> {
       const user: User|null = await User.findOne({where: {email: email}})
        return Boolean(user)
    }

    private validateEmailAndPassword(email: string, password: string): CustomResponse {
        if (email.length <= 0 || password.length <= 0) {
            return {
                success: false,
                message: 'Missing requires fields'
            }
        }

        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailReg.test(email)){
            return {
                success: false,
                message: 'Invalid email'
            }
        }

        if (password.length < 6 || password.length > 15){
            return {
                success: false,
                message: 'invalid length of password'
            }
        }

        return {
            success: true,
            message: 'successfully validated'
        }
    }
}

