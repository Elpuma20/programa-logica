import { useState, useCallback } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Send, ChevronRight } from 'lucide-react';

const EJERCICIOS = [
    {
        proposition: "p and q",
        rows: [{ p: true, q: true }, { p: true, q: false }, { p: false, q: true }, { p: false, q: false }]
    },
    {
        proposition: "p or q",
        rows: [{ p: true, q: true }, { p: true, q: false }, { p: false, q: true }, { p: false, q: false }]
    },
    {
        proposition: "not p",
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
            setLocalError("ERROR: Debes completar todas las filas antes de verificar.");
            return;
        }
        setLoading(true);
        setLocalError(null);
        try {
            const res = await api.post('/logica/verificar/', {
                proposition: ejercicioActual.proposition,
                rows
            });
            setFeedback(res.data);
            if (!res.data.all_correct) {
                setLocalError("WARN: Hay errores en tu tabla. Revisa los indicadores y corrige.");
            }
        } catch (err) {
            setLocalError("ERROR: No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    }, [rows, ejercicioActual.proposition]);

    const siguienteEjercicio = useCallback(() => {
        if (!feedback) {
            setLocalError("ERROR: No puedes avanzar sin verificar tus respuestas.");
            return;
        }

        if (!feedback.all_correct) {
            setLocalError("ERROR: Corrige los errores antes de avanzar al siguiente ejercicio.");
            return;
        }

        if (indexEjercicio < EJERCICIOS.length - 1) {
            const nuevoIndex = indexEjercicio + 1;
            setIndexEjercicio(nuevoIndex);
            setRows(EJERCICIOS[nuevoIndex].rows.map(r => ({ ...r, res: null })));
            setFeedback(null);
            setLocalError(null);
        } else {
            alert("SUCCESS: Has completado todos los ejercicios disponibles.");
        }
    }, [feedback, indexEjercicio]);

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <Link to="/dashboard" className="back-link">
                <ArrowLeft size={16} /> Volver al Panel
            </Link>

            <div className="card animate-fade-up" style={{ padding: '2.5rem' }}>
                <div className="exercise-header" style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--brand-indigo)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                        Evaluación Continua • Ejercicio {indexEjercicio + 1} / {EJERCICIOS.length}
                    </div>
                    <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Resolución de Proposiciones</h2>
                </div>

                <div className="progress-bar-container" style={{ height: '4px', marginBottom: '2.5rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${((indexEjercicio + 1) / EJERCICIOS.length) * 100}%` }} />
                </div>

                <div className="proposition-display" style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>ESPRESIÓN A EVALUAR:</div>
                    <code>{ejercicioActual.proposition}</code>
                </div>

                <div className="table-responsive" style={{ marginBottom: '2rem' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>P</th>
                                {ejercicioActual.rows[0].q !== undefined ? <th>Q</th> : null}
                                <th style={{ width: '200px' }}>Resultado</th>
                                {feedback ? <th style={{ width: '80px' }}>Status</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={i}>
                                    <td className={row.p ? 'truth-v' : 'truth-f'}>{row.p ? 'V' : 'F'}</td>
                                    {row.q !== undefined ? (
                                        <td className={row.q ? 'truth-v' : 'truth-f'}>{row.q ? 'V' : 'F'}</td>
                                    ) : null}
                                    <td>
                                        <select
                                            value={row.res === null ? '' : row.res}
                                            onChange={(e) => handleValueChange(i, e.target.value === 'true')}
                                            className="input-field"
                                            style={{ textAlign: 'center', py: '4px' }}
                                        >
                                            <option value="" disabled>Seleccione...</option>
                                            <option value="true">Verdadero (V)</option>
                                            <option value="false">Falso (F)</option>
                                        </select>
                                    </td>
                                    {feedback ? (
                                        <td>
                                            {feedback.results[i].is_correct ? (
                                                <CheckCircle style={{ color: 'var(--semantic-success)' }} size={20} />
                                            ) : (
                                                <XCircle style={{ color: 'var(--semantic-error)' }} size={20} />
                                            )}
                                        </td>
                                    ) : null}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button onClick={verify} disabled={loading} className="btn-primary" style={{ padding: '12px' }}>
                        {loading ? <RefreshCw size={18} className="spin" /> : <Send size={18} />} Verificar Respuestas
                    </button>

                    <button
                        onClick={siguienteEjercicio}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '12px' }}
                    >
                        Siguiente Ejercicio <ChevronRight size={18} />
                    </button>
                </div>

                {localError ? (
                    <div className="error-message" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <XCircle size={18} /> {localError}
                    </div>
                ) : null}

                {feedback?.all_correct ? (
                    <div className="success-message" style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>¡Verificación Correcta!</div>
                        <p style={{ fontSize: 'var(--text-sm)', opacity: 0.9 }}>Has completado satisfactoriamente este ejercicio.</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default TruthTable;
