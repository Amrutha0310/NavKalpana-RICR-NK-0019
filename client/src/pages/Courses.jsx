import React, { useEffect, useState } from 'react';
import api from '../config/Api';
import { Link } from 'react-router-dom';
import {
    FiPlay,
    FiCheckCircle,
    FiLoader,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiBookOpen
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

    const user = JSON.parse(sessionStorage.getItem("LearningUser"));
    const role = user?.role || 'student';

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const url = view === 'explore' ? '/courses?type=all' : '/courses';
            const res = await api.get(url);
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            await api.post(`/courses/${courseId}/enroll`);
            setView('my');
        } catch (err) {
            alert(err.response?.data?.message || 'Enrollment failed');
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/courses', newCourse);
            setShowCreateModal(false);
            fetchCourses();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const markAsComplete = async (courseId) => {
        try {
            await api.post('/courses/course-complete', { courseId });
            fetchCourses();
        } catch (err) {
            console.error(err);
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
        <div className="space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-base-content">
                        {role === 'teacher' ? 'Course Management' : 'My Learning'}
                    </h2>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setView(view === 'my' ? 'explore' : 'my')}
                        className="btn btn-outline btn-sm rounded-xl"
                    >
                        {view === 'my' ? 'Explore Courses' : 'My Courses'}
                    </button>

                    {role === 'teacher' && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn btn-primary rounded-xl flex items-center gap-2"
                        >
                            <FiPlus size={20} /> Create Course
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-base-100 rounded-3xl border-2 border-dashed border-base-300 shadow-sm">
                        <FiBookOpen className="mx-auto mb-4 text-base-content/20" size={64} />
                        <p className="text-xl font-medium uppercase tracking-widest text-base-content/30 italic">No courses available</p>
                        <p className="text-sm text-base-content/50 mt-2">Check back later for new content!</p>
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
                                attendance={item.attendance || 0}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-base-100 p-8 rounded-3xl w-full max-w-2xl border border-base-300 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-base-content flex items-center gap-2">
                                <FiBookOpen className="text-primary" /> Publish New Course
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost btn-sm rounded-full">✕</button>
                        </div>

                        <form onSubmit={handleCreateCourse} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-base-content/60 ml-1">COURSE TITLE</label>
                                <input
                                    required
                                    className="input input-bordered w-full rounded-2xl focus:input-primary"
                                    placeholder="e.g. Advanced Web Development"
                                    value={newCourse.name}
                                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-base-content/60 ml-1">DESCRIPTION</label>
                                <textarea
                                    required
                                    className="textarea textarea-bordered w-full h-32 rounded-2xl focus:textarea-primary"
                                    placeholder="Enter course details and learning objectives..."
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-primary w-full rounded-2xl h-14 text-lg font-bold shadow-lg shadow-primary/20"
                            >
                                {submitting ? <FiLoader className="animate-spin" /> : 'Launch Course'}
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
    attendance,
    isTeacher,
    onMarkComplete,
    onEnroll,
    isExplore
}) => (
    <div className="bg-base-100 rounded-3xl overflow-hidden border border-base-300 flex flex-col hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl group">
        <div className="p-7 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">{course.name}</h3>
            <p className="text-base-content/60 text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>

            {!isTeacher && !isExplore && (
                <div className="mb-6 space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-base-content/40 italic">Learning Progress</span>
                        <span className="text-primary">{progress}%</span>
                    </div>
                    <div className="h-2.5 bg-base-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-primary transition-all duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-3 mt-auto pt-4">
                {isTeacher ? (
                    <>
                        <button className="flex-1 btn btn-ghost bg-base-200 hover:bg-base-300 rounded-2xl flex items-center justify-center gap-2 text-base-content border-none">
                            <FiEdit2 size={18} /> Manage
                        </button>
                        <button className="btn btn-ghost w-12 h-12 flex items-center justify-center text-error hover:bg-error/10 rounded-2xl border-none transition-colors">
                            <FiTrash2 size={20} />
                        </button>
                    </>
                ) : isExplore ? (
                    <button
                        onClick={onEnroll}
                        className="flex-1 btn btn-primary rounded-2xl flex items-center justify-center gap-2 text-white shadow-md shadow-primary/20 h-12"
                    >
                        <FiPlus size={18} /> Enroll Now
                    </button>
                ) : (
                    <>
                        <Link
                            to={`/CourseDetail?id=${course._id}`}
                            className="flex-1 btn btn-ghost bg-base-200 hover:bg-base-300 rounded-2xl flex items-center justify-center gap-2 text-base-content border-none h-12"
                        >
                            <FiPlay size={18} className="text-primary" /> Resume
                        </Link>
                        <button
                            onClick={onMarkComplete}
                            className={`btn btn-ghost w-12 h-12 flex items-center justify-center rounded-2xl border-none transition-colors ${progress === 100 ? 'text-emerald-500 bg-emerald-500/10' : 'text-base-content/30 hover:bg-emerald-500/10 hover:text-emerald-500'
                                }`}
                        >
                            <FiCheckCircle size={22} />
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
);

export default Courses;