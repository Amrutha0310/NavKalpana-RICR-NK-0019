import React, { useEffect, useState } from 'react';
import api from '../config/Api';
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

    const user = JSON.parse(sessionStorage.getItem("LearningUser"));
    const role = user?.role || 'student';

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
            <div className="flex items-center justify-center h-full text-primary-500">
                <FiLoader className="animate-spin" size={48} />
            </div>
        );

    return (
        <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        {role === 'teacher'
                            ? 'Doubt Resolution'
                            : 'Learning Support'}
                    </h2>
                    <p className="text-slate-400 mt-1">
                        {role === 'teacher'
                            ? 'Assist students with their queries.'
                            : "Stuck somewhere? We're here to help."}
                    </p>
                </div>

                {role === 'student' && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 shadow-lg transition-all"
                    >
                        <FiPlus size={20} /> New Request
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-6">
                        {role === 'teacher'
                            ? 'Incoming Queries'
                            : 'Your Recent Requests'}
                    </h3>

                    {doubts.map((doubt) => (
                        <div
                            key={doubt._id}
                            className="glass p-6 rounded-3xl border border-slate-800"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                        <FiMessageSquare size={20} />
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-200">
                                            {doubt.topic}
                                        </h4>
                                        <p className="text-xs text-slate-500 uppercase">
                                            {doubt.course.name} • {doubt.type}
                                            {role === 'teacher' &&
                                                ` • Student: ${doubt.student.fullName}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase ${doubt.status === 'Resolved'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
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
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                </div>
                            </div>

                            <p className="text-slate-400 text-sm mb-6 bg-slate-950/30 p-4 rounded-xl border border-slate-800">
                                {doubt.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <FiClock size={14} />
                                    <span>
                                        Requested on{' '}
                                        {new Date(
                                            doubt.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                {doubt.status === 'Resolved' && (
                                    <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold">
                                        <FiCheckCircle size={16} /> Closed
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {doubts.length === 0 && (
                        <div className="text-center py-20 glass rounded-3xl border-dashed border-slate-800">
                            <FiMessageSquare
                                className="mx-auto mb-4 text-slate-700"
                                size={48}
                            />
                            <p className="text-slate-500 italic">
                                No queries found.
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-linear-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FiLifeBuoy size={120} />
                        </div>

                        <h4 className="text-2xl font-bold text-white mb-2">
                            Academic Support
                        </h4>
                        <p className="text-indigo-100 mb-6 text-sm">
                            Our team of experts is available to help you
                            navigate complex topics and system issues.
                        </p>

                        <button className="bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl">
                            View Help Center
                        </button>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="max-w-2xl w-full glass border border-slate-800 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-white">
                                Submit New Request
                            </h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-slate-500 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    Topic
                                </label>
                                <input
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white"
                                    value={formData.topic}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            topic: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    Description
                                </label>
                                <textarea
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white h-32"
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
                                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <FiLoader
                                        className="animate-spin"
                                        size={20}
                                    />
                                ) : (
                                    <>
                                        <FiSend size={20} /> Submit Request
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