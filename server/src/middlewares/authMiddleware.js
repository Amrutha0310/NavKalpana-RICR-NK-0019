import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";


 const Protect = async (req, res, next) => {
  try {
    const token = req.cookies.parleG;
    console.log("token recived in cookies:", token); 

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);

    const verifiedUser = await User.findById(decode.id); // verified from mongoose id

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
export default Protect;
