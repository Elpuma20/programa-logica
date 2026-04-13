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
        <Card className="fade-in" style={{ borderTop: '4px solid var(--brand-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Target size={24} color="var(--brand-primary)" /> Emparejamiento Lógico
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>MOVIMIENTOS</div>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--brand-primary)' }}>{moves}</div>
                    </div>
                    <Button variant="secondary" onClick={initializeGame} style={{ padding: '0.5rem' }}>
                        <RotateCcw size={16} />
                    </Button>
                </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                Relaciona los símbolos proposicionales con sus definiciones técnicas.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '1rem'
            }}>
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index);
                    const isSolved = solved.includes(card.name);

                    return (
                        <div
                            key={index}
                            onClick={() => handleClick(index)}
                            style={{
                                height: '90px',
                                background: isSolved ? 'rgba(16, 185, 129, 0.1)' : (isFlipped ? 'var(--bg-secondary)' : 'var(--bg-surface)'),
                                border: `2px solid ${isSolved ? '#10b981' : (isFlipped ? 'var(--brand-primary)' : 'var(--border-default)')}`,
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all var(--transition-base)',
                                fontSize: card.symbol ? '1.5rem' : '0.75rem',
                                padding: '0.5rem',
                                textAlign: 'center',
                                fontWeight: 700,
                                color: isSolved ? '#10b981' : 'var(--text-primary)',
                            }}
                        >
                            {(isFlipped || isSolved) ? (card.symbol || card.name) : <Brain size={20} style={{ opacity: 0.1 }} />}
                        </div>
                    );
                })}
            </div>
            {solved.length === symbols.length / 2 && (
                <div className="fade-in" style={{ marginTop: '2rem', textAlign: 'center', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px' }}>
                    <CheckCircle2 size={32} color="#10b981" />
                    <h4 style={{ color: '#10b981', mt: '0.5rem' }}>¡Transmisión Completa!</h4>
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
        <Card className="fade-in" style={{ borderTop: '4px solid #f59e0b', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Zap size={24} color="#f59e0b" /> Desafío Binario
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Badge variant="secondary"><Timer size={14} style={{ verticalAlign: 'middle', mr: 4 }} /> {timeLeft}s</Badge>
                    <Badge variant="primary">PT: {score}</Badge>
                </div>
            </div>

            {gameState === 'start' && (
                <div style={{ textAlign: 'center', margin: 'auto' }}>
                    <Award size={40} color="#f59e0b" style={{ mb: '1rem' }} />
                    <h3 className="mb-4">Deducción Veloz</h3>
                    <Button onClick={startGame}>Iniciar Secuencia</Button>
                </div>
            )}

            {gameState === 'playing' && (
                <div style={{ textAlign: 'center', margin: 'auto', width: '100%' }}>
                    <div style={{ 
                        fontSize: '2.5rem', 
                        padding: '2rem', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: '20px', 
                        fontFamily: 'monospace',
                        marginBottom: '2rem',
                        border: feedback === 'correct' ? '2px solid #10b981' : (feedback === 'wrong' ? '2px solid #ef4444' : '1px solid var(--border-default)')
                    }}>
                        <span style={{ color: q.p ? '#10b981' : '#ef4444' }}>{q.p ? 'V' : 'F'}</span>
                        <span style={{ margin: '0 1rem', opacity: 0.3 }}>{q.op}</span>
                        <span style={{ color: q.q ? '#10b981' : '#ef4444' }}>{q.q ? 'V' : 'F'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Button style={{ background: '#10b981' }} onClick={() => handleAnswer(true)}>V</Button>
                        <Button style={{ background: '#ef4444' }} onClick={() => handleAnswer(false)}>F</Button>
                    </div>
                </div>
            )}

            {gameState === 'end' && (
                <div style={{ textAlign: 'center', margin: 'auto' }}>
                    <h2 className="text-gradient mb-2">{score} PUNTOS</h2>
                    <p className="mb-4">Rendimiento cognoscitivo procesado.</p>
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

    if (loading) return <Card style={{ textAlign: 'center' }}>Cargando desafíos...</Card>;
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
        <Card className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
                    <Icon size={20} color={color} /> {type}s
                </h3>
                <Badge variant={current.dificultad === 'facil' ? 'success' : 'primary'}>{current.dificultad}</Badge>
            </div>

            <div style={{ flex: 1 }}>
                <h4 className="mb-4">{current.titulo}</h4>
                <div style={{ 
                    padding: '1.5rem', 
                    background: 'var(--bg-secondary)', 
                    borderRadius: '12px', 
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    minHeight: '80px'
                }}>
                    {current.descripcion}
                </div>

                {type === 'trivia' && current.opciones && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {current.opciones.map((opt, i) => (
                            <Button 
                                key={i}
                                variant="secondary"
                                onClick={() => !showAnswer && checkTriviaAnswer(opt)}
                                disabled={showAnswer}
                                style={{ 
                                    background: showAnswer && opt === current.respuesta ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                    color: showAnswer && opt === current.respuesta ? '#10b981' : 'inherit',
                                    borderColor: showAnswer && opt === current.respuesta ? '#10b981' : 'var(--border-default)'
                                }}
                            >
                                {opt}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: 'auto' }}>
                {(showAnswer || ['paradoja', 'adivinanza', 'rompecabezas'].includes(type)) && (
                    <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: `4px solid ${color}`, marginBottom: '1rem' }}>
                         <small style={{ fontWeight: 800, opacity: 0.5, display: 'block' }}>REVELACIÓN:</small>
                         <p style={{ fontWeight: 700 }}>{current.respuesta}</p>
                    </div>
                )}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {!showAnswer && ['adivinanza', 'rompecabezas'].includes(type) && (
                        <Button variant="secondary" onClick={() => setShowAnswer(true)} style={{ flex: 1 }}><Eye size={16} /> Resolver</Button>
                    )}
                    <Button onClick={handleNext} style={{ flex: 1 }}>Siguiente <ChevronRight size={16} /></Button>
                </div>
            </div>
        </Card>
    );
};

const LogicGames = () => {
    return (
        <div className="container fade-in">
            <header className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                     <h1 className="mb-2"><span className="text-gradient">Laboratorio</span> de Juegos</h1>
                     <p style={{ color: 'var(--text-secondary)' }}>Retos interactivos para expandir tu capacidad de razonamiento.</p>
                </div>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary"><ArrowLeft size={16} /> Panel</Button>
                </Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
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
