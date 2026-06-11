import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Briefcase, Users } from 'lucide-react';

import { API_URL } from '../config';
const API_BASE = `${API_URL}/api`;


const emptyForm = { type: 'work', period: '', title: '', organization: '', description: '' };

export default function Experience() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [filterType, setFilterType] = useState<'all' | 'work' | 'leadership'>('all');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchExp = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/experience`);
      setExperiences(res.data);
    } catch { showToast('error', 'Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExp(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/experience/${editingId}`, formData);
        showToast('success', 'Experience updated!');
      } else {
        await axios.post(`${API_BASE}/experience`, formData);
        showToast('success', 'Experience added!');
      }
      setFormData({ ...emptyForm });
      setEditingId(null);
      fetchExp();
    } catch (err: any) {
      showToast('error', err?.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleEdit = (item: any) => {
    setFormData({ type: item.type, period: item.period, title: item.title, organization: item.organization, description: item.description });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await axios.delete(`${API_BASE}/experience/${id}`);
      showToast('success', 'Deleted');
      fetchExp();
    } catch { showToast('error', 'Failed to delete'); }
  };

  const inputClass = 'w-full bg-surface-variant border border-on-surface/10 rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors';

  const filtered = filterType === 'all' ? experiences : experiences.filter(e => e.type === filterType);

  return (
    <div className="max-w-5xl">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-headline-lg font-bold">Manage Experience</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            {experiences.filter(e => e.type === 'work').length} work · {experiences.filter(e => e.type === 'leadership').length} leadership
          </p>
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData({ ...emptyForm }); }}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Experience
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
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
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Category *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'work' })}
                  className={`flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-bold transition-colors ${formData.type === 'work' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant hover:bg-primary/10'}`}
                >
                  <Briefcase size={14} /> Work
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'leadership' })}
                  className={`flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-bold transition-colors ${formData.type === 'leadership' ? 'bg-secondary text-on-primary' : 'bg-surface-variant text-on-surface-variant hover:bg-secondary/10'}`}
                >
                  <Users size={14} /> Leadership
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Period *</label>
              <input required value={formData.period} onChange={e => setFormData({ ...formData, period: e.target.value })} className={inputClass} placeholder="e.g. 2024 - 2025" />
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Job Title *</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClass} placeholder="e.g. Founder & Creative Director" />
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Organization / Company *</label>
              <input required value={formData.organization} onChange={e => setFormData({ ...formData, organization: e.target.value })} className={inputClass} placeholder="e.g. Apaya Creative Agency" />
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Description *</label>
              <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClass} />
            </div>

            <button type="submit" disabled={saving} className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : (editingId ? 'Update' : 'Add Experience')}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-4">
            {[{ key: 'all', label: 'All' }, { key: 'work', label: '💼 Work & Project' }, { key: 'leadership', label: '👥 Leadership' }].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${filterType === f.key ? 'bg-primary text-on-primary' : 'border border-on-surface/10 text-on-surface-variant hover:border-primary/40'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading && <div className="text-center py-12 text-on-surface-variant">Loading...</div>}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant glass-card rounded-xl">No experiences yet.</div>
          )}
          {filtered.map(exp => (
            <div key={exp.id} className={`bg-surface-container p-5 rounded-xl border transition-all ${editingId === exp.id ? 'border-primary/50 ring-1 ring-primary/30' : 'border-on-surface/5 hover:border-on-surface/10'}`}>
              <div className="flex gap-3">
                <div className={`w-2 rounded-full shrink-0 ${exp.type === 'work' ? 'bg-primary' : 'bg-secondary'}`} style={{ minHeight: '60px' }}></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 inline-block ${exp.type === 'work' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                        {exp.type === 'work' ? 'Work & Project' : 'Leadership'}
                      </span>
                      <div className="text-sm text-on-surface-variant">{exp.period}</div>
                      <h4 className="font-bold text-base">{exp.title}</h4>
                      <p className={`text-sm font-semibold ${exp.type === 'work' ? 'text-secondary' : 'text-primary'}`}>{exp.organization}</p>
                      <p className="text-on-surface-variant text-sm mt-1 line-clamp-2">{exp.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleEdit(exp)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

