import mongoose from "mongoose";

const { Schema } = mongoose;

const bookingSchema = new Schema({
	listing: {
		type: Schema.Types.ObjectId,
		ref: "Listing",
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	checkIn: {
		type: Date,
		required: true,
	},
	checkOut: {
		type: Date,
		required: true,
	},
	guests: {
		type: Number,
		required: true,
		min: 1,
	},
	nights: {
		type: Number,
		required: true,
		min: 1,
	},
	totalPrice: {
		type: Number,
		required: true,
		min: 0,
	},
	bookingDate: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("Booking", bookingSchema);
