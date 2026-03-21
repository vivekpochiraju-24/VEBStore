import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { getUserNotifications, markNotificationsRead, updateNotificationToken } from '../controller/userNotificationController.js';

const notificationRoutes = express.Router();

notificationRoutes.get('/list', isAuth, getUserNotifications);
notificationRoutes.post('/read', isAuth, markNotificationsRead);
notificationRoutes.post('/update-token', isAuth, updateNotificationToken);

export default notificationRoutes;
