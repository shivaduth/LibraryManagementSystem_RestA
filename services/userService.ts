import {Books, User} from "../serviceTypes"
import { adminQueries, RES_STATUS, userQueries } from '../constants';
import { databaseQuery} from '../database/db_queryFunction';
import {QueryResult} from 'pg'


export const availableBooks = async (reqUser: User): Promise<Books> => {
    return new Promise(async (resolve, reject) => {
        try {
            if(reqUser.role == 'admin'){
                const ans: QueryResult = await databaseQuery(adminQueries.allBooks.books);
                if(!ans.rowCount)
                    return resolve({status: RES_STATUS.NOTFOUND, message: 'No books'});
                return resolve({status: RES_STATUS.SUCCESS,  books: ans.rows});
            }
            const ans: QueryResult = await databaseQuery(userQueries.AvailBooks.availBooks);
            if(!ans.rowCount)
                return resolve({status: RES_STATUS.NOTFOUND, message: 'No available books'});
            return resolve({status: RES_STATUS.SUCCESS,  books: ans.rows});
        }
        catch (err) {
            return reject(err);
        }
    });
}


export const requestBook = async (bookName: string, numberParams: number, reqUser: User): Promise<Books> => {
    return new Promise(async (resolve, reject) => {
        try {
            if(reqUser.role == 'admin')
                return resolve({status: RES_STATUS.NOTATHURIZED, message: 'Forbidden not allowed'});
            if(!bookName)
                return resolve({status: RES_STATUS.BADREQUEST, message: 'Book name required'});
            if(numberParams != 1)
                return resolve({status: RES_STATUS.BADREQUEST, message: 'Only one parameters required'});
            let regexp = /[a-z0-9]+/gi;
            let entry: string[] | null = bookName.match(regexp);
            let book_name = entry?.join(' ');
            book_name?.toString();
            const book: QueryResult = await databaseQuery(userQueries.RequestBook.book, [book_name])
            if(!book.rowCount)
                return resolve({status: RES_STATUS.BADREQUEST, message: 'Book name invalid'});
            const bookId: string = book.rows[0].id;
            const userId = reqUser.id;
            const userBookMaped: QueryResult = await databaseQuery(userQueries.RequestBook.user_mapped,[bookId, userId]);
            if(userBookMaped.rowCount)
                return resolve({status: RES_STATUS.BADREQUEST, message: 'Book already issued'});
            const availableBooks: QueryResult = await databaseQuery(userQueries.RequestBook.get_available, [bookId]);
            if(!availableBooks.rowCount)
                return resolve({status: RES_STATUS.NOTFOUND, message: 'No available books'});
            await databaseQuery(userQueries.RequestBook.add_maping,[bookId, userId, userId, userId]);
            await databaseQuery(userQueries.RequestBook.update_books, [userId, bookId]);
            const ans: QueryResult = await databaseQuery(userQueries.RequestBook.issued_book, [bookId]);
            return resolve({status: RES_STATUS.SUCCESS, books: ans.rows[0]});
        }
        catch(err) {
            return reject(err);
        }
    });
}



export const issuedBooks = async (reqUser: User): Promise<Books> =>{
    return new Promise(async (resolve, reject) => {
        try {
            if(reqUser.role == 'admin'){
                const ans: QueryResult = await databaseQuery(adminQueries.issuedBooks.books);
                if(!ans.rowCount)
                    return resolve({status: RES_STATUS.NOTFOUND, message: 'No issued books'});
                return resolve({status: RES_STATUS.SUCCESS, books: ans.rows});
            }
            const userId = reqUser.id//user.rows[0].id;
            const ans: QueryResult = await databaseQuery(userQueries.IssuedBooks.books, [userId]);
            if(!ans.rowCount)
                return resolve({status: RES_STATUS.NOTFOUND, message: 'No issued books'});
            return resolve({status: RES_STATUS.SUCCESS, books: ans.rows});
        }
        catch(err) {
            return reject(err);
        }
    });
}


export const returnBook =async (bookName: string, reqUser: User): Promise<Books> => {
    return new Promise(async (resolve, reject) => {
        try {
            if(reqUser.role == 'admin')
                return resolve({status: RES_STATUS.NOTATHURIZED, message: 'Forbidden not allowed'});
            if(!bookName)
                return resolve({status: RES_STATUS.BADREQUEST, message: 'Book Id required'});
            let regexp = /[a-z0-9]+/gi;
            let entry: string[] | null = bookName.match(regexp);
            let book_name = entry?.join(' ');
            book_name?.toString();
            const book: QueryResult = await databaseQuery(userQueries.ReturnBook.book, [book_name])
            if(!book.rowCount)
                return resolve({status: RES_STATUS.BADREQUEST, message: 'Book Id invalid'});
            const bookId: string = book.rows[0].id
            const userId: string | undefined = reqUser.id;
            const issued: QueryResult = await databaseQuery(userQueries.ReturnBook.issued, [userId, bookId]);
            if(!issued.rowCount)
                return resolve({status: RES_STATUS.NOTFOUND, message: 'No issued books'});
            await databaseQuery(userQueries.ReturnBook.delete,[bookId, userId]);
            //const date: Date = new Date();
            await databaseQuery(userQueries.ReturnBook.update, [userId, bookId]);
            const ans: QueryResult = await databaseQuery(userQueries.ReturnBook.availBooks, [bookId]);
            return resolve({status: RES_STATUS.SUCCESS, book: ans.rows[0]});
        }
        catch(err) {
            return reject(err);
        }
    });
}
