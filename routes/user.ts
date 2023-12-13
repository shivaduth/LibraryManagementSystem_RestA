import { Request, Response, NextFunction, json } from 'express';
import express from 'express';


const controller = require('../controllers/userController'); 
const services = require('../services/logService');
const router = express.Router();




router.post('/register', controller.registerUser);

router.post('/login', controller.userLogger);

router.post('/addBook', services.authenticateToken, controller.setBooks);

router.get('/availableBooks', services.authenticateToken, controller.getAvailBooks);

router.post('/requestBook', services.authenticateToken, controller.requestBook);

router.get('/issuedBooks', services.authenticateToken, controller.getIssuedBooks);

router.put('/returnBook/:id', services.authenticateToken, controller.returnIssuedBook);

router.get('/getStudentsByBookName/:id', services.authenticateToken, controller.getStudentData);

router.get('/getBooksByUserName/:id', services.authenticateToken, controller.getBooksData);

module.exports = router;

export default router;






























































// router.delete('/removeBook/:id', services.authenticateToken, controller.deleteBook);
