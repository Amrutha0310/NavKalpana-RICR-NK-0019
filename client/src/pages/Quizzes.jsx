import React, { useEffect, useState } from "react";
import api from "../config/Api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FiCpu,
  FiClock,
  FiHelpCircle,
  FiArrowRight,
  FiPlus,
  FiLoader,
  FiTrash2,
  FiEdit3,
  FiCheckCircle,
  FiCircle,
} from "react-icons/fi";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newQuiz, setNewQuiz] = useState({
    courseId: "",
    title: "",
    duration: 15,
    questions: [
      {
        question: "",
        options: ["", ""],
        correctAnswers: [0],
        type: "single",
        explanation: "",
      },
    ],
  });

  const { user, role } = useAuth();

  const fetchData = async () => {
    try {
      const [quizRes, courseRes] = await Promise.all([
        api.get("/quizzes"),
        role === "teacher"
          ? api.get("/courses")
          : Promise.resolve({ data: [] }),
      ]);

      setQuizzes(quizRes.data);

      if (role === "teacher") {
        setCourses(courseRes.data);
        if (courseRes.data.length > 0) {
          setNewQuiz((prev) => ({
            ...prev,
            courseId: courseRes.data[0]._id,
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/quizzes", newQuiz);
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [
        ...newQuiz.questions,
        {
          question: "",
          options: ["", ""],
          correctAnswers: [0],
          type: "single",
          explanation: "",
        },
      ],
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="text-primary animate-spin" size={48} />
      </div>
    );

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-base-content">
            {role === "teacher" ? "Quiz Management" : "Interactive Quizzes"}
          </h2>
          <p className="text-base-content/60 mt-1 font-medium">
            {role === "teacher"
              ? "Create and publish assessments for students."
              : "Test your knowledge and earn points."}
          </p>
        </div>

        {role === "teacher" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 h-12"
          >
            <FiPlus size={20} /> Create Quiz
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="bg-base-100 p-7 rounded-[2rem] border border-base-300 flex flex-col group hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                <FiCpu size={28} />
              </div>
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] bg-base-200 px-3 py-1 rounded-full">
                {quiz.course?.name || "No Course"}
              </span>
            </div>

            <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors leading-tight">
              {quiz.title}
            </h3>

            <div className="flex items-center gap-5 text-sm text-base-content/50 mb-10 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <FiClock className="text-primary" />
                <span>{quiz.duration}m</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiHelpCircle className="text-primary" />
                <span>{quiz.totalQuestions} Qs</span>
              </div>
            </div>

            <div className="mt-auto">
              {role === "teacher" ? (
                <div className="flex gap-3">
                  <button className="flex-1 btn btn-ghost bg-base-200 hover:bg-base-300 rounded-2xl text-base-content border-none h-12 font-bold">
                    <FiEdit3 size={18} /> Edit
                  </button>
                  <button className="btn btn-ghost w-12 h-12 text-error hover:bg-error/10 flex items-center justify-center rounded-2xl border-none transition-all">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="btn btn-primary w-full rounded-2xl flex items-center justify-center gap-2 h-12 font-black shadow-md shadow-primary/10"
                >
                  Start Quiz
                  <FiArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>
        ))}

        {quizzes.length === 0 && (
          <div className="col-span-full py-24 text-center bg-base-100 rounded-[2.5rem] border-2 border-dashed border-base-300">
            <FiCircle
              className="mx-auto mb-6 text-base-content/10 animate-pulse"
              size={64}
            />
            <p className="text-base-content/30 italic text-xl font-medium">No quizzes available at the moment.</p>
          </div>
        )}
      </div>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="max-w-3xl w-full bg-base-100 border border-base-300 rounded-[2.5rem] p-10 max-h-[90vh] overflow-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-base-content flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <FiPlus />
                </div>
                Design New Quiz
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-ghost btn-sm rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-base-content/40 uppercase tracking-widest ml-2">
                    Relate to Course
                  </label>
                  <select
                    className="select select-bordered w-full rounded-2xl h-14 font-bold bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
                    value={newQuiz.courseId}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, courseId: e.target.value })
                    }
                  >
                    {courses.map((c) => (
                      <option key={c.course._id} value={c.course._id}>
                        {c.course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-base-content/40 uppercase tracking-widest ml-2">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    className="input input-bordered w-full rounded-2xl h-14 font-bold bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
                    value={newQuiz.duration}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, duration: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-base-content/40 uppercase tracking-widest ml-2">
                  Quiz Title
                </label>
                <input
                  required
                  className="input input-bordered w-full rounded-2xl h-14 font-bold bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Advanced JavaScript Mastery"
                  value={newQuiz.title}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, title: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full rounded-2xl h-16 text-lg font-black shadow-xl shadow-primary/20 group"
              >
                {submitting ? (
                  <FiLoader className="animate-spin" size={20} />
                ) : (
                  <>
                    <FiCheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                    Deploy Quiz
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quizzes;
