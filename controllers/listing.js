
import Listing from "../models/listing.js";

export const index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};
const showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing
    .findById(id)
    .populate("reviews")
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};
const createListing = async (req, res) => {
  console.log("FILE:", req.file); // 👈 DEBUG

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // ✅ SAFE CHECK
  if (req.file) {
    newListing.image = {
     // secure_url: req.file.path,
      url: req.file.secure_url,
      filename: req.file.filename,
    };
  } else {
    console.log("No file uploaded ❌");
  }

  await newListing.save();

  req.flash("success", "New listing created");
  res.redirect("/listings");
};
const renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};
const updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data");
  }

  const { id } = req.params;
 let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

 if ( typeof req.file !== 'undefined') {
 //let url = req.file.path;
 let url = req.file.secure_url;
  let filename = req.file.filename;
  listing.image = { url, filename };
  await listing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};
const deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};

export default {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  deleteListing
};



