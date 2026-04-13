import { useState, useCallback } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Send, ChevronRight, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const EJERCICIOS = [
    {
        proposition: "p ∧ q",
        rows: [{ p: true, q: true }, { p: true, q: false }, { p: false, q: true }, { p: false, q: false }]
    },
    {
        proposition: "p ∨ q",
        rows: [{ p: true, q: true }, { p: true, q: false }, { p: false, q: true }, { p: false, q: false }]
    },
    {
        proposition: "¬p",
        rows: [{ p: true }, { p: false }]
    }
];

const TruthTable = () => {
    const [indexEjercicio, setIndexEjercicio] = useState(0);
    const ejercicioActual = EJERCICIOS[indexEjercicio];
    const [rows, setRows] = useState(ejercicioActual.rows.map(r => ({ ...r, res: null })));
    const [localError, setLocalError] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleValueChange = useCallback((index, val) => {
        setRows(prev => {
            const newRows = [...prev];
            newRows[index] = { ...newRows[index], res: val };
            return newRows;
        });
        setFeedback(null);
        setLocalError(null);
    }, []);

    const verify = useCallback(async () => {
        if (rows.some(r => r.res === null)) {
            setLocalError("Debes completar todas las filas antes de verificar.");
            return;
        }
        setLoading(true);
        setLocalError(null);
        try {
            // Mapping UI symbols back to API expected format if necessary
            // Current API expects symbols or text? Previous code sent "p and q"
            // I'll send the proposition as defined in EJERCICIOS
            const res = await api.post('/logica/verificar/', {
                proposition: ejercicioActual.proposition.replace('∧', 'and').replace('∨', 'or').replace('¬', 'not'),
                rows
            });
            setFeedback(res.data);
            if (!res.data.all_correct) {
                setLocalError("Hay errores en tu tabla. Revisa los indicadores y corrige.");
            }
        } catch (err) {
            setLocalError("Error de conexión con el servidor de validación.");
        } finally {
            setLoading(false);
        }
    }, [rows, ejercicioActual.proposition]);

    const siguienteEjercicio = useCallback(() => {
        if (!feedback?.all_correct) {
            setLocalError("Debes validar correctamente el ejercicio actual antes de avanzar.");
            return;
        }

        if (indexEjercicio < EJERCICIOS.length - 1) {
            const nuevoIndex = indexEjercicio + 1;
            setIndexEjercicio(nuevoIndex);
            setRows(EJERCICIOS[nuevoIndex].rows.map(r => ({ ...r, res: null })));
            setFeedback(null);
            setLocalError(null);
        } else {
            alert("¡Felicitaciones! Has completado todos los ejercicios.");
        }
    }, [feedback, indexEjercicio]);

    const progress = ((indexEjercicio + 1) / EJERCICIOS.length) * 100;

    return (
        <div className="container fade-in" style={{ maxWidth: '900px' }}>
            <header className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
                <Badge variant="primary">Ejercicio {indexEjercicio + 1} de {EJERCICIOS.length}</Badge>
            </header>

            <Card style={{ borderTop: '4px solid var(--brand-primary)' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="mb-4">Validación de <span className="text-gradient">Tablas de Verdad</span></h2>
                    <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden', marginBottom: '2rem' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--brand-primary)', transition: 'width 0.5s ease' }}></div>
                    </div>
                    
                    <div style={{ 
                        background: 'var(--bg-secondary)', 
                        padding: '2rem', 
                        borderRadius: '16px', 
                        display: 'inline-block',
                        minWidth: '300px',
                        border: '1px solid var(--border-default)'
                    }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PROPOSICIÓN A EVALUAR</p>
                        <code style={{ fontSize: '2rem', color: 'var(--brand-primary)', fontWeight: 900 }}>{ejercicioActual.proposition}</code>
                    </div>
                </div>

                <div style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                        <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.85rem' }}>
                            <tr>
                                <th style={{ padding: '1.25rem' }}>P</th>
                                {ejercicioActual.rows[0].q !== undefined && <th style={{ padding: '1.25rem' }}>Q</th>}
                                <th style={{ padding: '1.25rem' }}>Resultado (F/V)</th>
                                {feedback && <th style={{ padding: '1.25rem' }}>Status</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={i} style={{ borderTop: '1px solid var(--border-default)' }}>
                                    <td style={{ padding: '1.25rem', fontWeight: 800, color: row.p ? '#10b981' : '#ef4444' }}>{row.p ? 'V' : 'F'}</td>
                                    {row.q !== undefined && <td style={{ padding: '1.25rem', fontWeight: 800, color: row.q ? '#10b981' : '#ef4444' }}>{row.q ? 'V' : 'F'}</td>}
                                    <td style={{ padding: '1.25rem' }}>
                                        <select 
                                            className="input-field" 
                                            style={{ maxWidth: '140px', textAlign: 'center', fontWeight: 700 }}
                                            value={row.res === null ? '' : row.res}
                                            onChange={(e) => handleValueChange(i, e.target.value === 'true')}
                                        >
                                            <option value="" disabled>-</option>
                                            <option value="true">Verdadero (V)</option>
                                            <option value="false">Falso (F)</option>
                                        </select>
                                    </td>
                                    {feedback && (
                                        <td style={{ padding: '1.25rem' }}>
                                            {feedback.results[i].is_correct ? 
                                                <CheckCircle color="#10b981" size={24} /> : 
                                                <XCircle color="#ef4444" size={24} />
                                            }
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Button onClick={verify} disabled={loading}>
                        {loading ? <RefreshCw className="spin" size={18} /> : <Send size={18} />} Verificar Tabla
                    </Button>
                    <Button variant="secondary" onClick={siguienteEjercicio}>
                        Siguiente Nivel <ChevronRight size={18} />
                    </Button>
                </div>

                {localError && (
                    <div className="fade-in" style={{ 
                        marginTop: '1.5rem', 
                        padding: '1rem', 
                        background: 'rgba(239, 68, 68, 0.05)', 
                        color: '#ef4444', 
                        borderRadius: '12px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 600
                    }}>
                        <AlertCircle size={20} /> {localError}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TruthTable;
