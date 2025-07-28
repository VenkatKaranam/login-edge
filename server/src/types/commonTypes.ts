import {Model} from "sequelize";
import {User} from "../models/user";
import Ip from "../models/ip";

export interface CustomResponse {
    success: boolean
    message: string
}

export interface LoginValidation extends CustomResponse {
    user?: User
}