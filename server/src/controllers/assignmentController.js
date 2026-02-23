import Submission from "../models/SubmissionModel.js";
<<<<<<< HEAD
import Assignment from "../models/AssignmentModal.js";
=======
import Assignment from "../models/AssignmentModel.js";
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
import User from "../models/UserModel.js";
import Course from "../models/CourseModel.js";

// Get all assignments for courses student is enrolled in
<<<<<<< HEAD
export const getAssignments = async (req, res) => {
  const user = await User.findById(req.user._id);
  const courseIds = user.enrolledCourses.map((c) => c.course);

  const assignments = await Assignment.find({
    course: { $in: courseIds },
  }).populate("course", "name");
  res.json(assignments);
};

//  Submit assignment
export const submitAssignment = async (req, res) => {
  const { assignmentId, content, fileUrl, externalLink } = req.body;

  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  const isLate = new Date() > new Date(assignment.deadline);

  const submission = await Submission.create({
    assignment: assignmentId,
    student: req.user._id,
    content,
    fileUrl,
    externalLink,
    isLate,
    status: isLate ? "Late Submitted" : "Submitted",
  });

  // Update streak on submission
  const user = await User.findById(req.user._id);
  user.learningStreak += 1;
  await user.save();

  res.status(201).json(submission);
};

// Get submissions (Own for student, all for teacher's courses)
export const getSubmissions = async (req, res) => {
  if (req.user.role === "teacher") {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map((c) => c._id);
    const assignments = await Assignment.find({ course: { $in: courseIds } });
    const assignmentIds = assignments.map((a) => a._id);

    const submissions = await Submission.find({
      assignment: { $in: assignmentIds },
    })
      .populate("student", "name email")
      .populate("assignment", "title")
      .sort({ createdAt: -1 });
    return res.json(submissions);
  }
  const submissions = await Submission.find({ student: req.user._id })
    .populate("assignment", "title")
    .sort({ createdAt: -1 });
  res.json(submissions);
};

//  Grade a submission
export const evaluateSubmission = async (req, res) => {
  const { marks, feedback } = req.body;
  const submission = await Submission.findById(req.params.id);

  if (!submission) return res.status(404).json({ message: "Not found" });

  submission.marks = marks;
  submission.feedback = feedback;
  submission.status = "Evaluated";

  await submission.save();
  res.json(submission);
=======
export const getAssignments = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const courseIds = user.enrolledCourses.map((c) => c.course);

    const assignments = await Assignment.find({
      course: { $in: courseIds },
    }).populate("course", "name");
    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

//  Submit assignment
export const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId, content, fileUrl, externalLink } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const isLate = new Date() > new Date(assignment.deadline);

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      content,
      fileUrl,
      externalLink,
      isLate,
      status: isLate ? "Late Submitted" : "Submitted",
    });

    // Update streak on submission
    const user = await User.findById(req.user._id);
    user.learningStreak += 1;
    await user.save();

    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
};

// Get submissions (Own for student, all for teacher's courses)
export const getSubmissions = async (req, res, next) => {
  try {
    if (req.user.role === "teacher") {
      const courses = await Course.find({ instructor: req.user._id });
      const courseIds = courses.map((c) => c._id);
      const assignments = await Assignment.find({ course: { $in: courseIds } });
      const assignmentIds = assignments.map((a) => a._id);

      const submissions = await Submission.find({
        assignment: { $in: assignmentIds },
      })
        .populate("student", "fullName email")
        .populate("assignment", "title")
        .sort({ createdAt: -1 });
      return res.json(submissions);
    }
    const submissions = await Submission.find({ student: req.user._id })
      .populate("assignment", "title")
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

//  Grade a submission
export const evaluateSubmission = async (req, res, next) => {
  try {
    const { marks, feedback } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) return res.status(404).json({ message: "Not found" });

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = "Evaluated";

    await submission.save();
    res.json(submission);
  } catch (error) {
    next(error);
  }
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
};
