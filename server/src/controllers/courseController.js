import Course from '../models/CourseModel.js';
import User from '../models/UserModel.js';

//    Get all courses (Enrolled for student, Created for teacher)
//   GET /api/courses


//    Get all courses (Enrolled for student, Created for teacher)
//   GET /api/courses
export const getCourses = async (req, res, next) => {
    try {
        // If student wants to explore available courses
        if (req.user.role === 'student' && req.query.type === 'all') {
            const allCourses = await Course.find({}).populate('instructor', 'fullName');
            return res.json(allCourses);
        }

        if (req.user.role === 'teacher') {
            const courses = await Course.find({ instructor: req.user._id });
            return res.json(courses.map(cours => ({
                course: cours,
                isTeacher: true
            })));
        }

        const user = await User.findById(req.user._id).populate('enrolledCourses.course');
        res.json(user.enrolledCourses);
    } catch (error) {
        next(error);
    }
};

//  Enroll in a course
//  POST /api/courses/:id/enroll
export const enrollInCourse = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const course = await Course.findById(req.params.id);

        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Check if already enrolled
        const isEnrolled = user.enrolledCourses.some(cours => cours.course.toString() === req.params.id);
        if (isEnrolled) { return res.status(400).json({ message: 'Already enrolled' }); }

        user.enrolledCourses.push({
            course: course._id,
            progress: 0,
            completedLessons: [],
            attendance: 100 // Default full attendance for new enrollment
        });

        await user.save();
        res.status(201).json({ message: 'Successfully enrolled' });
    } catch (error) {
        next(error);
    }
};

//   Create a new course
//  POST /api/courses
export const createCourse = async (req, res, next) => {
    try {
        const { name, description, thumbnail, modules } = req.body;

        // Calculate total lessons
        let totalLessons = 0;
        modules.forEach(module => {
            totalLessons += module.lessons.length;
        });

        const course = await Course.create({
            name,
            description,
            thumbnail,
            modules,
            instructor: req.user._id,
            totalLessons
        });

        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
};

//  Get course detail
//  GET /api/courses/:id
export const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        next(error);
    }
};

// Mark a lesson as complete
// POST /api/courses/lesson-complete
export const markLessonComplete = async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.body;
        const user = await User.findById(req.user._id);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or Course not found' });
        }

        const enrolledIndex = user.enrolledCourses.findIndex(cours => cours.course.toString() === courseId);
        if (enrolledIndex === -1) {
            return res.status(400).json({ message: 'Not enrolled in this course' });
        }

        // Add lesson to completed if not already there
        if (!user.enrolledCourses[enrolledIndex].completedLessons.includes(lessonId)) {
            user.enrolledCourses[enrolledIndex].completedLessons.push(lessonId);

            // Update Streak (simplified: just bump if active)
            user.learningStreak += 1;
            user.lastActivity = Date.now();
        }

        // Calculate progress
        const completedCount = user.enrolledCourses[enrolledIndex].completedLessons.length;
        user.enrolledCourses[enrolledIndex].progress = Math.round((completedCount / course.totalLessons) * 100);

        await user.save();
        res.json({
            progress: user.enrolledCourses[enrolledIndex].progress,
            completedLessons: user.enrolledCourses[enrolledIndex].completedLessons
        });
    } catch (error) {
        next(error);
    }
};

//  Mark whole course as complete (Demo button)
//  POST /api/courses/course-complete
export const markCourseComplete = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const user = await User.findById(req.user._id);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or Course not found' });
        }

        const enrolledIndex = user.enrolledCourses.findIndex(cours => cours.course.toString() === courseId);
        if (enrolledIndex === -1) return res.status(400).json({ message: 'Not enrolled' });

        // Mark all lessons as complete
        const allLessonIds = [];
        course.modules.forEach(mod => {
            mod.lessons.forEach(lesson => {
                allLessonIds.push(lesson.id);
            });
        });

        user.enrolledCourses[enrolledIndex].completedLessons = allLessonIds;
        user.enrolledCourses[enrolledIndex].progress = 100;

        // Add skill if course completed
        if (!user.skills.includes(course.name)) {
            user.skills.push(course.name);
        }

        await user.save();
        res.json({ message: 'Course marked as complete', progress: 100 });
    } catch (error) {
        next(error);
    }
};


