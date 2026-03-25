import express from 'express';
import { postMessage, getAdminMessages, replyToMessage, getUserMessages, getUnreadCount } from '../controller/messageController.js';

const messageRoutes = express.Router();

messageRoutes.post('/send', postMessage);
messageRoutes.get('/admin/all', getAdminMessages);
messageRoutes.post('/admin/reply', replyToMessage);
messageRoutes.get('/user/:userId', getUserMessages);
messageRoutes.get('/user/:userId/unread', getUnreadCount);

export default messageRoutes;
