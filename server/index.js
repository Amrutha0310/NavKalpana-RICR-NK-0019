import dotenv from "dotenv"
dotenv.config()
import express from "express";
import connectDB from "./src/config/db.js";
import morgan from "morgan"; //gives error,or any log data in terminal
import cors from "cors";
// import UserRouter from "./src/routers/userRouter.js";
// import StudentRouter from "./src/routers/studentRouter.js";
// import TeacherRouter from "./src/routers/teacherRouter.js";
import AuthRouter from "./src/routers/authRouter.js";



const app = express();

app.use(cors({origin:"http://localhost:5173", credentials: true}))

app.use(express.json());
// cookie parser
app.use(morgan("dev"));

//router(auth,public,user...)
app.use("/auth",AuthRouter);
// app.use("/user",UserRouter);
// app.use("/student",StudentRouter);
// app.use("/teacher",TeacherRouter);


app.get("/", (req,res)=>{
    console.log("server is working");
    
})

app.use((err, req, res, next) => {
  const ErrorMessage = err.message || "Internal Sever Error";
  const StatusCode = err.statusCode || 500;

  res.status(StatusCode).json({ message: ErrorMessage });
});



// mongoDB connection
const port =process.env.PORT || 5000;
app.listen(port, async()=>{
    console.log("server port:",port);
    // connectDB();
    try {
        //cloudinary 
    } catch (error) {
        console.log(error);
        
    }
    
})
