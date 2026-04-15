// src/pages/SetTheory.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, Info, CheckCircle2, RotateCcw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const SetTheoryLab = () => {
    const [operation, setOperation] = useState('union');

    const operations = {
        union: {
            title: 'Unión (A ∪ B)',
            symbol: '∪',
            desc: 'El conjunto de todos los elementos que están en A, en B, o en ambos.',
            highlight: ['left', 'center', 'right']
        },
        intersection: {
            title: 'Intersección (A ∩ B)',
            symbol: '∩',
            desc: 'El conjunto de todos los elementos que están tanto en A como en B.',
            highlight: ['center']
        },
        difference: {
            title: 'Diferencia (A - B)',
            symbol: '-',
            desc: 'El conjunto de elementos que pertenecen a A pero no a B.',
            highlight: ['left']
        },
        sym_diff: {
            title: 'Diferencia Simétrica (A △ B)',
            symbol: '△',
            desc: 'Elementos que están en A o en B, pero no en ambos.',
            highlight: ['left', 'right']
        }
    };

    const isHighlighted = (part) => operations[operation].highlight.includes(part);

    return (
        <div className="settheory-container fade-in">
            {/* Header */}
            <header className="settheory-header">
                <div className="settheory-header-left">
                    <h1 className="settheory-title">
                        <span className="text-gradient">Teoría</span> de Conjuntos
                    </h1>
                    <p className="settheory-subtitle">
                        Explora el universo de los grupos lógicos y sus interacciones.
                    </p>
                </div>
                <Link to="/dashboard" className="settheory-back-link">
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
            </header>

            {/* Grid principal - 2 columnas responsivo */}
            <div className="settheory-two-column-grid">
                {/* Visualizador de Venn */}
                <Card className="settheory-venn-card" style={{ padding: '2rem', borderTop: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 className="settheory-venn-title" style={{ color: '#8b5cf6' }}>Visualizador de Venn</h3>
                    
                    {/* Diagrama de Venn - RESPONSIVE */}
                    <div className="settheory-venn-diagram">
                        {/* Circle A */}
                        <div className={`settheory-circle-a ${isHighlighted('left') ? 'highlighted' : ''}`}>
                            <span className="settheory-circle-label-a">Conjunto A</span>
                        </div>

                        {/* Intersection Area */}
                        <div className={`settheory-intersection ${isHighlighted('center') ? 'highlighted' : ''}`}></div>

                        {/* Circle B */}
                        <div className={`settheory-circle-b ${isHighlighted('right') ? 'highlighted' : ''}`}>
                            <span className="settheory-circle-label-b">Conjunto B</span>
                        </div>
                    </div>

                    {/* Información de la operación */}
                    <div className="settheory-operation-info">
                        <h4 className="settheory-operation-title" style={{ color: '#8b5cf6' }}>{operations[operation].title}</h4>
                        <p className="settheory-operation-desc">{operations[operation].desc}</p>
                    </div>
                </Card>

                {/* Operaciones y datos curiosos */}
                <div className="settheory-sidebar">
                    {/* Operaciones */}
                    <Card className="settheory-operations-card" style={{ borderTop: '4px solid var(--brand-secondary)' }}>
                        <h4 className="settheory-operations-title">Operaciones Disponibles</h4>
                        <div className="settheory-operations-list">
                            {Object.entries(operations).map(([key, op]) => (
                                <button
                                    key={key}
                                    onClick={() => setOperation(key)}
                                    className={`settheory-operation-btn ${operation === key ? 'active' : ''}`}
                                >
                                    <div>
                                        <div className="settheory-operation-name">{op.title}</div>
                                        <div className="settheory-operation-symbol">{op.symbol}</div>
                                    </div>
                                    {operation === key && <CheckCircle2 size={18} color="#8b5cf6" />}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Dato curioso */}
                    <Card className="settheory-fact-card" style={{ background: 'var(--bg-surface)', borderLeft: '4px solid #10b981' }}>
                        <div className="settheory-fact-header">
                            <Info size={20} color="#10b981" />
                            <div className="settheory-fact-title">Dato Curioso</div>
                        </div>
                        <p className="settheory-fact-text">
                            La Teoría de Conjuntos fue desarrollada por Georg Cantor a finales del siglo XIX y es la base de casi toda la matemática moderna.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SetTheoryLab;