import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowLeft, Binary, Cpu, Zap, CheckCircle2, 
    Award, ShieldCheck, ChevronRight, Activity
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const BooleanAlgebra = () => {
    const [activeGate, setActiveGate] = useState('AND');
    const [inputs, setInputs] = useState({ A: false, B: false });

    const gates = {
        AND: (a, b) => a && b,
        OR: (a, b) => a || b,
        NOT: (a) => !a,
        XOR: (a, b) => a !== b
    };

    const getResult = () => {
        if (activeGate === 'NOT') return gates.NOT(inputs.A);
        return gates[activeGate](inputs.A, inputs.B);
    };

    return (
        <div className="container fade-in" style={{ maxWidth: '1000px' }}>
            <header className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                     <h1 className="mb-2">Unidad 5: <span className="text-gradient">Arquitectura Lógica</span></h1>
                     <p style={{ color: 'var(--text-secondary)' }}>Del pensamiento binario al hardware: Álgebra de Boole y Circuitos.</p>
                </div>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
            </header>

            <div className="two-column-grid">
                <Card className="glass-card" style={{ borderTop: '4px solid #10b981', padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
                            <Cpu size={24} />
                        </div>
                        <h3>Simulador de Compuertas</h3>
                    </div>

                    <div style={{ 
                        background: 'var(--bg-secondary)', 
                        padding: '3rem', 
                        borderRadius: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '2rem',
                        marginBottom: '2rem',
                        position: 'relative',
                        border: '1px solid var(--border-default)'
                    }}>
                        {/* Inputs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div 
                                onClick={() => setInputs({...inputs, A: !inputs.A})}
                                style={{ 
                                    width: '40px', height: '40px', borderRadius: '50%', 
                                    background: inputs.A ? '#10b981' : 'var(--bg-surface)',
                                    border: '2px solid var(--border-default)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 900, boxShadow: inputs.A ? '0 0 15px #10b98166' : 'none'
                                }}
                            >
                                {inputs.A ? '1' : '0'}
                            </div>
                            {activeGate !== 'NOT' && (
                                <div 
                                    onClick={() => setInputs({...inputs, B: !inputs.B})}
                                    style={{ 
                                        width: '40px', height: '40px', borderRadius: '50%', 
                                        background: inputs.B ? '#10b981' : 'var(--bg-surface)',
                                        border: '2px solid var(--border-default)', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 900, boxShadow: inputs.B ? '0 0 15px #10b98166' : 'none'
                                    }}
                                >
                                    {inputs.B ? '1' : '0'}
                                </div>
                            )}
                        </div>

                        {/* Gate Icon */}
                        <div style={{ 
                            padding: '2rem', background: 'var(--brand-primary)', borderRadius: '16px', color: 'white',
                            fontSize: '1.5rem', fontWeight: 900, minWidth: '100px', textAlign: 'center'
                        }}>
                            {activeGate}
                        </div>

                        {/* Output */}
                        <div style={{ 
                            width: '60px', height: '60px', borderRadius: '12px',
                            background: getResult() ? '#10b981' : 'var(--bg-surface)',
                            border: '2px solid var(--border-default)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', fontWeight: 900, color: getResult() ? 'white' : 'var(--text-muted)',
                            boxShadow: getResult() ? '0 0 30px #10b98144' : 'none',
                            transition: 'all 0.3s'
                        }}>
                            {getResult() ? '1' : '0'}
                        </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                        Interactúa con los interruptores de entrada (0/1) para ver cómo la compuerta <strong>{activeGate}</strong> procesa la señal.
                    </p>
                </Card>

                {/* Theory & Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card style={{ borderTop: '4px solid var(--brand-secondary)' }}>
                        <h4 className="mb-4">Seleccionar Compuerta</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {['AND', 'OR', 'NOT', 'XOR'].map(gate => (
                                <Button 
                                    key={gate}
                                    variant={activeGate === gate ? 'primary' : 'secondary'}
                                    onClick={() => setActiveGate(gate)}
                                    style={{ padding: '1rem' }}
                                >
                                    Logica {gate}
                                </Button>
                            ))}
                        </div>
                    </Card>

                    <Card style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid #10b981' }}>
                        <h4 className="mb-2">Optimización: Mapas de Karnaugh</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Los Mapas de Karnaugh son una herramienta gráfica utilizada para simplificar funciones booleanas, reduciendo la cantidad de compuertas necesarias en un circuito físico.
                        </p>
                        <ul style={{ fontSize: '0.75rem', marginTop: '1rem', paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                            <li>Agrupación de unos en potencias de 2.</li>
                            <li>Eliminación de variables que cambian.</li>
                            <li>Minimización de hardware.</li>
                        </ul>
                    </Card>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <Link to="/logica" style={{ textDecoration: 'none' }}>
                    <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid var(--brand-primary)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                             <Activity size={24} color="var(--brand-primary)" />
                             <div>
                                 <h4 style={{ margin: 0 }}>Practicar con Tablas de Verdad Completas</h4>
                                 <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Usa el evaluador algorítmico para verificar funciones complejas.</p>
                             </div>
                        </div>
                        <ChevronRight size={20} color="var(--brand-primary)" />
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default BooleanAlgebra;
