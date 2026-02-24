import React, { useEffect, useState } from 'react';
import api from "../config/Api";
import {
    FiTrendingUp,
    FiCalendar,
    FiCheckCircle,
    FiXCircle,
    FiClock
} from 'react-icons/fi';

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await api.get('/support/attendance');
                setAttendance(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    const calculateOverall = () => {
        if (attendance.length === 0) return 0;
        const present = attendance.filter(a => a.status === 'Present').length;
        return Math.round((present / attendance.length) * 100);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 space-y-6 animate-in slide-in-from-top-4 duration-700 max-w-6xl mx-auto">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-base-content">Attendance Tracking</h2>
                <p className="text-base-content/60 text-sm mt-1">Keep track of your classes and participation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-base-100 p-4 sm:p-6 rounded-2xl border border-base-300 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <FiTrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-base-content/40 uppercase tracking-wider">
                            Overall Attendance
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-base-content">
                            {calculateOverall()}%
                        </h3>
                    </div>
                </div>

                <div className="bg-base-100 p-4 sm:p-6 rounded-2xl border border-base-300 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                        <FiCheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-base-content/40 uppercase tracking-wider">
                            Classes Present
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-base-content">
                            {attendance.filter(a => a.status === 'Present').length}
                        </h3>
                    </div>
                </div>

                <div className="bg-base-100 p-4 sm:p-6 rounded-2xl border border-base-300 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-error/10 text-error rounded-xl flex items-center justify-center">
                        <FiXCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-base-content/40 uppercase tracking-wider">
                            Classes Absent
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-base-content">
                            {attendance.filter(a => a.status === 'Absent').length}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-base-300 bg-base-200/30 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-base-content">
                        Attendance History
                    </h3>
                    <div className="flex items-center gap-2 text-base-content/40 text-sm font-medium">
                        <FiCalendar size={16} />
                        <span>Last 30 Days</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                        <thead>
                            <tr className="text-base-content/50 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                <th className="px-4 sm:px-6 py-3">Course Name</th>
                                <th className="px-4 sm:px-6 py-3">Date</th>
                                <th className="px-4 sm:px-6 py-3">Status</th>
                                <th className="px-4 sm:px-6 py-3">Session</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-base-200">
                            {attendance.map((record) => (
                                <tr
                                    key={record._id}
                                    className="hover:bg-base-200/50 transition-colors group"
                                >
                                    <td className="px-4 sm:px-6 py-3 font-semibold text-sm text-base-content">
                                        {record.course.name}
                                    </td>

                                    <td className="px-4 sm:px-6 py-3 text-base-content/60 text-sm">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar size={14} className="text-primary" />
                                            {new Date(record.date).toLocaleDateString()}
                                        </div>
                                    </td>

                                    <td className="px-4 sm:px-6 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${record.status === 'Present'
                                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                : 'bg-error/10 text-error border border-error/20'
                                                }`}
                                        >
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full ${record.status === 'Present'
                                                    ? 'bg-emerald-500'
                                                    : 'bg-error'
                                                    }`}
                                            ></div>
                                            {record.status}
                                        </span>
                                    </td>

                                    <td className="px-4 sm:px-6 py-3 text-base-content/60">
                                        <div className="flex items-center gap-2 font-medium text-sm">
                                            <FiClock size={14} className="text-base-content/30" />
                                            Theory Class
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {attendance.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-8 py-12 text-center text-base-content/30 italic font-medium"
                                    >
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;