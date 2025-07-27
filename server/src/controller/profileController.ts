import {Request, Response} from "express";

export class ProfileController {

    public getProfile =  (req: Request, res: Response)=>  {
        if (!req.session.user){
            res.status(200).json({
                success: false,
            })
            return
        }

        res.status(200).json({
            success: true,
            userEmail: req.session.user.email
        })
    }
}