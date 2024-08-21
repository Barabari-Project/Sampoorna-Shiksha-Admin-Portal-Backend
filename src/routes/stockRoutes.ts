import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addNewStock, removeFromStock } from '../controllers/stockController.js';

const router = express.Router();

router.post('/',
    authMiddleware,
    addNewStock
);

router.post('/remove',
    authMiddleware,
    removeFromStock
);

export default router;