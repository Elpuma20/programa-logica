import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Send, ChevronRight } from 'lucide-react';

const TruthTable = () => {
    const ejercicios = [
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

    const [indexEjercicio, setIndexEjercicio] = useState(0);
    const ejercicioActual = ejercicios[indexEjercicio];
    const [rows, setRows] = useState(ejercicioActual.rows.map(r => ({ ...r, res: null })));
    const [localError, setLocalError] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleValueChange = (index, val) => {
        const newRows = [...rows];
        newRows[index].res = val;
        setRows(newRows);
        setFeedback(null);
        setLocalError(null);
    };

    const verify = async () => {
        if (rows.some(r => r.res === null)) {
            setLocalError("Debes completar todas las filas de la tabla antes de verificar.");
            return;
        }
        setLoading(true);
        setLocalError(null);
        try {
            const res = await axios.post('http://localhost:8000/api/logica/verificar/', {
                proposition: ejercicioActual.proposition,
                rows
            });
            setFeedback(res.data);
            if (!res.data.all_correct) {
                setLocalError("Hay errores en tu tabla. Revisa los iconos rojos y corrige tus respuestas.");
            }
        } catch (err) {
            setLocalError("Error al conectar con el servidor. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const siguienteEjercicio = () => {
        if (!feedback) {
            setLocalError("No puedes avanzar sin antes verificar tus respuestas.");
            return;
        }

        if (!feedback.all_correct) {
            setLocalError("Debes corregir los errores actuales antes de poder pasar al siguiente ejercicio.");
            return;
        }

        if (indexEjercicio < ejercicios.length - 1) {
            const nuevoIndex = indexEjercicio + 1;
            setIndexEjercicio(nuevoIndex);
            setRows(ejercicios[nuevoIndex].rows.map(r => ({ ...r, res: null })));
            setFeedback(null);
            setLocalError(null);
        } else {
            alert("¡Felicidades! Has completado todos los ejercicios disponibles.");
        }
    };

    return (
        <div className="container">
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 500 }}>
                <ArrowLeft size={18} /> Regresar al Panel
            </Link>

            <div className="card" style={{ padding: '3rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Tablas de Verdad</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Ejercicio {indexEjercicio + 1} de {ejercicios.length}: Determina el valor de verdad para la proposición:
                </p>

                <div className="proposition-display">
                    <code>{ejercicioActual.proposition}</code>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>p</th>
                                {ejercicioActual.rows[0].q !== undefined && <th style={{ width: '80px' }}>q</th>}
                                <th style={{ width: '150px' }}>Resultado</th>
                                {feedback && <th style={{ width: '100px' }}>Estado</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 500, color: row.p ? 'var(--success)' : 'var(--error)' }}>
                                        {row.p ? 'V' : 'F'}
                                    </td>
                                    {row.q !== undefined && (
                                        <td style={{ fontWeight: 500, color: row.q ? 'var(--success)' : 'var(--error)' }}>
                                            {row.q ? 'V' : 'F'}
                                        </td>
                                    )}
                                    <td>
                                        <select
                                            value={row.res === null ? '' : row.res}
                                            onChange={(e) => handleValueChange(i, e.target.value === 'true')}
                                            className="input-field"
                                            style={{ padding: '8px 12px', textAlign: 'center' }}
                                        >
                                            <option value="" disabled>Seleccionar</option>
                                            <option value="true">Verdadero (V)</option>
                                            <option value="false">Falso (F)</option>
                                        </select>
                                    </td>
                                    {feedback && (
                                        <td>
                                            {feedback.results[i].is_correct ? (
                                                <CheckCircle style={{ color: 'var(--success)' }} size={22} />
                                            ) : (
                                                <XCircle style={{ color: 'var(--error)' }} size={22} />
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="action-buttons">
                    <button onClick={verify} disabled={loading} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {loading ? <RefreshCw size={18} className="spin" /> : <Send size={18} />} Verificar Respuestas
                    </button>

                    <button
                        onClick={siguienteEjercicio}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        Siguiente <ChevronRight size={18} />
                    </button>
                </div>

                {localError && (
                    <div className="error-message" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <XCircle size={18} /> {localError}
                    </div>
                )}

                {feedback && feedback.all_correct && (
                    <div className="success-message" style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--success)' }}>
                            ¡Excelente! Todas las respuestas son correctas.
                        </h3>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};

export default TruthTable;
