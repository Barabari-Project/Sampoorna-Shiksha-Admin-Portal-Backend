import express from 'express';
import toysRoutes from './toysRoutes.js';

const router = express.Router();

router.use('/toys', toysRoutes);

export default router;