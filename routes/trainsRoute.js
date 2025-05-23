import express from "express"
import { addTrain,seatAvailability } from "../controllers/trainController.js"
import authenticateUser from "../middleware/auth.js"
import adminAuthMiddleware from "../middleware/adminAuth.js"
const router= express.Router();

router.post('/add',authenticateUser,adminAuthMiddleware,addTrain);
router.get('/availability',authenticateUser,seatAvailability);

export default router;