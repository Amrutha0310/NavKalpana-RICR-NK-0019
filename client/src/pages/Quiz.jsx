import React, { useEffect, useState } from 'react';
import api from '../config/Api';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiClock,
    FiChevronRight,
    FiChevronLeft,
    FiCheckCircle,
    FiAward
} from 'react-icons/fi';

const Quiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const [finished, setFinished] = useState(false);
    const [result, setResult] = useState(null);
    const [explanations, setExplanations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quizzes/${id}`);
                setQuiz(res.data);
                setTimeLeft(res.data.duration * 60);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (timeLeft === 0) {
            submitQuiz();
        }

        if (timeLeft > 0 && !finished) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, finished]);

    const handleOptionToggle = (questionId, optionIndex, type) => {
        setAnswers(prev => {
            const current = prev[questionId] || [];

            if (type === 'single') {
                return { ...prev, [questionId]: [optionIndex] };
            } else {
                if (current.includes(optionIndex)) {
                    return {
                        ...prev,
                        [questionId]: current.filter(i => i !== optionIndex)
                    };
                } else {
                    return {
                        ...prev,
                        [questionId]: [...current, optionIndex]
                    };
                }
            }
        });
    };

    const submitQuiz = async () => {
        setFinished(true);
        try {
            const res = await api.post('/quizzes/submit', {
                quizId: id,
                answers
            });

            setResult(res.data.attempt);
            setExplanations(res.data.explanation);
        } catch (err) {
            console.error(err);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return <div>Loading quiz...</div>;
    if (!quiz) return <div>Quiz not found</div>;


    if (finished && result) {
        return (
            <div className="max-w-3xl mx-auto py-10 animate-in zoom-in-95 duration-500">
                <div className="glass p-10 rounded-3xl border border-slate-800 text-center">
                    <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiAward size={40} />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">
                        Quiz Completed!
                    </h2>
                    <p className="text-slate-400 mb-8">
                        Great job finishing the {quiz.title}.
                    </p>

                    <div className="grid grid-cols-3 gap-6 mb-10">
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                                Score
                            </p>
                            <p className="text-2xl font-bold text-primary-400">
                                {result.percentage}%
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                                Correct
                            </p>
                            <p className="text-2xl font-bold text-emerald-500">
                                {result.correctCount}
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                                Incorrect
                            </p>
                            <p className="text-2xl font-bold text-red-500">
                                {result.incorrectCount}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10 text-left">
                        <h4 className="text-lg font-bold text-white mb-4">
                            Review Explanations
                        </h4>

                        {quiz.questions.map((q, i) => (
                            <div
                                key={q._id}
                                className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl"
                            >
                                <p className="text-sm font-semibold text-slate-200">
                                    Q{i + 1}: {q.question}
                                </p>

                                <p className="text-xs text-slate-500 mt-2 italic">
                                    <span className="text-primary-400 font-bold not-italic">
                                        Explanation:{' '}
                                    </span>
                                    {explanations.find(e => e.qId === q._id)
                                        ?.explanation || 'No explanation available.'}
                                </p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/quizzes')}
                        className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    // QUIZ SCREEN
    const currentQ = quiz.questions[currentQuestionIndex];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        {quiz.title}
                    </h2>
                    <p className="text-slate-400">
                        Total Questions: {quiz.totalQuestions}
                    </p>
                </div>

                <div
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
                        timeLeft < 60
                            ? 'bg-red-500/10 border-red-500/30 text-red-500'
                            : 'glass border-slate-800 text-primary-400'
                    }`}
                >
                    <FiClock
                        size={20}
                        className={timeLeft < 60 ? 'animate-pulse' : ''}
                    />
                    <span className="font-mono text-xl font-bold">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            
            <div className="glass rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-8 space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center font-bold">
                            {currentQuestionIndex + 1}
                        </span>
                        <h3 className="text-xl font-semibold text-slate-100">
                            {currentQ.question}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQ.options.map((option, idx) => {
                            const isSelected =
                                answers[currentQ._id]?.includes(idx);

                            return (
                                <button
                                    key={idx}
                                    onClick={() =>
                                        handleOptionToggle(
                                            currentQ._id,
                                            idx,
                                            currentQ.type
                                        )
                                    }
                                    className={`p-6 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                        isSelected
                                            ? 'bg-primary-500/10 border-primary-500 text-white'
                                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                                    }`}
                                >
                                    <span className="font-medium">
                                        {option}
                                    </span>

                                    {isSelected && (
                                        <FiCheckCircle
                                            size={18}
                                            className="text-primary-400"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-8 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between">
                    <button
                        onClick={() =>
                            setCurrentQuestionIndex(prev => prev - 1)
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold ${
                            currentQuestionIndex === 0
                                ? 'text-slate-700 cursor-not-allowed'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <FiChevronLeft size={20} />
                        Previous
                    </button>

                    {currentQuestionIndex === quiz.totalQuestions - 1 ? (
                        <button
                            onClick={submitQuiz}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2"
                        >
                            Finish Quiz
                            <FiCheckCircle size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                setCurrentQuestionIndex(prev => prev + 1)
                            }
                            className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2"
                        >
                            Next
                            <FiChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz;