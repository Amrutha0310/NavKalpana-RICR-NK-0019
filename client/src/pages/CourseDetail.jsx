import React, { useEffect, useState } from 'react';
import api from '../config/Api';
import { useParams } from 'react-router-dom';
import {
    FiChevronDown,
    FiChevronUp,
    FiPlay,
    FiCheckCircle,
    FiFileText,
    FiCpu,
    FiCode,
    FiLock,
    FiUnlock,
    FiAlertCircle,
    FiLoader,
    FiVideo
} from 'react-icons/fi';

const CourseDetail = () => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("id");
    const [course, setCourse] = useState(null);
    const [userCourseData, setUserCourseData] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [courseRes, userRes] = await Promise.all([
                api.get(`/courses/${id}`),
                api.get('/user/dashboard')
            ]);

            const courseData = courseRes.data;
            setCourse(courseData);

            const uc = userRes.data.enrolledCourses.find(c => c.id === id);
            setUserCourseData(uc);

            if (courseData.modules.length > 0) {
                const firstModId = courseData.modules[0]._id;
                setExpandedModules(prev => ({ ...prev, [firstModId]: true }));

                if (!activeLesson && courseData.modules[0].lessons.length > 0) {
                    setActiveLesson(courseData.modules[0].lessons[0]);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const toggleModule = (modId) => {
        setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
    };

    const handleLessonComplete = async (e, lessonId) => {
        e.stopPropagation();
        try {
            await api.post('/courses/lesson-complete', {
                courseId: id,
                lessonId: lessonId
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading)
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <FiLoader className="animate-spin text-primary-500" size={48} />
            </div>
        );

    if (!course)
        return (
            <div className="text-center py-20 text-slate-500">
                Course not found
            </div>
        );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">

            <div className="relative h-72 rounded-3xl overflow-hidden glass border border-slate-800 p-10 flex items-end">
                <div className="absolute inset-0 z-0">
                    <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200'}
                        alt=""
                        className="w-full h-full object-cover opacity-20 blur-sm"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 text-white">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-primary-500/10 text-primary-400 text-[10px] font-bold px-3 py-1 rounded-full border border-primary-500/20 uppercase tracking-widest">
                                {course.totalLessons} Lectures
                            </span>
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight">
                            {course.name}
                        </h1>

                        <div className="flex items-center gap-3 text-slate-400">
                            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                                <FiUnlock size={12} className="text-primary-500" />
                            </div>
                            <p className="text-sm font-medium">
                                Instructor: <span className="text-slate-200">Academy Faculty</span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 min-w-60 shadow-2xl">
                        <div className="flex items-center justify-between mb-3 text-white">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                Overall Progress
                            </span>
                            <span className="text-primary-400 font-bold text-lg">
                                {userCourseData?.progress || 0}%
                            </span>
                        </div>

                        <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden mb-2 p-0.5">
                            <div
                                className="h-full bg-linear-to-r from-primary-600 to-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${userCourseData?.progress || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass aspect-video rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl">
                        {activeLesson ? (
                            activeLesson.videoUrl ? (
                                getYouTubeId(activeLesson.videoUrl) ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.videoUrl)}?rel=0`}
                                        title={activeLesson.title}
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        controls
                                        className="w-full h-full bg-black"
                                        src={activeLesson.videoUrl.startsWith('/') ? `http://localhost:5000${activeLesson.videoUrl}` : activeLesson.videoUrl}
                                    />
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <FiAlertCircle size={64} className="text-slate-600" />
                                    <p className="text-slate-500">
                                        No Video Content
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                <FiPlay size={48} />
                                <p className="text-slate-500">
                                    Select a lesson
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Curriculum */}
                <div className="space-y-4">
                    {course.modules.map((module) => (
                        <div key={module._id} className="glass rounded-2xl border border-slate-800 overflow-hidden">
                            <button
                                onClick={() => toggleModule(module._id)}
                                className="w-full p-4 flex items-center justify-between"
                            >
                                <h4 className="text-slate-200 font-bold text-sm">
                                    {module.name}
                                </h4>

                                {expandedModules[module._id]
                                    ? <FiChevronUp size={16} />
                                    : <FiChevronDown size={16} />}
                            </button>

                            {expandedModules[module._id] && (
                                <div className="px-3 pb-3 space-y-2">
                                    {module.lessons.map((lesson) => {
                                        const isComplete =
                                            userCourseData?.completedLessons.includes(lesson.id);

                                        return (
                                            <div
                                                key={lesson.id}
                                                onClick={() => setActiveLesson(lesson)}
                                                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-800 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {(lesson.videoUrl?.endsWith('.mp4') || lesson.videoUrl?.includes('/uploads/')) ? <FiVideo className="text-primary-500" /> : <FiPlay size={14} />}
                                                    <p className="text-xs text-slate-400 font-semibold truncate max-w-[150px]">
                                                        {lesson.title}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={(e) => handleLessonComplete(e, lesson.id)}
                                                    className="text-slate-500 hover:text-primary-500"
                                                >
                                                    {isComplete ? <FiCheckCircle size={16} className="text-emerald-500" /> : <FiCheckCircle size={16} />}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};



export default CourseDetail;