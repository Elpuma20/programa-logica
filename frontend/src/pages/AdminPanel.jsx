import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { 
    Plus, Trash2, Edit3, Save, X, Search, Filter, 
    LayoutDashboard, Brain, HelpCircle, Puzzle, ScrollText, 
    CheckCircle2, AlertCircle, ChevronRight, ArrowLeft,
    ShieldAlert, Clock, Activity, Users, UserCheck, Shield,
    BarChart3, Database, Key, BrainCircuit
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [contents, setContents] = useState([]);
    const [logs, setLogs] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('usuarios'); // Starting with users as per request
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        tipo: 'trivia', titulo: '', descripcion: '', respuesta: '', opciones: [], dificultad: 'medio'
    });
    const [notification, setNotification] = useState(null);



    useEffect(() => {
        if (!user?.is_staff) { navigate('/dashboard'); } 
        else { 
            fetchContents(); 
            fetchLogs(); 
            fetchUsers();
        }
    }, [user, navigate]);

    const fetchContents = async () => {
        try { setLoading(true); const res = await api.get('/logica/contenido/'); setContents(res.data); } 
        catch (err) { showNotification('Error al cargar contenidos', 'error'); } 
        finally { setLoading(false); }
    };

    const fetchLogs = async () => {
        try { const res = await api.get('/auditoria/logs/'); setLogs(res.data); } 
        catch (err) { console.error('Error fetching logs', err); }
    };

    const fetchUsers = async () => {
        try { const res = await api.get('/list/'); setUsersList(res.data); } 
        catch (err) { console.error('Error fetching users', err); }
    };

    const handleVerifyUser = async (userId) => {
        try {
            await api.post(`/verify/${userId}/`);
            showNotification('Estado de verificación actualizado');
            fetchUsers();
        } catch (err) {
            showNotification('Error al verificar usuario', 'error');
        }
    };

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleOpenModal = (item = null) => {
        if (item) { setEditingItem(item); setFormData({ ...item, opciones: item.opciones || [] }); } 
        else { 
            setEditingItem(null); 
            setFormData({ tipo: ['trivia', 'adivinanza', 'rompecabezas', 'paradoja'].includes(activeTab) ? activeTab : 'trivia', titulo: '', descripcion: '', respuesta: '', opciones: [], dificultad: 'medio' }); 
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) { await api.patch(`/logica/contenido/${editingItem.id}/`, formData); showNotification('Actualizado exitosamente'); } 
            else { await api.post('/logica/contenido/', formData); showNotification('Creado exitosamente'); }
            fetchContents(); fetchLogs(); setIsModalOpen(false);
        } catch (err) { showNotification('Fallo en la operación', 'error'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Confirmar desactivación de este registro?')) {
            try { await api.delete(`/logica/contenido/${id}/`); showNotification('Eliminado'); fetchContents(); fetchLogs(); } 
            catch (err) { showNotification('Error al eliminar', 'error'); }
        }
    };

    const filteredContents = contents.filter(c => c.tipo === activeTab);

    const stats = [
        { label: 'Total Agentes', value: usersList.length, icon: Users, color: 'var(--brand-primary)' },
        { label: 'Verificados', value: usersList.filter(u => u.is_verified).length, icon: UserCheck, color: '#10b981' },
        { label: 'Contenido Total', value: contents.length, icon: Database, color: '#8b5cf6' },
        { label: 'Eventos Log', value: logs.length, icon: Activity, color: 'var(--brand-secondary)' }
    ];

    return (
        <div className="container fade-in">
            {/* Admin Header */}
            <header className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ 
                        width: '50px', height: '50px', 
                        background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', 
                        borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                        boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)'
                    }}>
                        <BrainCircuit size={28} />
                    </div>
                    <div>
                        <h1 className="mb-0" style={{ fontSize: '1.8rem' }}><span style={{ color: 'var(--brand-primary)' }}>Centro de Mando</span> EduLógica</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Terminal Nivel 4 - Autorización: {user?.nombres?.split(' ')[0]}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/dashboard" style={{ textDecoration: 'none' }}><Button variant="secondary"><ArrowLeft size={16} /> Volver</Button></Link>
                    {['trivia', 'adivinanza', 'rompecabezas', 'paradoja'].includes(activeTab) && <Button onClick={() => handleOpenModal()}><Plus size={18} /> Nuevo Registro</Button>}
                </div>
            </header>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((s, i) => (
                    <Card key={i} style={{ padding: '1.5rem', borderLeft: `4px solid ${s.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{s.label}</p>
                                <h2 style={{ margin: 0 }}>{s.value}</h2>
                            </div>
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '12px', color: s.color }}>
                                <s.icon size={20} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {notification && (
                <div className="fade-in" style={{ 
                    position: 'fixed', top: '5rem', right: '2rem', zIndex: 1100,
                    padding: '1rem 2rem', borderRadius: '12px',
                    background: notification.type === 'error' ? '#ef4444' : 'var(--brand-primary)',
                    color: notification.type === 'error' ? 'white' : 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800
                }}>
                    {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    {notification.msg}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) 3fr', gap: '2rem' }}>
                {/* Sidebar */}
                <Card style={{ padding: '1rem', height: 'fit-content', background: 'var(--bg-surface)' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', padding: '0 1rem' }}>OPERACIONES</p>
                    {[
                        { id: 'usuarios', label: 'Gestión Agentes', icon: Users },
                        { id: 'trivia', label: 'Trivias', icon: HelpCircle },
                        { id: 'adivinanza', label: 'Adivinanzas', icon: Brain },
                        { id: 'rompecabezas', label: 'Rompecabezas', icon: Puzzle },
                        { id: 'paradoja', label: 'Paradojas', icon: ScrollText },
                    ].map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ 
                            width: '100%', padding: '0.86rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: activeTab === t.id ? 'var(--accent-light)' : 'transparent',
                            color: activeTab === t.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700, textAlign: 'left', marginBottom: '0.25rem'
                        }}>
                            <t.icon size={18} /> {t.label}
                        </button>
                    ))}
                    <div style={{ margin: '1rem 0', borderTop: '1px solid var(--border-default)', paddingTop: '1rem' }}>
                        <button onClick={() => setActiveTab('auditoria')} style={{ 
                            width: '100%', padding: '0.86rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: activeTab === 'auditoria' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                            color: activeTab === 'auditoria' ? '#ef4444' : 'var(--text-secondary)',
                            border: 'none', cursor: 'pointer', fontWeight: 800, textAlign: 'left'
                        }}>
                             <ShieldAlert size={18} /> Bitácora Auditoría
                        </button>
                    </div>
                </Card>

                {/* Main Content Area */}
                <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <h3 style={{ textTransform: 'capitalize', margin: 0 }}>
                                {activeTab === 'usuarios' ? 'Personal Registrado' : activeTab === 'auditoria' ? 'Registro de Seguridad' : `${activeTab}s del Sistema`}
                            </h3>
                         </div>
                         <Badge variant="primary">
                            {activeTab === 'usuarios' ? usersList.length : activeTab === 'auditoria' ? logs.length : filteredContents.length} Entradas
                         </Badge>
                    </div>

                    <div style={{ overflowX: 'auto', minHeight: '400px' }}>
                        {activeTab === 'usuarios' ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>AGENTE</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>IDENTIFICACIÓN / CORREO</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>ESTADO</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.map(u => (
                                        <tr key={u.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{u.nombres} {u.apellidos}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Módulo: {u.area_estudios || 'No asignado'}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.85rem' }}>{u.cedula}</div>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{u.correo}</div>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <Badge style={{ 
                                                    background: u.is_verified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(37, 99, 235, 0.1)', 
                                                    color: u.is_verified ? '#10b981' : 'var(--brand-primary)',
                                                    border: `1px solid ${u.is_verified ? '#10b98133' : 'rgba(37, 99, 235, 0.2)'}` 
                                                }}>
                                                    {u.is_verified ? 'VERIFICADO' : 'PENDIENTE'}
                                                </Badge>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => handleVerifyUser(u.id)}
                                                    style={{ color: u.is_verified ? '#ef4444' : 'var(--brand-primary)' }}
                                                >
                                                    {u.is_verified ? <ShieldAlert size={18} /> : <UserCheck size={18} />}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : activeTab === 'auditoria' ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>FECHA / AGENTE</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>ACCIÓN</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>DETALLE DEL EVENTO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{log.usuario_detalle?.nombres}</div>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{new Date(log.timestamp).toLocaleString()}</div>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <Badge style={{ background: log.accion === 'CREAR' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: log.accion === 'CREAR' ? '#10b981' : '#ef4444' }}>{log.accion}</Badge>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                                <strong>{log.modelo}</strong>: {log.detalle}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>TÍTULO / ENTIDAD</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>NIVEL</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>OPERACIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredContents.map(item => (
                                        <tr key={item.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                                            <td style={{ padding: '1rem', fontWeight: 700 }}>{item.titulo}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}><Badge variant={item.dificultad === 'facil' ? 'success' : 'primary'}>{item.dificultad}</Badge></td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <Button variant="ghost" onClick={() => handleOpenModal(item)} style={{ padding: '0.5rem' }}><Edit3 size={16} /></Button>
                                                    <Button variant="ghost" onClick={() => handleDelete(item.id)} style={{ padding: '0.5rem', color: '#ef4444' }}><Trash2 size={16} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--brand-primary)' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                   <div style={{ width: '40px', height: '40px', background: 'var(--brand-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                       <Plus size={20} />
                                   </div>
                                   <h2 style={{ margin: 0 }}>{editingItem ? 'Modificar Registro' : `Configurar ${activeTab}`}</h2>
                               </div>
                               <Button variant="ghost" onClick={() => setIsModalOpen(false)}><X size={24} /></Button>
                         </div>
                         <form onSubmit={handleSubmit}>
                               <Input label="Título descriptivo o Nombre del Reto" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
                               <div className="input-group">
                                     <label className="input-label">Descripción Técnica / Contenido</label>
                                     <textarea className="input-field" rows={4} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} required />
                               </div>
                               <Input label="Solución / Palabra Clave" value={formData.respuesta} onChange={e => setFormData({...formData, respuesta: e.target.value})} required />
                               
                               {formData.tipo === 'trivia' && (
                                   <div className="input-group">
                                       <label className="input-label">Opciones del Menú (Una por línea)</label>
                                       <textarea className="input-field" rows={3} value={formData.opciones.join('\n')} onChange={e => setFormData({...formData, opciones: e.target.value.split('\n')})} />
                                   </div>
                               )}

                               <div className="input-group">
                                   <label className="input-label">Grado de Complejidad Computacional</label>
                                   <select className="input-field" value={formData.dificultad} onChange={e => setFormData({...formData, dificultad: e.target.value})}>
                                       <option value="facil">Nivel 1 - Básico</option>
                                       <option value="medio">Nivel 2 - Intermedio</option>
                                       <option value="dificil">Nivel 3 - Avanzado</option>
                                   </select>
                               </div>

                               <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="w-full">Cancelar Operación</Button>
                                    <Button type="submit" className="w-full" style={{ background: 'var(--brand-primary)', color: 'white' }}><Save size={18} /> Comprometer Cambios</Button>
                               </div>
                         </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
