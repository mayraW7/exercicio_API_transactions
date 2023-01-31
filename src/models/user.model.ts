import {v4 as uuidCreator} from 'uuid';
import { Transactions } from './transactions.model';

export class User {
    public id: string;
    public transactions: Transactions[];

    constructor(public name: string,public cpf: number,public email: string, public age: number){
        this.id = uuidCreator();
        this.transactions = [];
    }
}