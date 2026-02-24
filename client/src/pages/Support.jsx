import React, { useEffect, useState } from 'react';
import api from '../config/Api';
import { useAuth } from '../context/AuthContext';
import {
    FiLifeBuoy,
    FiSend,
    FiMessageSquare,
    FiClock,
    FiPlus,
    FiLoader,
    FiCheckCircle
} from 'react-icons/fi';

const Support = () => {
    const [doubts, setDoubts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        courseId: '',
        topic: '',
        description: '',
        type: 'Doubt'
    });

    const { user, role } = useAuth();

    const fetchData = async () => {
        try {
            const [doubtRes, courseRes] = await Promise.all([
                api.get('/support/doubts'),
                api.get('/courses')
            ]);

            setDoubts(doubtRes.data);
            setCourses(courseRes.data);

            if (courseRes.data.length > 0) {
                const firstCourseId = courseRes.data[0].course._id;
                setFormData(prev => ({ ...prev, courseId: firstCourseId }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post('/support/doubt', formData);

            setShowForm(false);
            setFormData(prev => ({
                ...prev,
                topic: '',
                description: ''
            }));

            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.put(`/support/resolve/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FiLoader className="text-primary animate-spin" size={48} />
            </div>
        );

    return (
        <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-base-content">
                        {role === 'teacher'
                            ? 'Doubt Resolution'
                            : 'Learning Support'}
                    </h2>
                    <p className="text-base-content/60 mt-1 font-medium">
                        {role === 'teacher'
                            ? 'Assist students with their queries.'
                            : "Stuck somewhere? We're here to help."}
                    </p>
                </div>

                {role === 'student' && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 h-12 px-6"
                    >
                        <FiPlus size={20} /> New Request
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-base-content mb-6">
                        {role === 'teacher'
                            ? 'Incoming Queries'
                            : 'Your Recent Requests'}
                    </h3>

                    {doubts.map((doubt) => (
                        <div
                            key={doubt._id}
                            className="bg-base-100 p-8 rounded-[2rem] border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-600 shadow-inner">
                                        <FiMessageSquare size={24} />
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-base-content text-lg">
                                            {doubt.topic}
                                        </h4>
                                        <p className="text-[10px] font-black text-base-content/40 uppercase tracking-widest mt-1">
                                            {doubt.course.name} • <span className="text-primary">{doubt.type}</span>
                                            {role === 'teacher' &&
                                                ` • Student: ${doubt.student.fullName}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${doubt.status === 'Resolved'
                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                            : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                                            }`}
                                    >
                                        {doubt.status}
                                    </span>

                                    {role === 'teacher' &&
                                        doubt.status === 'Pending' && (
                                            <button
                                                onClick={() =>
                                                    handleResolve(doubt._id)
                                                }
                                                className="btn btn-success btn-xs rounded-full font-black text-[9px] px-3 border-none"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                </div>
                            </div>

                            <p className="text-base-content/70 text-sm mb-8 leading-relaxed bg-base-200/50 p-6 rounded-2xl border border-base-300 italic font-medium">
                                "{doubt.description}"
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-base-content/40 font-bold uppercase tracking-wider">
                                    <FiClock className="text-primary" size={14} />
                                    <span>
                                        Ref: {new Date(
                                            doubt.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                {doubt.status === 'Resolved' && (
                                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-black uppercase tracking-widest">
                                        <FiCheckCircle size={18} /> Closed
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {doubts.length === 0 && (
                        <div className="text-center py-24 bg-base-100 rounded-[2.5rem] border-2 border-dashed border-base-300">
                            <FiMessageSquare
                                className="mx-auto mb-6 text-base-content/10"
                                size={64}
                            />
                            <p className="text-base-content/30 italic text-xl font-medium">
                                No queries found in history.
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary to-secondary p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                        <div className="absolute -top-10 -right-10 p-4 opacity-10">
                            <FiLifeBuoy size={180} />
                        </div>

                        <h4 className="text-2xl font-black text-white mb-3">
                            Need Expert Help?
                        </h4>
                        <p className="text-white/80 mb-8 text-sm leading-relaxed font-medium">
                            Our team of teaching assistants is available to help you
                            navigate complex topics and technical issues.
                        </p>

                        <button className="btn btn-white bg-white text-primary border-none font-black px-8 rounded-2xl h-14 hover:scale-105 transition-transform active:scale-95">
                            Help Center
                        </button>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="max-w-2xl w-full bg-base-100 border border-base-300 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-base-content flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                    <FiPlus />
                                </div>
                                Submit New Request
                            </h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="btn btn-ghost btn-sm rounded-full"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-8"
                        >
                            <div className="space-y-3">
                                <label className="text-xs font-black text-base-content/40 uppercase tracking-widest ml-2">
                                    Topic / Subject
                                </label>
                                <input
                                    required
                                    className="input input-bordered w-full rounded-2xl h-14 font-bold bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
                                    value={formData.topic}
                                    placeholder="e.g. Question about Module 3"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            topic: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-base-content/40 uppercase tracking-widest ml-2">
                                    Detailed Description
                                </label>
                                <textarea
                                    required
                                    className="textarea textarea-bordered w-full rounded-2xl h-32 font-bold bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Explain your doubt in detail..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-primary w-full rounded-2xl h-16 text-lg font-black shadow-xl shadow-primary/20 group"
                            >
                                {submitting ? (
                                    <FiLoader
                                        className="animate-spin"
                                        size={20}
                                    />
                                ) : (
                                    <>
                                        <FiSend size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        Submit Request
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

export default Support;