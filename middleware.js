import Listing from "./models/listing.js";
export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        const listingId = req.body?.listingId;
        req.session.redirectUrl = listingId
          ? `/listings/${listingId}`
          : req.originalUrl;
        req.flash("error", "Please login first to book this property.");
        return res.redirect("/login");
    }
    next();
};

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

export const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  
  next();
};