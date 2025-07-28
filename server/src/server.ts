import dotenv from "dotenv";
dotenv.config({path: '../.env'});

import express, {Express, Request, Response} from 'express';
import path from 'path'
import apiRouter from "./router/api";
import sequelize from "./config/database";
import session from "express-session";

const app :Express = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')))

console.log('Connecting to MySQL at host:', process.env.DB_HOST);
console.log('process.env.ENVIRONMENT', process.env.ENVIRONMENT);

sequelize.sync()
    .then(() => console.log('DB Connected'))
    .catch((err)=> console.error('Failed to connect DB', err))

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'professor-from-money-heist',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60,
        },
    })
)

app.use(apiRouter)

app.use((req:Request, res:Response) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
});

const PORT:string = process.env.PORT || '3000';
app.listen(PORT, ()=> {
    console.log(`Server started as port ${PORT}`);
})