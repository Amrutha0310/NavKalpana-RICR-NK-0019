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
    FiLayers,
    FiUpload,
    FiVideo,
    FiImage,
    FiX,
    FiSave,
    FiChevronDown,
    FiChevronUp
} from 'react-icons/fi';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [view, setView] = useState('my');
    const [editingCourse, setEditingCourse] = useState(null);

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

    const handleFileUpload = async (file, type) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post('/courses/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Media uploaded to local hub');
            return res.data.url;
        } catch (err) {
            toast.error('Upload failed');
            return null;
        } finally {
            setUploading(false);
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

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/courses/${editingCourse._id}`, editingCourse);
            toast.success('Course protocol updated!');
            setShowEditModal(false);
            fetchCourses();
        } catch (err) {
            toast.error('Modification failed');
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
                    courses.filter(item => (view === 'explore' ? item : item?.course)).map((item, index) => {
                        const courseObj = view === 'explore' ? item : item?.course;
                        const progressVal = view === 'explore' ? 0 : (item?.progress || 0);

                        if (!courseObj?.name) {
                            return null;
                        }

                        return (
                            <CourseCard
                                key={item?._id || courseObj?._id || index}
                                course={courseObj}
                                progress={progressVal}
                                isTeacher={role === 'teacher'}
                                onMarkComplete={() => markAsComplete(courseObj?._id)}
                                onEnroll={() => handleEnroll(courseObj?._id)}
                                onEdit={() => {
                                    setEditingCourse({ ...courseObj });
                                    setShowEditModal(true);
                                }}
                                isExplore={view === 'explore'}
                            />
                        );
                    })
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md overflow-hidden">
                    <div className="bg-base-100 p-10 rounded-[2.5rem] w-full max-w-2xl border border-base-300 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-auto flex flex-col">
                        <div className="flex justify-between items-center mb-10 sticky top-0 bg-base-100 z-10 py-2">
                            <h3 className="text-2xl font-black text-base-content flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                    <FiBookOpen size={24} />
                                </div>
                                Design New Course
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost btn-sm rounded-full">✕</button>
                        </div>

                        <form onSubmit={handleCreateCourse} className="space-y-8 flex-1">
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

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">THUMBNAIL (URL or Local Path)</label>
                                <div className="flex gap-4">
                                    <input
                                        className="input input-bordered flex-1 rounded-2xl h-14 font-bold bg-base-200 border-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Paste image link or upload below..."
                                        value={newCourse.thumbnail}
                                        onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                                    />
                                    <label className="btn btn-ghost bg-base-200 h-14 w-14 rounded-2xl flex items-center justify-center cursor-pointer">
                                        <FiImage size={24} />
                                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                            const url = await handleFileUpload(e.target.files[0], 'image');
                                            if (url) setNewCourse({ ...newCourse, thumbnail: url });
                                        }} />
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || uploading}
                                className="btn btn-primary w-full rounded-[1.5rem] h-16 text-lg font-black shadow-xl shadow-primary/20 group mt-4"
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

            {/* Edit Modal */}
            {showEditModal && editingCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md overflow-hidden">
                    <div className="bg-base-100 p-10 rounded-[2.5rem] w-full max-w-4xl border border-base-300 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-auto flex flex-col">
                        <div className="flex justify-between items-center mb-10 sticky top-0 bg-base-100 z-10 py-2">
                            <h3 className="text-2xl font-black text-base-content flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600">
                                    <FiEdit2 size={24} />
                                </div>
                                Modifying Curriculum
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpdateCourse}
                                    className="btn btn-primary rounded-2xl h-12 px-6 font-black gap-2 shadow-lg shadow-primary/20"
                                    disabled={submitting || uploading}
                                >
                                    {submitting ? <FiLoader className="animate-spin" /> : <><FiSave /> Commit Changes</>}
                                </button>
                                <button onClick={() => setShowEditModal(false)} className="btn btn-ghost btn-sm rounded-full">✕</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left: Metadata */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">ASSESSMENT TITLE</label>
                                    <input
                                        required
                                        className="input input-bordered w-full rounded-2xl h-14 font-bold bg-base-200 border-none"
                                        value={editingCourse.name}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">CORE DESCRIPTION</label>
                                    <textarea
                                        required
                                        className="textarea textarea-bordered w-full h-32 rounded-2xl font-bold bg-base-200 border-none"
                                        value={editingCourse.description}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">CURRICULUM THUMBNAIL</label>
                                    <div className="relative group">
                                        <div className="w-full h-40 bg-base-200 rounded-[2rem] border-2 border-dashed border-base-300 overflow-hidden flex items-center justify-center relative">
                                            {editingCourse.thumbnail ? (
                                                <img src={editingCourse.thumbnail.startsWith('/') ? `${api.defaults.baseURL.replace('/api', '')}${editingCourse.thumbnail}` : editingCourse.thumbnail} className="w-full h-full object-cover" />
                                            ) : (
                                                <FiImage size={40} className="text-base-content/10" />
                                            )}
                                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <FiUpload className="text-white" size={32} />
                                                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                                    const url = await handleFileUpload(e.target.files[0], 'image');
                                                    if (url) setEditingCourse({ ...editingCourse, thumbnail: url });
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Modules & Content */}
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] ml-2">MODULE HIERARCHY & MEDIA</label>
                                <div className="space-y-4">
                                    {editingCourse.modules.map((module, modIndex) => (
                                        <div key={modIndex} className="bg-base-200 rounded-3xl p-6 border border-base-300 space-y-4">
                                            <div className="flex gap-2">
                                                <input
                                                    className="bg-transparent border-none text-lg font-black w-full"
                                                    value={module.name}
                                                    onChange={(e) => {
                                                        const m = [...editingCourse.modules];
                                                        m[modIndex].name = e.target.value;
                                                        setEditingCourse({ ...editingCourse, modules: m });
                                                    }}
                                                />
                                                <button onClick={() => {
                                                    const m = editingCourse.modules.filter((_, i) => i !== modIndex);
                                                    setEditingCourse({ ...editingCourse, modules: m });
                                                }} className="text-error"><FiX /></button>
                                            </div>

                                            <div className="space-y-3">
                                                {module.lessons.map((lesson, lessonIndex) => (
                                                    <div key={lessonIndex} className="bg-base-100 p-4 rounded-2xl border border-base-300 space-y-3">
                                                        <div className="flex gap-2 items-center">
                                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded">L{lessonIndex + 1}</span>
                                                            <input
                                                                className="bg-transparent border-none font-bold text-sm w-full"
                                                                value={lesson.title}
                                                                onChange={(e) => {
                                                                    const m = [...editingCourse.modules];
                                                                    m[modIndex].lessons[lessonIndex].title = e.target.value;
                                                                    setEditingCourse({ ...editingCourse, modules: m });
                                                                }}
                                                            />
                                                            <button className="text-error" onClick={() => {
                                                                const m = [...editingCourse.modules];
                                                                m[modIndex].lessons = m[modIndex].lessons.filter((_, i) => i !== lessonIndex);
                                                                setEditingCourse({ ...editingCourse, modules: m });
                                                            }}><FiX size={14} /></button>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 bg-base-200 px-4 py-2 rounded-xl flex items-center justify-between text-xs font-black">
                                                                <span className="opacity-40 truncate">{lesson.videoUrl || 'No Content Attached'}</span>
                                                                {lesson.videoUrl && <FiVideo className="text-primary shrink-0 ml-2" />}
                                                            </div>
                                                            <label className="btn btn-primary btn-sm rounded-xl h-10 w-10 p-0 flex items-center justify-center cursor-pointer">
                                                                <FiVideo size={16} />
                                                                <input type="file" className="hidden" accept="video/*" onChange={async (e) => {
                                                                    const url = await handleFileUpload(e.target.files[0], 'video');
                                                                    if (url) {
                                                                        const m = [...editingCourse.modules];
                                                                        m[modIndex].lessons[lessonIndex].videoUrl = url;
                                                                        setEditingCourse({ ...editingCourse, modules: m });
                                                                    }
                                                                }} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const m = [...editingCourse.modules];
                                                        m[modIndex].lessons.push({ id: `l${Date.now()}`, title: 'New Lesson', videoUrl: '', difficulty: 'Easy' });
                                                        setEditingCourse({ ...editingCourse, modules: m });
                                                    }}
                                                    className="w-full h-10 rounded-xl border-2 border-dashed border-base-300 flex items-center justify-center gap-2 text-xs font-black opacity-30 hover:opacity-100 transition-opacity"
                                                >
                                                    <FiPlus /> Add Transmission
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingCourse({
                                                ...editingCourse,
                                                modules: [...editingCourse.modules, { name: 'Core Module', lessons: [] }]
                                            });
                                        }}
                                        className="w-full h-14 rounded-3xl border-2 border-dashed border-primary/20 flex items-center justify-center gap-2 text-sm font-black text-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
                                    >
                                        <FiPlus /> New Cluster
                                    </button>
                                </div>
                            </div>
                        </div>
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
    onEdit,
    isExplore
}) => (
    <div className="bg-base-100 rounded-[2rem] overflow-hidden border border-base-300 flex flex-col hover:border-primary transition-all duration-300 shadow-sm hover:shadow-2xl group relative">
        <div className="h-48 overflow-hidden relative">
            <img
                src={course?.thumbnail ? (course.thumbnail.startsWith('/') ? `http://localhost:5000${course.thumbnail}` : course.thumbnail) : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-white border border-white/20">
                    {course?.name?.charAt(0) || '?'}
                </div>
            </div>
            {isExplore && (
                <div className="absolute top-4 right-4 animate-in slide-in-from-right-4">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                        Available
                    </span>
                </div>
            )}
        </div>

        <div className="p-8 flex-1 flex flex-col">
            <h3 className="text-xl font-black text-base-content mb-3 group-hover:text-primary transition-colors leading-tight">
                {course?.name || 'Untitled Course'}
            </h3>
            <p className="text-base-content/60 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                {course?.description || 'No description available.'}
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
                        <button
                            onClick={onEdit}
                            className="flex-1 btn btn-ghost bg-base-200 hover:bg-base-300 rounded-2xl flex items-center justify-center gap-2 text-base-content border-none font-black h-12"
                        >
                            <FiEdit2 size={18} /> Modify
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