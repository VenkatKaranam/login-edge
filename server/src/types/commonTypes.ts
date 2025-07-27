import {Model} from "sequelize";

export interface CustomResponse {
    success: boolean
    message: string
}

export interface LoginValidation extends CustomResponse {
    user: any
}