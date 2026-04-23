// src/pages/TruthTable.jsx
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
    const [shakeCard, setShakeCard] = useState(false);

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
            const res = await api.post('/logica/verificar/', {
                proposition: ejercicioActual.proposition.replace('∧', 'and').replace('∨', 'or').replace('¬', 'not'),
                rows
            });
            setFeedback(res.data);
            if (!res.data.all_correct) {
                setLocalError("Hay errores en tu tabla. Revisa los indicadores y corrige.");
                setShakeCard(true);
                setTimeout(() => setShakeCard(false), 500);
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
            setShakeCard(true);
            setTimeout(() => setShakeCard(false), 500);
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
        <div className="truthtable-page-container fade-in">
            {/* Header */}
            <header className="truthtable-page-header">
                <Link to="/dashboard" className="truthtable-back-link">
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
                <Badge variant="primary">Ejercicio {indexEjercicio + 1} de {EJERCICIOS.length}</Badge>
            </header>

            {/* Card principal */}
            <Card className={`truthtable-main-card ${shakeCard ? 'shake' : ''}`} style={{ borderTop: '4px solid var(--brand-primary)', border: localError ? '2px solid #ef4444' : '1px solid var(--border-default)' }}>
                
                {/* Encabezado con proposición */}
                <div className="truthtable-header-section">
                    <h2 className="truthtable-title">Validación de <span className="text-gradient">Tablas de Verdad</span></h2>
                    
                    {/* Barra de progreso */}
                    <div className="truthtable-progress-bar">
                        <div className="truthtable-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    
                    {/* Proposición */}
                    <div className="truthtable-proposition-box">
                        <p className="truthtable-proposition-label">PROPOSICIÓN A EVALUAR</p>
                        <code className="truthtable-proposition-code">{ejercicioActual.proposition}</code>
                    </div>
                </div>

                {/* Tabla de verdad - RESPONSIVE con scroll */}
                <div className="truthtable-table-wrapper">
                    <table className="truthtable-table">
                        <thead>
                            <tr>
                                <th>P</th>
                                {ejercicioActual.rows[0].q !== undefined && <th>Q</th>}
                                <th>Resultado (F/V)</th>
                                {feedback && <th>Status</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={i}>
                                    <td className={`truthtable-value ${row.p ? 'true' : 'false'}`}>
                                        {row.p ? 'V' : 'F'}
                                    </td>
                                    {row.q !== undefined && (
                                        <td className={`truthtable-value ${row.q ? 'true' : 'false'}`}>
                                            {row.q ? 'V' : 'F'}
                                        </td>
                                    )}
                                    <td>
                                        <select 
                                            className="truthtable-select"
                                            value={row.res === null ? '' : row.res}
                                            onChange={(e) => handleValueChange(i, e.target.value === 'true')}
                                        >
                                            <option value="" disabled>-</option>
                                            <option value="true">Verdadero (V)</option>
                                            <option value="false">Falso (F)</option>
                                        </select>
                                    </td>
                                    {feedback && (
                                        <td className="truthtable-status">
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

                {/* Botones */}
                <div className="truthtable-buttons">
                    <Button onClick={verify} disabled={loading} className="truthtable-verify-btn">
                        {loading ? <RefreshCw className="spin" size={18} /> : <Send size={18} />} Verificar Tabla
                    </Button>
                    <Button variant="secondary" onClick={siguienteEjercicio} className="truthtable-next-btn">
                        Siguiente Nivel <ChevronRight size={18} />
                    </Button>
                </div>

                {/* Mensaje de error */}
                {localError && (
                    <div className="error-message-pop" style={{ justifyContent: 'center' }}>
                        <AlertCircle size={20} /> {localError}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TruthTable;