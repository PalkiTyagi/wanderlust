//import { createRequire } from "module";
//const require = createRequire(import.meta.url);
//const Joi = require("joi");
//import pkg from "joi";
//const Joi = pkg;

import Joi from "joi";
//import review from "./models/reviews.js";
//import listing from "./schema.js";
 export const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required(),
   image: Joi.string().allow("", null)
  }).required()
});



export const reviewSchema = Joi.object({
  review: Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required(),

  }).required()

});
