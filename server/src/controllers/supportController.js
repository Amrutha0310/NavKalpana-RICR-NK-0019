import Doubt from "../models/DoubtsModel.js"
import Attendance from "../models/AttendanceModel.js"
import Course from "../models/CourseModel.js";

//  Submit a doubt or backup class request
<<<<<<< HEAD
export const submitDoubt = async (req, res) => {
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
};

//   Get all doubts for student or teacher
export const getDoubts = async (req, res) => {
    if (req.user.role === 'teacher') {
        const courses = await Course.find({ instructor: req.user._id });
        const courseIds = courses.map(c => c._id);
        const doubts = await Doubt.find({ course: { $in: courseIds } })
            .populate('student', 'name')
            .populate('course', 'name')
            .sort({ createdAt: -1 });
        return res.json(doubts);
    }
    const doubts = await Doubt.find({ student: req.user._id }).populate('course', 'name').sort({ createdAt: -1 });
    res.json(doubts);
};

//    Resolve a doubt
export const resolveDoubt = async (req, res) => {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Not found' });

    doubt.status = 'Resolved';
    await doubt.save();
    res.json(doubt);
};

//  Get attendance history
export const getAttendance = async (req, res) => {
    const attendance = await Attendance.find({ student: req.user._id }).populate('course', 'name');
    res.json(attendance);
=======
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
        const doubt = await Doubt.findById(req.params.id);
        if (!doubt) return res.status(404).json({ message: 'Not found' });

        doubt.status = 'Resolved';
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
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
};


