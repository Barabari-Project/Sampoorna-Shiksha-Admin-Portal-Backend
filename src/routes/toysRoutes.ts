import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addToy, updateToy } from '../controllers/toyController.js';

const router = express.Router();

router.post('/',
    authMiddleware,
    addToy
);

router.put('/',
    authMiddleware,
    updateToy
);

export default router;