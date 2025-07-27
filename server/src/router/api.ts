import express from "express";
import {LoginController} from "../controller/loginController";
import {SignupController} from "../controller/signupController";
import {ProfileController} from "../controller/profileController";

const apiRouter = express.Router();

apiRouter.post('/api/login', new LoginController().login)

apiRouter.post('/api/signup', new SignupController().signup)

apiRouter.get('/api/profile', new ProfileController().getProfile)

export default apiRouter