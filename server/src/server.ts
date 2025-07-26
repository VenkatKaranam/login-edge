import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({path: '../.env'});

const app :Express = express();

app.post('/api/login', (req: Request, res: Response)=>{
    console.log('reached')
    res.status(200).json(
        {
            success: 'true',
            message: 'running'
        }
    )
});

app.use(express.static(path.join(__dirname, '../public')))

app.use((req:Request, res:Response) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
});

const PORT:string = process.env.NODE_SERVER_PORT || '3000';
app.listen(PORT, ()=> {
    console.log(`Server started as port ${PORT}`);
})