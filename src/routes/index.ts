import express from 'express';
import toysRoutes from './toysRoutes.js';
import schoolRoutes from './schoolRoutes.js';

const router = express.Router();

router.use('/toys', toysRoutes);
router.use('/school', schoolRoutes);

export default router;