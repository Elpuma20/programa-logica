// src/pages/PredicateLogic.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitBranch, Target, CheckCircle2, Award, Zap, BookOpen } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const PredicateLogicLesson = () => {
    const [step, setStep] = useState(1);
    const [quizAnswer, setQuizAnswer] = useState(null);

    const questions = {
        1: {
            q: "¿A qué se refiere el cuantificador universal (∀)?",
            options: ["A algunos elementos", "A todos los elementos del dominio", "A un elemento único", "A ningún elemento"],
            correct: 1
        },
        2: {
            q: "Si decimos '∃x P(x)', estamos afirmando que:",
            options: ["P(x) es falso para todos", "No existe ningún x", "Existe al menos un x tal que P(x)", "Todos los x cumplen P(x)"],
            correct: 2
        }
    };

    const handleQuiz = (idx) => {
        setQuizAnswer(idx);
    };

    return (
        <div className="predicate-container fade-in">
            {/* Header */}
            <header className="predicate-header">
                <div className="predicate-header-left">
                    <h1 className="predicate-title">
                        Unidad 3: <span className="text-gradient">Lógica</span> de Predicados
                    </h1>
                    <p className="predicate-subtitle">
                        Más allá de las proposiciones simples: cuantificadores y variables.
                    </p>
                </div>
                <Link to="/dashboard" className="predicate-back-link">
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
            </header>

            {/* Content Area - Responsive */}
            <div className="predicate-content-grid">
                <Card className="predicate-main-card" style={{ borderTop: '4px solid #f43f5e', padding: '2rem' }}>
                    
                    {/* Contenido según el paso */}
                    {step === 1 ? (
                        <div className="predicate-step fade-in">
                            {/* Header del módulo */}
                            <div className="predicate-module-header">
                                <div className="predicate-module-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
                                    <BookOpen size={24} />
                                </div>
                                <h3>Módulo 1: Cuantificador Universal (∀)</h3>
                            </div>
                            
                            <p className="predicate-description">
                                El cuantificador universal se representa con el símbolo <strong>∀</strong> (una 'A' invertida por "All" en inglés) y se lee como "Para todo..." o "Para cada...".
                            </p>
                            
                            {/* Ejemplo formal */}
                            <Card className="predicate-example-card" style={{ background: 'var(--bg-secondary)' }}>
                                <p className="predicate-example-label">EJEMPLO FORMAL:</p>
                                <code className="predicate-example-code" style={{ color: '#f43f5e' }}>∀x [ Humano(x) → Mortal(x) ]</code>
                                <p className="predicate-example-translation">
                                    Traducción: "Para todo x, si x es humano, entonces x es mortal".
                                </p>
                            </Card>

                            {/* Info adicional */}
                            <div className="predicate-info-box" style={{ borderLeft: '4px solid #f43f5e' }}>
                                <h4 className="predicate-info-title">¿Cuándo es Verdadero?</h4>
                                <p className="predicate-info-text">
                                    Es verdadero solo si la propiedad se cumple para <strong>absolutamente todos</strong> los elementos del conjunto bajo estudio.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="predicate-step fade-in">
                            <div className="predicate-module-header">
                                <div className="predicate-module-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
                                    <Zap size={24} />
                                </div>
                                <h3>Módulo 2: Cuantificador Existencial (∃)</h3>
                            </div>
                            
                            <p className="predicate-description">
                                El cuantificador existencial se representa con el símbolo <strong>∃</strong> (una 'E' invertida por "Existential") y se lee como "Existe un..." o "Hay al menos un...".
                            </p>
                            
                            <Card className="predicate-example-card" style={{ background: 'var(--bg-secondary)' }}>
                                <p className="predicate-example-label">EJEMPLO FORMAL:</p>
                                <code className="predicate-example-code" style={{ color: '#f43f5e' }}>∃x [ Estudiante(x) ∧ Sobresaliente(x) ]</code>
                                <p className="predicate-example-translation">
                                    Traducción: "Existe al menos un x tal que x es estudiante y x es sobresaliente".
                                </p>
                            </Card>

                            <div className="predicate-info-box" style={{ borderLeft: '4px solid #f43f5e' }}>
                                <h4 className="predicate-info-title">¿Cuándo es Verdadero?</h4>
                                <p className="predicate-info-text">
                                    Es verdadero si podemos encontrar <strong>al menos un ejemplo</strong> que cumpla la condición. No importa si los demás no la cumplen.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Sección de Quiz */}
                    <div className="predicate-quiz-section">
                        <p className="predicate-quiz-question">{questions[step]?.q}</p>
                        
                        <div className="predicate-quiz-options">
                            {questions[step]?.options.map((opt, i) => (
                                <Button 
                                    key={i} 
                                    variant={quizAnswer === i ? (i === questions[step].correct ? "primary" : "secondary") : "secondary"}
                                    onClick={() => handleQuiz(i)}
                                    className="predicate-quiz-btn"
                                    style={{ 
                                        borderColor: quizAnswer === i ? (i === questions[step].correct ? "#10b981" : "#ef4444") : "var(--border-default)",
                                        background: quizAnswer === i && i === questions[step].correct ? "rgba(16, 185, 129, 0.1)" : ""
                                    }}
                                >
                                    {opt}
                                </Button>
                            ))}
                        </div>
                        
                        {/* Feedback */}
                        {quizAnswer !== null && (
                            <div className="predicate-quiz-feedback fade-in">
                                {quizAnswer === questions[step].correct ? 
                                    <Badge variant="success">¡Correcto! Has captado la esencia lógica.</Badge> : 
                                    <Badge variant="primary">Inténtalo de nuevo, revisa la teoría.</Badge>
                                }
                            </div>
                        )}

                        {/* Botones de navegación */}
                        <div className="predicate-nav-buttons">
                            <Button 
                                variant="ghost" 
                                disabled={step === 1} 
                                onClick={() => { setStep(s => s - 1); setQuizAnswer(null); }}
                                className="predicate-nav-prev"
                            >
                                Anterior
                            </Button>
                            {step === 1 ? (
                                <Button 
                                    onClick={() => { setStep(s => s + 1); setQuizAnswer(null); }}
                                    className="predicate-nav-next"
                                >
                                    Continuar ∃
                                </Button>
                            ) : (
                                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                    <Button className="predicate-nav-finish" style={{ background: '#10b981' }}>
                                        <Award size={18} /> Finalizar Módulo
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PredicateLogicLesson;