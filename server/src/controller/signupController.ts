import {Request, Response} from "express";
import {SignupService} from "../services/signupService";

export class SignupController {

    public signup = async (req: Request, res: Response) => {
        const {email, password} = req.body
        const response = await new SignupService().signup(email, password);
        res.status(200).json(response)
    }
}