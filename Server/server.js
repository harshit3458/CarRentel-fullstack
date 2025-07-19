import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';
import userRouter from './Routes/userRoutes.js';
import ownerRouter from './Routes/ownerRoutes.js';
import bookingRouter from './Routes/bookingRoutes.js';


const app=express();

await connectDB();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("server is running");
})

app.use('/api/user',userRouter);
app.use('/api/owner',ownerRouter);
app.use('/api/bookings',bookingRouter);

app.listen(8000,()=>{
  console.log('server is started');
})
