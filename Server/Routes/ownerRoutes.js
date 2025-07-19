import express from "express";
import protect from "../middleware/auth.js";
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnersCars, toggleCarAvailibility, updateUserImage } from "../controller/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter=express.Router();

ownerRouter.post("/change-role",protect,changeRoleToOwner);
ownerRouter.post("/add-car",upload.single("image"),protect,addCar);
ownerRouter.get("/cars",protect,getOwnersCars);
ownerRouter.post("/toggle-car",protect,toggleCarAvailibility);
ownerRouter.post("/delete-car",protect,deleteCar);
ownerRouter.get('/dashboard',protect,getDashboardData);
ownerRouter.post('/update-image',upload.single("image"),protect,updateUserImage);


export default ownerRouter;