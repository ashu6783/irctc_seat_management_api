import db from "../config/db.js";
// controller fro adding train 
// requires train_name,source,destination,total_seats,available_seats 
//x-api-key for admin in headers along with bearer token of admin when login 

export const addTrain = async (req, res, next) => {
    const {train_name,source,destination,total_seats,available_seats} =req.body;
    if(!train_name || !source ||!destination ||!total_seats){
        return res.status(400).json({message:'All fields are required'});
    }
    try {
        await db.query(
            'INSERT INTO TRAINS (train_name,source,destination,total_seats,available_seats) VALUES (?,?,?,?,?)',
            [train_name,source,destination,total_seats,available_seats]
        )
        res.status(201).json({message:'Train info added successfully'});
    } catch (error) {
        next(error);
    }
}

//controller for getting seat availabilty need source and destination

export const seatAvailability = async (req, res, next) => {
    const { source, destination } = req.query;
    if (!source || !destination) {
        return res.status(400).json({ message: 'Source and destination are required' });
    }
    try {
        const [trains] = await db.query(
            'SELECT train_id, train_name, source, destination, available_seats FROM TRAINS WHERE source=? AND destination=?',
            [source, destination]
        );
        res.json(trains);
    } catch (error) {
        next(error);
    }
};

