import Booking from "../models/booking.js";
import Listing from "../models/listing.js";

const createBooking = async (req, res) => {
	const { listingId, checkIn, checkOut } = req.body;
	const guests = Number(req.body.guests);
	const startDate = new Date(checkIn);
	const endDate = new Date(checkOut);

	if (
		!listingId ||
		Number.isNaN(startDate.getTime()) ||
		Number.isNaN(endDate.getTime()) ||
		endDate <= startDate ||
		!Number.isInteger(guests) ||
		guests < 1
	) {
		req.flash("error", "Please enter valid dates and at least 1 guest");
		return res.redirect(`/listings/${listingId}`);
	}

	const listing = await Listing.findById(listingId);
	if (!listing) {
		req.flash("error", "Listing does not exist");
		return res.redirect("/listings");
	}

	if (listing.owner && listing.owner.equals(req.user._id)) {
		req.flash("error", "You cannot book your own property");
		return res.redirect(`/listings/${listingId}`);
	}

	const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
	const totalPrice = nights * Number(listing.price || 0);

	await Booking.create({
		listing: listing._id,
		user: req.user._id,
		checkIn: startDate,
		checkOut: endDate,
		guests,
		nights,
		totalPrice,
	});

	req.flash("success", "Booking created successfully");
	res.redirect("/bookings/my");
};

const showMyBookings = async (req, res) => {
	const bookings = await Booking.find({ user: req.user._id })
		.populate("listing")
		.sort({ bookingDate: -1 });

	res.render("bookings/index.ejs", { bookings });
};

const cancelBooking = async (req, res) => {
	const booking = await Booking.findOne({
		_id: req.params.id,
		user: req.user._id,
	});

	if (!booking) {
		req.flash("error", "Booking not found");
		return res.redirect("/bookings/my");
	}

	await booking.deleteOne();
	req.flash("success", "Booking cancelled successfully");
	res.redirect("/bookings/my");
};

export default { createBooking, showMyBookings, cancelBooking };
