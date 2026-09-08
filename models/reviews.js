//import { string } from "joi";
import Joi from "joi";

import mongoose from "mongoose";
//import { type } from "os";
const { Schema } = mongoose;
const  reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    comment: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
       default: Date.now(),
    },
});
const review = mongoose.model("review", reviewSchema);

export default review;
