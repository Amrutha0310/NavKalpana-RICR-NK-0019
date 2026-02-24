import React, { useEffect, useState } from 'react';
import api from '../config/Api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    FiPlay,
    FiCheckCircle,
    FiLoader,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiBookOpen,
    FiSearch,
    FiLayers
} from 'react-icons/fi';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [view, setView] = useState('my');

    const [newCourse, setNewCourse] = useState({
        name: '',
        description: '',
        thumbnail: '',
        modules: [
            { name: 'Introduction', lessons: [{ id: 'l1', title: 'Getting Started', videoUrl: '', difficulty: 'Easy' }] }
        ]
    });

    const { user, role } = useAuth();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const url = view === 'explore' ? '/courses?type=all' : '/courses';
            const res = await api.get(url);
            setCourses(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            const res = await api.post(`/courses/${courseId}/enroll`);
            toast.success(res.data.message || 'Successfully enrolled!');
            setView('my');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Enrollment failed');
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/courses', newCourse);
            toast.success('Course launched successfully!');
            setShowCreateModal(false);
            setNewCourse({
                name: '',
                description: '',
                thumbnail: '',
                modules: [
                    { name: 'Introduction', lessons: [{ id: 'l1', title: 'Getting Started', videoUrl: '', difficulty: 'Easy' }] }
                ]
            });
            fetchCourses();
        } catch (err) {
            console.error(err);
            toast.error('Failed to launch course');
        } finally {
            setSubmitting(false);
        }
    };

    const markAsComplete = async (courseId) => {
        try {
            await api.post('/courses/course-complete', { courseId });
            toast.success('Course marked as complete!');
            fetchCourses();
        } catch (err) {
            console.error(err);
            toast.error('Failed to mark course as complete');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [view]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FiLoader className="text-primary animate-spin" size={48} />
            </div>
        );

    return (
        <div className="space-y-8 p-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-base-content tracking-tight">
                        {role === 'teacher' ? 'Course Management' : 'Learning Hub'}
                    </h2>
                    <p className="text-base-content/60 mt-1 font-medium">
                        {role === 'teacher'
                            ? 'Organize and publish your curriculum.'
                            : 'Explore new topics or continue your journey.'}
                    </p>
                </div>

                <div className="flex gap-3 bg-base-100 p-2 rounded-2xl border border-base-300 shadow-sm w-fit">
                    <button
                        onClick={() => setView('my')}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${view === 'my'
                                ? 'bg-primary text-primary-content shadow-lg shadow-primary/20'
                                : 'text-base-content/60 hover:bg-base-200'
                            }`}
                    >
                        <FiLayers /> {role === 'teacher' ? 'My Created' : 'My Courses'}
                    </button>
                    <button
                        onClick={() => setView('explore')}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${view === 'explore'
                                ? 'bg-primary text-primary-content shadow-lg shadow-primary/20'
                                : 'text-base-content/60 hover:bg-base-200'
                            }`}
                    >
                        <FiSearch /> Explore All
                    </button>

                    {role === 'teacher' && (
                        <div className="w-[1px] bg-base-300 mx-1" />
                    )}

                    {role === 'teacher' && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                        >
                            <FiPlus size={20} /> Create Course
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-base-100 rounded-[2.5rem] border-2 border-dashed border-base-300">
                        <FiBookOpen className="mx-auto mb-6 text-base-content/10" size={80} />
                        <p className="text-2xl font-black text-base-content/30 italic">
                            {view === 'explore'
                                ? 'No courses available for enrollment.'
                                : 'You haven\'t started any courses yet.'}
                        </p>
                        {view === 'my' && role !== 'teacher' && (
                            <button
                                onClick={() => setView('explore')}
                                className="mt-6 btn btn-primary px-8 rounded-2xl h-14 font-black"
                            >
                                Browse Catalog
                            </button>
                        )}
                    </div>
                ) : (
                    courses.map((item) => {
                        const courseObj = view === 'explore' ? item : item.course;
                        const progressVal = view === 'explore' ? 0 : item.progress;

                        return (
                            <CourseCard
                                key={courseObj._id}
                                course={courseObj}
                                progress={progressVal}
                                isTeacher={role === 'teacher'}
                                onMarkComplete={() => markAsComplete(courseObj._id)}
                                onEnroll={() => handleEnroll(courseObj._id)}
                                isExplore={view === 'explore'}
                            />
                        );
                    })
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
                    <div className="bg-base-100 p-10 rounded-[2.5rem] w-full max-w-2xl border border-base-300 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-base-content flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                    <FiBookOpen size={24} />
                                </div>
                                Design New Course
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost btn-sm rounded-full">✕</button>
                        </div>

                        <form onSubmit={handleCreateCourse} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">COURSE TITLE</label>
                                <input
                                    required
                                    className="input input-bordered w-full rounded-2xl h-14 font-bold bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. Master React & Redux"
                                    value={newCourse.name}
                                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">DESCRIPTION</label>
                                <textarea
                                    required
                                    className="textarea textarea-bordered w-full h-40 rounded-2xl font-bold bg-base-200 border-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                                    placeholder="What will students learn in this course?"
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-primary w-full rounded-[1.5rem] h-16 text-lg font-black shadow-xl shadow-primary/20 group"
                            >
                                {submitting ? <FiLoader className="animate-spin" /> : (
                                    <>
                                        Launch Course Now
                                        <FiPlus className="group-hover:rotate-90 transition-transform" />
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

const CourseCard = ({
    course,
    progress,
    isTeacher,
    onMarkComplete,
    onEnroll,
    isExplore
}) => (
    <div className="bg-base-100 rounded-[2rem] overflow-hidden border border-base-300 flex flex-col hover:border-primary transition-all duration-300 shadow-sm hover:shadow-2xl group relative">
        <div className="p-8 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black">
                    {course.name.charAt(0)}
                </div>
                {isExplore && (
                    <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
                        Available
                    </span>
                )}
            </div>

            <h3 className="text-xl font-black text-base-content mb-3 group-hover:text-primary transition-colors leading-tight">
                {course.name}
            </h3>
            <p className="text-base-content/60 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                {course.description}
            </p>

            {!isTeacher && !isExplore && (
                <div className="mb-8 space-y-4 bg-base-200/50 p-5 rounded-2xl border border-base-300">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-base-content/40 italic">Mastery Progress</span>
                        <span className="text-primary">{progress}%</span>
                    </div>
                    <div className="h-3 bg-base-300 rounded-full overflow-hidden shadow-inner p-0.5">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${progress === 100 ? 'bg-emerald-500' : 'bg-primary'
                                }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-3 mt-auto pt-6 border-t border-base-300">
                {isTeacher ? (
                    <>
                        <button className="flex-1 btn btn-ghost bg-base-200 hover:bg-base-300 rounded-2xl flex items-center justify-center gap-2 text-base-content border-none font-black h-12">
                            <FiEdit2 size={18} /> Edit
                        </button>
                        <button className="btn btn-ghost w-12 h-12 flex items-center justify-center text-error hover:bg-error/10 rounded-2xl border-none transition-colors">
                            <FiTrash2 size={20} />
                        </button>
                    </>
                ) : isExplore ? (
                    <button
                        onClick={onEnroll}
                        className="flex-1 btn btn-primary rounded-2xl flex items-center justify-center gap-2 h-14 font-black shadow-lg shadow-primary/20 group"
                    >
                        Enroll Now
                        <FiPlus size={20} className="group-hover:scale-125 transition-transform" />
                    </button>
                ) : (
                    <>
                        <Link
                            to={`/CourseDetail?id=${course._id}`}
                            className="flex-1 btn btn-ghost bg-base-200 hover:bg-base-300 rounded-2xl flex items-center justify-center gap-2 text-base-content border-none h-14 font-black transition-all"
                        >
                            <FiPlay size={18} className="text-primary fill-primary" /> Resume
                        </Link>
                        <button
                            onClick={onMarkComplete}
                            className={`btn btn-ghost w-14 h-14 flex items-center justify-center rounded-2xl border-none transition-all ${progress === 100
                                    ? 'text-emerald-500 bg-emerald-500/10 shadow-inner'
                                    : 'text-base-content/20 bg-base-200 hover:text-emerald-500'
                                }`}
                        >
                            <FiCheckCircle size={24} />
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
);

export default Courses;