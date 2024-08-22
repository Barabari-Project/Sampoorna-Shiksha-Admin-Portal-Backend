import express from 'express';
import toysRoutes from './toysRoutes.js';
import schoolRoutes from './schoolRoutes.js';
import stockRoutes from './stockRoutes.js';
import vendorOrderRoutes from './vendorOrderRoutes.js';

const router = express.Router();

router.use('/toys', toysRoutes);
router.use('/school', schoolRoutes);
router.use('/stock', stockRoutes);
router.use('/vendor-order', vendorOrderRoutes);

export default router;