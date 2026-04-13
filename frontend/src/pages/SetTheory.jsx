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
        <div className="container fade-in" style={{ maxWidth: '1000px' }}>
            <header className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                     <h1 className="mb-2">Unidad 4: <span className="text-gradient">Teoría</span> de Conjuntos</h1>
                     <p style={{ color: 'var(--text-secondary)' }}>Explora el universo de los grupos lógicos y sus interacciones.</p>
                </div>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '2rem' }}>
                {/* Visualizer card */}
                <Card style={{ padding: '2rem', borderTop: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 className="mb-4" style={{ color: '#8b5cf6' }}>Visualizador de Venn</h3>
                    
                    <div style={{ 
                        position: 'relative', 
                        width: '400px', 
                        height: '280px', 
                        margin: '2rem 0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {/* Circle A */}
                        <div style={{ 
                            width: '200px', 
                            height: '200px', 
                            borderRadius: '50%', 
                            border: '2px solid var(--text-primary)',
                            position: 'relative',
                            zIndex: 1,
                            background: isHighlighted('left') ? 'rgba(139, 92, 246, 0.4)' : 'transparent',
                            transition: 'all 0.3s ease'
                        }}>
                             <span style={{ position: 'absolute', top: -30, left: 10, fontWeight: 900 }}>Conjunto A</span>
                        </div>

                        {/* Intersection Area (The overlap is a bit tricky with pure CSS backgrounds, so we use a middle overlay) */}
                        <div style={{
                            width: '100px',
                            height: '160px',
                            background: isHighlighted('center') ? 'rgba(139, 92, 246, 0.4)' : 'transparent',
                            position: 'absolute',
                            zIndex: 3,
                            borderRadius: '50% 50% 50% 50%',
                            left: '150px',
                            transition: 'all 0.3s ease'
                        }}></div>

                        {/* Circle B */}
                        <div style={{ 
                            width: '200px', 
                            height: '200px', 
                            borderRadius: '50%', 
                            border: '2px solid var(--text-primary)',
                            marginLeft: '-100px',
                            zIndex: 2,
                            background: isHighlighted('right') ? 'rgba(139, 92, 246, 0.4)' : 'transparent',
                            transition: 'all 0.3s ease'
                        }}>
                            <span style={{ position: 'absolute', top: -30, right: 10, fontWeight: 900 }}>Conjunto B</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', width: '100%' }}>
                        <h4 className="mb-2" style={{ color: '#8b5cf6' }}>{operations[operation].title}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{operations[operation].desc}</p>
                    </div>
                </Card>

                {/* Operations Explorer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card style={{ borderTop: '4px solid var(--brand-secondary)' }}>
                        <h4 className="mb-4">Operaciones Disponibles</h4>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {Object.entries(operations).map(([key, op]) => (
                                <button
                                    key={key}
                                    onClick={() => setOperation(key)}
                                    style={{
                                        padding: '1.25rem',
                                        textAlign: 'left',
                                        borderRadius: '12px',
                                        background: operation === key ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-secondary)',
                                        border: `2px solid ${operation === key ? '#8b5cf6' : 'var(--border-default)'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{op.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{op.symbol}</div>
                                    </div>
                                    {operation === key && <CheckCircle2 size={18} color="#8b5cf6" />}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card style={{ background: 'var(--bg-surface)', borderLeft: '4px solid #10b981' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Info size={20} color="#10b981" />
                            <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Dato Curioso</div>
                        </div>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                            La Teoría de Conjuntos fue desarrollada por Georg Cantor a finales del siglo XIX y es la base de casi toda la matemática moderna.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SetTheoryLab;
