import db from "../config/db.js";

//for booking seat
export const bookSeat=async (req,res,next)=>{
    const{train_id}=req.body;
    const user_id=req.user.id;
    if(!train_id){
        res.status(400).json({message:'Train id is required'});
    }
    let connection;
    try {
        connection=await db.getConnection();
        // starting transaction to handle race conditions
        await connection.beginTransaction();
        

        //locking the row for this train to prevent race conditions for update
        const [trains]=await connection.query(
            'SELECT available_seats FROM trains WHERE train_id=? FOR UPDATE',[train_id]
        );
        //IF no trains found or exists
        if(trains.length===0)
        {
            await connection.rollback();
            return res.status(404).json({message:'Train not found'})
        }

        //if no seats are available
        
        if(trains[0].available_seats<=0){
            await connection.rollback();
            return res.status(400).json({message:'No seats available'});
        }

        // update available seats by decrementing it
        await connection.query(
            'UPDATE trains SET available_seats=available_seats-1 WHERE train_id=?',[train_id]
        );

        //Inserting booking record
        await connection.query(
            'INSERT INTO bookings (train_id,user_id,booking_time) VALUES (?,?,NOW())',[train_id,user_id]
        )

        //commit the trasaction
        await connection.commit();

        // apt msg displayed
        res.json({message:'Seat booked succssfully'});
    } catch (error) {
        //rollback in case of any errors during transaction
        if(connection) await connection.rollback();
        next(error)
    }
    finally{
        //release connection back to pool
        if(connection) connection.release();
    }
}


//for booking details 
export const getBookingDetails=async(req,res,next)=>{
    const user_id=req.user.id;
    try{
        //fetch all the booking details -- required -> user_id with bearer token of logged-in user 
        const [bookings]=await db.query(
            'SELECT b.booking_id, b.train_id, t.train_name, t.source, t.destination, b.booking_time ' +
             'FROM bookings b JOIN trains t ON b.train_id = t.train_id WHERE b.user_id = ?',[user_id]
        );
        res.json(bookings);
    }catch(error){
        next(error);
    }
}