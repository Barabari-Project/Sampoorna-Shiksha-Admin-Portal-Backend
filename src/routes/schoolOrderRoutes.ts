import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getOrderBySchoolId, placeOrderToSchool, updateOrder } from '../controllers/schoolOrderController.js';

const router = express.Router();

router.post('/',
    authMiddleware,
    placeOrderToSchool
);

router.get('/school/:schoolId',
    authMiddleware,
    getOrderBySchoolId
);

router.put('/',
    authMiddleware,
    updateOrder
)

export default router;