import { Request, Response, NextFunction, json } from 'express';
import {Router} from 'express';
const router = Router();

const controller = require('../controllers/userController'); 
const services = require('../services/logService');




router.post('/register', controller.registerUser);

router.post('/login', controller.loginUser);

router.post('/addBook', services.authenticateToken, controller.setBooks);

router.get('/availableBooks', services.authenticateToken, controller.getAvailBooks);

router.post('/requestBook', services.authenticateToken, controller.requestBook);

router.get('/issuedBooks', services.authenticateToken, controller.getIssuedBooks);

router.put('/returnBook/:id', services.authenticateToken, controller.returnIssuedBook);

router.get('/getStudentsByBookName/:id', services.authenticateToken, controller.getStudentData);

router.get('/getBooksByUserName/:id', services.authenticateToken, controller.getBooksData);

module.exports = router;

export default router;






























































