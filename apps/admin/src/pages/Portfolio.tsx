import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, X, Upload, ExternalLink, Star } from 'lucide-react';
import { API_URL } from '../config';

const API_BASE = `${API_URL}/api`;

const CATEGORIES = [
  'UI/UX Design',
  'Brand Identity',
  'Digital Marketing',
  'Business Strategy',
  'Multimedia',
  'Photography',
  'Graphic Design',
];

const emptyForm = { title: '', category: 'UI/UX Design', imageUrl: '', description: '', link: '', isFeatured: false };

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);
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

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/projects`);
      setProjects(res.data);
    } catch {
      showToast('error', 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post(`${API_BASE}/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData(prev => ({ ...prev, imageUrl: res.data.fileUrl }));
      showToast('success', 'Image uploaded!');
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
        await axios.put(`${API_BASE}/projects/${editingId}`, formData);
        showToast('success', 'Project updated!');
      } else {
        await axios.post(`${API_BASE}/projects`, formData);
        showToast('success', 'Project created!');
      }
      setFormData({ ...emptyForm });
      setEditingId(null);
      fetchProjects();
    } catch (err: any) {
      showToast('error', err?.response?.data?.error || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      description: item.description,
      link: item.link || '',
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setFormData({ ...emptyForm });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await axios.delete(`${API_BASE}/projects/${id}`);
      showToast('success', 'Project deleted');
      fetchProjects();
    } catch {
      showToast('error', 'Failed to delete');
    }
  };

  const handleToggleFeatured = async (item: any) => {
    try {
      await axios.put(`${API_BASE}/projects/${item.id}`, { isFeatured: !item.isFeatured });
      fetchProjects();
    } catch {
      showToast('error', 'Failed to update featured status');
    }
  };

  const inputClass = 'w-full bg-surface-variant border border-on-surface/10 rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors';

  return (
    <div className="max-w-5xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold flex items-center gap-2 transition-all ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-headline-lg font-bold">Manage Portfolio</h2>
          <p className="text-on-surface-variant text-sm mt-1">{projects.length} projects total</p>
        </div>
        <button
          onClick={handleCancel}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-surface-container p-6 rounded-2xl glass-card h-fit sticky top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{editingId ? '✏️ Edit Project' : '➕ New Project'}</h3>
            {editingId && (
              <button onClick={handleCancel} className="text-on-surface-variant hover:text-on-surface">
                <X size={18} />
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Title *</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClass} placeholder="e.g. Brand Redesign Project" />
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Category *</label>
              <input required list="categories-list" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputClass} placeholder="e.g. UI/UX Design" />
              <datalist id="categories-list">
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} />
                ))}
                {/* Also include any custom categories that exist in current projects */}
                {Array.from(new Set(projects.map(p => p.category))).filter(c => !CATEGORIES.includes(c)).map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-2">Project Image *</label>
              <div className="space-y-2">
                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-primary/30 rounded-lg text-primary hover:border-primary/60 hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                  <Upload size={18} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

                {/* Or paste URL */}
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <div className="flex-1 h-px bg-on-surface/10"></div>
                  or paste URL
                  <div className="flex-1 h-px bg-on-surface/10"></div>
                </div>
                <input
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className={inputClass}
                  placeholder="https://..."
                />
                {/* Image preview */}
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="preview"
                    className="mt-1 rounded-lg w-full h-28 object-cover border border-on-surface/10"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Project Link</label>
              <input value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>

            <div>
              <label className="block text-sm font-label-md text-on-surface-variant mb-1">Description *</label>
              <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClass} placeholder="Brief description of the project..." />
            </div>

            <button type="submit" disabled={saving} className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : (editingId ? 'Update Project' : 'Create Project')}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="w-full py-2 rounded-lg border border-on-surface/10 text-on-surface-variant hover:bg-surface-variant transition-colors">
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {loading && <div className="text-center py-12 text-on-surface-variant">Loading...</div>}
          {!loading && projects.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant glass-card rounded-xl">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">folder_open</span>
              No projects yet. Add your first project!
            </div>
          )}
          {projects.map(project => (
            <div key={project.id} className={`bg-surface-container p-4 rounded-xl border transition-all flex gap-4 ${editingId === project.id ? 'border-primary/50 ring-1 ring-primary/30' : 'border-on-surface/5 hover:border-on-surface/10'}`}>
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-28 h-20 object-cover rounded-lg shrink-0"
                onError={e => { e.currentTarget.src = 'https://via.placeholder.com/112x80?text=No+Image'; }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <h4 className="font-bold text-base leading-tight">{project.title}</h4>
                </div>
                <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md mb-1">{project.category}</span>
                <p className="text-on-surface-variant text-sm line-clamp-2">{project.description}</p>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-xs text-primary hover:underline">
                    <ExternalLink size={11} /> View Link
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => handleToggleFeatured(project)} className={`p-2 rounded-lg transition-colors ${project.isFeatured ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-on-surface-variant hover:text-yellow-400 hover:bg-yellow-400/10'}`} title={project.isFeatured ? "Unfeature Project" : "Feature Project"}>
                  <Star size={16} fill={project.isFeatured ? "currentColor" : "none"} />
                </button>
                <button onClick={() => handleEdit(project)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
