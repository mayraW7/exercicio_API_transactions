import { Request, Response, Router } from 'express';
import { usersList } from '../data/user';
import { Transactions } from '../models/transactions.model';
import { User } from '../models/user.model';


// http://localhost:7007/
export const userRoutes = Router();

// POST http://localhost:7007/users
userRoutes.post("/", (req: Request, res: Response) => {
        try {
            const { name, cpf, email, age } = req.body;
            
            if(!name){
                return res.status(400).send({
                    ok: false,
                    message: 'Name not provided',
            });
        }
            if(!cpf){
                return res.status(400).send({
                    ok: false,
                    message: 'CPF not provided',
            });
            }
            if(!email){
                return res.status(400).send({
                    ok: false,
                    message: 'Email not provided',
            });}
            if(!age){
                return res.status(400).send({
                    ok: false,
                    message: 'Age not provided',
            });}


            if(usersList.some(user => user.cpf === cpf)){
                return res.status(400).send({
                    ok: false,
                    message: 'CPF already exists'
                })
            }
            const user = new User(name,cpf,email,age);

            usersList.push(user);

            return res.status(201).send({
                ok: true,
                data: usersList,
            })

        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString()
            });
        }
    }
);

// GET http://localhost:7007/users/:id
userRoutes.get("/:id",(req: Request, res: Response)=>{
    try{
        const { id } = req.params;

        const user = usersList.find(user=> user.id === id);

        if(!user) {
            return res.status(404).send({
                ok:false,
                message: "User not found"
            })
        }
        return res.status(200).send({
            id: user.id,
            name: user.name,
            cpf: user.cpf,
            email: user.email,
            age: user.age
        })

    } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString()
            });
    }
});

//POST http://localhost:7007/users/:userId/transactions
userRoutes.post("/:userId/transactions",(req:Request, res: Response)=>{
    try{
        const { title, value, type} = req.body;
        const { userId } = req.params;
        if(!title){
            return res.status(400).send({
                ok:false,
                message:"Title not provided."
            });
        }
        if(!value){
            return res.status(400).send({
                ok:false,
                message:"Title not provided."
            });
        }
        if(!type){
            return res.status(400).send({
                ok:false,
                message:"Title not provided."
            });
        }
        if(type !== 'income' && type !== 'outcome'){
            return res.status(400).send({
                ok: false,
                message:"Type value is invalid (must be income or outcome)."
            });
        }

        const transaction = new Transactions(title, value, type);

        const user = usersList.find(user => user.id === userId);

        if(!user){
            return res.status(404).send({
                ok: false,
                message: "User not found."
            });
        }
            user.transactions.push(transaction);
            

            return res.status(201).send({
                ok:true,
                data: usersList

            })

        } catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: error.toString()
        });
    }
})

//GET http://localhost:7007/users/:userId/transactions/:id
userRoutes.get("/:userId/transactions/:id",(req:Request, res:Response)=>{
    try{
            const { userId, id}= req.params;

        const user = usersList.find(user => user.id === userId);
        if(!user){
            return res.status(404).send({
                ok: false,
                message: "User not found."
            });
        }

        const transaction = user.transactions.find(transaction => transaction.id === id);
        if(!transaction){
            return res.status(404).send({
                ok: false,
                message: "Transaction not found."
            });
        }
        return res.status(200).send(transaction);

    }catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: error.toString()
        });
    }
})

//GET http://localhost:7007/users/:userId/transactions
userRoutes.get("/:userId/transactions/",(req:Request, res:Response)=>{
    try{
            const { userId}= req.params;

        const user = usersList.find(user => user.id === userId);
        if(!user){
            return res.status(404).send({
                ok: false,
                message: "User not found."
            });
        }
        const alltransactions = user.transactions;

        let incomes = alltransactions.filter((transaction)=>(transaction.type == "income")).reduce((prev, transaction)=>{
            return  prev + transaction.value;
        },0)

        let outcomes = alltransactions.filter((transaction)=>(transaction.type == "outcome")).reduce((prev, transaction)=>{
            return  prev + transaction.value;
        },0)

        let totall = incomes - outcomes;

        return res.status(200).send({
            "transactions": alltransactions,
             "balance": {
                "income": incomes,
                "outcome":outcomes,
                "total": totall
             }
        });

    }catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: error.toString()
        });
    }
})

//PUT http://localhost:7007/users/:userId/transactions/:id
userRoutes.put("/:userId/transactions/:id", (req: Request, res:Response)=>{
    try{
        const{userId, id} = req.params;
        const{title, value, type} = req.body;
        const user = usersList.find(user => user.id === userId);
        if(!user){
            return res.status(404).send({
                ok: false,
                message: "User not found."
            });
        }
        const transaction = user.transactions.find(transaction => transaction.id === id);
        if(!transaction){
            return res.status(404).send({
                ok: false,
                message: "Transaction not found."
            });
        }if(title && value && type)
            transaction.title = title;
            transaction.value = value;
            transaction.type = type;

        return res.status(200).send({
            ok: true,
            message: `Transaction ${id} successfully updated!`,
        });

    }catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: error.toString()
        });
    }    
});

//DELETE http://localhost:7007/users/:userId/transactions/:id
userRoutes.delete("/:userId/transactions/:id", (req: Request, res:Response)=>{
    try{
            const{userId, id} = req.params;
            const user = usersList.find(user => user.id === userId);
            if(!user){
                return res.status(404).send({
                    ok: false,
                    message: "User not found."
                });
            }
            const transaction = user.transactions.find(transaction => transaction.id === id);
            if(!transaction){
                return res.status(404).send({
                    ok: false,
                    message: "Transaction not found."
                });
            }
//            const transactionIndex = transaction.
        
             const indexTransaction = user.transactions.findIndex((transaction) => transaction.id === id);

            user.transactions.splice(indexTransaction, 1);

            return res.status(200).send({
                ok: true,
                message: `Transaction was successfully deleted!`,
            });

    }catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: error.toString()
        });
    }
});