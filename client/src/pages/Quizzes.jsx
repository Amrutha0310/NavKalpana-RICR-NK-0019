import React, { useEffect, useState } from 'react';
import api from '../config/Api';
import { Link } from 'react-router-dom';
import {
    FiCpu,
    FiClock,
    FiHelpCircle,
    FiArrowRight,
    FiPlus,
    FiLoader,
    FiTrash2,
    FiEdit3,
    FiCheckCircle,
    FiCircle
} from 'react-icons/fi';

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [newQuiz, setNewQuiz] = useState({
        courseId: '',
        title: '',
        duration: 15,
        questions: [
            { question: '', options: ['', ''], correctAnswers: [0], type: 'single', explanation: '' }
        ]
    });

    const user = JSON.parse(sessionStorage.getItem("LearningUser"));
    const role = user?.role || 'student';

    const fetchData = async () => {
        try {
            const [quizRes, courseRes] = await Promise.all([
                api.get('/quizzes'),
                role === 'teacher' ? api.get('/courses') : Promise.resolve({ data: [] })
            ]);

            setQuizzes(quizRes.data);

            if (role === 'teacher') {
                setCourses(courseRes.data);
                if (courseRes.data.length > 0) {
                    setNewQuiz(prev => ({
                        ...prev,
                        courseId: courseRes.data[0].course._id
                    }));
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
    }, []);

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/quizzes', newQuiz);
            setShowCreateModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const addQuestion = () => {
        setNewQuiz({
            ...newQuiz,
            questions: [
                ...newQuiz.questions,
                { question: '', options: ['', ''], correctAnswers: [0], type: 'single', explanation: '' }
            ]
        });
    };

    if (loading)
        return (
            <div className="flex items-center justify-center h-full">
                <FiLoader className="text-primary-500 animate-spin" size={48} />
            </div>
        );

    return (
        <div className="p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        {role === 'teacher' ? 'Quiz Management' : 'Interactive Quizzes'}
                    </h2>
                    <p className="text-slate-400 mt-1">
                        {role === 'teacher'
                            ? 'Create and publish assessments for students.'
                            : 'Test your knowledge and earn points.'}
                    </p>
                </div>

                {role === 'teacher' && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <FiPlus size={20} /> Create Quiz
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        className="glass p-6 rounded-3xl border border-slate-800 flex flex-col group hover:border-primary-500/30 transition-all"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-primary-500/10 text-primary-400 rounded-2xl group-hover:scale-110 transition-transform">
                                <FiCpu size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {quiz.course.name}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">
                            {quiz.title}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-8">
                            <div className="flex items-center gap-1">
                                <FiClock size={14} />
                                <span>{quiz.duration} mins</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FiHelpCircle size={14} />
                                <span>{quiz.totalQuestions} Questions</span>
                            </div>
                        </div>

                        {role === 'teacher' ? (
                            <div className="flex gap-3">
                                <button className="flex-1 bg-slate-900 border border-slate-700 hover:border-primary-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                                    <FiEdit3 size={18} /> Edit
                                </button>
                                <button className="w-12 h-12 text-red-400 hover:bg-red-500/10 flex items-center justify-center rounded-xl transition-all">
                                    <FiTrash2 size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to={`/quiz/${quiz._id}`}
                                className="w-full bg-slate-900 border border-slate-700 hover:border-primary-500 hover:bg-primary-500/10 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                Start Quiz
                                <FiArrowRight size={18} />
                            </Link>
                        )}
                    </div>
                ))}

                {quizzes.length === 0 && (
                    <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-slate-800">
                        <FiCircle className="mx-auto mb-4 text-slate-700 animate-spin" size={48} />
                        <p className="text-slate-500 italic">
                            No quizzes available.
                        </p>
                    </div>
                )}
            </div>

            {/* Create Quiz Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="max-w-3xl w-full glass border border-slate-800 rounded-3xl p-8 max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-white">
                                Design New Quiz
                            </h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-500 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateQuiz} className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        Relate to Course
                                    </label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white"
                                        value={newQuiz.courseId}
                                        onChange={(e) =>
                                            setNewQuiz({ ...newQuiz, courseId: e.target.value })
                                        }
                                    >
                                        {courses.map(c => (
                                            <option key={c.course._id} value={c.course._id}>
                                                {c.course.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        Duration (Minutes)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white"
                                        value={newQuiz.duration}
                                        onChange={(e) =>
                                            setNewQuiz({ ...newQuiz, duration: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    Quiz Title
                                </label>
                                <input
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white"
                                    placeholder="e.g. Mid-term Assessment"
                                    value={newQuiz.title}
                                    onChange={(e) =>
                                        setNewQuiz({ ...newQuiz, title: e.target.value })
                                    }
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <FiLoader className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <FiCheckCircle size={20} />
                                        Deploy Quiz
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

export default Quizzes;