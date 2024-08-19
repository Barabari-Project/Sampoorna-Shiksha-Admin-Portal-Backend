import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addToy } from '../controllers/toyController.js';

const router = express.Router();

router.post('/',
    authMiddleware,
    addToy
);

export default router;