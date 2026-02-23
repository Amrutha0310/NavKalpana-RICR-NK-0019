import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { genToken } from "../utils/authToken.js";


export const UserLogin = async (req, res, next) => {
  try {
    // fetching from frontend
    const { email, password } = req.body;

    //verifying
    if (!email || !password) {
      const error = new Error("All Fields Required");
      error.StatusCode = 400;
      return next(error);
    }
    // checking user is registered or not
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 401;
      return next(error);
    }

    // verify the Password
    const isVerified = await bcrypt.compare(password, existingUser.password);
    if (!isVerified) {
      const error = new Error("Password didn't match");
      error.StatusCode = 402;
      return next(error);
    }

    // Token Generation
    await genToken(existingUser, res);

    //sending message to frontend
    res.status(200).json({ message: "Login Successfull", data: existingUser });

    //end
  } catch (error) {
    next(error);
  }
};
export const UserRegister = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password, role } = req.body;

    // 1️⃣ Check required fields
    if (!fullName || !email || !mobileNumber || !password || !role) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    // 2️⃣ Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Invalid email format");
      error.statusCode = 400;
      return next(error);
    }

    // 3️⃣ Validate mobile number (Indian 10 digits)
    const mobileRegex = /^\d{10}$/; 
    if (!mobileRegex.test(mobileNumber)) {
      const error = new Error("Mobile number must be 10 digits");
      error.statusCode = 400;
      return next(error);
    }

    // 4️⃣ Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error("Email is already registered");
      error.statusCode = 409;
      return next(error);
    }

    // Optional: Check if mobileNumber already exists
    const existingMobile = await User.findOne({ mobileNumber });
    if (existingMobile) {
      const error = new Error("Mobile number is already registered");
      error.statusCode = 409;
      return next(error);
    }

    // 5️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // 6️⃣ Generate default profile photo URL
    const photoURL = `https://placehold.co/600x400?text=${fullName.charAt(0).toUpperCase()}`;
    const photo = { url: photoURL };

    // 7️⃣ Create new user
    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      mobileNumber,
      password: hashPassword,
      role,
      photo,
    });

    // 8️⃣ Send response
    res.status(201).json({ message: "Registration Successful", userId: newUser._id });
  } catch (error) {
    // 9️⃣ Fallback error handling
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const UserLogout = async (req, res, next) => {
  try {
    res.clearCookie("parleG");
    res.status(200).json({ message: "Logout Successfull" });
  } catch (error) {
    next(error);
  }
};