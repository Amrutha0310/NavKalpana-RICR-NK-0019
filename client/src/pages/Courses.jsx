
import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import api from '../config/Api'; 
=======
import api from '../config/Api';
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
import { Link } from 'react-router-dom';
import {
    FiPlay,
    FiCheckCircle,
<<<<<<< HEAD
   
=======
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
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

<<<<<<< HEAD
    const role = localStorage.getItem('role') || 'student';
=======
    const user = JSON.parse(sessionStorage.getItem("LearningUser"));
    const role = user?.role || 'student';
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47

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
            <div className="flex items-center justify-center h-full">
                <FiLoader className="text-primary-500 animate-spin" size={48} />
            </div>
        );

    return (
<<<<<<< HEAD
        <div className="space-y-8">
=======
        <div className="space-y-8 p-6">
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        {role === 'teacher' ? 'Course Management' : 'My Learning'}
                    </h2>
                </div>

<<<<<<< HEAD
                {role === 'teacher' && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary-600 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2"
                    >
                        <FiPlus size={20} /> Create Course
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((item) => {
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
                })}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                    <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <FiBookOpen /> Publish New Course
                        </h3>
=======
                <div className="flex gap-4">
                    <button
                        onClick={() => setView(view === 'my' ? 'explore' : 'my')}
                        className="btn btn-outline btn-sm"
                    >
                        {view === 'my' ? 'Explore Courses' : 'My Courses'}
                    </button>

                    {role === 'teacher' && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-primary-600 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2"
                        >
                            <FiPlus size={20} /> Create Course
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.length === 0 ? (
                    <div className="col-span-full py-20 text-center glass rounded-3xl border-2 border-dashed border-slate-800">
                        <FiBookOpen className="mx-auto mb-4 text-slate-700 opacity-20" size={64} />
                        <p className="text-xl font-medium uppercase tracking-widest text-base-content/30 italic">No courses available</p>
                        <p className="text-sm text-slate-500 mt-2">Check back later for new content!</p>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-2xl border border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FiBookOpen /> Publish New Course
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47

                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <input
                                required
<<<<<<< HEAD
                                className="w-full bg-slate-800 p-3 rounded-xl text-white"
=======
                                className="w-full bg-slate-800 p-3 rounded-xl text-white outline-hidden border border-slate-700 focus:border-primary-500"
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
                                placeholder="Course Title"
                                value={newCourse.name}
                                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                            />

                            <textarea
                                required
<<<<<<< HEAD
                                className="w-full bg-slate-800 p-3 rounded-xl text-white"
=======
                                className="w-full bg-slate-800 p-3 rounded-xl text-white h-32 outline-hidden border border-slate-700 focus:border-primary-500"
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
                                placeholder="Description"
                                value={newCourse.description}
                                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                            />

                            <button
                                type="submit"
                                disabled={submitting}
<<<<<<< HEAD
                                className="w-full bg-primary-600 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2"
=======
                                className="w-full bg-primary-600 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-500 transition-colors"
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
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
<<<<<<< HEAD
    <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>

            {!isTeacher && !isExplore && (
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-primary-400">{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full">
                        <div
                            className="h-full bg-primary-500"
=======
    <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex flex-col hover:border-slate-700 transition-colors shadow-xl">
        <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description}</p>

            {!isTeacher && !isExplore && (
                <div className="mb-6">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400 font-bold uppercase">Learning Progress</span>
                        <span className="text-primary-400 font-bold">{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-500 transition-all duration-500"
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-3 mt-auto">
                {isTeacher ? (
                    <>
<<<<<<< HEAD
                        <button className="flex-1 bg-slate-800 py-3 rounded-xl flex items-center justify-center gap-2 text-white">
                            <FiEdit2 size={18} /> Manage
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center text-red-400">
=======
                        <button className="flex-1 bg-slate-800 py-3 rounded-xl flex items-center justify-center gap-2 text-white hover:bg-slate-700">
                            <FiEdit2 size={18} /> Manage
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
                            <FiTrash2 size={20} />
                        </button>
                    </>
                ) : isExplore ? (
                    <button
                        onClick={onEnroll}
<<<<<<< HEAD
                        className="flex-1 bg-primary-600 py-3 rounded-xl flex items-center justify-center gap-2 text-white"
                    >
                        <FiPlus size={18} /> Enroll
=======
                        className="flex-1 bg-primary-600 py-3 rounded-xl flex items-center justify-center gap-2 text-white hover:bg-primary-500"
                    >
                        <FiPlus size={18} /> Enroll Now
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
                    </button>
                ) : (
                    <>
                        <Link
<<<<<<< HEAD
                            to={`/course/${course._id}`}
                            className="flex-1 bg-slate-800 py-3 rounded-xl flex items-center justify-center gap-2 text-white"
=======
                            to={`/CourseDetail?id=${course._id}`}
                            className="flex-1 bg-slate-800 py-3 rounded-xl flex items-center justify-center gap-2 text-white hover:bg-slate-700"
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
                        >
                            <FiPlay size={18} /> Resume
                        </Link>
                        <button
                            onClick={onMarkComplete}
<<<<<<< HEAD
                            className="w-12 h-12 flex items-center justify-center text-emerald-400"
=======
                            className="w-12 h-12 flex items-center justify-center text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-colors"
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
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