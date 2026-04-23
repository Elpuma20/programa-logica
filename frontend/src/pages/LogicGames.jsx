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
import Input from '../components/ui/Input';

const JigsawPiece = ({ image, size, x, y, dx, dy, onClick, isCorrect }) => (
    <div 
        onClick={onClick}
        style={{
            width: size,
            height: size,
            backgroundImage: `url(${image})`,
            backgroundSize: `${size * 3}px ${size * 3}px`,
            backgroundPosition: `-${dx * size}px -${dy * size}px`,
            border: isCorrect ? '2px solid #10b981' : '2px solid rgba(255,255,255,0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '4px',
            boxShadow: isCorrect ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
            opacity: isCorrect ? 1 : 0.9,
            transform: isCorrect ? 'scale(1)' : 'scale(0.98)',
        }}
    />
);

const ImagePuzzle = ({ image, onComplete }) => {
    const [pieces, setPieces] = useState([]);
    const [selected, setSelected] = useState(null);
    const [pieceSize, setPieceSize] = useState(100);

    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            if (width < 400) setPieceSize(80);
            else if (width < 500) setPieceSize(90);
            else setPieceSize(100);
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        const initialPieces = [];
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                initialPieces.push({ id: y * 3 + x, x, y, dx: x, dy: y });
            }
        }
        
        let shuffled;
        do {
            shuffled = [...initialPieces].sort(() => Math.random() - 0.5);
        } while (shuffled.every((p, i) => p.id === i));
        
        setPieces(shuffled);
    }, [image]);

    const handlePieceClick = (index) => {
        if (selected === null) {
            setSelected(index);
        } else {
            const newPieces = [...pieces];
            const temp = newPieces[selected];
            newPieces[selected] = newPieces[index];
            newPieces[index] = temp;
            setPieces(newPieces);
            setSelected(null);

            const isSolved = newPieces.every((p, i) => p.id === i);
            if (isSolved) onComplete();
        }
    };

    return (
        <div style={{ padding: '0.5rem', display: 'inline-block', background: 'rgba(0,0,0,0.05)', borderRadius: '16px' }}>
            <div className="image-puzzle-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(3, ${pieceSize}px)`, 
                gridTemplateRows: `repeat(3, ${pieceSize}px)`,
                gap: '4px', 
                margin: '0 auto',
                background: 'rgba(0,0,0,0.05)',
                padding: '4px',
                borderRadius: '12px',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
            }}>
                {pieces.map((piece, i) => (
                    <JigsawPiece 
                        key={i}
                        image={image}
                        size={pieceSize}
                        x={piece.x}
                        y={piece.y}
                        dx={piece.dx}
                        dy={piece.dy}
                        isCorrect={piece.id === i}
                        onClick={() => handlePieceClick(i)}
                    />
                ))}
            </div>
        </div>
    );
};

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
    const [showError, setShowError] = useState(false);
    const [shakeCard, setShakeCard] = useState(false);
    const [userInput, setUserInput] = useState('');

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
        if (!showAnswer && ['trivia', 'adivinanza', 'rompecabezas'].includes(type)) {
            setShowError(true);
            setShakeCard(true);
            setTimeout(() => setShakeCard(false), 500);
            return;
        }
        setCurrentIndex((currentIndex + 1) % contents.length);
        setShowAnswer(false);
        setUserFeedback(null);
        setShowError(false);
        setUserInput('');
    };

    const checkTriviaAnswer = (option) => {
        setUserFeedback(option === current.respuesta ? 'correct' : 'wrong');
        setShowAnswer(true);
    };

    const checkTypedAnswer = () => {
        if (!userInput.trim()) {
            setShakeCard(true);
            setTimeout(() => setShakeCard(false), 500);
            return;
        }
        
        const cleanUser = userInput.trim().toLowerCase();
        const cleanCorrect = current.respuesta.trim().toLowerCase();
        
        if (cleanUser === cleanCorrect) {
            setUserFeedback('correct');
            setShowAnswer(true);
            setShowError(false);
        } else {
            setUserFeedback('wrong');
            setShakeCard(true);
            setTimeout(() => setShakeCard(false), 500);
        }
    };

    return (
        <Card className={`game-module-card ${shakeCard ? 'shake' : ''}`} style={{ border: showError ? '2px solid #ef4444' : 'none' }}>
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

                {type === 'trivia' && current.opciones && !showAnswer && (
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

                {type === 'rompecabezas' && current.imagen && !showAnswer && (
                    <div className="image-puzzle-section" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Intercambia las piezas para reconstruir la imagen lógica.
                        </p>
                        <ImagePuzzle 
                            image={(() => {
                                if (current.imagen.startsWith('http')) return current.imagen;
                                const base = import.meta.env.PROD 
                                    ? 'https://edulogica.onrender.com' 
                                    : 'http://localhost:8000';
                                return `${base}${current.imagen}`;
                            })()} 
                            onComplete={() => {
                                setUserFeedback('correct');
                                setShowAnswer(true);
                            }}
                        />
                    </div>
                )}

                {type === 'rompecabezas' && !current.imagen && !showAnswer && (
                    <div className="puzzle-assembly-area" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '2px dashed var(--border-default)' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                            {/* Generamos "piezas" falsas basadas en la respuesta (si es número) */}
                            {[
                                parseInt(current.respuesta) - 2, 
                                parseInt(current.respuesta) + 10, 
                                current.respuesta, 
                                parseInt(current.respuesta) * 2
                            ].sort(() => Math.random() - 0.5).map((val, i) => (
                                <div 
                                    key={i}
                                    onClick={() => {
                                        setUserInput(val.toString());
                                        if (val.toString().toLowerCase() === current.respuesta.toLowerCase()) {
                                            setUserFeedback('correct');
                                            setShowAnswer(true);
                                        } else {
                                            setUserFeedback('wrong');
                                            setTimeout(() => setUserFeedback('idle'), 1000);
                                        }
                                    }}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        background: userInput === val.toString() ? 'var(--brand-primary)' : 'white',
                                        color: userInput === val.toString() ? 'white' : 'var(--text-primary)',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                        border: '2px solid var(--border-default)',
                                        fontWeight: 800,
                                        transition: 'all 0.2s',
                                        transform: userInput === val.toString() ? 'scale(1.1)' : 'scale(1)',
                                        clipPath: 'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)'
                                    }}
                                >
                                    {val}
                                </div>
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '1rem', color: 'var(--text-muted)' }}>
                            Selecciona la pieza que completa la secuencia lógica
                        </p>
                    </div>
                )}

                {type !== 'rompecabezas' && !showAnswer && (
                    <div className="game-module-input-section" style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                            {type === 'trivia' ? 'O elige una opción arriba, o escribe aquí:' : 'Escribe tu deducción:'}
                        </div>
                        <Input 
                            placeholder="Escribe tu respuesta aquí..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            disabled={showAnswer}
                            style={{ 
                                borderColor: userFeedback === 'correct' ? '#10b981' : userFeedback === 'wrong' ? '#ef4444' : '',
                                background: userFeedback === 'correct' ? 'rgba(16, 185, 129, 0.05)' : userFeedback === 'wrong' ? 'rgba(239, 68, 68, 0.05)' : ''
                            }}
                        />
                        <Button 
                            onClick={checkTypedAnswer} 
                            style={{ marginTop: '0.75rem', width: '100%', background: 'var(--brand-primary)' }}
                        >
                            Verificar Respuesta
                        </Button>
                    </div>
                )}
            </div>

            <div className="game-module-footer">
                {showAnswer && type !== 'rompecabezas' && (
                    <div className="game-module-answer fade-in" style={{ borderLeftColor: color, background: userFeedback === 'correct' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {userFeedback === 'correct' ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
                            <small style={{ fontWeight: 800 }}>{userFeedback === 'correct' ? '¡CORRECTO!' : 'RESPUESTA CORRECTA:'}</small>
                        </div>
                        <p style={{ fontWeight: 700 }}>{current.respuesta}</p>
                    </div>
                )}
                <div className="game-module-actions">
                    {!showAnswer && ['adivinanza', 'paradoja'].includes(type) && (
                        <Button variant="ghost" onClick={() => setShowAnswer(true)} className="game-module-solve" style={{ opacity: 0.6 }}>
                            <Eye size={14} /> Ver respuesta
                        </Button>
                    )}
                    <Button onClick={handleNext} className="game-module-next" variant={showAnswer ? 'primary' : 'secondary'}>
                        Siguiente <ChevronRight size={16} />
                    </Button>
                </div>
                {showError && (
                    <div className="error-message-pop" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                        Debes resolver este desafío antes de continuar
                    </div>
                )}
            </div>
        </Card>
    );
};

const LogicGames = () => {
    return (
        <div className="logic-games-container container fade-in">
            <header className="logic-games-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="logic-games-header-left">
                    <h1 className="logic-games-title" style={{ fontSize: '1.8rem', margin: 0 }}>
                        <span className="text-gradient">Laboratorio</span>
                    </h1>
                    <p className="logic-games-subtitle hide-mobile" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Desafíos interactivos de razonamiento.
                    </p>
                </div>
                <Link to="/dashboard" className="logic-games-back">
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
            </header>

            <div className="logic-games-grid">
                {/* <SymbolMatch /> */}
                {/* <TruthQuest /> */}
                <DynamicGameModule type="trivia" icon={HelpCircle} color="var(--brand-primary)" />
                <DynamicGameModule type="adivinanza" icon={Brain} color="#8b5cf6" />
                <DynamicGameModule type="rompecabezas" icon={Puzzle} color="#ec4899" />
                <DynamicGameModule type="paradoja" icon={ScrollText} color="#f59e0b" />
            </div>
        </div>
    );
};

export default LogicGames;