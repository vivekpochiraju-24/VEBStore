import express from 'express';
import { createExchangeRequest, getAllExchangeRequests, getUserExchangeRequests, updateExchangeStatus, deleteExchangeRequest } from '../controller/exchangeController.js';
import isAuth from '../middleware/isAuth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// User routes
router.post('/request', isAuth, createExchangeRequest);
router.get('/my-requests', isAuth, getUserExchangeRequests);
router.delete('/:id', isAuth, deleteExchangeRequest);

// Admin routes
router.get('/all-requests', adminAuth, getAllExchangeRequests);
router.put('/:id/status', adminAuth, updateExchangeStatus);

export default router;
