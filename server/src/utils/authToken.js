import jwt from "jsonwebtoken";
export const genToken = async (user, res) => {
  try {
    const payload = {
     
      id: user._id,
      role: user.role || "admin",
    };
   
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d", // it is a timeline
    });
    console.log(token);

    res.cookie("token:", token, {
      
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
    });
  } catch (error) {
    throw error;
  }
};