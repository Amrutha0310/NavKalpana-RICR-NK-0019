import React, { useEffect, useState } from "react";
import api from "../config/Api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
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
  FiChevronLeft,
  FiChevronRight,
  FiTarget,
  FiMenu
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
        const teacherCourses = courseRes.data;
        setCourses(teacherCourses);
        if (teacherCourses.length > 0) {
          const firstCourseId = teacherCourses[0]?.course?._id || teacherCourses[0]?._id;
          if (firstCourseId) {
            setNewQuiz((prev) => ({
              ...prev,
              courseId: firstCourseId,
            }));
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    if (!newQuiz.courseId) {
      return toast.error("Please select a course for this quiz");
    }

    if (!newQuiz.title || newQuiz.title.trim() === "") {
      return toast.error("Please provide a title for the quiz");
    }

    // Validation
    const invalidQ = newQuiz.questions.find(q => !q.question || q.options.some(o => !o));
    if (invalidQ) return toast.error("Please fill all questions and options");

    setSubmitting(true);
    try {
      await api.post("/quizzes", newQuiz);
      toast.success("Quiz deployed successfully!");
      setShowCreateModal(false);
      setNewQuiz({
        courseId: courses[0]?.course?._id || courses[0]?._id || "",
        title: "",
        duration: 15,
        questions: [{ question: "", options: ["", ""], correctAnswers: [0], type: "single", explanation: "" }],
      });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to deploy quiz");
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

  const removeQuestion = (index) => {
    if (newQuiz.questions.length === 1) return;
    const qs = [...newQuiz.questions];
    qs.splice(index, 1);
    setNewQuiz({ ...newQuiz, questions: qs });
  };

  const updateQuestion = (index, field, value) => {
    const qs = [...newQuiz.questions];
    qs[index][field] = value;
    setNewQuiz({ ...newQuiz, questions: qs });
  };

  const addOption = (qIndex) => {
    const qs = [...newQuiz.questions];
    qs[qIndex].options.push("");
    setNewQuiz({ ...newQuiz, questions: qs });
  };

  const removeOption = (qIndex, oIndex) => {
    const qs = [...newQuiz.questions];
    if (qs[qIndex].options.length <= 2) return;
    qs[qIndex].options.splice(oIndex, 1);
    // Adjust correct answers if necessary
    qs[qIndex].correctAnswers = qs[qIndex].correctAnswers
      .filter(idx => idx !== oIndex)
      .map(idx => (idx > oIndex ? idx - 1 : idx));
    setNewQuiz({ ...newQuiz, questions: qs });
  };

  const toggleCorrectOption = (qIndex, oIndex) => {
    const qs = [...newQuiz.questions];
    if (qs[qIndex].type === 'single') {
      qs[qIndex].correctAnswers = [oIndex];
    } else {
      const current = qs[qIndex].correctAnswers;
      if (current.includes(oIndex)) {
        qs[qIndex].correctAnswers = current.filter(i => i !== oIndex);
      } else {
        qs[qIndex].correctAnswers = [...current, oIndex];
      }
    }
    setNewQuiz({ ...newQuiz, questions: qs });
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
          <h2 className="text-4xl font-black text-base-content tracking-tight">
            {role === "teacher" ? "Quiz Management" : "Assessment Hub"}
          </h2>
          <p className="text-base-content/60 mt-1 font-medium">
            {role === "teacher"
              ? "Design and monitor interactive student assessments."
              : "Validate your skills and track your progress."}
          </p>
        </div>

        {role === "teacher" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-content px-8 py-3.5 rounded-2xl h-14 font-black flex items-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            <FiPlus size={20} /> Create New Quiz
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-base-100 rounded-[2.5rem] border-2 border-dashed border-base-300">
            <FiHelpCircle className="mx-auto mb-6 text-base-content/10" size={80} />
            <p className="text-2xl font-black text-base-content/30 italic">No assessments deployed yet.</p>
          </div>
        ) : quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="bg-base-100 p-8 rounded-[2.5rem] border border-base-300 flex flex-col group hover:border-primary transition-all duration-300 shadow-sm hover:shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <FiCpu size={28} />
              </div>
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] bg-base-200 px-4 py-1.5 rounded-full border border-base-300">
                {quiz.course?.name || "Internal"}
              </span>
            </div>

            <h3 className="text-2xl font-black text-base-content mb-3 group-hover:text-primary transition-colors leading-tight">
              {quiz.title}
            </h3>

            <div className="flex items-center gap-6 text-xs text-base-content/50 mb-10 font-black uppercase tracking-widest pl-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-base-200 flex items-center justify-center text-primary shadow-sm">
                  <FiClock size={14} />
                </div>
                <span>{quiz.duration}m</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-base-200 flex items-center justify-center text-primary shadow-sm">
                  <FiTarget size={14} />
                </div>
                <span>{quiz.totalQuestions || 0} QUESTS</span>
              </div>
            </div>

            <div className="mt-auto border-t border-base-300 pt-6">
              {role === "teacher" ? (
                <div className="flex gap-3">
                  <button className="flex-1 btn btn-ghost bg-base-200 hover:bg-base-300 rounded-2xl text-base-content border-none h-14 font-black">
                    <FiEdit3 size={18} /> Manage
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Delete this quiz?')) {
                        try {
                          await api.delete(`/quizzes/${quiz._id}`);
                          toast.success("Quiz deleted");
                          fetchData();
                        } catch (e) { toast.error("Failed to delete"); }
                      }
                    }}
                    className="btn btn-ghost w-14 h-14 text-error hover:bg-error/10 flex items-center justify-center rounded-2xl border-none transition-all"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="btn btn-primary w-full rounded-2xl flex items-center justify-center gap-2 h-14 font-black shadow-lg shadow-primary/20 group"
                >
                  Embark Journey
                  <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE QUIZ MODAL - Full Screen Flow */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-5xl h-full flex flex-col bg-base-100 border border-base-300 rounded-[3rem] shadow-2xl relative overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-base-300 bg-base-100 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary text-primary-content rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <FiPlus size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-base-content tracking-tight">Curate New Assessment</h3>
                  <p className="text-xs font-bold text-base-content/40 uppercase tracking-[0.2em]">{newQuiz.questions.length} Questions Drafted</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-base-200 hover:bg-error/10 hover:text-error transition-all font-black"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Scrollable Form */}
            <form onSubmit={handleCreateQuiz} className="flex-1 overflow-auto flex flex-col">
              <div className="p-10 space-y-12 flex-1">
                {/* Basic Info Section */}
                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black">1</div>
                    <h4 className="text-lg font-black text-base-content tracking-wider uppercase opacity-50">Base Configuration</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">COURSE CONTEXT</label>
                      <select
                        className="select select-bordered w-full rounded-2xl h-14 font-black bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
                        value={newQuiz.courseId}
                        onChange={(e) => setNewQuiz({ ...newQuiz, courseId: e.target.value })}
                      >
                        {courses.map((item) => {
                          const course = item.course || item;
                          return (
                            <option key={course._id} value={course._id}>
                              {course.name}
                            </option>
                          )
                        })}
                      </select>
                    </div>

                    <div className="md:col-span-1 space-y-3">
                      <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">TIME LIMIT (MINS)</label>
                      <input
                        type="number"
                        required
                        className="input input-bordered w-full rounded-2xl h-14 font-black bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
                        value={newQuiz.duration}
                        onChange={(e) => setNewQuiz({ ...newQuiz, duration: e.target.value })}
                      />
                    </div>

                    <div className="md:col-span-1 space-y-3">
                      <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">ASSESSMENT TITLE</label>
                      <input
                        required
                        className="input input-bordered w-full rounded-2xl h-14 font-black bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
                        placeholder="e.g. React Architecture Advanced"
                        value={newQuiz.title}
                        onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                {/* Questions Section */}
                <section className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black">2</div>
                      <h4 className="text-lg font-black text-base-content tracking-wider uppercase opacity-50">Question Bank</h4>
                    </div>
                  </div>

                  <div className="space-y-12">
                    {newQuiz.questions.map((q, qIndex) => (
                      <div key={qIndex} className="bg-base-200/50 p-8 rounded-[2rem] border border-base-300 relative group/q animate-in slide-in-from-left-4 duration-300">

                        {/* Question Index & Remove */}
                        <div className="absolute -left-4 top-8 w-10 h-10 bg-primary text-primary-content rounded-xl flex items-center justify-center font-black shadow-lg">
                          {qIndex + 1}
                        </div>

                        {newQuiz.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="absolute -right-4 top-8 w-10 h-10 bg-error text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform opacity-0 group-hover/q:opacity-100"
                          >
                            <FiTrash2 />
                          </button>
                        )}

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3 space-y-2">
                              <label className="text-[10px] font-black text-base-content/30 uppercase tracking-[0.2em] ml-2">QUESTION TEXT</label>
                              <input
                                required
                                className="input input-ghost w-full bg-base-100 rounded-2xl h-14 font-bold focus:bg-base-100 text-lg"
                                placeholder="State your question..."
                                value={q.question}
                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-base-content/30 uppercase tracking-[0.2em] ml-2">TYPE</label>
                              <select
                                className="select select-ghost w-full bg-base-100 rounded-2xl h-14 font-black"
                                value={q.type}
                                onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                              >
                                <option value="single">Single Choice</option>
                                <option value="multiple">Multiple Choice</option>
                              </select>
                            </div>
                          </div>

                          {/* Options Grid */}
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-base-content/30 uppercase tracking-[0.2em] ml-2">OPTIONS (SELECT CORRECT)</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleCorrectOption(qIndex, oIndex)}
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${q.correctAnswers.includes(oIndex)
                                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                      : 'bg-base-100 text-base-content/20'
                                      }`}
                                  >
                                    {q.correctAnswers.includes(oIndex) ? <FiCheckCircle size={24} /> : <FiCircle size={24} />}
                                  </button>
                                  <div className="flex-1 relative group/opt">
                                    <input
                                      required
                                      className="input input-ghost w-full bg-base-100 rounded-2xl h-14 font-medium"
                                      placeholder={`Option ${oIndex + 1}`}
                                      value={opt}
                                      onChange={(e) => {
                                        const o = [...q.options];
                                        o[oIndex] = e.target.value;
                                        updateQuestion(qIndex, 'options', o);
                                      }}
                                    />
                                    {q.options.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() => removeOption(qIndex, oIndex)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-error opacity-0 group-hover/opt:opacity-100 transition-opacity"
                                      >
                                        <FiTrash2 />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addOption(qIndex)}
                                className="h-14 rounded-2xl border-2 border-dashed border-base-300 flex items-center justify-center gap-2 font-black text-base-content/40 hover:border-primary hover:text-primary transition-all"
                              >
                                <FiPlus /> Add Choice
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-base-content/30 uppercase tracking-[0.2em] ml-2">EXPLANATION (OPTIONAL)</label>
                            <input
                              className="input input-ghost w-full bg-base-100 rounded-2xl h-14 font-medium"
                              placeholder="Explain why the answer is correct..."
                              value={q.explanation}
                              onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addQuestion}
                      className="w-full h-24 rounded-[2rem] border-4 border-dashed border-base-300 flex flex-col items-center justify-center gap-1 group hover:border-primary hover:bg-primary/5 transition-all text-base-content/20 hover:text-primary"
                    >
                      <FiPlus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                      <span className="font-black uppercase tracking-widest text-xs">Append Question</span>
                    </button>
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-base-300 bg-base-200/50 flex justify-end gap-4 sticky bottom-0 z-10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-10 py-4 rounded-2full font-black text-base-content/60 hover:bg-base-300 transition-all rounded-2xl"
                >
                  Discard Draft
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary/90 text-primary-content px-12 py-4 rounded-2xl h-16 font-black flex items-center gap-3 shadow-xl shadow-primary/20 transition-all group active:scale-95"
                >
                  {submitting ? <FiLoader className="animate-spin" /> : (
                    <>
                      DEPLOY TO HUB
                      <FiTarget size={22} className="group-hover:scale-125 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quizzes;
