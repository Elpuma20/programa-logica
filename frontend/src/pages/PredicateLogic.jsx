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
        <div className="container fade-in" style={{ maxWidth: '900px' }}>
            <header className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                     <h1 className="mb-2">Unidad 3: <span className="text-gradient">Lógica</span> de Predicados</h1>
                     <p style={{ color: 'var(--text-secondary)' }}>Más allá de las proposiciones simples: cuantificadores y variables.</p>
                </div>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
                {/* Content Area */}
                <Card style={{ borderTop: '4px solid #f43f5e', padding: '2rem' }}>
                    {step === 1 ? (
                        <div className="fade-in">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '0.75rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '12px', color: '#f43f5e' }}>
                                    <BookOpen size={24} />
                                </div>
                                <h3>Módulo 1: Cuantificador Universal (∀)</h3>
                            </div>
                            
                            <p className="mb-4">El cuantificador universal se representa con el símbolo <strong>∀</strong> (una 'A' invertida por "All" en inglés) y se lee como "Para todo..." o "Para cada...".</p>
                            
                            <Card style={{ background: 'var(--bg-secondary)', marginBottom: '2rem' }}>
                                <p style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>EJEMPLO FORMAL:</p>
                                <code style={{ fontSize: '1.25rem', color: '#f43f5e' }}>∀x [ Humano(x) → Mortal(x) ]</code>
                                <p className="mt-2" style={{ fontSize: '0.9rem' }}>Traducción: "Para todo x, si x es humano, entonces x es mortal".</p>
                            </Card>

                            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', borderLeft: '4px solid #f43f5e' }}>
                                <h4 className="mb-2">¿Cuándo es Verdadero?</h4>
                                <p style={{ fontSize: '0.9rem' }}>Es verdadero solo si la propiedad se cumple para <strong>absolutamente todos</strong> los elementos del conjunto bajo estudio.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="fade-in">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '0.75rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '12px', color: '#f43f5e' }}>
                                    <Zap size={24} />
                                </div>
                                <h3>Módulo 2: Cuantificador Existencial (∃)</h3>
                            </div>
                            
                            <p className="mb-4">El cuantificador existencial se representa con el símbolo <strong>∃</strong> (una 'E' invertida por "Existential") y se lee como "Existe un..." o "Hay al menos un...".</p>
                            
                            <Card style={{ background: 'var(--bg-secondary)', marginBottom: '2rem' }}>
                                <p style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>EJEMPLO FORMAL:</p>
                                <code style={{ fontSize: '1.25rem', color: '#f43f5e' }}>∃x [ Estudiante(x) ∧ Sobresaliente(x) ]</code>
                                <p className="mt-2" style={{ fontSize: '0.9rem' }}>Traducción: "Existe al menos un x tal que x es estudiante y x es sobresaliente".</p>
                            </Card>

                            <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', borderLeft: '4px solid #f43f5e' }}>
                                <h4 className="mb-2">¿Cuándo es Verdadero?</h4>
                                <p style={{ fontSize: '0.9rem' }}>Es verdadero si podemos encontrar <strong>al menos un ejemplo</strong> que cumpla la condición. No importa si los demás no la cumplen.</p>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-default)', textAlign: 'center' }}>
                         <p className="mb-4" style={{ fontWeight: 700 }}>{questions[step]?.q}</p>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            {questions[step]?.options.map((opt, i) => (
                                <Button 
                                    key={i} 
                                    variant={quizAnswer === i ? (i === questions[step].correct ? "primary" : "secondary") : "secondary"}
                                    onClick={() => handleQuiz(i)}
                                    style={{ 
                                        borderColor: quizAnswer === i ? (i === questions[step].correct ? "#10b981" : "#ef4444") : "var(--border-default)",
                                        background: quizAnswer === i && i === questions[step].correct ? "rgba(16, 185, 129, 0.1)" : ""
                                    }}
                                >
                                    {opt}
                                </Button>
                            ))}
                         </div>
                         
                         {quizAnswer !== null && (
                             <div className="fade-in mb-4">
                                {quizAnswer === questions[step].correct ? 
                                    <Badge variant="success">¡Correcto! Has captado la esencia lógica.</Badge> : 
                                    <Badge variant="primary">Inténtalo de nuevo, revisa la teoría.</Badge>
                                }
                             </div>
                         )}

                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="ghost" disabled={step === 1} onClick={() => { setStep(s => s - 1); setQuizAnswer(null); }}>Anterior</Button>
                            {step === 1 ? (
                                <Button onClick={() => { setStep(s => s + 1); setQuizAnswer(null); }}>Continuar ∃</Button>
                            ) : (
                                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                    <Button style={{ background: '#10b981' }}><Award size={18} /> Finalizar Módulo</Button>
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
