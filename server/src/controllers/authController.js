import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

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
   // await genToken(existingUser, res);

    //sending message to frontend
    res.status(200).json({ message: "Login Successfull", data: existingUser });

    //end
  } catch (error) {
    next(error);
  }
};
