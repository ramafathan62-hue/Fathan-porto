import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

import { API_URL } from '../config';
const API_BASE = `${API_URL}/api`;


// Material Symbols icon suggestions
const ICON_SUGGESTIONS = ['palette', 'trending_up', 'devices', 'photo_camera', 'campaign', 'design_services', 'monitoring', 'rocket_launch', 'star', 'diamond', 'brush', 'code'];

const emptyForm = { title: '', description: '', icon: 'palette' };

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/services`);
      setServices(res.data);
    } catch { showToast('error', 'Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/services/${editingId}`, formData);
        showToast('success', 'Service updated!');
      } else {
        await axios.post(`${API_BASE}/services`, formData);
        showToast('success', 'Service created!');
      }
      setFormData({ ...emptyForm });
      setEditingId(null);
      fetchServices();
    } catch (err: any) {
      showToast('error', err?.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleEdit = (service: any) => {
    setFormData({ title: service.title, description: service.description, icon: service.icon });
    setEditingId(service.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await axios.delete(`${API_BASE}/services/${id}`);
      showToast('success', 'Deleted');
      fetchServices();
    } catch { showToast('error', 'Failed to delete'); }
  };

  const inputClass = 'w-full bg-surface-variant border border-on-surface/10 rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors';

  return (
    <div className="max-w-5xl">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-headline-lg font-bold">Manage Services</h2>
          <p className="text-on-surface-variant text-sm mt-1">{services.length} services total</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData({ ...emptyForm }); }}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-surface-container p-6 rounded-2xl glass-card h-fit sticky top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{editingId ? '✏️ Edit' : '➕ New'}</h3>
            {editingId && (
              <button onClick={() => { setEditingId(null); setFormData({ ...emptyForm }); }} className="text-on-surface-variant hover:text-on-surface">
                <X size={18} />
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Title *</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClass} placeholder="e.g. Creative Design" />
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Icon (Material Symbols) *</label>
              <input required value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className={inputClass} placeholder="e.g. palette" />
              {/* Preview */}
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">{formData.icon}</span>
                </div>
                <span className="text-xs text-on-surface-variant">Icon preview</span>
              </div>
              {/* Suggestions */}
              <div className="flex flex-wrap gap-1 mt-2">
                {ICON_SUGGESTIONS.map(ic => (
                  <button key={ic} type="button" onClick={() => setFormData({ ...formData, icon: ic })}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${formData.icon === ic ? 'border-primary bg-primary/10 text-primary' : 'border-on-surface/10 text-on-surface-variant hover:border-primary/40'}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Description *</label>
              <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClass} />
            </div>

            <button type="submit" disabled={saving} className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : (editingId ? 'Update Service' : 'Create Service')}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {loading && <div className="text-center py-12 text-on-surface-variant">Loading...</div>}
          {!loading && services.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant glass-card rounded-xl">No services yet.</div>
          )}
          {services.map(service => (
            <div key={service.id} className={`bg-surface-container p-4 rounded-xl border transition-all flex items-start gap-4 ${editingId === service.id ? 'border-primary/50' : 'border-on-surface/5 hover:border-on-surface/10'}`}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">{service.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base">{service.title}</h4>
                <p className="text-on-surface-variant text-sm mt-1">{service.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(service)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(service.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

