import React, { useEffect, useState } from 'react';
import api from '../config/Api';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiClock,
    FiChevronRight,
    FiChevronLeft,
    FiCheckCircle,
    FiAward,
    FiTarget,
    FiXCircle,
    FiInfo,
    FiLoader
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

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <FiLoader className="text-primary animate-spin" size={48} />
            <p className="text-base-content/60 font-black uppercase tracking-widest text-xs">Initializing Training Module...</p>
        </div>
    );

    if (!quiz) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <FiXCircle className="text-error" size={64} />
            <h2 className="text-2xl font-black">Transmission Lost</h2>
            <p className="text-base-content/60">Module not found in the central database.</p>
            <button onClick={() => navigate('/quizzes')} className="btn btn-primary rounded-2xl px-10 h-14 font-black">Back to Hub</button>
        </div>
    );


    if (finished && result) {
        return (
            <div className="max-w-4xl mx-auto py-12 animate-in zoom-in-95 duration-700">
                <div className="bg-base-100 p-12 rounded-[3rem] border border-base-300 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-emerald-500 to-primary"></div>

                    <div className="text-center space-y-4 mb-12">
                        <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <FiAward size={48} />
                        </div>
                        <h2 className="text-4xl font-black text-base-content tracking-tight">Mission Accomplished</h2>
                        <p className="text-base-content/50 font-medium">Evaluation for <span className="text-primary font-bold">"{quiz.title}"</span> finalized.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-base-200/50 border border-base-300 p-8 rounded-[2.5rem] text-center group hover:bg-primary hover:text-primary-content transition-all duration-500">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">Efficiency Rate</p>
                            <p className="text-4xl font-black">{result.percentage}%</p>
                        </div>

                        <div className="bg-base-200/50 border border-base-300 p-8 rounded-[2.5rem] text-center group hover:bg-emerald-500 hover:text-white transition-all duration-500">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">Correct Hits</p>
                            <p className="text-4xl font-black">{result.correctCount}</p>
                        </div>

                        <div className="bg-base-200/50 border border-base-300 p-8 rounded-[2.5rem] text-center group hover:bg-error hover:text-white transition-all duration-500">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">Missed Targets</p>
                            <p className="text-4xl font-black">{result.incorrectCount}</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-12">
                        <h4 className="text-xs font-black text-base-content/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <FiInfo /> After-Action Review
                        </h4>

                        <div className="space-y-4 max-h-[400px] overflow-auto pr-4 custom-scrollbar">
                            {quiz.questions.map((q, i) => (
                                <div
                                    key={q._id}
                                    className="p-6 bg-base-200 rounded-[2rem] border border-base-300 hover:border-primary transition-colors"
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center font-black text-xs shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-bold text-base-content leading-snug">
                                                {q.question}
                                            </p>
                                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                                <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">INTEL DATA:</p>
                                                <p className="text-sm text-base-content/70 italic">
                                                    {explanations.find(e => e.qId === q._id)?.explanation || 'No additional intelligence available for this query.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate('/quizzes')}
                            className="bg-primary hover:bg-primary/90 text-primary-content font-black py-4 px-12 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 text-lg"
                        >
                            Return to Hub
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // QUIZ SCREEN
    const currentQ = quiz.questions[currentQuestionIndex];

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-3xl font-black text-base-content tracking-tight">
                        {quiz.title}
                    </h2>
                    <div className="flex items-center gap-4 text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] justify-center md:justify-start">
                        <span className="bg-base-200 px-3 py-1 rounded-full border border-base-300">Question {currentQuestionIndex + 1} of {quiz.totalQuestions}</span>
                        <span className="bg-base-200 px-3 py-1 rounded-full border border-base-300">Mode: Tactical Evaluation</span>
                    </div>
                </div>

                <div
                    className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] border-2 transition-all duration-300 shadow-xl ${timeLeft < 60
                            ? 'bg-error/10 border-error text-error shadow-error/10 animate-pulse'
                            : 'bg-base-100 border-primary text-primary shadow-primary/10'
                        }`}
                >
                    <FiClock
                        size={24}
                    />
                    <span className="font-black text-2xl tracking-tight">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4">
                <div className="w-full h-3 bg-base-300 rounded-full overflow-hidden p-1 shadow-inner">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-700 ease-out shadow-lg shadow-primary/30"
                        style={{ width: `${((currentQuestionIndex + 1) / quiz.totalQuestions) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-base-100 rounded-[3rem] border border-base-300 overflow-hidden shadow-2xl relative">
                <div className="p-10 md:p-14 space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary text-primary-content rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
                                {currentQuestionIndex + 1}
                            </div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Query Protocol Active</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-base-content leading-tight">
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
                                    className={`group p-8 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between active:scale-[0.98] ${isSelected
                                            ? 'bg-primary/5 border-primary text-base-content shadow-lg shadow-primary/10'
                                            : 'bg-base-200/50 border-transparent text-base-content/60 hover:bg-base-200 hover:border-base-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${isSelected ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/30'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-lg font-bold">
                                            {option}
                                        </span>
                                    </div>

                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary border-none text-primary-content' : 'border-base-300'
                                        }`}>
                                        {isSelected && <FiCheckCircle size={20} />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-8 md:p-10 bg-base-200/50 border-t border-base-300 flex flex-col md:flex-row items-center justify-between gap-6">
                    <button
                        onClick={() =>
                            setCurrentQuestionIndex(prev => prev - 1)
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all uppercase tracking-widest text-xs ${currentQuestionIndex === 0
                                ? 'opacity-20 cursor-not-allowed'
                                : 'bg-base-100 hover:bg-base-300 text-base-content shadow-sm'
                            }`}
                    >
                        <FiChevronLeft size={20} />
                        Retreat
                    </button>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {currentQuestionIndex === quiz.totalQuestions - 1 ? (
                            <button
                                onClick={submitQuiz}
                                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-black px-12 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-lg"
                            >
                                TRANSMIT RESULTS
                                <FiTarget size={22} className="animate-pulse" />
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    setCurrentQuestionIndex(prev => prev + 1)
                                }
                                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-content font-black px-12 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-95 transition-all text-lg group"
                            >
                                NEXT PHASE
                                <FiChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;