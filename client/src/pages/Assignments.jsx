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
        <FaSpinner className="animate-spin text-primary text-5xl" />
      </div>
    );
  }

  if (role === "teacher") {
    return (
      <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-700">
        <h2 className="text-3xl font-bold text-base-content">Student Submissions</h2>

        <div className="bg-base-100 shadow-sm rounded-3xl border border-base-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-base-200 text-base-content/60 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Assignment</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Marks</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-base-200">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center">
                        <FaUser className="text-base-content/10 mb-4" size={48} />
                        <p className="text-base-content/40 italic font-medium">No submissions found yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-base-200/50 transition-colors">
                      <td className="px-6 py-4 flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-primary">
                          <FaUser size={14} />
                        </div>
                        <div>
                          <p className="text-base-content font-bold">
                            {sub.student.fullName}
                          </p>
                          <p className="text-xs text-base-content/50 font-medium">
                            {sub.student.email}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-base-content/80 font-medium">
                        {sub.assignment.title}
                      </td>

                      <td className="px-6 py-4 text-base-content/60 text-xs flex gap-2 items-center font-mono">
                        <FaClock className="text-primary/50" />
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sub.status === "Evaluated"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                            }`}
                        >
                          {sub.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-black text-primary">
                        {sub.marks ? `${sub.marks}/100` : "--"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-700">
      <h2 className="text-3xl font-bold text-base-content">Assignments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-base-100 rounded-3xl border-2 border-dashed border-base-300 shadow-sm font-medium italic">
            <FaCalendarAlt className="mx-auto mb-4 text-base-content/10" size={64} />
            <p className="text-xl tracking-widest text-base-content/30 italic">No assignments available</p>
            <p className="text-sm text-base-content/50 mt-2">You're all caught up!</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const submission = getStudentSubmission(assignment._id);

            return (
              <div
                key={assignment._id}
                className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 group hover:border-primary/50"
              >
                <h3 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                  {assignment.title}
                </h3>

                <p className="text-base-content/60 text-sm mt-3 leading-relaxed">
                  {assignment.description}
                </p>

                <div className="flex items-center gap-2 text-base-content/40 text-sm mt-5 font-bold uppercase tracking-wider">
                  <FaCalendarAlt className="text-primary" />
                  Due: {new Date(assignment.deadline).toLocaleDateString()}
                </div>

                {submission ? (
                  <div className="mt-6 flex items-center justify-between bg-base-200/50 p-4 rounded-2xl border border-base-300">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-emerald-500 text-xl" />
                      <span className="text-base-content font-bold">
                        {submission.marks
                          ? `Score: ${submission.marks}/100`
                          : "Submitted • Awaiting Review"}
                      </span>
                    </div>

                    {submission.feedback && (
                      <div className="tooltip tooltip-left" data-tip="Has Feedback">
                        <FaCommentDots className="text-primary cursor-help" />
                      </div>
                    )}
                  </div>
                ) : (
                  <button className="btn btn-primary mt-8 w-full rounded-2xl h-14 text-lg font-bold shadow-lg shadow-primary/20">
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