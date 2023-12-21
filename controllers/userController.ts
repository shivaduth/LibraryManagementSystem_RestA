import {Response, NextFunction} from 'express';
import * as logServices from '../services/logService';
import * as userServices from '../services/userService';
import * as adminServices from '../services/adminService'
import { IGetUserAuthInfoRequest, Users, Books} from "../serviceTypes"



export const registerUser = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
        const result: Users = await logServices.userRegistration(req.body);
        if(result.message)
            res.status(result.status).json({message: result.message});
        else
            res.status(result.status).json(result.user);
    }
    catch (err: unknown) {
        if(err instanceof Error)
            res.status(500).json({message: err.message});
    }
}


export const loginUser = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result: Users = await logServices.userLogin(req.body.username, req.body.password, Object.values(req.body).length);
        if(result.message)
            res.status(result.status).json({message: result.message});
        else
            res.status(result.status).json(result.user);
    }
    catch (err: unknown) {
        if(err instanceof Error)
            res.status(500).json({message: err.message});
    }
}


export const setBooks =async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
        const result: Books = await adminServices.addBook(req.body, req.user);
        if(result.message)
            res.status(result.status).json({message: result.message});
        else
            res.status(result.status).json(result.book);
    }
    catch (err: unknown) {
        if(err instanceof Error)
            res.status(500).json({message: err.message});
    }
}



export const getAvailBooks = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
        const result: Books = await userServices.availableBooks(req.user);
        if (result.message)
            res.status(result.status).json({message: result.message});
        else
            res.status(result.status).json(result.books);
    }
    catch (err: unknown) {
        if(err instanceof Error)
            res.status(500).json({message: err.message});
    }
}



export const requestBook = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
        const result: Books = await userServices.requestBook(req.body.name, Object.values(req.body).length, req.user);
        if(result.message)
            res.status(result.status).json({message: result.message});
        else
            res.status(result.status).json(result.books);
    }
    catch (err: unknown) {
        if(err instanceof Error)
            res.status(500).json({message: err.message});
    }
}


export const getIssuedBooks = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
        const result: Books = await userServices.issuedBooks(req.user);
        if (result.message)
            res.status(result.status).json({message: result.message});
        else
            res.status(result.status).json(result.books);
    }
    catch (err: unknown) {
        if(err instanceof Error)
            res.status(500).json({message: err.message});
    }
}


export const returnIssuedBook = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
        const result: Books = await userServices.returnBook(req.params.id, req.user);
        if(result.message)
            res.status(result.status).json({message: result.message});
        else
            res.status(result.status).json(result.book); 
    }
    catch (err: unknown) {
        if(err instanceof Error)
            res.status(500).json({message: err.message});
    }
}


export const getStudentData =async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
        
        const result: Users = await adminServices.getStudents(req.params.id, req.user);
        if(result.message)
            res.status(result.status).json({message: result.message});
        else
            res.status(result.status).json(result.users); 
    }
    catch (err: unknown) {
        if(err instanceof Error)
            res.status(500).json({message: err.message});
    }
}


export const getBooksData =async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
        
        const result: Users = await adminServices.getIssuedBooks(req.params.id, req.user);
        if(result.message)
            res.status(result.status).json({message: result.message});
        else
            res.status(result.status).json(result.users); 
    }
    catch (err: unknown) {
        if(err instanceof Error)
            res.status(500).json({message: err.message});
    }
}


module.exports = {
    registerUser: registerUser,
    loginUser: loginUser,
    setBooks: setBooks,
    getAvailBooks: getAvailBooks,
    requestBook: requestBook,
    getIssuedBooks: getIssuedBooks,
    returnIssuedBook: returnIssuedBook,
    getStudentData: getStudentData,
    getBooksData: getBooksData
}




















































