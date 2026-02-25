
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
    FiCheckCircle,
    FiUser,
    FiArrowRight,
    FiCornerDownRight,
    FiInfo
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Support = () => {
    const [doubts, setDoubts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [resolvingId, setResolvingId] = useState(null);
    const [teacherReply, setTeacherReply] = useState("");

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

            if (courseRes.data.length > 0 && !formData.courseId) {
                const firstCourseId = courseRes.data[0].course?._id || courseRes.data[0]._id;
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
            toast.success("Query transmitted to teaching faculty");
            setShowForm(false);
            setFormData(prev => ({
                ...prev,
                topic: '',
                description: ''
            }));

            fetchData();
        } catch (err) {
            toast.error("Transmission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleResolve = async (id) => {
        if (!teacherReply.trim()) return toast.error("Please provide an appropriate reply");
        setSubmitting(true);
        try {
            await api.put(`/support/resolve/${id}`, { teacherReply });
            toast.success("Intelligence data synced to student");
            setResolvingId(null);
            setTeacherReply("");
            fetchData();
        } catch (err) {
            toast.error("Resolution failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <FiLoader className="text-primary animate-spin" size={48} />
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Syncing Communications...</p>
            </div>
        );

    return (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-base-content tracking-tight uppercase">
                        {role === 'teacher'
                            ? 'Doubt Resolution hub'
                            : 'Intelligence support'}
                    </h2>
                    <p className="text-base-content/50 font-medium text-sm">
                        {role === 'teacher'
                            ? 'Direct communication channel with your students.'
                            : "Connect with faculty for tactical guidance."}
                    </p>
                </div>

                {role === 'student' && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary btn-sm sm:btn-md rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 px-6 font-bold text-xs uppercase tracking-wider group active:scale-95 transition-all"
                    >
                        <FiPlus size={24} className="group-hover:rotate-90 transition-transform" />
                        Initiate Query
                    </button>
                )}
            </div>

            <div className="space-y-4 sm:space-y-6">
                <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <FiMessageSquare size={16} />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-base-content uppercase tracking-wider">
                            {role === 'teacher' ? 'Active Transmissions' : 'Your Transmission History'}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {doubts.map((doubt) => (
                            <div
                                key={doubt._id}
                                className="bg-base-100 p-4 sm:p-6 rounded-2xl border border-base-300 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-1.5 h-full bg-primary/5 group-hover:bg-primary transition-colors"></div>

                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 rounded-xl bg-base-200 text-primary shadow-inner shrink-0">
                                            <FiMessageSquare size={20} />
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-bold text-base-content text-base sm:text-lg tracking-tight">
                                                {doubt.topic}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-3 text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em]">
                                                <span className="bg-base-200 px-3 py-1 rounded-full">{doubt.course?.name || 'General'}</span>
                                                <span className="text-primary">• {doubt.type}</span>
                                                {role === 'teacher' && (
                                                    <span className="flex items-center gap-1.5"><FiUser className="text-primary" /> {doubt.student?.fullName}</span>
                                                )}
                                                <span>• {new Date(doubt.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-[0.2em] shadow-sm ${doubt.status === 'Resolved'
                                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 animate-pulse'
                                                }`}
                                        >
                                            {doubt.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <blockquote className="text-base-content/70 text-sm sm:text-base mb-4 leading-relaxed bg-base-200/50 p-4 sm:p-5 rounded-xl border border-base-300 font-medium italic">
                                        "{doubt.description}"
                                    </blockquote>

                                    {doubt.teacherReply ? (
                                        <div className="mt-8 space-y-4 animate-in slide-in-from-top-4">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-2">
                                                <FiCornerDownRight /> FACULTY RESPONSE
                                            </div>
                                            <div className="bg-emerald-500/5 border-2 border-emerald-500/20 p-4 sm:p-5 rounded-xl relative">
                                                <p className="text-base-content font-bold leading-relaxed">
                                                    {doubt.teacherReply}
                                                </p>
                                                <div className="flex items-center gap-2 mt-3 text-[9px] font-bold text-emerald-600/50">
                                                    <FiCheckCircle /> VERIFIED INTEL • AUTHENTICATED BY FACULTY
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        role === 'teacher' && (
                                            <div className="mt-8 space-y-4">
                                                {resolvingId === doubt._id ? (
                                                    <div className="space-y-4 animate-in fade-in duration-300">
                                                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-2">Craft Intelligence Reply</label>
                                                        <textarea
                                                            className="textarea textarea-bordered w-full rounded-[2rem] h-32 font-bold bg-base-200 border-2 border-primary/20 focus:border-primary transition-all p-6"
                                                            placeholder="Enter your appropriate response here..."
                                                            value={teacherReply}
                                                            onChange={(e) => setTeacherReply(e.target.value)}
                                                        />
                                                        <div className="flex gap-3 justify-end">
                                                            <button
                                                                onClick={() => setResolvingId(null)}
                                                                className="btn btn-ghost rounded-2xl px-6 font-black uppercase text-xs"
                                                            >
                                                                Abort
                                                            </button>
                                                            <button
                                                                onClick={() => handleResolve(doubt._id)}
                                                                disabled={submitting}
                                                                className="btn btn-primary rounded-2xl px-10 h-14 font-black uppercase text-xs shadow-lg shadow-primary/20 gap-2"
                                                            >
                                                                {submitting ? <FiLoader className="animate-spin" /> : <><FiSend /> Sync Response</>}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setResolvingId(doubt._id)}
                                                        className="w-full h-16 rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-center gap-3 text-sm font-black text-primary/40 hover:text-primary hover:bg-primary/5 hover:border-primary transition-all uppercase tracking-widest"
                                                    >
                                                        <FiSend /> Decrypt & Respond
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}

                        {doubts.length === 0 && (
                            <div className="text-center py-16 sm:py-24 bg-base-100 rounded-2xl border-2 border-dashed border-base-200">
                                <FiMessageSquare
                                    className="mx-auto mb-4 text-base-content/5"
                                    size={64}
                                />
                                <h3 className="text-lg sm:text-xl font-bold text-base-content/20 uppercase tracking-widest">
                                    Clean Frequency
                                </h3>
                                <p className="text-base-content/20 font-bold mt-2 italic">
                                    No active transmissions detected in this sector.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Student Request Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="max-w-lg w-full bg-base-100 border border-base-300 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 relative overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-base-content flex items-center gap-3 uppercase tracking-tight">
                                <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                    <FiPlus size={16} />
                                </div>
                                New Query
                            </h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="btn btn-ghost btn-circle"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider ml-1">
                                    Subject
                                </label>
                                <div className="relative group">
                                    <input
                                        required
                                        className="input input-bordered w-full rounded-xl h-12 font-medium bg-base-200 border-none focus:ring-2 focus:ring-primary/10 transition-all pl-10 text-sm"
                                        value={formData.topic}
                                        placeholder="Briefly state your technical query..."
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                topic: e.target.value
                                            })
                                        }
                                    />
                                    <FiInfo className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={16} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider ml-1">
                                    Description
                                </label>
                                <textarea
                                    required
                                    className="textarea textarea-bordered w-full rounded-xl h-28 font-medium bg-base-200 border-none focus:ring-2 focus:ring-primary/10 transition-all p-4 leading-relaxed text-sm"
                                    placeholder="Explain the specific gap in your intel..."
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
                                className="btn btn-primary w-full rounded-xl h-12 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                            >
                                {submitting ? (
                                    <FiLoader
                                        className="animate-spin"
                                        size={24}
                                    />
                                ) : (
                                    <>
                                        COMMENCE TRANSMISSION
                                        <FiSend size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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

const FiX = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default Support;