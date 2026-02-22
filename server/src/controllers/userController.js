
import User from "../models/UserModel.js"
import Submission from "../models/SubmissionModel.js";
import Attempt from "../models/AttemptModel.js";
import Course from "../models/CourseModel.js";



//     Get student dashboard stats
//    GET /api/users/dashboard
export const getStudentDashboard = async (req, res) => {

    const user = await User.findById(req.user._id).populate('enrolledCourses.course');

    // Calculate Academic Score (Average of Quiz scores and Assignment scores)
    const attempts = await Attempt.find({ student: user._id });
    const submissions = await Submission.find({ student: user._id, status: 'Evaluated' });

    let totalScore = 0;
    let count = 0;

    attempts.forEach(a => { totalScore += a.percentage; count++; });
    submissions.forEach(s => { totalScore += (s.marks || 0); count++; });

    const performance = count > 0 ? (totalScore / count).toFixed(2) : 0;

    // Assignment Summary
    const totalAssignments = await Submission.countDocuments({ student: user._id });
    const completedAssignments = await Submission.countDocuments({ student: user._id, status: { $in: ['Submitted', 'Late Submitted', 'Evaluated'] } });

    // Progress
    const totalCourses = user.enrolledCourses.length;
    const skillsAcquired = user.skills.length;

    res.json({
        name: user.name,
        performance,
        assignments: {
            completed: completedAssignments,
            total: totalAssignments || 10 // Dummy total if none assigned
        },
        learningStreak: user.learningStreak,
        skillsCount: skillsAcquired,
        totalSkills: 50, // Dummy cap
        weeklyChart: [
            { day: 'Mon', count: 2 },
            { day: 'Tue', count: 4 },
            { day: 'Wed', count: 1 },
            { day: 'Thu', count: 5 },
            { day: 'Fri', count: 3 },
            { day: 'Sat', count: 0 },
            { day: 'Sun', count: 0 },
        ],
        enrolledCourses: user.enrolledCourses.map(c => ({
            id: c.course._id,
            name: c.course.name,
            progress: c.progress,
            instructor: c.course.instructor,
            attendance: c.attendance,
            completedLessons: c.completedLessons
        }))
    });
};

//    Get teacher dashboard stats
//    GET /api/users/teacher-dashboard
export const getTeacherDashboard = async (req, res) => {
    // 1. Get courses taught by this teacher
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(c => c._id);

    // 2. Count total students across all their courses (unique students)
    const totalStudents = await User.countDocuments({
        role: 'student',
        'enrolledCourses.course': { $in: courseIds }
    });

    // 3. Pending Submissions (Submitted but not Evaluated)
    const pendingSubmissions = await Submission.find({
        course: { $in: courseIds },
        status: { $in: ['Submitted', 'Late Submitted'] }
    }).populate('student', 'name').populate('course', 'name').sort({ createdAt: -1 });

    // 4. Recent Submissions (Last 5)
    const recentSubmissions = await Submission.find({
        course: { $in: courseIds }
    }).populate('student', 'name').populate('course', 'name').sort({ createdAt: -1 }).limit(5);

    // 5. Active Courses count
    const activeCoursesCount = courses.length;

    // 6. Average Engagement (Average progress of all students in these courses)
    // This is more complex, but we can do a quick calc
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
        name: req.user.name,
        totalStudents,
        activeCourses: activeCoursesCount,
        pendingAssignments: pendingSubmissions.length,
        averageEngagement,
        recentSubmissions: recentSubmissions.map(s => ({
            id: s._id,
            student: s.student.name,
            course: s.course.name,
            time: s.createdAt,
            status: s.status
        }))
    });
};

//    Get leaderboard
//   GET /api/users/leaderboard
export const getLeaderboard = async (req, res) => {
    // Top 5 users based on performance
    const topUsers = await User.find({}).sort({ performance: -1 }).limit(5).select('name performance');
    res.json(topUsers);
};


