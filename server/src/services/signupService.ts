import {User} from "../models/user";
import { hash } from 'bcrypt'
import {CustomResponse} from "../types/commonTypes";
import {validateEmailAndPasswordWithLengths} from "../utils/validation";

export class SignupService{
   public async signup(email: string, password: string): Promise<CustomResponse> {
        let response: CustomResponse = {
            success: false,
            message: 'something went wrong'
        }

        const validation = validateEmailAndPasswordWithLengths(email, password)
        if (!validation.success){
            response.message = validation.message
            return response
        }

        const isAlreadyRegisteredUser = await this.isAlreadyRegisteredUser(email);
        if (isAlreadyRegisteredUser){
            response.message = 'User with the email is already registered'
            return response
        }

        const hashedPassword =await hash(password, 10)
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
}

