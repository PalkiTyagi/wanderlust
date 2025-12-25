import User from "../models/user.js";

/* GET signup form */
const renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

/* POST signup */
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, err => {
      if (err) return next(err);

      req.flash("success", "User registered");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};
/* GET login form */
const renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

/* POST login (after passport authentication) */
const login = async (req, res) => {
  req.flash("success", "Logged in successfully");
  const redirectUrl = res.locals.redirect || "/listings";
  res.redirect(redirectUrl);
};

/* LOGOUT */
const logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.flash("success", "You have been logged out successfully!");
    res.redirect("/listings");
  });
};

export default {
  renderSignupForm,
  signup,
  renderLoginForm,
  login,
  logout
};
