import React, { useEffect, useState } from "react";
import api from "../config/Api";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCommentDots,
  FaSpinner,
  FaUser
} from "react-icons/fa";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(sessionStorage.getItem("LearningUser"));
  const role = user?.role || "student";


  const fetchAssignments = async () => {
    try {
      const assignmentsRes = await api.get("/assignments");
      setAssignments(assignmentsRes.data);
    } catch (error) {
      console.error("Failed to fetch assignments", error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const submissionsRes = await api.get("/assignments/submissions");
      setSubmissions(submissionsRes.data);
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAssignments(), fetchSubmissions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getStudentSubmission = (assignmentId) =>
    submissions.find((s) => s.assignment?._id === assignmentId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <FaSpinner className="animate-spin text-primary-500 text-5xl" />
      </div>
    );
  }

  if (role === "teacher") {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-700">
        <h2 className="text-3xl font-bold text-white">Student Submissions</h2>

        <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Assignment</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Marks</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <FaUser className="text-slate-700 opacity-20 mb-4" size={48} />
                      <p className="text-slate-500 italic">No submissions found yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-800/40">
                    <td className="px-6 py-4 flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <FaUser />
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {sub.student.fullName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {sub.student.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {sub.assignment.title}
                    </td>

                    <td className="px-6 py-4 text-slate-400 text-xs flex gap-2 items-center">
                      <FaClock />
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${sub.status === "Evaluated"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-orange-500/10 text-orange-400"
                          }`}
                      >
                        {sub.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-primary-400">
                      {sub.marks ? `${sub.marks}/100` : "--"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-700">
      <h2 className="text-3xl font-bold text-white">Assignments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.length === 0 ? (
          <div className="col-span-full py-20 text-center glass rounded-3xl border-2 border-dashed border-slate-800">
            <FaCalendarAlt className="mx-auto mb-4 text-slate-700 opacity-20" size={64} />
            <p className="text-xl font-medium uppercase tracking-widest text-base-content/30 italic">No assignments available</p>
            <p className="text-sm text-slate-500 mt-2">You're all caught up!</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const submission = getStudentSubmission(assignment._id);

            return (
              <div
                key={assignment._id}
                className="glass p-6 rounded-3xl border border-slate-800"
              >
                <h3 className="text-xl font-bold text-white">
                  {assignment.title}
                </h3>

                <p className="text-slate-400 text-sm mt-2">
                  {assignment.description}
                </p>

                <div className="flex items-center gap-2 text-slate-500 text-sm mt-4">
                  <FaCalendarAlt />
                  {new Date(assignment.deadline).toLocaleDateString()}
                </div>

                {submission ? (
                  <div className="mt-5 flex items-center justify-between bg-slate-900/60 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-emerald-500" />
                      <span className="text-white font-semibold">
                        {submission.marks
                          ? `Score: ${submission.marks}/100`
                          : "Submitted • Awaiting Review"}
                      </span>
                    </div>

                    {submission.feedback && (
                      <FaCommentDots className="text-slate-500" />
                    )}
                  </div>
                ) : (
                  <button className="mt-6 w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition">
                    Submit Assignment
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Assignments;