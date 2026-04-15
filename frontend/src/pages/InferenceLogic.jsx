// src/pages/InferenceLogic.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowLeft, Brain, BookOpen, CheckCircle2, Award, Zap, 
    Binary, ShieldCheck, ChevronRight, RotateCcw
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const InferenceLogic = () => {
    const [step, setStep] = useState(1);
    const [quizAnswer, setQuizAnswer] = useState(null);

    const theoryData = {
        1: {
            title: "Reglas de Inferencia",
            icon: Brain,
            color: '#8b5cf6',
            content: (
                <div className="inference-content fade-in">
                    <p className="inference-description">Las reglas de inferencia son esquemas lógicos que nos permiten extraer conclusiones válidas a partir de premisas verdaderas.</p>
                    <div className="inference-rules-grid">
                        <Card className="inference-rule-card" style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid #8b5cf6' }}>
                            <h4 className="inference-rule-title">Modus Ponens (MP)</h4>
                            <p className="inference-rule-desc">Si tengo "P → Q" y tengo "P", entonces necesariamente tengo "Q".</p>
                            <code className="inference-rule-code">
                                p → q <br/>
                                p <br/>
                                ∴ q
                            </code>
                        </Card>
                        <Card className="inference-rule-card" style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid #8b5cf6' }}>
                            <h4 className="inference-rule-title">Modus Tollens (MT)</h4>
                            <p className="inference-rule-desc">Si tengo "P → Q" y tengo "¬Q", entonces necesariamente tengo "¬P".</p>
                            <code className="inference-rule-code">
                                p → q <br/>
                                ¬q <br/>
                                ∴ ¬p
                            </code>
                        </Card>
                    </div>
                </div>
            ),
            question: "¿Qué conclusión obtenemos de: 'Si llueve, el suelo se moja' y 'El suelo NO está mojado'?",
            options: ["Llueve", "No llueve", "El suelo se mojará", "Inconcluso"],
            correct: 1
        },
        2: {
            title: "Métodos de Demostración",
            icon: BookOpen,
            color: '#8b5cf6',
            content: (
                <div className="inference-content fade-in">
                    <p className="inference-description">Demostrar es el proceso de construir una cadena de razonamientos que justifiquen una afirmación.</p>
                    <div className="inference-methods-list">
                        <div className="inference-method-item">
                            <strong>1. Demostración Directa:</strong> Se asume que las premisas son verdaderas y se llega a la conclusión paso a paso.
                        </div>
                        <div className="inference-method-item">
                            <strong>2. Reducción al Absurdo:</strong> Se asume que la conclusión es FALSA y se busca una contradicción lógica.
                        </div>
                        <div className="inference-method-item">
                            <strong>3. Inducción Matemática:</strong> Se demuestra para un caso base (n=1) y luego para (n+1).
                        </div>
                    </div>
                </div>
            ),
            question: "¿Cuál método asume que la conclusión es falsa para encontrar un error?",
            options: ["Directa", "Inducción", "Por el Absurdo", "Modus Ponens"],
            correct: 2
        }
    };

    const currentData = theoryData[step];

    return (
        <div className="inference-container fade-in">
            {/* Header */}
            <header className="inference-header">
                <div className="inference-header-left">
                    <h1 className="inference-title">
                        <span className="text-gradient">Inferencia</span>
                    </h1>
                    <p className="inference-subtitle">
                        El arte de validar razonamientos y demostraciones lógicas.
                    </p>
                </div>
                <Link to="/dashboard" className="inference-back-link">
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
            </header>

            {/* Card principal */}
            <Card className="inference-main-card" style={{ borderTop: `4px solid ${currentData.color}`, padding: '2rem' }}>
                
                {/* Header del módulo */}
                <div className="inference-module-header">
                    <div className="inference-module-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: currentData.color }}>
                        <currentData.icon size={24} />
                    </div>
                    <h3 className="inference-module-title">{currentData.title}</h3>
                </div>

                {/* Contenido dinámico */}
                {currentData.content}

                {/* Sección de Quiz */}
                <div className="inference-quiz-section">
                    <p className="inference-quiz-question">{currentData.question}</p>
                    
                    <div className="inference-quiz-options">
                        {currentData.options.map((opt, i) => (
                            <Button 
                                key={i} 
                                variant={quizAnswer === i ? (i === currentData.correct ? "primary" : "secondary") : "secondary"}
                                onClick={() => setQuizAnswer(i)}
                                className="inference-quiz-btn"
                                style={{ 
                                    borderColor: quizAnswer === i ? (i === currentData.correct ? "#10b981" : "#ef4444") : "var(--border-default)",
                                    background: quizAnswer === i && i === currentData.correct ? "rgba(16, 185, 129, 0.1)" : ""
                                }}
                            >
                                {opt}
                            </Button>
                        ))}
                    </div>

                    {/* Botones de navegación */}
                    <div className="inference-nav-buttons">
                        <Button 
                            variant="ghost" 
                            disabled={step === 1} 
                            onClick={() => { setStep(s => s - 1); setQuizAnswer(null); }}
                            className="inference-nav-prev"
                        >
                            Anterior
                        </Button>
                        {step === 1 ? (
                            <Button 
                                disabled={quizAnswer !== currentData.correct} 
                                onClick={() => { setStep(s => s + 1); setQuizAnswer(null); }}
                                className="inference-nav-next"
                            >
                                Continuar <ChevronRight size={18} />
                            </Button>
                        ) : (
                            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                <Button 
                                    className="inference-nav-finish" 
                                    style={{ background: '#10b981' }} 
                                    disabled={quizAnswer !== currentData.correct}
                                >
                                    <CheckCircle2 size={18} /> Finalizar Unidad
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default InferenceLogic;