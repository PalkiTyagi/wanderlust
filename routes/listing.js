
import express from "express";
const router = express.Router();

import { listingSchema } from "../schema.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import ListingController from "../controllers/listing.js";
import { isLoggedIn, isOwner } from "../middleware.js";

import multer from "multer";
import { storage } from "../cludconfig.js";

const upload = multer({ storage });

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// index
router.get("/", wrapAsync(ListingController.index));
//router.get("/", (req, res) => {
 // res.send("Listings route working ✅");
//});

// new
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// show
router.get("/:id", wrapAsync(ListingController.showListing));

// create ✅
router.post(
  "/",
  isLoggedIn,
  
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(ListingController.createListing)
);

// edit
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

// update
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(ListingController.updateListing)
);

// delete
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.deleteListing)
);

export default router;
