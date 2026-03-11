import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Brain, Target, Shield, Zap, RotateCcw, CheckCircle2, XCircle, Timer, Award } from 'lucide-react';

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
        <div className="card animate-fade-up" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={20} className="text-accent" /> Emparejamiento de Símbolos
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Movimientos: {moves}</span>
                    <button className="btn-secondary" onClick={initializeGame} style={{ padding: '0.4rem 0.8rem', minHeight: 'auto' }}>
                        <RotateCcw size={14} /> Reiniciar
                    </button>
                </div>
            </div>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Encuentra el par correspondiente: el símbolo lógico y su nombre/significado.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
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
                                height: '100px',
                                background: isSolved ? 'var(--brand-indigo-soft)' : (isFlipped ? 'var(--bg-secondary)' : 'var(--bg-surface-raised)'),
                                border: `2px solid ${isSolved ? 'var(--semantic-success)' : (isFlipped ? 'var(--brand-indigo)' : 'var(--border-default)')}`,
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all var(--transition-base)',
                                fontSize: card.symbol ? 'var(--text-2xl)' : 'var(--text-xs)',
                                padding: '0.5rem',
                                textAlign: 'center',
                                fontWeight: '600',
                                transform: isFlipped || isSolved ? 'rotateY(0deg)' : 'rotateY(0)',
                                opacity: isSolved ? 0.7 : 1,
                            }}
                        >
                            {(isFlipped || isSolved) ? (card.symbol || card.name) : '?'}
                        </div>
                    );
                })}
            </div>
            {solved.length === symbols.length / 2 && (
                <div className="success-message animate-fade-up" style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <CheckCircle2 size={32} style={{ marginBottom: '0.5rem', color: 'var(--semantic-success)' }} />
                    <h4 style={{ color: 'var(--semantic-success)' }}>¡Lo lograste!</h4>
                    <p style={{ fontSize: 'var(--text-sm)' }}>Has emparejado todos los símbolos en {moves} movimientos.</p>
                </div>
            )}
        </div>
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
        { p: true, q: true, op: '↔', ans: true },
        { p: true, q: false, op: '↔', ans: false },
    ];

    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [gameState, setGameState] = useState('start'); // start, playing, end
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
        <div className="card animate-fade-up" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={20} style={{ color: '#F59E0B' }} /> Desafío de Verdad
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        padding: '0.4rem 0.8rem',
                        background: 'var(--bg-surface-raised)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '700',
                        color: timeLeft <= 3 ? 'var(--semantic-error)' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}>
                        <Timer size={14} /> {timeLeft}s
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--brand-indigo)' }}>Score: {score}</span>
                </div>
            </div>

            {gameState === 'start' && (
                <div style={{ textAlign: 'center', margin: 'auto' }}>
                    <Award size={48} style={{ color: 'var(--brand-indigo)', marginBottom: '1rem' }} />
                    <h4>¿Listo para el desafío?</h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Responde rápido si la proposición es Verdadera o Falsa.
                    </p>
                    <button className="btn-primary" onClick={startGame}>Comenzar Juego</button>
                </div>
            )}

            {gameState === 'playing' && (
                <div style={{ margin: 'auto', width: '100%', textAlign: 'center' }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        background: 'var(--bg-secondary)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '2rem',
                        border: feedback === 'correct' ? '2px solid var(--semantic-success)' : (feedback === 'wrong' ? '2px solid var(--semantic-error)' : '1px solid var(--border-default)'),
                        transition: 'all 0.2s'
                    }}>
                        <span style={{ color: q.p ? 'var(--semantic-success)' : 'var(--semantic-error)' }}>{q.p ? 'V' : 'F'}</span>
                        <span style={{ margin: '0 1rem', color: 'var(--brand-indigo)' }}>{q.op}</span>
                        <span style={{ color: q.q ? 'var(--semantic-success)' : 'var(--semantic-error)' }}>{q.q ? 'V' : 'F'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            className="btn-success"
                            style={{ flex: 1, padding: '1.5rem', fontSize: '1.2rem' }}
                            onClick={() => handleAnswer(true)}
                        >
                            Verdadero (V)
                        </button>
                        <button
                            className="btn-primary"
                            style={{ flex: 1, padding: '1.5rem', fontSize: '1.2rem', background: 'var(--semantic-error)', borderColor: 'var(--semantic-error)' }}
                            onClick={() => handleAnswer(false)}
                        >
                            Falso (F)
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'end' && (
                <div style={{ textAlign: 'center', margin: 'auto' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                    <h4>¡Juego Terminado!</h4>
                    <p style={{ margin: '0.5rem 0' }}>Tu puntaje final es:</p>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--brand-indigo)', marginBottom: '1.5rem' }}>{score}</div>
                    <button className="btn-primary" onClick={startGame}>Jugar de Nuevo</button>
                </div>
            )}
        </div>
    );
};

const LogicGames = () => {
    return (
        <div className="container">
            <Link to="/dashboard" className="back-link">
                <ChevronLeft size={16} /> Volver al Panel
            </Link>

            <div className="page-header animate-fade-up" style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Brain size={32} className="text-accent" /> Juegos de Lógica
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Diviértete mientras refuerzas tus conocimientos de lógica matemática.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                <SymbolMatch />
                <TruthQuest />
            </div>
        </div>
    );
};

export default LogicGames;
