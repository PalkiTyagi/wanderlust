console.log("🔥 THIS app.js IS RUNNING");
// ...existing code...
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import methodOverride from "method-override";
import mongoose from "mongoose";
import ejsMate from "ejs-mate";
import { fileURLToPath } from "url";
import ExpressError from "./utils/ExpressError.js";

import listingRouter from "./routes/listing.js";
import reviewsRouter from "./routes/review.js";
import userRouter from "./routes/user.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import { isLoggedIn, isOwner } from "./middleware.js";

// ✅ Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

// ✅ Middleware
app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.json()); // for JSON data
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Database connection
const dbUrl = process.env.ATLAS_DB_URL;

async function main() {
  try {
    await mongoose.connect(dbUrl, {
      tls: true, // ensures secure connection
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Atlas connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

main();


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // cookie.expires must be a Date object
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
//app.use("/listings/:id/reviews/", reviewsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//custom error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// start server
app.listen(port, () => {
  console.log(` App is listening on http://localhost:${port}`);
});
// ...existing code...