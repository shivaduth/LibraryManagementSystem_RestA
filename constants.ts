import { type } from "os"
type status = {
    SUCCESS: number,
    BADREQUEST: number,
    UNATHURIZED: number,
    NOTATHURIZED: number,
    NOTFOUND: number
}

interface addBook {
    lib_id: string;
    addBook: string;
    book: string;
}

interface availBook  {
    availBooks: string;
}

interface raiseBook  {
    user: string;
    user_mapped: string;
    get_available: string;
    add_maping: string;
    update_books: string;
    issued_books: string;
}

interface userqueries {
    [key: string]: addBook | availBook | raiseBook;
  }
export const RES_STATUS: status = {
    SUCCESS: 200,
    BADREQUEST: 400,
    UNATHURIZED: 401,
    NOTATHURIZED: 403,
    NOTFOUND: 404
}

export const userQueries = {
    'AvailBooks': {
        availBooks: 'SELECT name, available_count FROM books WHERE available_count > 0'
    },
    'RequestBook': {
        user: `SELECT id FROM users WHERE email = $1`,
        book: `SELECT id FROM books WHERE name ilike $1`,
        user_mapped: `SELECT user_id FROM issuedbooks WHERE book_id = $1 AND user_id = $2`,
        get_available: `SELECT available_count FROM books WHERE id = $1 AND available_count > 0`,
        add_maping: `INSERT INTO issuedbooks (book_id, user_id, created_by, updated_by) VALUES ($1, $2, $3, $4)`,
        update_books: `UPDATE books SET available_count = available_count - 1, issued_count = issued_count + 1, updated_by = $1 WHERE id = $2`,
        issued_book: `SELECT name FROM books WHERE ID = $1`,
        issued_books: `SELECT id, name FROM books WHERE id IN (SELECT book_id FROM issuedbooks WHERE user_id = $1)`
    },
    'IssuedBooks':{
        user: `SELECT id FROM users WHERE email = $1`,
        books: `SELECT name FROM books WHERE id in (SELECT book_id FROM issuedbooks WHERE user_id = $1)`
    },
    'ReturnBook':{
        available: `SELECT issued_count FROM books WHERE id = $1 AND issued_count > 0`,
        issued: `SELECT id, name FROM books WHERE id IN (SELECT book_id FROM issuedbooks WHERE user_id = $1 AND book_id =$2)`,
        delete: `DELETE FROM issuedbooks WHERE book_id = $1 AND user_id = $2`,
        update: `UPDATE books SET available_count = available_count + 1, issued_count = issued_count - 1, updated_by =$1 WHERE id = $2`,
        issued_books: `SELECT id, name FROM books WHERE id IN (SELECT book_id FROM issuedbooks WHERE user_id = $1)`,
        book: `SELECT id FROM books WHERE name ilike $1`,
        availBooks: `SELECT name, available_count FROM books WHERE id = $1`
    }
}

export const adminQueries = {
    'AddBooks' : {
        lib_id: `SELECT id FROM users WHERE email = $1`,
        book_name: `SELECT id, name FROM books WHERE name ilike $1`,
        updateBook: `UPDATE books SET available_count = available_count + $1, updated_by = $2 WHERE id = $3`,
        addBook: `INSERT INTO books (id, name, available_count, created_by, updated_by) VALUES ($1, $2, $3, $4, $5)`,
        book: `SELECT name, available_count, issued_count FROM books WHERE id = $1`,
    }, 
    'allBooks':{
        books: `SELECT name, available_count FROM books`
    },
    'StudentData': {
        students: `SELECT email AS username, name FROM users WHERE id IN (SELECT user_id FROM issuedbooks WHERE book_id = $1)`,
        book: `SELECT id FROM books WHERE name ilike $1`
    },
    'issuedBooks': {
        books: `SELECT name FROM books WHERE issued_count > 0`
    },
    'removeBook':{
        book: `SELECT id, name, available_count, issued_count FROM books WHERE id = $1`,
        deleteBook: `DELETE FROM books WHERE id = $1`,
        books: `SELECT id, name, available_count FROM books`
    },
    'issuedBooksByUserId':{
        user: `SELECT id FROM users WHERE email = $1`,
        books: `SELECT name FROM books WHERE id IN (SELECT book_id FROM issuedbooks WHERE user_id = $1)`,
    }
}
export const logQueries = {
    'Register': {
        user: `SELECT email FROM users WHERE Email = $1`,
        adduser: `INSERT INTO users (id, role, name, email, passcode, created_by,  updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        addeduser: `SELECT id, name, email from users WHERE email = $1`
    },
    'login': {
        passcode: `SELECT passcode, role, id FROM users WHERE Email = $1`
    }
}





