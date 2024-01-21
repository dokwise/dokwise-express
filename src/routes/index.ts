import { Router } from 'express';
import projectRoutes from './projectRoutes';
import folderRoutes from './folderRoutes';
import dwfileRoutes from './dwfileRoutes';

const router = Router();

// Use the specific routes for each resource
router.use('/projects', projectRoutes);
router.use('/folders', folderRoutes);
router.use('/dwfiles', dwfileRoutes);

export default router;
