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
        <div className="p-8 space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-base-content tracking-tight uppercase">
                        {role === 'teacher'
                            ? 'Doubt Resolution hub'
                            : 'Intelligence support'}
                    </h2>
                    <p className="text-base-content/50 font-medium">
                        {role === 'teacher'
                            ? 'Direct communication channel with your students.'
                            : "Connect with faculty for tactical guidance."}
                    </p>
                </div>

                {role === 'student' && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20 h-16 px-10 font-black text-sm uppercase tracking-widest group active:scale-95 transition-all"
                    >
                        <FiPlus size={24} className="group-hover:rotate-90 transition-transform" />
                        Initiate Query
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <FiMessageSquare size={20} />
                        </div>
                        <h3 className="text-xl font-black text-base-content uppercase tracking-widest">
                            {role === 'teacher' ? 'Active Transmissions' : 'Your Transmission History'}
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {doubts.map((doubt) => (
                            <div
                                key={doubt._id}
                                className="bg-base-100 p-8 md:p-10 rounded-[2.5rem] border border-base-300 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-2 h-full bg-primary/5 group-hover:bg-primary transition-colors"></div>

                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                    <div className="flex items-start gap-5">
                                        <div className="p-5 rounded-2xl bg-base-200 text-primary shadow-inner shrink-0">
                                            <FiMessageSquare size={28} />
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-black text-base-content text-2xl tracking-tight">
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
                                    <blockquote className="text-base-content/70 text-lg mb-8 leading-relaxed bg-base-200/50 p-8 rounded-[2rem] border border-base-300 font-medium italic">
                                        "{doubt.description}"
                                    </blockquote>

                                    {doubt.teacherReply ? (
                                        <div className="mt-8 space-y-4 animate-in slide-in-from-top-4">
                                            <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest ml-4">
                                                <FiCornerDownRight /> FACULTY RESPONSE
                                            </div>
                                            <div className="bg-emerald-500/5 border-2 border-emerald-500/20 p-8 rounded-[2rem] relative">
                                                <p className="text-base-content font-bold leading-relaxed">
                                                    {doubt.teacherReply}
                                                </p>
                                                <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-emerald-600/50">
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
                                                )
                                            )}
                                                )
                                    )}
                                            </div>
                            </div>
                        ))}

                                {doubts.length === 0 && (
                                    <div className="text-center py-32 bg-base-100 rounded-[3rem] border-4 border-dashed border-base-200">
                                        <FiMessageSquare
                                            className="mx-auto mb-6 text-base-content/5"
                                            size={100}
                                        />
                                        <h3 className="text-2xl font-black text-base-content/20 uppercase tracking-widest">
                                            Clean Frequency
                                        </h3>
                                        <p className="text-base-content/20 font-bold mt-2 italic">
                                            No active transmissions detected in this sector.
                                        </p>
                                    </div>
                                )}
                            </div>
                </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-base-100 p-8 rounded-[2.5rem] border border-base-300 shadow-xl space-y-6">
                            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <FiInfo size={24} />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-tight">Support Directives</h4>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                                    <p className="text-sm font-medium text-base-content/60 leading-snug">All queries are tracked and monitored for quality assurance.</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                                    <p className="text-sm font-medium text-base-content/60 leading-snug">Response time varies based on faculty bandwidth.</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                                    <p className="text-sm font-medium text-base-content/60 leading-snug">Priority is given to technical blockers and conceptual gaps.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary p-1 rounded-[2.5rem] shadow-2xl shadow-primary/30">
                            <div className="bg-base-100 p-8 rounded-[2.3rem] space-y-6">
                                <div className="h-40 bg-primary/5 rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                                    <FiLifeBuoy size={80} className="text-primary/10 absolute -bottom-4 -right-4 rotate-12" />
                                    <FiLifeBuoy size={48} className="text-primary animate-spin-slow" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-black tracking-tight">Global Support</h4>
                                    <p className="text-base-content/50 text-xs font-medium leading-relaxed">Need instantaneous assistance? Jump into our global developer hub for 24/7 technical monitoring.</p>
                                </div>
                                <button className="btn btn-primary w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs">Access Global Hub</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Request Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="max-w-2xl w-full bg-base-100 border border-base-300 rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-3xl font-black text-base-content flex items-center gap-4 uppercase tracking-tighter">
                                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group">
                                        <FiPlus className="group-hover:rotate-90 transition-transform" />
                                    </div>
                                    Transmit Intel Request
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
                                className="space-y-10"
                            >
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.3em] ml-2">
                                        Target Subject
                                    </label>
                                    <div className="relative group">
                                        <input
                                            required
                                            className="input input-bordered w-full rounded-2xl h-16 font-bold bg-base-200 border-none focus:ring-4 focus:ring-primary/10 transition-all pl-12"
                                            value={formData.topic}
                                            placeholder="Briefly state your technical query..."
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    topic: e.target.value
                                                })
                                            }
                                        />
                                        <FiInfo className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.3em] ml-2">
                                        Mission Parameters (Description)
                                    </label>
                                    <textarea
                                        required
                                        className="textarea textarea-bordered w-full rounded-[2rem] h-40 font-bold bg-base-200 border-none focus:ring-4 focus:ring-primary/10 transition-all p-8 leading-relaxed"
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
                                    className="btn btn-primary w-full rounded-2xl h-16 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 group active:scale-[0.98] transition-all"
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

            const FiX = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

            export default Support;