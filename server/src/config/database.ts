import {Sequelize} from "sequelize-typescript";
import Ip from '../models/ip';
import UserLoginAttempt from "../models/userLoginAttempt";
import {User} from "../models/user";

const sequelize =new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [User, UserLoginAttempt,Ip,],
    logging: false
});

export default sequelize;