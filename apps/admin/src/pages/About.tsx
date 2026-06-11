import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Plus, Trash2, Edit2, X } from 'lucide-react';
import { API_URL } from '../config';

const API_BASE = `${API_URL}/api`;

export default function About() {
  const [about, setAbout] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Stat form
  const [editingStat, setEditingStat] = useState<any | null>(null);
  const [statForm, setStatForm] = useState({ value: '', suffix: '+', label: '' });

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [aboutRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/about`),
        axios.get(`${API_BASE}/stats`),
      ]);
      setAbout(aboutRes.data);
      setSkills(JSON.parse(aboutRes.data.skills || '[]'));
      setStats(statsRes.data);
    } catch { showToast('error', 'Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── About Save ──
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about?.id) return;
    setSaving(true);
    try {
      const { id, createdAt, updatedAt, ...data } = about;
      data.skills = JSON.stringify(skills);
      await axios.put(`${API_BASE}/about/${about.id}`, data);
      showToast('success', '✅ About section saved!');
    } catch { showToast('error', 'Failed to save'); }
    finally { setSaving(false); }
  };

  // ── Skills ──
  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); }
    setNewSkill('');
  };
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));

  // ── Stats ──
  const openNewStat = () => { setEditingStat(null); setStatForm({ value: '', suffix: '+', label: '' }); };
  const openEditStat = (s: any) => { setEditingStat(s); setStatForm({ value: s.value.toString(), suffix: s.suffix, label: s.label }); };

  const saveStat = async () => {
    if (!statForm.value || !statForm.label) return showToast('error', 'Value and label required');
    try {
      if (editingStat) {
        await axios.put(`${API_BASE}/stats/${editingStat.id}`, { ...statForm, order: editingStat.order });
      } else {
        await axios.post(`${API_BASE}/stats`, { ...statForm, order: stats.length + 1 });
      }
      showToast('success', editingStat ? 'Stat updated!' : 'Stat added!');
      setEditingStat(null);
      setStatForm({ value: '', suffix: '+', label: '' });
      fetchAll();
    } catch { showToast('error', 'Failed to save stat'); }
  };

  const deleteStat = async (id: string) => {
    if (!confirm('Delete this stat box?')) return;
    try {
      await axios.delete(`${API_BASE}/stats/${id}`);
      showToast('success', 'Stat deleted');
      fetchAll();
    } catch { showToast('error', 'Failed to delete'); }
  };

  const inputClass = 'w-full bg-surface-variant border border-on-surface/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors';

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-on-surface-variant">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mr-3"></div>
      Loading...
    </div>
  );

  return (
    <div className="max-w-4xl">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold max-w-sm ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-headline-lg font-bold">About Section</h2>
        <p className="text-on-surface-variant mt-1">Edit heading, journey text, skills tags, and stat boxes</p>
      </div>

      <form onSubmit={handleSaveAbout} className="space-y-6">
        {/* ── Headline ── */}
        <div className="bg-surface-container p-6 rounded-2xl glass-card">
          <h3 className="font-bold text-lg mb-4">📝 Section Headline</h3>
          <input
            value={about?.headline || ''}
            onChange={e => setAbout({ ...about, headline: e.target.value })}
            className={inputClass}
            placeholder="e.g. Bridging Creativity and Business Strategy"
          />
        </div>

        {/* ── Journey Card ── */}
        <div className="bg-surface-container p-6 rounded-2xl glass-card space-y-4">
          <h3 className="font-bold text-lg">🚀 Journey Card</h3>
          <div>
            <label className="block text-sm text-on-surface-variant mb-2">Card Title</label>
            <input
              value={about?.journeyTitle || ''}
              onChange={e => setAbout({ ...about, journeyTitle: e.target.value })}
              className={inputClass}
              placeholder="e.g. Creative & Entrepreneurial Journey"
            />
          </div>
          <div>
            <label className="block text-sm text-on-surface-variant mb-2">Card Content</label>
            <textarea
              rows={6}
              value={about?.journeyText || ''}
              onChange={e => setAbout({ ...about, journeyText: e.target.value })}
              className={inputClass}
              placeholder="Write your journey story here..."
            />
          </div>
        </div>

        {/* ── Skills Tags ── */}
        <div className="bg-surface-container p-6 rounded-2xl glass-card">
          <h3 className="font-bold text-lg mb-4">🏷️ Skills / Tags</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, i) => (
              <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-semibold">
                {skill}
                <button type="button" onClick={() => removeSkill(i)} className="hover:text-red-400 transition-colors ml-1">
                  <X size={13} />
                </button>
              </span>
            ))}
            {skills.length === 0 && <p className="text-on-surface-variant text-sm">No skills added yet</p>}
          </div>
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              className={inputClass}
              placeholder="Add a skill tag and press Enter..."
            />
            <button type="button" onClick={addSkill} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-1 shrink-0">
              <Plus size={18} /> Add
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg shadow-primary/20">
            <Save size={20} />
            {saving ? 'Saving...' : 'Save About Section'}
          </button>
        </div>
      </form>

      {/* ── Stats Boxes ── */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-2xl font-bold">📊 Stat Boxes</h3>
            <p className="text-on-surface-variant text-sm mt-1">Kotak angka di bawah About section — bisa ditambah, diedit, atau dihapus</p>
          </div>
          <button
            onClick={openNewStat}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} /> Add Stat
          </button>
        </div>

        {/* Stat Form */}
        <div className="bg-surface-container p-5 rounded-2xl glass-card mb-5">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            {editingStat ? <><Edit2 size={16} /> Edit Stat Box</> : <><Plus size={16} /> New Stat Box</>}
          </h4>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs text-on-surface-variant mb-1">Number Value *</label>
              <input
                type="number"
                value={statForm.value}
                onChange={e => setStatForm({ ...statForm, value: e.target.value })}
                className={inputClass}
                placeholder="e.g. 15"
              />
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1">Suffix</label>
              <input
                value={statForm.suffix}
                onChange={e => setStatForm({ ...statForm, suffix: e.target.value })}
                className={inputClass}
                placeholder="e.g. +"
              />
            </div>
            <div>
              <label className="block text-xs text-on-surface-variant mb-1">Label *</label>
              <input
                value={statForm.label}
                onChange={e => setStatForm({ ...statForm, label: e.target.value })}
                className={inputClass}
                placeholder="e.g. Certifications"
              />
            </div>
          </div>
          {/* Preview */}
          {statForm.value && statForm.label && (
            <div className="mb-3 flex justify-center">
              <div className="glass-card p-4 rounded-xl text-center w-36 border border-primary/20">
                <div className="text-primary text-2xl font-bold">{statForm.value}{statForm.suffix}</div>
                <div className="text-on-surface-variant text-xs uppercase mt-1">{statForm.label}</div>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={saveStat} className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary/90 transition-colors">
              {editingStat ? 'Update Stat' : 'Add Stat'}
            </button>
            {editingStat && (
              <button onClick={() => { setEditingStat(null); setStatForm({ value: '', suffix: '+', label: '' }); }} className="px-4 py-2 border border-on-surface/10 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Stat List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.id} className={`relative group glass-card p-5 rounded-xl text-center border transition-all ${editingStat?.id === stat.id ? 'border-primary/50 ring-1 ring-primary/30' : 'border-on-surface/5 hover:border-primary/20'}`}>
              <div className="text-primary text-3xl font-bold mb-1">{stat.value}{stat.suffix}</div>
              <div className="text-on-surface-variant text-xs uppercase">{stat.label}</div>
              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditStat(stat)} className="p-1 bg-surface-variant rounded hover:text-primary transition-colors">
                  <Edit2 size={12} />
                </button>
                <button onClick={() => deleteStat(stat.id)} className="p-1 bg-surface-variant rounded hover:text-red-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {stats.length === 0 && (
            <div className="col-span-full text-center py-8 text-on-surface-variant border border-dashed border-on-surface/10 rounded-xl">
              No stat boxes yet. Click "Add Stat" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
