import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Upload, FileText, Image as ImageIcon } from 'lucide-react';

import { API_URL } from '../config';
const API_BASE = `${API_URL}/api`;


const emptyForm = { year: '', title: '', organization: '', description: '', fileUrl: '' };

export default function Certifications() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/certifications`);
      setCerts(res.data);
    } catch {
      showToast('error', 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post(`${API_BASE}/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData(prev => ({ ...prev, fileUrl: res.data.fileUrl }));
      showToast('success', 'File uploaded!');
    } catch {
      showToast('error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/certifications/${editingId}`, formData);
        showToast('success', 'Certification updated!');
      } else {
        await axios.post(`${API_BASE}/certifications`, formData);
        showToast('success', 'Certification added!');
      }
      setFormData({ ...emptyForm });
      setEditingId(null);
      fetchCerts();
    } catch (err: any) {
      showToast('error', err?.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      year: item.year,
      title: item.title,
      organization: item.organization,
      description: item.description,
      fileUrl: item.fileUrl || '',
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await axios.delete(`${API_BASE}/certifications/${id}`);
      showToast('success', 'Deleted');
      fetchCerts();
    } catch {
      showToast('error', 'Failed to delete');
    }
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isPdf = (url: string) => /\.pdf$/i.test(url);

  const inputClass = 'w-full bg-surface-variant border border-on-surface/10 rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors';

  return (
    <div className="max-w-5xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold transition-all ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-headline-lg font-bold">Manage Certifications</h2>
          <p className="text-on-surface-variant text-sm mt-1">{certs.length} certifications total</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData({ ...emptyForm }); }}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Certification
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
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Year *</label>
              <input required value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className={inputClass} placeholder="e.g. 2026" />
            </div>
            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Certification Title *</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClass} placeholder="e.g. Marketing Management" />
            </div>
            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Organization *</label>
              <input required value={formData.organization} onChange={e => setFormData({ ...formData, organization: e.target.value })} className={inputClass} placeholder="e.g. MySkill" />
            </div>
            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Description *</label>
              <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClass} />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-2">Certificate File (PDF or Image)</label>
              <div className="space-y-2">
                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-primary/30 rounded-lg text-primary hover:border-primary/60 hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                  <Upload size={18} />
                  {uploading ? 'Uploading...' : 'Upload PDF / Image'}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {/* Or paste URL */}
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <div className="flex-1 h-px bg-on-surface/10"></div>
                  or paste URL
                  <div className="flex-1 h-px bg-on-surface/10"></div>
                </div>
                <input
                  value={formData.fileUrl}
                  onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                  className={inputClass}
                  placeholder="https://... or /uploads/..."
                />

                {/* Preview */}
                {formData.fileUrl && (
                  <div className="mt-2 p-2 bg-surface-variant rounded-lg flex items-center gap-2">
                    {isPdf(formData.fileUrl) ? (
                      <FileText size={20} className="text-red-400 shrink-0" />
                    ) : (
                      <ImageIcon size={20} className="text-primary shrink-0" />
                    )}
                    <span className="text-xs text-on-surface-variant truncate">{formData.fileUrl.split('/').pop()}</span>
                    <button type="button" onClick={() => setFormData({ ...formData, fileUrl: '' })} className="ml-auto text-on-surface-variant hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={saving} className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {loading && <div className="text-center py-12 text-on-surface-variant">Loading...</div>}
          {!loading && certs.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant glass-card rounded-xl">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">workspace_premium</span>
              No certifications yet.
            </div>
          )}
          {certs.map(cert => (
            <div key={cert.id} className={`bg-surface-container p-5 rounded-xl border transition-all ${editingId === cert.id ? 'border-primary/50 ring-1 ring-primary/30' : 'border-on-surface/5 hover:border-on-surface/10'}`}>
              <div className="flex gap-4">
                {/* File preview */}
                {cert.fileUrl ? (
                  <div className="shrink-0">
                    {isImage(cert.fileUrl) ? (
                      <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer">
                        <img src={cert.fileUrl} alt="cert" className="w-20 h-16 object-cover rounded-lg hover:opacity-80 transition-opacity" />
                      </a>
                    ) : (
                      <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-20 h-16 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-colors">
                        <FileText size={28} className="text-red-400" />
                        <span className="text-xs text-red-400 font-bold">PDF</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="w-20 h-16 bg-primary/5 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary opacity-50">workspace_premium</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-primary text-sm font-bold">{cert.year}</span>
                      <h4 className="font-bold text-base leading-tight">{cert.title}</h4>
                      <p className="text-secondary text-sm font-semibold">{cert.organization}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleEdit(cert)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(cert.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm mt-1 line-clamp-2">{cert.description}</p>
                  {cert.fileUrl && (
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                    >
                      {isPdf(cert.fileUrl) ? <FileText size={12} /> : <ImageIcon size={12} />}
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

