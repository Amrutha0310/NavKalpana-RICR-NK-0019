
import dotenv from "dotenv";
dotenv.config();



import express from "express";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";
import morgan from "morgan"; //gives error,or any log data in terminal
import cors from "cors";
import UserRouter from "./src/routers/userRouter.js";
import courseRouter from "./src/routers/courseRouter.js"
import quizRouter from "./src/routers/quizRouter.js";
import assignmentRouter from "./src/routers/assignmentRouter.js";
import supportRouter from "./src/routers/supportRouter.js";
import AuthRouter from "./src/routers/authRouter.js";



const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }))

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

//router(auth,public,user...)
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/courses", courseRouter);
app.use("/assignments", assignmentRouter);
app.use("/quizzes", quizRouter);
app.use("/support", supportRouter);


app.get("/", (req, res) => {
    console.log("server is working");
    res.send("API is working");
})

// Error handling middleware
app.use((err, req, res, next) => {
    const ErrorMessage = err.message || "Internal Server Error";
    const StatusCode = err.statusCode || 500;
    console.log("Error Found ", { ErrorMessage, StatusCode });


    res.status(StatusCode).json({ message: ErrorMessage });
});



// mongoDB connection
const port = process.env.PORT || 5000;
connectDB();
app.listen(port, async () => {
    console.log("server port:", port);

    // connectDB();
    try {
        //cloudinary 
    } catch (error) {
        console.log(error);

    }

})
