import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Table2, ArrowLeft, ArrowRight, CheckCircle2, Info, BrainCircuit, GraduationCap } from 'lucide-react';

const STEPS = [
    { title: "Introducción a la Lógica", icon: 'graduation', content: 'intro' },
    { title: "Conectivos Lógicos (Parte 1)", icon: 'brain', content: 'connectives1' },
    { title: "Conectivos Lógicos (Parte 2)", icon: 'brain', content: 'connectives2' },
    { title: "Condicional y Bicondicional", icon: 'info', content: 'conditional' },
    { title: "Tablas de Verdad", icon: 'table', content: 'truthtables' },
    { title: "Tautologías y Contradicciones", icon: 'check', content: 'tautologies' },
    { title: "Leyes Lógicas", icon: 'book', content: 'laws' },
];

const ICON_MAP = {
    graduation: GraduationCap,
    brain: BrainCircuit,
    info: Info,
    table: Table2,
    check: CheckCircle2,
    book: BookOpen,
};

const StepContent = ({ contentKey }) => {
    switch (contentKey) {
        case 'intro':
            return (
                <div className="animate-fade-up lesson-content">
                    <p>La <strong style={{ color: 'var(--accent-primary)' }}>Lógica Matemática</strong> es la disciplina que trata los métodos de razonamiento. En el nivel más básico, nos permite determinar si un razonamiento es válido o no.</p>

                    <div className="video-responsive">
                        <iframe
                            src="https://www.youtube.com/embed/vKe0UKSpNQQ?si=Z8oZC40P9ZtUVPS8"
                            title="Introducción a la Lógica"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    <div className="proposition-display">
                        <strong>Definición:</strong> Una <strong>proposición</strong> es una oración que puede ser verdadera (V) o falsa (F), pero no ambas a la vez.
                    </div>
                </div>
            );
        case 'connectives1':
            return (
                <div className="animate-fade-up lesson-content">
                    <p>Los conectivos permiten unir proposiciones simples para crear estructuras más complejas.</p>

                    <div className="video-responsive">
                        <iframe
                            src="https://www.youtube.com/embed/9X5E9T3S7r0"
                            title="Conectivos Lógicos"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    <div className="connective-grid">
                        <div className="connective-card">
                            <h4>¬ Negación (NOT)</h4>
                            <p>Cambia el valor de verdad. Si <strong>p</strong> es V, entonces <strong>¬p</strong> es F.</p>
                        </div>
                        <div className="connective-card">
                            <h4>∧ Conjunción (AND)</h4>
                            <p>Solo es verdadera cuando <strong>ambas</strong> proposiciones son verdaderas.</p>
                        </div>
                    </div>
                </div>
            );
        case 'connectives2':
            return (
                <div className="animate-fade-up lesson-content">
                    <p>Otros conectivos importantes:</p>
                    <div className="connective-grid" style={{ marginTop: '1.5rem' }}>
                        <div className="connective-card">
                            <h4>∨ Disyunción (OR)</h4>
                            <p>Es verdadera si al menos <strong>una</strong> de las partes lo es.</p>
                        </div>
                        <div className="connective-card">
                            <h4>⊻ Disyunción Exclusiva (XOR)</h4>
                            <p>Verdadera si <strong>solo una</strong> es verdadera. No ambas.</p>
                        </div>
                    </div>
                </div>
            );
        case 'conditional':
            return (
                <div className="animate-fade-up lesson-content">
                    <p>Conectivos de condición y consecuencia:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.2rem' }}>
                        <div className="connective-card accent">
                            <h4>→ Condicional (Si... entonces)</h4>
                            <p><strong>p → q</strong>: Solo es falsa cuando el antecedente (p) es Verdadero y el consecuente (q) es Falso.</p>
                        </div>
                        <div className="connective-card accent">
                            <h4>↔ Bicondicional (Si y solo si)</h4>
                            <p><strong>p ↔ q</strong>: Es verdadera cuando ambas tienen el <strong>mismo</strong> valor (ambas V o ambas F).</p>
                        </div>
                    </div>
                </div>
            );
        case 'truthtables':
            return (
                <div className="animate-fade-up lesson-content">
                    <p>Para construir una tabla, calculamos todas las combinaciones posibles (2<sup>n</sup> filas).</p>

                    <div className="video-responsive">
                        <iframe
                            src="https://www.youtube.com/embed/vH8lP8NWh2E"
                            title="Tablas de Verdad"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>P</th>
                                    <th>Q</th>
                                    <th>¬P</th>
                                    <th>P ∧ Q</th>
                                    <th>P → Q</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td className="truth-v">V</td><td className="truth-v">V</td><td className="truth-f">F</td><td className="truth-v">V</td><td className="truth-v">V</td></tr>
                                <tr><td className="truth-v">V</td><td className="truth-f">F</td><td className="truth-f">F</td><td className="truth-f">F</td><td className="truth-f">F</td></tr>
                                <tr><td className="truth-f">F</td><td className="truth-v">V</td><td className="truth-v">V</td><td className="truth-f">F</td><td className="truth-v">V</td></tr>
                                <tr><td className="truth-f">F</td><td className="truth-f">F</td><td className="truth-v">V</td><td className="truth-f">F</td><td className="truth-v">V</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case 'tautologies':
            return (
                <div className="animate-fade-up lesson-content">
                    <p>Clasificación de resultados en tablas de verdad:</p>
                    <ul className="concept-list">
                        <li className="concept-item tautology">
                            <strong>TAUTOLOGÍA:</strong> Todos los valores finales son <strong>VERDADEROS</strong>.
                        </li>
                        <li className="concept-item contradiction">
                            <strong>CONTRADICCIÓN:</strong> Todos los valores finales son <strong>FALSOS</strong>.
                        </li>
                        <li className="concept-item contingency">
                            <strong>CONTINGENCIA:</strong> Mezcla de Verdaderos y Falsos.
                        </li>
                    </ul>
                </div>
            );
        case 'laws':
            return (
                <div className="animate-fade-up lesson-content">
                    <p>Leyes fundamentales de la lógica:</p>
                    <div className="proposition-display">
                        <strong>Leyes de De Morgan:</strong><br />
                        <span style={{ color: 'var(--accent-primary)' }}>1.</span> ¬(p ∧ q) ≡ ¬p ∨ ¬q<br />
                        <span style={{ color: 'var(--accent-primary)' }}>2.</span> ¬(p ∨ q) ≡ ¬p ∧ ¬q
                    </div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Estas leyes permiten simplificar proposiciones complejas y resolver ejercicios avanzados de razonamiento matemático.</p>
                </div>
            );
        default:
            return null;
    }
};

const LogicLesson = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const step = STEPS[currentStep];
    const IconComponent = ICON_MAP[step.icon];
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    const goBack = useCallback(() => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    }, []);

    const goForward = useCallback(() => {
        setCurrentStep(prev => prev + 1);
    }, []);

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <Link to="/dashboard" className="back-link">
                <ArrowLeft size={16} /> Volver al Panel
            </Link>

            <div className="card animate-fade-up" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}>
                <div className="lesson-header">
                    <div className="module-icon">
                        <IconComponent size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--brand-indigo)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                            Módulo Académico • Paso {currentStep + 1} de {STEPS.length}
                        </div>
                        <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>{step.title}</h2>
                    </div>
                </div>

                <div className="progress-bar-container" style={{ margin: '0 0 2.5rem 0', height: '4px' }}>
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>

                <div style={{ flex: 1 }}>
                    <StepContent contentKey={step.content} />
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '3rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border-subtle)'
                }}>
                    <button
                        className="btn-secondary"
                        onClick={goBack}
                        disabled={currentStep === 0}
                    >
                        Anterior
                    </button>

                    {currentStep < STEPS.length - 1 ? (
                        <button
                            className="btn-primary"
                            onClick={goForward}
                        >
                            Siguiente <ArrowRight size={16} />
                        </button>
                    ) : (
                        <Link to="/logica" style={{ textDecoration: 'none' }}>
                            <button className="btn-success" style={{ background: 'var(--semantic-success)', border: 'none' }}>
                                <CheckCircle2 size={16} /> Iniciar Evaluación
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                {STEPS.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: i === currentStep ? 'var(--brand-indigo)' : i < currentStep ? 'var(--semantic-success)' : 'var(--border-strong)',
                            opacity: i === currentStep ? 1 : 0.4,
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default LogicLesson;
