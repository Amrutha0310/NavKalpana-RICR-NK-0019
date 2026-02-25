import React, { useEffect, useState } from "react";
import api from "../config/Api";
import { useAuth } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCommentDots,
  FaSpinner,
  FaUser,
  FaPlus,
  FaFileUpload,
  FaLink,
  FaBook,
  FaTrophy,
  FaAngleRight
} from "react-icons/fa";
import toast from "react-hot-toast";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    courseId: "",
    title: "",
    description: "",
    deadline: ""
  });

  const [submissionForm, setSubmissionForm] = useState({
    content: "",
    fileUrl: "",
    externalLink: ""
  });

  const { user, role } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, submissionsRes] = await Promise.all([
        api.get("/assignments"),
        api.get("/assignments/submissions")
      ]);
      setAssignments(assignmentsRes.data);
      setSubmissions(submissionsRes.data);

      if (role === "teacher") {
        const coursesRes = await api.get("/courses");
        setCourses(coursesRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to sync assignment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.courseId) return toast.error("Please select a target course");
    setSubmitting(true);
    try {
      await api.post("/assignments/create", newAssignment);
      toast.success("Assignment deployed successfully");
      setShowCreateModal(false);
      setNewAssignment({ courseId: "", title: "", description: "", deadline: "" });
      fetchData();
    } catch (error) {
      toast.error("Deployment failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/assignments/submit", {
        assignmentId: selectedAssignment._id,
        ...submissionForm
      });
      toast.success("Assignment submitted! Streak updated! 🔥");
      setShowSubmitModal(false);
      setSubmissionForm({ content: "", fileUrl: "", externalLink: "" });
      fetchData();
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const getStudentSubmission = (assignmentId) =>
    submissions.find((s) => s.assignment?._id === assignmentId);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <FaSpinner className="animate-spin text-primary text-5xl" />
        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 italic">Syncing Curricula...</p>
      </div>
    );
  }

  const renderTeacherView = () => (
    <div className="p-4 sm:p-6 space-y-6 animate-in slide-in-from-right-4 duration-700 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-base-content tracking-tight uppercase">Student Work & Intel</h2>
          <p className="text-base-content/50 font-medium text-sm italic">Monitor transmissions and deploy new challenges.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary btn-sm sm:btn-md rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 px-6 font-bold text-xs uppercase tracking-wider group active:scale-95 transition-all"
        >
          <FaPlus size={14} className="group-hover:rotate-90 transition-transform" /> Deploy Assignment
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-base-100 p-4 sm:p-5 rounded-2xl border border-base-300 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FaBook size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-base-content">{assignments.length}</p>
            <p className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider">Active Assignments</p>
          </div>
        </div>
        <div className="bg-base-100 p-4 sm:p-5 rounded-2xl border border-base-300 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <FaCheckCircle size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-base-content">{submissions.length}</p>
            <p className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider">Total Submissions</p>
          </div>
        </div>
        <div className="bg-base-100 p-4 sm:p-5 rounded-2xl border border-base-300 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
            <FaTrophy size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-base-content">{submissions.filter(s => s.status === 'Evaluated').length}</p>
            <p className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider">Graded Units</p>
          </div>
        </div>
      </div>

      <div className="bg-base-100 shadow-xl rounded-2xl border border-base-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
        <div className="p-4 sm:p-5 border-b border-base-300 flex items-center justify-between bg-base-200/30">
          <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider">Recent Transmissions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-base-200/50 text-base-content/60 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-center w-12">#</th>
                <th className="px-4 sm:px-6 py-3">Student</th>
                <th className="px-4 sm:px-6 py-3">Assignment</th>
                <th className="px-4 sm:px-6 py-3">Timestamp</th>
                <th className="px-4 sm:px-6 py-3">Status</th>
                <th className="px-4 sm:px-6 py-3 text-right">Result</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-base-200">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <FaUser size={40} />
                      <p className="text-sm font-bold uppercase tracking-wider italic">No Submissions Yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                submissions.map((sub, idx) => (
                  <tr key={sub._id} className="hover:bg-primary/5 transition-all duration-300 group cursor-default">
                    <td className="px-4 sm:px-6 py-3 text-center font-bold text-base-content/20 text-sm">{idx + 1}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-primary font-bold text-sm shadow-inner">
                          {sub.student.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-base-content font-bold text-sm group-hover:text-primary transition-colors">{sub.student.fullName}</p>
                          <p className="text-[10px] font-bold text-base-content/40">{sub.student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <p className="font-bold text-base-content/80 uppercase text-xs tracking-wider">{sub.assignment?.title}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-base-content/40">
                        <FaClock className="text-primary/50" />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className={`text-[9px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${sub.status === "Evaluated" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20 animate-pulse"
                        }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right font-bold text-lg text-primary">
                      {sub.marks ? `${sub.marks}` : "--"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-lg w-full bg-base-100 border border-base-300 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-base-content flex items-center gap-3 uppercase tracking-tight">
                <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <FaPlus size={14} />
                </div>
                New Assignment
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost btn-circle btn-sm">✕</button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider ml-1">Course</label>
                <select
                  required
                  className="select select-bordered w-full rounded-xl h-12 font-medium bg-base-200 border-none focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  value={newAssignment.courseId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
                >
                  <option value="">Select Course...</option>
                  {courses.map(c => (
                    <option key={c._id} value={c.course?._id || c._id}>{c.course?.name || c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider ml-1">Title</label>
                <input
                  required
                  className="input input-bordered w-full rounded-xl h-12 font-medium bg-base-200 border-none focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  placeholder="Assignment title..."
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider ml-1">Deadline</label>
                <input
                  required
                  type="date"
                  className="input input-bordered w-full rounded-xl h-12 font-medium bg-base-200 border-none focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  value={newAssignment.deadline}
                  onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider ml-1">Description</label>
                <textarea
                  required
                  className="textarea textarea-bordered w-full rounded-xl h-28 font-medium bg-base-200 border-none focus:ring-2 focus:ring-primary/10 transition-all p-4 leading-relaxed text-sm"
                  placeholder="Provide detailed instructions..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full rounded-xl h-12 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : "Deploy Assignment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderStudentView = () => (
    <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-base-content tracking-tight uppercase">Active Missions</h2>
        <p className="text-base-content/50 font-medium text-sm">Verify your objectives and transmit your solutions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {assignments.length === 0 ? (
          <div className="col-span-full py-16 sm:py-24 text-center bg-base-100 rounded-2xl border-2 border-dashed border-base-200 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center text-base-content/10">
              <FaCalendarAlt size={32} />
            </div>
            <div>
              <p className="text-lg font-bold uppercase tracking-wider text-base-content/20">No Active Assignments</p>
              <p className="text-xs font-medium text-base-content/30 mt-1">You're all caught up!</p>
            </div>
          </div>
        ) : (
          assignments.map((assignment) => {
            const submission = getStudentSubmission(assignment._id);

            return (
              <div
                key={assignment._id}
                className="bg-base-100 p-4 sm:p-6 rounded-2xl border border-base-300 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                  <FaBook size={80} />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase text-primary tracking-wider bg-primary/5 px-3 py-0.5 rounded-full">{assignment.course?.name}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-base-content tracking-tight group-hover:text-primary transition-colors pr-12">
                      {assignment.title}
                    </h3>
                  </div>

                  <p className="text-base-content/70 text-sm font-medium leading-relaxed bg-base-200/50 p-4 rounded-xl border border-base-300 italic">
                    "{assignment.description}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-base-content/40 uppercase tracking-wider">
                      <FaCalendarAlt className="text-primary" size={12} />
                      Due: {new Date(assignment.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {submission ? (
                    <div className="flex flex-col gap-3">
                      <div className="w-full h-1 bg-base-200 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-emerald-500 animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <FaCheckCircle size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-base-content uppercase tracking-wider">Submitted</p>
                            <p className="text-[10px] font-medium text-emerald-600">
                              {submission.marks ? `Score: ${submission.marks}/100` : "Pending Review"}
                            </p>
                          </div>
                        </div>

                        {submission.feedback && (
                          <div className="tooltip tooltip-left" data-tip={submission.feedback}>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-help">
                              <FaCommentDots size={14} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setSelectedAssignment(assignment); setShowSubmitModal(true); }}
                      className="btn btn-primary w-full rounded-xl h-12 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                    >
                      Submit <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-lg w-full bg-base-100 border border-base-300 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-base-content flex items-center gap-3 uppercase tracking-tight">
                <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <FaFileUpload size={14} />
                </div>
                Submit Work
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="btn btn-ghost btn-circle btn-sm">✕</button>
            </div>

            <div className="mb-6 p-4 bg-base-200 rounded-xl border border-base-300">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Assignment</p>
              <p className="text-base font-bold text-base-content">{selectedAssignment?.title}</p>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider ml-1">Link / URL</label>
                <div className="relative">
                  <input
                    className="input input-bordered w-full rounded-xl h-12 font-medium bg-base-200 border-none focus:ring-2 focus:ring-primary/10 transition-all pl-10 text-sm"
                    placeholder="Google Drive / GitHub link..."
                    value={submissionForm.externalLink}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, externalLink: e.target.value })}
                  />
                  <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={14} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider ml-1">Description</label>
                <textarea
                  required
                  className="textarea textarea-bordered w-full rounded-xl h-28 font-medium bg-base-200 border-none focus:ring-2 focus:ring-primary/10 transition-all p-4 leading-relaxed text-sm"
                  placeholder="Briefly describe your solution..."
                  value={submissionForm.content}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, content: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full rounded-xl h-12 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return role === "teacher" ? renderTeacherView() : renderStudentView();
};

export default Assignments;