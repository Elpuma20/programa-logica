import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
    BookOpen, Table2, ArrowLeft, ArrowRight, CheckCircle2, 
    Info, BrainCircuit, GraduationCap, XCircle, HelpCircle, 
    ChevronRight, Award, Zap, RotateCcw
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const LESSON_DATA = [
    {
        id: 'intro',
        title: "Fundamentación Lógica",
        icon: GraduationCap,
        theory: (
            <div className="fade-in">
                <p className="mb-4">La <strong>Lógica Proposicional</strong> es la rama de la matemática que estudia las proposiciones y las relaciones que existen entre ellas. Es el "lenguaje del pensamiento" formalizado.</p>
                <Card style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid var(--brand-primary)', marginBottom: '1.5rem' }}>
                    <h4 className="mb-2">¿Qué es una Proposición?</h4>
                    <p style={{ fontSize: '0.9rem' }}>Es una oración o enunciado del cual se puede afirmar, sin ambigüedad, que es <strong>Verdadero (V)</strong> o <strong>Falso (F)</strong>, pero nunca ambos a la vez.</p>
                </Card>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
                        <span style={{ color: '#10b981', fontWeight: 800 }}>EJEMPLOS:</span>
                        <ul style={{ fontSize: '0.8rem', paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                            <li>"Hoy es lunes."</li>
                            <li>"El número 2 es par."</li>
                            <li>"3 + 5 es igual a 10."</li>
                        </ul>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
                        <span style={{ color: '#ef4444', fontWeight: 800 }}>NO SON PROPOSICIONES:</span>
                        <ul style={{ fontSize: '0.8rem', paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                            <li>"¡Cierra la puerta!" (Orden)</li>
                            <li>"¿Cómo estás?" (Pregunta)</li>
                            <li>"Él es alto." (Vago)</li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
        exercises: [
            { q: "¿Cuál de estos es una proposición?", options: ["¡Hola!", "Hoy está lloviendo.", "¿Qué hora es?", "Haz tu tarea."], a: 1 },
            { q: "Si digo '2 es un número primo', ¿es una proposición?", options: ["No, porque es falso.", "Sí, aunque fuera falso.", "Depende del contexto.", "Solo si es verdadero."], a: 1 },
            { q: "¿Puede una proposición ser V y F al mismo tiempo?", options: ["Sí, en lógica cuántica.", "No, por el principio de no contradicción.", "A veces.", "Solo en oraciones complejas."], a: 1 }
        ]
    },
    {
        id: 'negation_conjunction',
        title: "Conectivos I: AND y NOT",
        icon: BrainCircuit,
        theory: (
            <div className="fade-in">
                <p className="mb-4">Los conectivos lógicos nos permiten construir proposiciones compuestas a partir de simples.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    <Card style={{ background: 'var(--bg-secondary)' }}>
                        <h4 style={{ color: 'var(--brand-primary)' }}>1. La Negación (¬p)</h4>
                        <p style={{ fontSize: '0.9rem' }}>Invierte el valor de verdad. Si p es V, ¬p es F. En lenguaje natural se usa el prefijo "No", "No es cierto que".</p>
                    </Card>
                    <Card style={{ background: 'var(--bg-secondary)' }}>
                        <h4 style={{ color: 'var(--brand-primary)' }}>2. La Conjunción (p ∧ q)</h4>
                        <p style={{ fontSize: '0.9rem' }}>Se asocia con la palabra "y". Una conjunción es <strong>Verdadera</strong> ÚNICAMENTE cuando ambas proposiciones son verdaderas. Si una falla, todo el conjunto es Falso.</p>
                    </Card>
                </div>
                <div className="table-wrapper">
                    <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                        <thead><tr style={{ borderBottom: '2px solid var(--border-default)' }}><th style={{ padding: '0.5rem' }}>P</th><th style={{ padding: '0.5rem' }}>Q</th><th style={{ padding: '0.5rem' }}>P ∧ Q</th></tr></thead>
                        <tbody>
                            <tr><td style={{ color: '#10b981' }}>V</td><td style={{ color: '#10b981' }}>V</td><td style={{ color: '#10b981', fontWeight: 800 }}>V</td></tr>
                            <tr><td style={{ color: '#10b981' }}>V</td><td style={{ color: '#ef4444' }}>F</td><td style={{ color: '#ef4444', fontWeight: 800 }}>F</td></tr>
                            <tr><td style={{ color: '#ef4444' }}>F</td><td style={{ color: '#10b981' }}>V</td><td style={{ color: '#ef4444', fontWeight: 800 }}>F</td></tr>
                            <tr><td style={{ color: '#ef4444' }}>F</td><td style={{ color: '#ef4444' }}>F</td><td style={{ color: '#ef4444', fontWeight: 800 }}>F</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        ),
        exercises: [
            { q: "Si P es V y Q es F, ¿qué valor tiene P ∧ Q?", options: ["Verdadero", "Falso", "Nulo", "No se puede saber"], a: 1 },
            { q: "¿Cómo se llama el símbolo '¬'?", options: ["Conjunción", "Disyunción", "Negación", "Implicación"], a: 2 },
            { q: "Si ¬P es F, ¿cuál es el valor original de P?", options: ["Falso", "Verdadero", "Indefinido", "Nulo"], a: 1 }
        ]
    },
    {
        id: 'disjunction_xor',
        title: "Conectivos II: OR y XOR",
        icon: BrainCircuit,
        theory: (
            <div className="fade-in">
                <p className="mb-4">Diferenciamos entre la elección inclusiva y la elección exclusiva.</p>
                <div className="feature-grid mb-4">
                    <Card style={{ borderTop: '4px solid var(--brand-secondary)' }}>
                        <h4 className="mb-2">Disyunción Inclusiva (∨)</h4>
                        <p style={{ fontSize: '0.85rem' }}>Es verdadera si al menos UNA de las proposiciones es verdadera. Solo es falsa si ambas son falsas.</p>
                    </Card>
                    <Card style={{ borderTop: '4px solid var(--brand-secondary)' }}>
                        <h4 className="mb-2">Disyunción Exclusiva (⊻)</h4>
                        <p style={{ fontSize: '0.85rem' }}>Es verdadera si UNA Y SOLO UNA es verdadera. Si ambas son verdaderas o ambas falsas, el resultado es Falso.</p>
                    </Card>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                    <p><strong>Ejemplo OR:</strong> "Estudiaré mate o veré una película" (puedo hacer ambas).</p>
                    <p><strong>Ejemplo XOR:</strong> "Eres soltero o eres casado" (no puedes ser ambas).</p>
                </div>
            </div>
        ),
        exercises: [
            { q: "En la Disyunción (OR), ¿cuándo es Falsa la oración?", options: ["Cuando una es V", "Cuando ambas son V", "Cuando ambas son F", "Nunca es falsa"], a: 2 },
            { q: "¿Qué valor tiene (V ⊻ V)?", options: ["Verdadero", "Falso", "Depende del contexto", "Indefinido"], a: 1 },
            { q: "En 'p ∨ q', si p=F y q=V, ¿cuál es el resultado?", options: ["Falso", "Verdadero", "V ∧ F", "Incorrecto"], a: 1 }
        ]
    },
    {
        id: 'conditional',
        title: "Implicación y Bicondicional",
        icon: Info,
        theory: (
            <div className="fade-in">
                <p className="mb-4">Establecemos relaciones de dependencia causal y equivalencia.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    <Card style={{ borderLeft: '4px solid var(--brand-primary)' }}>
                        <h4>Condicional (p → q)</h4>
                        <p style={{ fontSize: '0.9rem' }}>Se lee "Si p, entonces q". Es falsa ÚNICAMENTE cuando el antecedente (p) es Verdadero y el consecuente (q) es Falso.</p>
                    </Card>
                    <Card style={{ borderLeft: '4px solid var(--brand-secondary)' }}>
                        <h4>Bicondicional (p ↔ q)</h4>
                        <p style={{ fontSize: '0.9rem' }}>Se lee "p si y solo si q". Es verdadera solo cuando ambas proposiciones tienen el mismo valor de verdad.</p>
                    </Card>
                </div>
                <div style={{ padding: '1rem', background: 'var(--accent-light)', borderRadius: '12px' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nota Crítica: En p → q, si el antecedente (p) es Falso, la implicación siempre se considera Verdadera (Vacuidad).</p>
                </div>
            </div>
        ),
        exercises: [
            { q: "¿Cuándo es Falso un Condicional (p → q)?", options: ["V -> V", "V -> F", "F -> V", "F -> F"], a: 1 },
            { q: "El Bicondicional (V ↔ F) resulta en:", options: ["Verdadero", "Falso", "Incongruente", "Indefinido"], a: 1 },
            { q: "Si digo 'Si llueve (V), entonces la calle se moja (V)', ¿es?", options: ["Falso", "Verdadero", "Imposible", "Incierto"], a: 1 }
        ]
    },
    {
        id: 'tables',
        title: "Metodología de Tablas de Verdad",
        icon: Table2,
        theory: (
            <div className="fade-in">
                <p className="mb-4">Las tablas permiten analizar cualquier combinación mecánica de proposiciones.</p>
                <p className="mb-4">Para determinar el número de filas usamos la fórmula: <strong>2<sup>n</sup></strong>, donde <em>n</em> es el número de proposiciones simples (p, q, r, ...).</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <Card style={{ background: 'var(--bg-secondary)', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>2 Proposiciones</div>
                        <div style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>4 Filas</div>
                    </Card>
                    <Card style={{ background: 'var(--bg-secondary)', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>3 Proposiciones</div>
                        <div style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>8 Filas</div>
                    </Card>
                </div>
                <p style={{ fontSize: '0.9rem' }}>Se deben resolver primero los paréntesis, luego las negaciones, y finalmente los conectivos principales.</p>
            </div>
        ),
        exercises: [
            { q: "¿Cuántas filas tiene una tabla con 3 proposiciones (p, q, r)?", options: ["4", "6", "8", "16"], a: 2 },
            { q: "¿Cuál es la fórmula para determinar el número de filas?", options: ["2n", "n^2", "2^n", "n + 2"], a: 2 },
            { q: "¿Qué se debe resolver primero en una expresión compleja?", options: ["Negaciones", "Paréntesis", "El conectivo final", "Cualquiera"], a: 1 }
        ]
    },
    {
        id: 'tautologies',
        title: "Tautologías y Contradicciones",
        icon: CheckCircle2,
        theory: (
            <div className="fade-in">
                <p className="mb-4">Clasificamos el resultado final de una tabla de verdad desglosando sus valores finales:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
                        <div style={{ fontWeight: 800, width: '120px' }}>TAUTOLOGÍA</div>
                        <div style={{ fontSize: '0.85rem' }}>Todos los valores finales son <strong>Verdaderos</strong>. Representa una verdad lógica universal.</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', borderLeft: '4px solid #ef4444' }}>
                        <div style={{ fontWeight: 800, width: '120px' }}>CONTRADICCIÓN</div>
                        <div style={{ fontSize: '0.85rem' }}>Todos los valores finales son <strong>Falsos</strong>. Representa una falsedad inherente.</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '16px', borderLeft: '4px solid #2563eb' }}>
                        <div style={{ fontWeight: 800, width: '120px' }}>CONTINGENCIA</div>
                        <div style={{ fontSize: '0.85rem' }}>Existe una mezcla de valores Verdaderos y Falsos en la columna final.</div>
                    </div>
                </div>
            </div>
        ),
        exercises: [
            { q: "Si la columna final de una tabla da todo Verdadero, es una:", options: ["Contingencia", "Tautología", "Contradicción", "Falsedad"], a: 1 },
            { q: "Una Contradicción se define por:", options: ["Tener al menos un falso", "Ser siempre falsa", "Tener alternancia", "Ser siempre verdadera"], a: 1 },
            { q: "Si obtengo (V, F, V, V) en el resultado final, ¿qué es?", options: ["Tautología", "Contingencia", "Contradicción", "No es una tabla"], a: 1 }
        ]
    },
    {
        id: 'laws',
        title: "Leyes Lógicas Esenciales",
        icon: BookOpen,
        theory: (
            <div className="fade-in">
                <p className="mb-4">Las leyes lógicas permiten simplificar expresiones complejas sin alterar su valor de verdad.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid var(--brand-secondary)' }}>
                        <h4 className="mb-2">Leyes de De Morgan</h4>
                        <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                            1. ¬(p ∧ q) ≡ ¬p ∨ ¬q <br/>
                            2. ¬(p ∨ q) ≡ ¬p ∧ ¬q
                        </div>
                        <p className="mt-2" style={{ fontSize: '0.8rem' }}>La negación de una conjunción es la disyunción de las negaciones (y viceversa).</p>
                    </Card>
                    <Card style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid var(--brand-secondary)' }}>
                        <h4 className="mb-2">Ley de Absorción</h4>
                        <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                            p ∧ (p ∨ q) ≡ p <br/>
                            p ∨ (p ∧ q) ≡ p
                        </div>
                    </Card>
                </div>
            </div>
        ),
        exercises: [
            { q: "¿Cuál es la ley ¬(p ∧ q) ≡ ¬p ∨ ¬q?", options: ["De Morgan", "Identidad", "Distribución", "Conmutatividad"], a: 0 },
            { q: "¿A qué equivale p ∧ (p ∨ q)?", options: ["q", "p y q", "p", "Verdadero"], a: 2 },
            { q: "La ley de De Morgan sirve para:", options: ["Sumar proposiciones", "Negar estructuras compuestas", "Anular paréntesis", "Cambiar nombres"], a: 1 }
        ]
    }
];

const StepQuiz = ({ exercises, onComplete }) => {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [hasError, setHasError] = useState(false);

    const resetQuiz = () => {
        setCurrent(0);
        setSelected(null);
        setScore(0);
        setFinished(false);
        setFeedback(null);
        setHasError(false);
    };

    const handleAnswer = (idx) => {
        if (feedback) return;
        setSelected(idx);
        const correct = idx === exercises[current].a;
        if (correct) {
            setScore(s => s + 1);
            setFeedback('correct');
        } else {
            setFeedback('wrong');
            setHasError(true);
        }

        setTimeout(() => {
            if (current + 1 < exercises.length) {
                setCurrent(c => c + 1);
                setSelected(null);
                setFeedback(null);
            } else {
                setFinished(true);
            }
        }, 800);
    };

    if (finished) {
        const passed = score === exercises.length;
        if (passed) onComplete();
        
        return (
            <div className="fade-in" style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                <Award size={48} color={passed ? "#10b981" : "#ef4444"} className="mb-4" />
                <h3 className="mb-2">{passed ? "¡Evaluación Superada!" : "Revisión Necesaria"}</h3>
                <p className="mb-4">Has acertado {score} de {exercises.length} ejercicios.</p>
                <Button onClick={resetQuiz} variant={passed ? "secondary" : "primary"}>
                    {passed ? "Practicar de Nuevo" : "Reintentar Nivel"}
                </Button>
                {passed && <p className="mt-4" style={{ color: '#10b981', fontWeight: 800, fontSize: '0.85rem' }}>Módulo validado. Puedes avanzar.</p>}
            </div>
        );
    }

    const ex = exercises[current];

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <HelpCircle size={20} color="var(--brand-primary)" /> Desafío {current + 1}/{exercises.length}
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {hasError && (
                        <Button variant="ghost" onClick={resetQuiz} style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>
                            <RotateCcw size={12} /> Reiniciar
                        </Button>
                    )}
                    <Badge variant="primary">{current + 1}/{exercises.length}</Badge>
                </div>
            </div>
            <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ width: `${((current + 1) / exercises.length) * 100}%`, height: '100%', background: 'var(--brand-primary)', transition: 'width 0.3s ease' }}></div>
            </div>
            <p className="mb-4" style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.4 }}>{ex.q}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ex.options.map((opt, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleAnswer(i)}
                        style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderRadius: '12px',
                            border: `2px solid ${selected === i ? (feedback === 'correct' ? '#10b981' : '#ef4444') : 'var(--border-default)'}`,
                            background: selected === i ? (feedback === 'correct' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--bg-surface)',
                            cursor: feedback ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            fontWeight: 600,
                            color: selected === i ? (feedback === 'correct' ? '#10b981' : '#ef4444') : 'var(--text-primary)'
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

const LogicLesson = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isQuizPassed, setIsQuizPassed] = useState(false);
    const [showBlockError, setShowBlockError] = useState(false);
    const [shakeQuiz, setShakeQuiz] = useState(false);
    const step = LESSON_DATA[currentStep];
    const progress = ((currentStep + 1) / LESSON_DATA.length) * 100;

    const handleStepChange = (dir) => {
        if (dir > 0 && !isQuizPassed) {
            setShowBlockError(true);
            setShakeQuiz(true);
            setTimeout(() => setShakeQuiz(false), 500);
            return;
        }

        const next = currentStep + dir;
        if (next >= 0 && next < LESSON_DATA.length) {
            setCurrentStep(next);
            setIsQuizPassed(false);
            setShowBlockError(false);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="container fade-in" style={{ maxWidth: '900px' }}>
            <header className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {LESSON_DATA.map((_, i) => (
                        <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i <= currentStep ? 'var(--brand-primary)' : 'var(--bg-secondary)', transition: 'all 0.3s' }}></div>
                    ))}
                </div>
            </header>

            <div className="two-column-grid">
                <Card className="glass-card" style={{ minHeight: '600px', borderTop: '4px solid var(--brand-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--accent-light)', borderRadius: '16px', color: 'var(--brand-primary)' }}>
                            <step.icon size={28} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{step.title}</p>
                            <h2 className="text-gradient">Lógica Proposicional</h2>
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        {step.theory}
                    </div>

                    <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="secondary" disabled={currentStep === 0} onClick={() => handleStepChange(-1)}>Anterior</Button>
                        {currentStep < LESSON_DATA.length - 1 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                <Button onClick={() => handleStepChange(1)}>Continuar <ArrowRight size={18} /></Button>
                                {showBlockError && (
                                    <span className="fade-in" style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
                                        Completa el desafío para avanzar
                                    </span>
                                )}
                            </div>
                        ) : (
                            <Link to="/logica" style={{ textDecoration: 'none' }}>
                                <Button style={{ background: '#10b981' }} onClick={(e) => {
                                    if (!isQuizPassed) {
                                        e.preventDefault();
                                        handleStepChange(1);
                                    }
                                }}><CheckCircle2 size={18} /> Certificar</Button>
                            </Link>
                        )}
                    </div>
                </Card>

                <div className={`glass-card ${shakeQuiz ? 'shake' : ''}`} style={{ position: 'sticky', top: '100px', border: showBlockError ? '2px solid #ef4444' : 'none' }}>
                    <Card style={{ borderTop: '4px solid var(--brand-secondary)' }}>
                        {!isQuizPassed ? (
                            <StepQuiz exercises={step.exercises} onComplete={() => setIsQuizPassed(true)} />
                        ) : (
                            <div className="fade-in" style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ 
                                    width: '60px', height: '60px', borderRadius: '50%', 
                                    background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 1rem'
                                }}>
                                    <CheckCircle2 size={32} />
                                </div>
                                <h4>Paso Validado</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Has completado satisfactoriamente los ejercicios de este nivel.</p>
                                <Button variant="secondary" onClick={() => setIsQuizPassed(false)} style={{ width: '100%' }}>Reintentar Práctica</Button>
                            </div>
                        )}
                    </Card>
                    
                    <Card className="mt-4" style={{ background: 'var(--bg-secondary)', border: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Zap size={20} color="var(--brand-primary)" />
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Tip de Estudio</div>
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                            Resuelve los ejercicios de la derecha para desbloquear el avance a la siguiente lección teórica.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LogicLesson;
