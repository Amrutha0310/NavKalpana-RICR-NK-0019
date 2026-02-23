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

    if (loading) return <div>Loading attendance...</div>;

    return (
        <div className="p-6 space-y-8 animate-in slide-in-from-top-4 duration-700">
            <div>
                <h2 className="text-3xl font-bold text-white">Attendance Tracking</h2>
                <p className="text-slate-400 mt-1">Keep track of your classes and participation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="glass p-8 rounded-3xl border border-slate-800 flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center">
                        <FiTrendingUp size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                            Overall Attendance
                        </p>
                        <h3 className="text-4xl font-bold text-white">
                            {calculateOverall()}%
                        </h3>
                    </div>
                </div>


                <div className="glass p-8 rounded-3xl border border-slate-800 flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                        <FiCheckCircle size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                            Classes Present
                        </p>
                        <h3 className="text-4xl font-bold text-white">
                            {attendance.filter(a => a.status === 'Present').length}
                        </h3>
                    </div>
                </div>


                <div className="glass p-8 rounded-3xl border border-slate-800 flex items-center gap-6">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
                        <FiXCircle size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                            Classes Absent
                        </p>
                        <h3 className="text-4xl font-bold text-white">
                            {attendance.filter(a => a.status === 'Absent').length}
                        </h3>
                    </div>
                </div>
            </div>


            <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                        Attendance History
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <FiCalendar size={16} />
                        <span>Last 30 Days</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-8 py-4">Course Name</th>
                                <th className="px-8 py-4">Date</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Session</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800">
                            {attendance.map((record) => (
                                <tr
                                    key={record._id}
                                    className="hover:bg-slate-800/30 transition-colors group"
                                >
                                    <td className="px-8 py-4 font-semibold text-slate-200">
                                        {record.course.name}
                                    </td>

                                    <td className="px-8 py-4 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <FiCalendar size={14} />
                                            {new Date(record.date).toLocaleDateString()}
                                        </div>
                                    </td>

                                    <td className="px-8 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${record.status === 'Present'
                                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                }`}
                                        >
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full ${record.status === 'Present'
                                                    ? 'bg-emerald-500'
                                                    : 'bg-red-500'
                                                    }`}
                                            ></div>
                                            {record.status}
                                        </span>
                                    </td>

                                    <td className="px-8 py-4 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <FiClock size={14} />
                                            Theory Class
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {attendance.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-8 py-10 text-center text-slate-600 italic"
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