import express, { Request, Response } from 'express';
import { userRoutes } from './routes/user.routes';

const app = express();
app.use(express.json());


app.use("/users", userRoutes);


//http://localhost:7007
app.listen(7007, ()=>{
    console.log("servidor rodando!");
});