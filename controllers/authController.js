import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";


// Controller for registering a new user
//Requires username,password and role as input
export const registerUser = async (req, res, next) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Required username and password" });
    }
    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === 'admin' ? 'admin' : 'user';
        await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, userRole]);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        next(error);
    }
};


//Controller for login user 
//Requires username and password for user
//For admin user role is admin initially can be created again

export const loginUser= async(req,res,next)=>{
    const {username,password}=req.body;
    if(!username || !password){
        return res.status(400).json({message:"Required fields username and password"}); 
    }
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?',[username]);
        if(users.length===0){
            return res.status(401).json({message:'Invalid Credentials'});
        }
        const user = users[0];
        const isMatch =  await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:'Invalid Credentials'});
        }

        const token =  jwt.sign({
            id:user.id,username:user.username,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );
        res.json({token});
    } catch (error) {
        next(error);
    }
}