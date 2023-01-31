// import { Request, Response } from "express";
// import { usersList } from "../data/user";
// import { User } from "../models/user.model";

// export class userController {
//     public create (req: Request, res: Response) {
//         try {
//             const { name, cpf, email, age } = req.body;
            
//             if(!name){
//                 return res.status(400).send({
//                     ok: false,
//                     message: 'Name not provided',
//             });
//         }
//             if(!cpf){
//                 return res.status(400).send({
//                     ok: false,
//                     message: 'CPF not provided',
//             });
//             }
//             if(!email){
//                 return res.status(400).send({
//                     ok: false,
//                     message: 'Email not provided',
//             });}
//             if(!age){
//                 return res.status(400).send({
//                     ok: false,
//                     message: 'Age not provided',
//             });}


//             if(usersList.some(user => user.cpf === cpf)){
//                 return res.status(400).send({
//                     ok: false,
//                     message: 'CPF already exists'
//                 })
//             }
//             const user = new User(name,cpf,email,age);

//             usersList.push(user);

//             return res.status(201).send({
//                 ok: true,
//                 data: usersList
//             })

//         } catch (error: any) {
//             return res.status(500).send({
//                 ok: false,
//                 message: error.toString()
//             });
//         }
//     }
// }