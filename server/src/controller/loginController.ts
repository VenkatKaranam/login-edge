import {Request, Response} from "express";
import {LoginService} from "../services/loginService";
import {CustomResponse} from "../types/commonTypes";

export class LoginController {

    public login =  async (req: Request, res: Response)=>  {
        const response:CustomResponse = await new LoginService().login(req)
        res.status(200).json(response)
    }
}