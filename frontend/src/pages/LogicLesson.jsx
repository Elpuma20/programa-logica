import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Table2, ArrowLeft, ArrowRight, CheckCircle2, Info, BrainCircuit, GraduationCap } from 'lucide-react';

const LogicLesson = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Introducción a la Lógica",
            icon: <GraduationCap className="text-primary" size={40} />,
            content: (
                <div className="animate-fade-up">
                    <p className="mb-4">La <strong>Lógica Matemática</strong> es la disciplina que trata los métodos de razonamiento. En el nivel más básico, nos permite determinar si un razonamiento es válido o no.</p>

                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', marginBottom: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                        <iframe
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            src="https://www.youtube.com/embed/PFY7He9SjtQ"
                            title="Introducción a la Lógica"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div className="proposition-display">
                        Una <strong>proposición</strong> es una oración que puede ser verdadera (V) o falsa (F), pero no ambas a la vez.
                    </div>
                </div>
            )
        },
        {
            title: "Conectivos Lógicos (Parte 1)",
            icon: <BrainCircuit className="text-primary" size={40} />,
            content: (
                <div className="animate-fade-up">
                    <p>Los conectivos permiten unir proposiciones simples para crear estructuras más complejas.</p>

                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', margin: '1.5rem 0', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                        <iframe
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            src="https://www.youtube.com/embed/9X5E9T3S7r0"
                            title="Conectivos Lógicos"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--primary)' }}>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>¬ Negación (NOT)</h4>
                            <p style={{ fontSize: '0.9rem' }}>Cambia el valor de verdad. Si <strong>p</strong> es V, entonces <strong>¬p</strong> es F.</p>
                        </div>
                        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--primary)' }}>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>∧ Conjunción (AND)</h4>
                            <p style={{ fontSize: '0.9rem' }}>Solo es verdadera cuando <strong>ambas</strong> proposiciones son verdaderas.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Conectivos Lógicos (Parte 2)",
            icon: <BrainCircuit className="text-primary" size={40} />,
            content: (
                <div className="animate-fade-up">
                    <p>Continuamos con los conectivos que definen decisiones y condiciones:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--primary)' }}>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>∨ Disyunción (OR)</h4>
                            <p style={{ fontSize: '0.9rem' }}>Es verdadera si al menos <strong>una</strong> de las partes lo es.</p>
                        </div>
                        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--primary)' }}>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>⊻ Disyunción Exclusiva</h4>
                            <p style={{ fontSize: '0.9rem' }}>Verdadera si <strong>solo una</strong> es verdadera. No ambas.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "El Condicional y Bicondicional",
            icon: <Info className="text-primary" size={40} />,
            content: (
                <div className="animate-fade-up">
                    <p>Estos conectivos representan relaciones de causa y efecto:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.2rem' }}>
                        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent)' }}>
                            <h4 style={{ color: 'var(--accent)', marginBottom: '0.4rem' }}>→ Condicional (Si... entonces)</h4>
                            <p style={{ fontSize: '0.9rem' }}><strong>p → q</strong>: Solo es falsa cuando el antecedente (p) es Verdadero y el consecuente (q) es Falso.</p>
                        </div>
                        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent)' }}>
                            <h4 style={{ color: 'var(--accent)', marginBottom: '0.4rem' }}>↔ Bicondicional (Si y solo si)</h4>
                            <p style={{ fontSize: '0.9rem' }}><strong>p ↔ q</strong>: Es verdadera cuando ambas tienen el <strong>mismo</strong> valor (ambas V o ambas F).</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Tablas de Verdad Masterclass",
            icon: <Table2 className="text-primary" size={40} />,
            content: (
                <div className="animate-fade-up">
                    <p>Para construir una tabla, calculamos todas las combinaciones posibles (2^n filas).</p>

                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', margin: '1.5rem 0', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                        <iframe
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            src="https://www.youtube.com/embed/vH8lP8NWh2E"
                            title="Tablas de Verdad"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <table style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', fontSize: '0.9rem' }}>
                            <thead>
                                <tr>
                                    <th>p</th>
                                    <th>q</th>
                                    <th>¬p</th>
                                    <th>p ∧ q</th>
                                    <th>p → q</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>V</td><td>V</td><td>F</td><td style={{ fontWeight: 'bold' }}>V</td><td style={{ fontWeight: 'bold' }}>V</td></tr>
                                <tr><td>V</td><td>F</td><td>F</td><td>F</td><td style={{ color: 'var(--error)', fontWeight: 'bold' }}>F</td></tr>
                                <tr><td>F</td><td>V</td><td>V</td><td>F</td><td style={{ fontWeight: 'bold' }}>V</td></tr>
                                <tr><td>F</td><td>F</td><td>V</td><td>F</td><td style={{ fontWeight: 'bold' }}>V</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        },
        {
            title: "Tautologías y Contradicciones",
            icon: <CheckCircle2 className="text-primary" size={40} />,
            content: (
                <div className="animate-fade-up">
                    <p>Al final de una tabla de verdad, podemos encontrar tres resultados posibles:</p>
                    <ul style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem', listStyle: 'none', padding: 0 }}>
                        <li style={{ background: '#f0fff4', padding: '1rem', borderRadius: '8px', border: '1px solid #c6f6d5' }}>
                            <strong>🌟 Tautología:</strong> Cuando todos los valores finales son <strong>Verdaderos</strong>.
                        </li>
                        <li style={{ background: '#fff5f5', padding: '1rem', borderRadius: '8px', border: '1px solid #fed7d7' }}>
                            <strong>❌ Contradicción:</strong> Cuando todos los valores finales son <strong>Falsos</strong>.
                        </li>
                        <li style={{ background: '#ebf8ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bee3f8' }}>
                            <strong>❓ Contingencia:</strong> Cuando hay una mezcla de Verdaderos y Falsos.
                        </li>
                    </ul>
                </div>
            )
        },
        {
            title: "Leyes Lógicas Importantes",
            icon: <BookOpen className="text-primary" size={40} />,
            content: (
                <div className="animate-fade-up">
                    <p>Existen reglas que siempre se cumplen en lógica, como las Leyes de De Morgan:</p>
                    <div className="proposition-display" style={{ fontSize: '1rem' }}>
                        1. ¬(p ∧ q) ≡ ¬p ∨ ¬q<br />
                        2. ¬(p ∨ q) ≡ ¬p ∧ ¬q
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Estas leyes son fundamentales para simplificar proposiciones complejas y resolver ejercicios avanzados de razonamiento matemático.</p>
                </div>
            )
        }
    ];

    return (
        <div className="container" style={{ maxWidth: '900px' }}>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 500 }}>
                <ArrowLeft size={18} /> Regresar al Panel
            </Link>

            <div className="card card-animated" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <div className="module-icon" style={{ marginBottom: 0 }}>
                        {steps[currentStep].icon}
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                            Lección {currentStep + 1} de {steps.length}
                        </span>
                        <h2 style={{ margin: 0 }}>{steps[currentStep].title}</h2>
                    </div>
                </div>

                <div style={{ flex: 1, fontSize: '1.1rem' }}>
                    {steps[currentStep].content}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <button
                        className="btn-secondary"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: currentStep === 0 ? 0.5 : 1 }}
                    >
                        <ArrowLeft size={18} /> Anterior
                    </button>

                    {currentStep < steps.length - 1 ? (
                        <button
                            className="btn-primary"
                            onClick={() => setCurrentStep(currentStep + 1)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            Siguiente <ArrowRight size={18} />
                        </button>
                    ) : (
                        <Link to="/logica" style={{ textDecoration: 'none' }}>
                            <button
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success)' }}
                            >
                                <CheckCircle2 size={18} /> ¡Comenzar Ejercicios!
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Progress indicators dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                {steps.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: i === currentStep ? 'var(--primary)' : 'var(--border-dark)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default LogicLesson;
