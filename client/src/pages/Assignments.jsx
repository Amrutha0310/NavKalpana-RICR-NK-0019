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
    <div className="p-8 space-y-12 animate-in slide-in-from-right-4 duration-700 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-base-content tracking-tight uppercase">STUDENT WORK & INTEL</h2>
          <p className="text-base-content/50 font-medium italic">Monitor transmissions and deploy new challenges.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20 h-16 px-10 font-black text-sm uppercase tracking-widest group active:scale-95 transition-all"
        >
          <FaPlus size={18} className="group-hover:rotate-90 transition-transform" /> Deploy Assignment
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-100 p-8 rounded-[2rem] border border-base-300 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <FaBook size={28} />
          </div>
          <div>
            <p className="text-4xl font-black text-base-content">{assignments.length}</p>
            <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Active Assignments</p>
          </div>
        </div>
        <div className="bg-base-100 p-8 rounded-[2rem] border border-base-300 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <FaCheckCircle size={28} />
          </div>
          <div>
            <p className="text-4xl font-black text-base-content">{submissions.length}</p>
            <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Total Submissions</p>
          </div>
        </div>
        <div className="bg-base-100 p-8 rounded-[2rem] border border-base-300 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
            <FaTrophy size={28} />
          </div>
          <div>
            <p className="text-4xl font-black text-base-content">{submissions.filter(s => s.status === 'Evaluated').length}</p>
            <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Graded Units</p>
          </div>
        </div>
      </div>

      <div className="bg-base-100 shadow-xl rounded-[2.5rem] border border-base-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20"></div>
        <div className="p-8 border-b border-base-300 flex items-center justify-between bg-base-200/30">
          <h3 className="text-xl font-black uppercase tracking-widest">Recent Transmissions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-base-200/50 text-base-content/60 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6 text-center w-20">#</th>
                <th className="px-6 py-6">Student Intel</th>
                <th className="px-6 py-6">Target Assignment</th>
                <th className="px-6 py-6">Timestamp</th>
                <th className="px-6 py-6">Sync Status</th>
                <th className="px-10 py-6 text-right">Result</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-base-200">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <FaUser size={64} />
                      <p className="text-xl font-black uppercase tracking-widest italic">No Intel Detected</p>
                    </div>
                  </td>
                </tr>
              ) : (
                submissions.map((sub, idx) => (
                  <tr key={sub._id} className="hover:bg-primary/5 transition-all duration-300 group cursor-default">
                    <td className="px-10 py-8 text-center font-black text-base-content/20 italic">{idx + 1}</td>
                    <td className="px-6 py-8">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-primary font-black shadow-inner">
                          {sub.student.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-base-content font-black text-lg tracking-tight group-hover:text-primary transition-colors">{sub.student.fullName}</p>
                          <p className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">{sub.student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <p className="font-black text-base-content/80 uppercase text-xs tracking-widest">{sub.assignment?.title}</p>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest">
                        <FaClock className="text-primary/50" />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest shadow-sm ${sub.status === "Evaluated" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20 animate-pulse"
                        }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right font-black text-2xl text-primary tracking-tighter">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-2xl w-full bg-base-100 border border-base-300 rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-black text-base-content flex items-center gap-4 uppercase tracking-tighter italic">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                  <FaPlus />
                </div>
                Deploy New Challenge
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost btn-circle">✕</button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.3em] ml-2">Target Course</label>
                <select
                  required
                  className="select select-bordered w-full rounded-2xl h-16 font-black bg-base-200 border-none focus:ring-4 focus:ring-primary/10 transition-all select-lg"
                  value={newAssignment.courseId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
                >
                  <option value="">Select Curriculum Sector...</option>
                  {courses.map(c => (
                    <option key={c._id} value={c.course?._id || c._id}>{c.course?.name || c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.3em] ml-2">Mission Title</label>
                <input
                  required
                  className="input input-bordered w-full rounded-2xl h-16 font-black bg-base-200 border-none focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                  placeholder="Briefly name the challenge..."
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.3em] ml-2">Execution Deadline</label>
                  <input
                    required
                    type="date"
                    className="input input-bordered w-full rounded-2xl h-16 font-black bg-base-200 border-none focus:ring-4 focus:ring-primary/10 transition-all"
                    value={newAssignment.deadline}
                    onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.3em] ml-2">Tactical Directives</label>
                <textarea
                  required
                  className="textarea textarea-bordered w-full rounded-[2rem] h-40 font-black bg-base-200 border-none focus:ring-4 focus:ring-primary/10 transition-all p-8 leading-relaxed"
                  placeholder="Provide detailed instructions for the students..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full rounded-2xl h-20 text-lg font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : "Deploy Assignment to Curriculum"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderStudentView = () => (
    <div className="p-8 space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-base-content tracking-tight uppercase italic">Active Missions</h2>
        <p className="text-base-content/50 font-medium">Verify your objectives and transmit your solutions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {assignments.length === 0 ? (
          <div className="col-span-full py-40 text-center bg-base-100 rounded-[3rem] border-4 border-dashed border-base-200 flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center text-base-content/10">
              <FaCalendarAlt size={48} />
            </div>
            <div>
              <p className="text-3xl font-black uppercase tracking-[0.3em] text-base-content/20 italic">Clean Sector</p>
              <p className="text-sm font-bold text-base-content/30 mt-2">No active assignments detected. Intelligence high.</p>
            </div>
          </div>
        ) : (
          assignments.map((assignment) => {
            const submission = getStudentSubmission(assignment._id);

            return (
              <div
                key={assignment._id}
                className="bg-base-100 p-10 rounded-[3rem] border border-base-300 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                  <FaBook size={120} />
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em] bg-primary/5 px-4 py-1 rounded-full">{assignment.course?.name}</span>
                    <h3 className="text-3xl font-black text-base-content tracking-tight group-hover:text-primary transition-colors pr-20">
                      {assignment.title}
                    </h3>
                  </div>

                  <p className="text-base-content/70 font-medium leading-relaxed bg-base-200/50 p-6 rounded-2xl border border-base-300 italic">
                    "{assignment.description}"
                  </p>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest">
                      <FaCalendarAlt className="text-primary" />
                      Due: {new Date(assignment.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase tracking-widest">
                      <FaClock className="text-primary" />
                      Sync: Local Node
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  {submission ? (
                    <div className="flex flex-col gap-4">
                      <div className="w-full h-1.5 bg-base-200 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-emerald-500 animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-500/5 p-6 rounded-2xl border-2 border-emerald-500/20">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <FaCheckCircle size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-base-content uppercase tracking-widest">Protocol Success</p>
                            <p className="text-xs font-bold text-emerald-600 uppercase">
                              {submission.marks ? `Validated Score: ${submission.marks}/100` : "Encryption Pending Review"}
                            </p>
                          </div>
                        </div>

                        {submission.feedback && (
                          <div className="tooltip tooltip-left" data-tip={submission.feedback}>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-help">
                              <FaCommentDots />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setSelectedAssignment(assignment); setShowSubmitModal(true); }}
                      className="btn btn-primary w-full rounded-2xl h-16 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 group active:scale-[0.98] transition-all"
                    >
                      Process Submission <FaAngleRight className="group-hover:translate-x-2 transition-transform" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-2xl w-full bg-base-100 border border-base-300 rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-black text-base-content flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                  <FaFileUpload />
                </div>
                Sync Solution
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="btn btn-ghost btn-circle">✕</button>
            </div>

            <div className="mb-10 p-6 bg-base-200 rounded-3xl border border-base-300">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Target Mission</p>
              <p className="text-xl font-black text-base-content">{selectedAssignment?.title}</p>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.3em] ml-2">Intel Data (Link/URL)</label>
                <div className="relative group">
                  <input
                    className="input input-bordered w-full rounded-2xl h-16 font-black bg-base-200 border-none focus:ring-4 focus:ring-primary/10 transition-all pl-12"
                    placeholder="Transmission Link (Google Drive / GitHub)..."
                    value={submissionForm.externalLink}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, externalLink: e.target.value })}
                  />
                  <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.3em] ml-2">Mission Report</label>
                <textarea
                  required
                  className="textarea textarea-bordered w-full rounded-[2rem] h-48 font-black bg-base-200 border-none focus:ring-4 focus:ring-primary/10 transition-all p-8 leading-relaxed"
                  placeholder="Briefly describe your solution path..."
                  value={submissionForm.content}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, content: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full rounded-2xl h-20 text-lg font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : "Transmit to Faculty"}
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