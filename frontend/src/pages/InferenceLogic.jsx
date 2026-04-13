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
                <div className="fade-in">
                    <p className="mb-4">Las reglas de inferencia son esquemas lógicos que nos permiten extraer conclusiones válidas a partir de premisas verdaderas.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Card style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid #8b5cf6' }}>
                            <h4 className="mb-2">Modus Ponens (MP)</h4>
                            <p style={{ fontSize: '0.85rem' }}>Si tengo "P → Q" y tengo "P", entonces necesariamente tengo "Q".</p>
                            <code style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                p → q <br/>
                                p <br/>
                                ∴ q
                            </code>
                        </Card>
                        <Card style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid #8b5cf6' }}>
                            <h4 className="mb-2">Modus Tollens (MT)</h4>
                            <p style={{ fontSize: '0.85rem' }}>Si tengo "P → Q" y tengo "¬Q", entonces necesariamente tengo "¬P".</p>
                            <code style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.9rem' }}>
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
                <div className="fade-in">
                    <p className="mb-4">Demostrar es el proceso de construir una cadena de razonamientos que justifiquen una afirmación.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <strong>1. Demostración Directa:</strong> Se asume que las premisas son verdaderas y se llega a la conclusión paso a paso.
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <strong>2. Reducción al Absurdo:</strong> Se asume que la conclusión es FALSA y se busca una contradicción lógica.
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
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
        <div className="container fade-in" style={{ maxWidth: '900px' }}>
            <header className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                     <h1 className="mb-2">Unidad 2: <span className="text-gradient">Inferencia</span></h1>
                     <p style={{ color: 'var(--text-secondary)' }}>El arte de validar razonamientos y demostraciones lógicas.</p>
                </div>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
            </header>

            <Card style={{ borderTop: `4px solid ${currentData.color}`, padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: currentData.color }}>
                        <currentData.icon size={24} />
                    </div>
                    <h3>{currentData.title}</h3>
                </div>

                {currentData.content}

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-default)' }}>
                    <p className="mb-4" style={{ fontWeight: 700 }}>{currentData.question}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        {currentData.options.map((opt, i) => (
                            <Button 
                                key={i} 
                                variant={quizAnswer === i ? (i === currentData.correct ? "primary" : "secondary") : "secondary"}
                                onClick={() => setQuizAnswer(i)}
                                style={{ 
                                    borderColor: quizAnswer === i ? (i === currentData.correct ? "#10b981" : "#ef4444") : "var(--border-default)",
                                    background: quizAnswer === i && i === currentData.correct ? "rgba(16, 185, 129, 0.1)" : ""
                                }}
                            >
                                {opt}
                            </Button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="ghost" disabled={step === 1} onClick={() => { setStep(s => s - 1); setQuizAnswer(null); }}>Anterior</Button>
                        {step === 1 ? (
                            <Button disabled={quizAnswer !== currentData.correct} onClick={() => { setStep(s => s + 1); setQuizAnswer(null); }}>Continuar <ChevronRight size={18} /></Button>
                        ) : (
                            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                <Button style={{ background: '#10b981' }} disabled={quizAnswer !== currentData.correct}><CheckCircle2 size={18} /> Finalizar Unidad</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default InferenceLogic;
