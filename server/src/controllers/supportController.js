import Doubt from "../models/DoubtsModel.js"
import Attendance from "../models/AttendanceModel.js"
import Course from "../models/CourseModel.js";

//  Submit a doubt or backup class request
export const submitDoubt = async (req, res, next) => {
    try {
        const { courseId, topic, description, screenshot, type } = req.body;

        const doubt = await Doubt.create({
            student: req.user._id,
            course: courseId,
            topic,
            description,
            screenshot,
            type
        });

        res.status(201).json(doubt);
    } catch (error) {
        next(error);
    }
};

//   Get all doubts for student or teacher
export const getDoubts = async (req, res, next) => {
    try {
        if (req.user.role === 'teacher') {
            const courses = await Course.find({ instructor: req.user._id });
            const courseIds = courses.map(c => c._id);
            const doubts = await Doubt.find({ course: { $in: courseIds } })
                .populate('student', 'fullName')
                .populate('course', 'name')
                .sort({ createdAt: -1 });
            return res.json(doubts);
        }
        const doubts = await Doubt.find({ student: req.user._id }).populate('course', 'name').sort({ createdAt: -1 });
        res.json(doubts);
    } catch (error) {
        next(error);
    }
};

//    Resolve a doubt
export const resolveDoubt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { teacherReply } = req.body;

        const doubt = await Doubt.findById(id);
        if (!doubt) return res.status(404).json({ message: 'Not found' });

        doubt.status = 'Resolved';
        doubt.teacherReply = teacherReply;
        doubt.resolvedBy = req.user._id;

        await doubt.save();
        res.json(doubt);
    } catch (error) {
        next(error);
    }
};

//  Get attendance history
export const getAttendance = async (req, res, next) => {
    try {
        const attendance = await Attendance.find({ student: req.user._id }).populate('course', 'name');
        res.json(attendance);
    } catch (error) {
        next(error);
    }
};


