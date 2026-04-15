// src/pages/BooleanAlgebra.jsx
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
        <div className="boolean-container fade-in">
            {/* Header */}
            <header className="boolean-header">
                <div className="boolean-header-left">
                    <h1 className="boolean-title">
                        Unidad 5: <span className="text-gradient">Arquitectura Lógica</span>
                    </h1>
                    <p className="boolean-subtitle">
                        Del pensamiento binario al hardware: Álgebra de Boole y Circuitos.
                    </p>
                </div>
                <Link to="/dashboard" className="boolean-back-link">
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
            </header>

            {/* Grid principal de 2 columnas - RESPONSIVE */}
            <div className="boolean-two-column-grid">
                {/* Simulador */}
                <Card className="boolean-simulator-card glass-card" style={{ borderTop: '4px solid #10b981', padding: '2rem' }}>
                    <div className="boolean-simulator-header">
                        <div className="boolean-simulator-icon">
                            <Cpu size={24} />
                        </div>
                        <h3>Simulador de Compuertas</h3>
                    </div>

                    {/* Área de simulación - RESPONSIVE */}
                    <div className="boolean-simulator-area">
                        {/* Inputs */}
                        <div className="boolean-inputs">
                            <div 
                                onClick={() => setInputs({...inputs, A: !inputs.A})}
                                className={`boolean-input-btn ${inputs.A ? 'active' : ''}`}
                            >
                                {inputs.A ? '1' : '0'}
                            </div>
                            {activeGate !== 'NOT' && (
                                <div 
                                    onClick={() => setInputs({...inputs, B: !inputs.B})}
                                    className={`boolean-input-btn ${inputs.B ? 'active' : ''}`}
                                >
                                    {inputs.B ? '1' : '0'}
                                </div>
                            )}
                        </div>

                        {/* Gate Icon */}
                        <div className="boolean-gate-icon">
                            {activeGate}
                        </div>

                        {/* Output */}
                        <div className={`boolean-output ${getResult() ? 'active' : ''}`}>
                            {getResult() ? '1' : '0'}
                        </div>
                    </div>

                    <p className="boolean-simulator-hint">
                        Interactúa con los interruptores de entrada (0/1) para ver cómo la compuerta <strong>{activeGate}</strong> procesa la señal.
                    </p>
                </Card>

                {/* Theory & Controls */}
                <div className="boolean-controls-side">
                    {/* Selector de compuertas */}
                    <Card className="boolean-gates-card" style={{ borderTop: '4px solid var(--brand-secondary)' }}>
                        <h4 className="boolean-section-title">Seleccionar Compuerta</h4>
                        <div className="boolean-gates-grid">
                            {['AND', 'OR', 'NOT', 'XOR'].map(gate => (
                                <Button 
                                    key={gate}
                                    variant={activeGate === gate ? 'primary' : 'secondary'}
                                    onClick={() => setActiveGate(gate)}
                                    className="boolean-gate-btn"
                                >
                                    Logica {gate}
                                </Button>
                            ))}
                        </div>
                    </Card>

                    {/* Info Karnaugh */}
                    <Card className="boolean-karnaugh-card" style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid #10b981' }}>
                        <h4 className="boolean-karnaugh-title">Optimización: Mapas de Karnaugh</h4>
                        <p className="boolean-karnaugh-description">
                            Los Mapas de Karnaugh son una herramienta gráfica utilizada para simplificar funciones booleanas, reduciendo la cantidad de compuertas necesarias en un circuito físico.
                        </p>
                        <ul className="boolean-karnaugh-list">
                            <li>Agrupación de unos en potencias de 2.</li>
                            <li>Eliminación de variables que cambian.</li>
                            <li>Minimización de hardware.</li>
                        </ul>
                    </Card>
                </div>
            </div>

            {/* Enlace a práctica adicional */}
            <div className="boolean-practice-link">
                <Link to="/logica" style={{ textDecoration: 'none' }}>
                    <Card className="boolean-practice-card" style={{ border: '1px solid var(--brand-primary)' }}>
                        <div className="boolean-practice-content">
                            <Activity size={24} color="var(--brand-primary)" />
                            <div>
                                <h4 className="boolean-practice-title">Practicar con Tablas de Verdad Completas</h4>
                                <p className="boolean-practice-desc">Usa el evaluador algorítmico para verificar funciones complejas.</p>
                            </div>
                        </div>
                        <ChevronRight size={20} color="var(--brand-primary)" className="boolean-practice-arrow" />
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default BooleanAlgebra;