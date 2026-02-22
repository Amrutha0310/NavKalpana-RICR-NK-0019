import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const Protect = async (req, res, next) => {
  try {
    const biscuit = req.cookies.parleG;
    console.log("token recived in cookies:", biscuit); 

    const tea = jwt.verify(biscuit, process.env.JWT_SECRET);
    console.log(tea);

    const verifiedUser = await User.findById(tea.id); // verified from mongoose id

    if (!verifiedUser) {
      const error = new Error("Unauthorized , please Login Again");
      error.statusCode = 401;
      return next(error);
    }

    req.user = verifiedUser;
    next(); // heading towards usercontroller to update

  } catch (error) {
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
