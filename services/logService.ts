
import { v4 as uuidv4 } from 'uuid';
import { Response, NextFunction, response, Request } from 'express';
import bcryptjs from 'bcryptjs';
import { JsonWebTokenError } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest, User, Users, jwtUser } from "../serviceTypes";
import { RES_STATUS, logQueries } from '../constants';
import { databaseQuery } from '../database/db_queryFunction';
import { resolve } from 'path';
import { rejects } from 'assert';
import {QueryResult} from 'pg'


export const userRegistration = async (body: Request["body"]): Promise<Users> => {
    return new Promise(async (resolve, reject) => {
        try {
            const validate: Users | null = registrationValidator(body);
            if (validate)
                return resolve(validate);
            let regexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            if(!regexp.test(body.email))
                return resolve({ status: RES_STATUS.BADREQUEST, message: "Email Id invalid" });
            const user: QueryResult = await databaseQuery(logQueries.Register.user, [body.email]);
            if (user.rowCount)
                return resolve({ status: RES_STATUS.BADREQUEST, message: 'User already exits' });
            const hashedPassword: string = await bcryptjs.hash(body.password, 10);
            const userId: string = uuidv4();
            await databaseQuery(logQueries.Register.adduser, [userId, body.role.toLowerCase(), body.name, body.email, hashedPassword, userId,  userId]);
            //const ans: QueryResult = await databaseQuery(logQueries.Register.addeduser, [body.email])
            return resolve({ status: RES_STATUS.SUCCESS, message: 'User Registered Successfully'});
        }
        catch (err) {
            return reject(err);
        }
    });
}


export const userLogin = async (username: string, password: string, numberParams: number): Promise<Users> => {
    return new Promise(async (resolve, reject) => {
        try {
            const validate: Users | null = loginValidator(username, password, numberParams);
            if (validate)
                return resolve(validate);
            let passCode: QueryResult = await databaseQuery(logQueries.login.passcode, [username]);
            if (!passCode.rowCount)
                return resolve({ status: RES_STATUS.NOTFOUND, message: 'User not exists' });
            const passKey = passCode.rows[0];
            if (await bcryptjs.compare(password, passKey.passcode)) {
                const user: User = { id: passKey.id, email: username, role: passKey.role };
                const accessToken: string = jwt.sign(user, String(process.env.SECRET_TOKEN), { expiresIn: "12000s" });
                return resolve({ status: RES_STATUS.SUCCESS, user: { accessToken: accessToken } });
            }
            else
                return resolve({ status: RES_STATUS.UNATHURIZED, message: 'Invalid Password' });
        }
        catch (err) {
            return reject(err);
        }
    });
}


export function authenticateToken(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined {
    const token: string | undefined = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(RES_STATUS.UNATHURIZED).json({ message: 'Requires Token or authentication' });
    jwt.verify(token, String(process.env.SECRET_TOKEN), (err: unknown, user: any) => {
        if (err)
            return res.status(RES_STATUS.UNATHURIZED).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
}








export function registrationValidator(body: Request["body"]): Users | null{
    if(Object.values(body).length == 0)
        return { status: RES_STATUS.BADREQUEST, message: "Four parameters required" };
    else if (!body.role)
        return { status: RES_STATUS.BADREQUEST, message: "Role required" };
    else if (!body.name)
        return { status: RES_STATUS.BADREQUEST, message: "Name required" };
    else if (!body.email)
        return { status: RES_STATUS.BADREQUEST, message: "Email required" };
    else if (!body.password)
        return { status: RES_STATUS.BADREQUEST, message: "Password required" };
    else if (body.password.length < 5)
        return { status: RES_STATUS.BADREQUEST, message: "Password must be atleast 5 digit long" };
    else if (Object.values(body).length != 4)
        return { status: RES_STATUS.BADREQUEST, message: "Four parameters required" };
    else if (body.role.toLowerCase() != 'user' && body.role.toLowerCase() != 'admin')
        return { status: RES_STATUS.BADREQUEST, message: "Roles are only admin and user" };
    else
        return null;
}



export function loginValidator(username: string, password: string, numberParams: number): Users | null {
    if(numberParams == 0)
        return { status: RES_STATUS.BADREQUEST, message: "Two parameters required" };
    else if (!username)
        return { status: RES_STATUS.BADREQUEST, message: "Username required" };
    else if (!password)
        return { status: RES_STATUS.BADREQUEST, message: "Password required" };
    else if (numberParams != 2)
        return { status: RES_STATUS.BADREQUEST, message: "Two parameters required" };
    else
        return null;
}













/*
    switch (body){
        case !body.role:
            return {status : RES_STATUS.BADREQUEST, message: "Role required"};
        case !body.name:
            return {status : RES_STATUS.BADREQUEST, message: "Name required"};
        case !body.email:
            return {status : RES_STATUS.BADREQUEST, message: "Email required"};
        case !body.password:
            return {status : RES_STATUS.BADREQUEST, message: "Password required"};
        case body.role.toLowerCase() != 'user' && body.role.toLowerCase() != 'admin':
            return {status : RES_STATUS.BADREQUEST, message: "Roles are only admin and user"};
        case Object.values(body).length != 4:
            return {status : RES_STATUS.BADREQUEST, message: "Four parameters required"};
        default:
            return null; 
    }*/
