import Quiz from "../models/QuizModel.js";
import Attempt from "../models/AttemptModel.js";
import User from "../models/UserModel.js";
import Course from "../models/CourseModel.js";

//  Get quizzes for student or teacher
export const getQuizzes = async (req, res, next) => {
  try {
    if (req.user.role === "teacher") {
      const courses = await Course.find({ instructor: req.user._id });
      const courseIds = courses.map((cours) => cours._id);

      const quizzes = await Quiz.find({ course: { $in: courseIds } }).populate(
        "course",
        "name",
      );

      return res.json(quizzes);
    }
    const user = await User.findById(req.user._id);
    const courseIds = user.enrolledCourses.map((cours) => cours.course);

    const quizzes = await Quiz.find({ course: { $in: courseIds } }).populate(
      "course",
      "name",
    );
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

//  Create a new quiz
export const createQuiz = async (req, res, next) => {
    try {
        const { courseId, title, duration, questions } = req.body;
        console.log("Creating Quiz with data:", { courseId, title, duration, questionsCount: questions?.length });

        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Quiz title is required" });
        }

        const quiz = await Quiz.create({
            course: courseId,
            title,
            duration: Number(duration) || 15,
            questions,
            createdBy: req.user?._id
        });
        res.status(201).json(quiz);
    } catch (error) {
        console.error("CREATE QUIZ ERROR:", error);
        next(error);
    }
    const { courseId, title, duration, questions } = req.body;
     if (!courseId || !title || !duration || !questions?.length) {
            return res.status(400).json({ message: "All fields are required" });
        }
    const quiz = await Quiz.create({
      course: courseId,
      title,
      duration,
      questions,
      createdBy: req.user._id,
    });
    res.status(201).json(quiz);
  }


// Get quiz details (including questions)
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

// Submit quiz attempt and calculate score
export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body; // answers: { questionId: [selectedIndices] }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let correctCount = 0;

    quiz.questions.forEach((q) => {
      const userAnswer = answers[q._id] || [];
      const correctAnswers = q.correctAnswers;

      // Check if user answer matches correct answers exactly
      if (
        userAnswer.length === correctAnswers.length &&
        userAnswer.every((val) => correctAnswers.includes(val))
      ) {
        correctCount++;
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const incorrectCount = totalQuestions - correctCount;

    const attempt = await Attempt.create({
      quiz: quizId,
      student: req.user._id,
      score: correctCount,
      correctCount,
      incorrectCount,
      percentage,
    });

    // Update streak and performance
    const user = await User.findById(req.user._id);
    user.learningStreak += 1;

    // Recalculate performance (Average of all attempts)
    const allAttempts = await Attempt.find({ student: user._id });
    const totalPercentage = allAttempts.reduce(
      (acc, curr) => acc + curr.percentage,
      0,
    );
    user.performance = Math.round(totalPercentage / allAttempts.length);

    await user.save();

    res.status(201).json({
      attempt,
      explanation: quiz.questions.map((q) => ({
        qId: q._id,
        explanation: q.explanation,
      })),
    });
  } catch (error) {
    next(error);
  }
};

//  Delete a quiz
export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        next(error);
    }
};


