import express from 'express';
import { bookSeat,getBookingDetails } from '../controllers/bookingController.js';
import authenticateUser from '../middleware/auth.js';
const router = express.Router();


router.post('/book',authenticateUser,bookSeat);
router.get('/detail',authenticateUser,getBookingDetails);

export default router;