
import User from "../models/UserModel.js"
import Submission from "../models/SubmissionModel.js";
import Attempt from "../models/AttemptModel.js";
import Course from "../models/CourseModel.js";

/**
 * getStudentDashboard
 * Aggregates user performance, assignment stats, and calculates a dynamic 
 * weekly activity chart based on recent attempts/submissions (Last 7 Days).
 */
export const getStudentDashboard = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('enrolledCourses.course');

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        // Calculate Academic Score (Average of Quiz scores and Assignment scores)
        const attempts = await Attempt.find({ student: user._id });
        const submissions = await Submission.find({ student: user._id, status: 'Evaluated' });

        let totalScore = 0;
        let count = 0;

        attempts.forEach(a => { totalScore += a.percentage; count++; });
        submissions.forEach(s => { totalScore += (s.marks || 0); count++; });

        const performance = count > 0 ? (totalScore / count).toFixed(0) : 0;

        // --- Weekly Activity Logic ---
        // Generates a map of the last 7 days to show active participation.
        const weeklyDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const activityMap = {};

        // Initialize last 7 days including today
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = weeklyDays[d.getDay()];
            activityMap[dayName] = 0;
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentAttempts = await Attempt.find({
            student: user._id,
            createdAt: { $gte: sevenDaysAgo }
        });
        const recentSubmissions = await Submission.find({
            student: user._id,
            createdAt: { $gte: sevenDaysAgo }
        });

        [...recentAttempts, ...recentSubmissions].forEach(item => {
            const dayName = weeklyDays[new Date(item.createdAt).getDay()];
            if (activityMap[dayName] !== undefined) {
                activityMap[dayName]++;
            }
        });

        const weeklyChart = Object.keys(activityMap).reverse().map(day => ({
            day,
            count: activityMap[day]
        }));

        res.json({
            fullName: user.fullName,
            performance,
            assignments: {
                completed: await Submission.countDocuments({ student: user._id, status: { $in: ['Submitted', 'Late Submitted', 'Evaluated'] } }),
                total: Math.max(await Submission.countDocuments({ student: user._id }), 5)
            },
            learningStreak: user.learningStreak || 0,
            skillsCount: user.skills?.length || 0,
            totalSkills: 50,
            weeklyChart,
            enrolledCourses: user.enrolledCourses.map(c => ({
                id: c.course._id,
                name: c.course.name,
                progress: c.progress,
                instructor: c.course.instructor,
                attendance: c.attendance,
                completedLessons: c.completedLessons
            }))
        });
    } catch (error) {
        next(error);
    }
};

/**
 * getTeacherDashboard
 * Aggregates teacher-specific stats including student counts, pending submissons,
 * and overall student engagement across their courses.
 */
export const getTeacherDashboard = async (req, res, next) => {
    try {
        const courses = await Course.find({ instructor: req.user._id });
        const courseIds = courses.map(c => c._id);

        const totalStudents = await User.countDocuments({
            role: 'student',
            'enrolledCourses.course': { $in: courseIds }
        });

        const pendingSubmissions = await Submission.find({
            course: { $in: courseIds },
            status: { $in: ['Submitted', 'Late Submitted'] }
        }).populate('student', 'fullName').populate('course', 'name').sort({ createdAt: -1 });

        const recentSubmissions = await Submission.find({
            course: { $in: courseIds }
        }).populate('student', 'fullName').populate('course', 'name').sort({ createdAt: -1 }).limit(5);

        const allStudents = await User.find({
            'enrolledCourses.course': { $in: courseIds }
        });

        let totalProgress = 0;
        let enrollCount = 0;
        allStudents.forEach(stu => {
            stu.enrolledCourses.forEach(ec => {
                if (courseIds.some(id => id.equals(ec.course))) {
                    totalProgress += ec.progress;
                    enrollCount++;
                }
            });
        });

        const averageEngagement = enrollCount > 0 ? (totalProgress / enrollCount).toFixed(0) : 0;

        res.json({
            fullName: req.user.fullName,
            totalStudents,
            activeCourses: courses.length,
            pendingAssignments: pendingSubmissions.length,
            averageEngagement,
            recentSubmissions: recentSubmissions.map(s => ({
                id: s._id,
                student: s.student.fullName,
                course: s.course.name,
                time: s.createdAt,
                status: s.status
            }))
        });
    } catch (error) {
        next(error);
    }
};

export const getLeaderboard = async (req, res, next) => {
    try {
        const topUsers = await User.find({}).sort({ performance: -1 }).limit(5).select('fullName performance');
        res.json(topUsers);
    } catch (error) {
        next(error);
    }
};
