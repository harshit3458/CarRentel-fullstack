import { memoryStorage } from "multer";
import imagekit from "../configs/imageKit.js";
import Car from "../model/Car.js";
import User from "../model/User.js";
import fs, { access } from 'fs';
import Booking from "../model/Booking.js";

export const changeRoleToOwner=async (req,res)=>{
  try {
    const {_id}=req.user;
    await User.findByIdAndUpdate(_id,{role:"owner"});
    res.json({success:true,message:"Now you can list cars"})
    
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}
//  Api to List Car

export const addCar=async(req,res)=>{
  try {
    const {_id}=req.user;
    let car=JSON.parse(req.body.carData);
    const imageFile=req.file;

    // upload image
    const fileBuffer=fs.readFileSync(imageFile.path);
    const response= await imagekit.upload({
        file:fileBuffer,
        fileName:imageFile.originalname,
        folder:'/cars'
    })
    
    // optimize through imagekit url
    var optimizedImageUrl = imagekit.url({
    path : response.filePath,
    transformation : [
      {width:'1280'},
      {quality:'auto'},
      {format:'webp'}
    ]
});

  const image=optimizedImageUrl;
  await Car.create({...car,owner:_id,image});

  res.json({success:true,message:"car added"});

  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}


// Api to list Ownwer Car

export const getOwnersCars=async (req,res)=>{
  try {
    const {_id}=req.user;
    const cars=await Car.find({owner:_id});
    res.json({success:true,cars});
    
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}

export const toggleCarAvailibility=async (req,res)=>{
  try {
    const {_id}=req.user;
    const {carId}=req.body;
    const car=await Car.findById(carId);

    if(car.owner.toString()!=_id.toString()){
      return res.json({success:false,message:"Unautorized"});
    }

    car.isAvaliable=!car.isAvaliable;
    await car.save();
    res.json({success:true,message:"Availibility Toggled"})
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}

export const deleteCar=async (req,res)=>{
  try {
    const {_id}=req.user;
    const {carId}=req.body;
    const car=await Car.findById(carId);

    if(car.owner.toString()!=_id.toString()){
      return res.json({success:false,message:"Unautorized"});
    }

    car.owner=null;
    car.isAvaliable=false;

    await car.save();
    res.json({success:true,message:"Car Removed"})
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}


// Api to get dashboard data

export const getDashboardData=async (req,res)=>{
  try {
    const {_id,role}=req.user;
    
    if(role!=='owner'){
      return res.json({success:false,message:"Unautorized"});
    }

    const cars=await Car.find({owner:_id});
    const bookings=await Booking.find({owner:_id}).populate('car').sort({createdAt:-1});

    const pendingBookings=await Booking.find({owner:_id,status:"pending"});
    const completedBookings=await Booking.find({owner:_id,status:"confirmed"});

    // calculate monthly revenue

    const monthlyRevenue=bookings.slice().filter(booking=>booking.status==='confirmed').reduce((acc,booking)=>acc+booking.price,0);

    const dashboardData={
      totalCars:cars.length,
      totalBookings:bookings.length,
      pendingBookings:pendingBookings.length,
      completedBookings:completedBookings.length,
      recentBookings:bookings.slice(0,3),
      monthlyRevenue
    }

    res.json({success:true,dashboardData});
    
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}

export const updateUserImage=async (req,res)=>{
  try {
    const {_id}=req.user;
    const imageFile=req.file;
    const fileBuffer=fs.readFileSync(imageFile.path);
    const response= await imagekit.upload({
        file:fileBuffer,
        fileName:imageFile.originalname,
        folder:'/users'
    })
    
    // optimize through imagekit url
    var optimizedImageUrl = imagekit.url({
    path : response.filePath,
    transformation : [
      {width:'400'},
      {quality:'auto'},
      {format:'webp'}
    ]
});

   const image=optimizedImageUrl;
   await User.findByIdAndUpdate(_id,{image});
   res.json({success:true,message:"Image Updated"});

  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}


