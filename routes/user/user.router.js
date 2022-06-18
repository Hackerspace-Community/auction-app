/**
 * Node module imports
 */
const {
  Router
} = require("express");

/**
 * Utils import.
 */
const { upload } = require("../../utils/multer");

/**
 * Middleware Imports
 */
const protect = require("../../middlewares/protect");
const role = require("../../middlewares/role")
const isSeller = require("../../middlewares/isSeller");
const isTimeRemaining = require("../../middlewares/isTimeRemaining");
const isWinner = require("../../middlewares/isWinner");

/**
 * Controller Imports
 */
const {
  getAllUsers,
  deleteUserById,
  getProfile,
  getProfileById,
  renderEditProfile,
  updateProfile,
  submitBid,
  renderSellerProfile,
  saveUserAddress,
  updateUserAddress
} = require("../../controllers/user/user.controller")

const {
  registerUser,
  verifyEmail,
  login,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword
} = require("../../controllers/user/auth.controller");
const { get } = require("mongoose");

/**
 * Decalarations
 */
const UserRouter = Router();

/**
 * Routes
 */

// Get all users route.
UserRouter.route('/users')
  .get(protect, role.checkRole(role.ROLES.Admin), getAllUsers)
  .post(upload.single('avatar'), registerUser)

// Register a new user route.
UserRouter.route('/users/register')
  .get((req, res) => {
    res.render('users/register');
  })

// Verify user email
UserRouter.route('/users/verification')
  .get((req, res)=>{
    res.render('users/verify', {
      title: "Verify your email",
      action: "/users/verification"
    });
  })
  .post(verifyEmail)

UserRouter.route('/users/dashboard')
  .get((req, res) => {
    res.render('users/dashboard');
  })

// Add address route.
UserRouter.route("/users/addAddress")
  .get(protect, (req, res) => {
    res.render("users/addAddress")
  })
  .post(protect, saveUserAddress)
  .put(protect, updateUserAddress)

// Render edit address route.
UserRouter.route("/users/address/edit")
  .get(protect, (req, res) => {
    const user = req.user;
    const { billingAddress, shippingAddress } = user.address;
    res.render("users/editAddress", {
      billingAddress,
      shippingAddress
    });
  })


// Login a user route.
UserRouter.route('/users/login')
  .get((req, res) => {
    res.render('users/login');
  })
  .post(login)

// Logout a user route.
UserRouter.route('/users/logout')
  .get(protect, logout)

// Clear all tokens and logout from all the devices.
UserRouter.route('/users/logoutAll')
  .get(protect, logoutAll)

// Forgot password route.
UserRouter.route('/users/forgot-password')
  .get((req, res) => {
    return res.render('users/verify', {
      title: "Forgot Password",
      action: "/users/forgot-password"
    });
  })
  .post(forgotPassword)

// Reset password route.
UserRouter.route('/users/confirm')
  .get((req, res) => {
    return res.render('users/confirm', {
      action: "/users/reset-password"
    });
  })

UserRouter.route("/users/reset-password")
  .post(resetPassword);

// Get logged in user's profile route.
UserRouter.route('/users/profile')
  .get(protect, getProfile)
  .put(protect, upload.single('avatar'), updateProfile)

// Edit logged in user's profile route.
UserRouter.route('/users/edit')
  .get(protect, renderEditProfile)

UserRouter.route('/users/edit/:id')
  .get(protect, role.checkRole(role.ROLES.Admin), renderEditProfile)
  .put(protect, role.checkRole(role.ROLES.Admin), upload.single('avatar'), updateProfile)

// Get user profile by id route. /users/user_id
UserRouter.route('/users/:id')
  .get(protect, getProfileById)
  .delete(protect, role.checkRole(role.ROLES.Admin), deleteUserById)

// Submit a bid route. /users/product_id/bid
UserRouter.route('/users/:id/bid')
  .post(protect, isSeller, isTimeRemaining, submitBid);

// Contact seller route. /constactSeller/product_id
UserRouter.route('/contactSeller/:id')
  .get(protect, isWinner, renderSellerProfile);

module.exports = UserRouter;