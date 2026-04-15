// src/pages/LogicGames.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { 
    ArrowLeft, Brain, Target, Shield, Zap, RotateCcw, 
    CheckCircle2, XCircle, Timer, Award, HelpCircle, 
    Puzzle, ScrollText, ChevronRight, Eye, RefreshCw
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const SymbolMatch = () => {
    const symbols = [
        { id: 1, symbol: '∧', name: 'Conjunción (y)', type: 'symbol' },
        { id: 2, name: 'Conjunción (y)', type: 'definition' },
        { id: 3, symbol: '∨', name: 'Disyunción (o)', type: 'symbol' },
        { id: 4, name: 'Disyunción (o)', type: 'definition' },
        { id: 5, symbol: '¬', name: 'Negación (no)', type: 'symbol' },
        { id: 6, name: 'Negación (no)', type: 'definition' },
        { id: 7, symbol: '→', name: 'Condicional (si... entonces)', type: 'symbol' },
        { id: 8, name: 'Condicional (si... entonces)', type: 'definition' },
        { id: 9, symbol: '↔', name: 'Bicondicional (si y solo si)', type: 'symbol' },
        { id: 10, name: 'Bicondicional (si y solo si)', type: 'definition' },
    ];

    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const shuffled = [...symbols].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setSolved([]);
        setFlipped([]);
        setMoves(0);
    };

    const handleClick = (index) => {
        if (disabled || flipped.includes(index) || solved.includes(cards[index].name)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
            setMoves(m => m + 1);
            if (cards[newFlipped[0]].name === cards[newFlipped[1]].name) {
                setSolved([...solved, cards[newFlipped[0]].name]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    return (
        <Card className="symbol-match-card fade-in">
            <div className="symbol-match-header">
                <h3 className="symbol-match-title">
                    <Target size={24} color="var(--brand-primary)" /> Emparejamiento Lógico
                </h3>
                <div className="symbol-match-stats">
                    <div className="symbol-match-moves">
                        <div className="symbol-match-moves-label">MOVIMIENTOS</div>
                        <div className="symbol-match-moves-value">{moves}</div>
                    </div>
                    <Button variant="secondary" onClick={initializeGame} className="symbol-match-reset">
                        <RotateCcw size={16} />
                    </Button>
                </div>
            </div>

            <p className="symbol-match-desc">
                Relaciona los símbolos proposicionales con sus definiciones técnicas.
            </p>

            <div className="symbol-match-grid">
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index);
                    const isSolved = solved.includes(card.name);

                    return (
                        <div
                            key={index}
                            onClick={() => handleClick(index)}
                            className={`symbol-match-card-item ${isSolved ? 'solved' : ''} ${isFlipped ? 'flipped' : ''}`}
                        >
                            {(isFlipped || isSolved) ? (card.symbol || card.name) : <Brain size={20} style={{ opacity: 0.1 }} />}
                        </div>
                    );
                })}
            </div>
            
            {solved.length === symbols.length / 2 && (
                <div className="symbol-match-complete fade-in">
                    <CheckCircle2 size={32} color="#10b981" />
                    <h4>¡Transmisión Completa!</h4>
                </div>
            )}
        </Card>
    );
};

const TruthQuest = () => {
    const questions = [
        { p: true, q: true, op: '∧', ans: true },
        { p: true, q: false, op: '∧', ans: false },
        { p: false, q: true, op: '∨', ans: true },
        { p: false, q: false, op: '∨', ans: false },
        { p: true, q: false, op: '→', ans: false },
        { p: false, q: true, op: '→', ans: true },
    ];

    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [gameState, setGameState] = useState('start');
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            handleAnswer(null);
        }
        return () => clearInterval(timer);
    }, [timeLeft, gameState]);

    const startGame = () => {
        setCurrent(0);
        setScore(0);
        setTimeLeft(10);
        setGameState('playing');
        setFeedback(null);
    };

    const handleAnswer = (answer) => {
        if (gameState !== 'playing') return;

        const correct = answer === questions[current].ans;
        if (correct) {
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            setFeedback('wrong');
        }

        setTimeout(() => {
            if (current + 1 < questions.length) {
                setCurrent(c => c + 1);
                setTimeLeft(10);
                setFeedback(null);
            } else {
                setGameState('end');
            }
        }, 800);
    };

    const q = questions[current];

    return (
        <Card className="truth-quest-card fade-in">
            <div className="truth-quest-header">
                <h3 className="truth-quest-title">
                    <Zap size={24} color="#f59e0b" /> Desafío Binario
                </h3>
                <div className="truth-quest-badges">
                    <Badge variant="secondary"><Timer size={14} /> {timeLeft}s</Badge>
                    <Badge variant="primary">PT: {score}</Badge>
                </div>
            </div>

            {gameState === 'start' && (
                <div className="truth-quest-start">
                    <Award size={40} color="#f59e0b" />
                    <h3>Deducción Veloz</h3>
                    <Button onClick={startGame}>Iniciar Secuencia</Button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="truth-quest-playing">
                    <div className={`truth-quest-expression ${feedback === 'correct' ? 'correct' : feedback === 'wrong' ? 'wrong' : ''}`}>
                        <span className="truth-value-true">{q.p ? 'V' : 'F'}</span>
                        <span className="truth-operator">{q.op}</span>
                        <span className={q.q ? 'truth-value-true' : 'truth-value-false'}>{q.q ? 'V' : 'F'}</span>
                    </div>
                    <div className="truth-quest-actions">
                        <Button className="truth-btn-true" onClick={() => handleAnswer(true)}>V</Button>
                        <Button className="truth-btn-false" onClick={() => handleAnswer(false)}>F</Button>
                    </div>
                </div>
            )}

            {gameState === 'end' && (
                <div className="truth-quest-end">
                    <h2 className="text-gradient">{score} PUNTOS</h2>
                    <p>Rendimiento cognoscitivo procesado.</p>
                    <Button onClick={startGame}>Reiniciar</Button>
                </div>
            )}
        </Card>
    );
};

const DynamicGameModule = ({ type, icon: Icon, color }) => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userFeedback, setUserFeedback] = useState(null);

    useEffect(() => {
        fetchData();
    }, [type]);

    const fetchData = async () => {
        try {
            const res = await api.get(`/logica/contenido/?tipo=${type}`);
            setContents(res.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    if (loading) return <Card className="game-module-loading">Cargando desafíos...</Card>;
    if (contents.length === 0) return null;

    const current = contents[currentIndex];

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % contents.length);
        setShowAnswer(false);
        setUserFeedback(null);
    };

    const checkTriviaAnswer = (option) => {
        setUserFeedback(option === current.respuesta ? 'correct' : 'wrong');
        setShowAnswer(true);
    };

    return (
        <Card className="game-module-card">
            <div className="game-module-header">
                <h3 className="game-module-title">
                    <Icon size={20} color={color} /> {type}s
                </h3>
                <Badge variant={current.dificultad === 'facil' ? 'success' : 'primary'}>{current.dificultad}</Badge>
            </div>

            <div className="game-module-body">
                <h4 className="game-module-question">{current.titulo}</h4>
                <div className="game-module-description">
                    {current.descripcion}
                </div>

                {type === 'trivia' && current.opciones && (
                    <div className="game-module-options">
                        {current.opciones.map((opt, i) => (
                            <Button 
                                key={i}
                                variant="secondary"
                                onClick={() => !showAnswer && checkTriviaAnswer(opt)}
                                disabled={showAnswer}
                                className={`game-module-option ${showAnswer && opt === current.respuesta ? 'correct-answer' : ''}`}
                            >
                                {opt}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            <div className="game-module-footer">
                {(showAnswer || ['paradoja', 'adivinanza', 'rompecabezas'].includes(type)) && (
                    <div className="game-module-answer" style={{ borderLeftColor: color }}>
                        <small>REVELACIÓN:</small>
                        <p>{current.respuesta}</p>
                    </div>
                )}
                <div className="game-module-actions">
                    {!showAnswer && ['adivinanza', 'rompecabezas'].includes(type) && (
                        <Button variant="secondary" onClick={() => setShowAnswer(true)} className="game-module-solve">
                            <Eye size={16} /> Resolver
                        </Button>
                    )}
                    <Button onClick={handleNext} className="game-module-next">
                        Siguiente <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

const LogicGames = () => {
    return (
        <div className="logic-games-container fade-in">
            <header className="logic-games-header">
                <div className="logic-games-header-left">
                    <h1 className="logic-games-title">
                        <span className="text-gradient">Laboratorio</span> de Juegos
                    </h1>
                    <p className="logic-games-subtitle">
                        Retos interactivos para expandir tu capacidad de razonamiento.
                    </p>
                </div>
                <Link to="/dashboard" className="logic-games-back">
                    <Button variant="secondary"><ArrowLeft size={16} /> Panel</Button>
                </Link>
            </header>

            <div className="logic-games-grid">
                <SymbolMatch />
                <TruthQuest />
                <DynamicGameModule type="trivia" icon={HelpCircle} color="var(--brand-primary)" />
                <DynamicGameModule type="adivinanza" icon={Brain} color="#8b5cf6" />
                <DynamicGameModule type="rompecabezas" icon={Puzzle} color="#ec4899" />
                <DynamicGameModule type="paradoja" icon={ScrollText} color="#f59e0b" />
            </div>
        </div>
    );
};

export default LogicGames;