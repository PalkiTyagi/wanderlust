import express from "express";
const router = express.Router({mergeParams:true });
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { reviewSchema } from "../schema.js";
import review from "../models/reviews.js"
import {listingSchema} from "../schema.js";
import Listing from "../models/listing.js";
import ReviewController from "../controllers/reviews.js"; 

const validateReview = (req , res , next)=>{
   let { error } = reviewSchema.validate(Request.body);
 if(error){
  let errMsg = error.details.map((el)=> el.message).join(",");
  throw new ExpressError(400 , errMsg);
 } else{
  next();
 }
}

//reviews route
router.post("/" , validateReview, wrapAsync(ReviewController.createReview));

// review delete route
router.delete("/:reviewId" , wrapAsync(ReviewController.deleteReview)
);
export default router;