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
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleValueChange = (index, val) => {
        const newRows = [...rows];
        newRows[index].res = val;
        setRows(newRows);
        setFeedback(null);
    };

    const verify = async () => {
        if (rows.some(r => r.res === null)) {
            alert("Completa todas las filas antes de verificar.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/logica/verificar/', {
                proposition: ejercicioActual.proposition,
                rows
            });
            setFeedback(res.data);
        } catch (err) {
            alert("Error al verificar. Asegúrate que el servidor está corriendo.");
        } finally {
            setLoading(false);
        }
    };

    const siguienteEjercicio = () => {
        if (indexEjercicio < ejercicios.length - 1) {
            const nuevoIndex = indexEjercicio + 1;
            setIndexEjercicio(nuevoIndex);
            setRows(ejercicios[nuevoIndex].rows.map(r => ({ ...r, res: null })));
            setFeedback(null);
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

                {feedback && (
                    <div className={feedback.all_correct ? 'success-message' : 'error-message'} style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <h3 style={{ color: feedback.all_correct ? 'var(--success)' : 'var(--error)' }}>
                            {feedback.all_correct ? '¡Excelente! Todas las respuestas son correctas.' : 'Algunas respuestas no son correctas. ¡Sigue intentando!'}
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
