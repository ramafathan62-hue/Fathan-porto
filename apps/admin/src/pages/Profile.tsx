import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Save, Upload, User } from 'lucide-react';

import { API_URL } from '../config';
const API_BASE = `${API_URL}/api`;


export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    axios.get(`${API_BASE}/profile`, { headers: { 'Cache-Control': 'no-cache' } })
      .then(res => { setProfile(res.data); setLoading(false); })
      .catch(() => { showToast('error', 'Failed to load profile'); setLoading(false); });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

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
      setProfile({ ...profile, imageUrl: res.data.fileUrl });
      showToast('success', 'Image uploaded!');
    } catch {
      showToast('error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/profile/${profile.id}`, profile);
      showToast('success', '✓ Profile saved! Refresh your portfolio to see changes.');
    } catch (err: any) {
      showToast('error', err?.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full bg-surface-variant border border-on-surface/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors';

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-on-surface-variant">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mr-3"></div>
      Loading...
    </div>
  );

  return (
    <div className="max-w-3xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold transition-all max-w-sm ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-headline-lg font-bold">Profile Settings</h2>
        <p className="text-on-surface-variant mt-1">Controls Hero & About sections on your portfolio</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Photo */}
        <div className="bg-surface-container p-6 rounded-2xl glass-card">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><User size={20} className="text-primary" /> Profile Photo</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-variant border-2 border-primary/30 shrink-0">
              <img
                src={profile?.imageUrl || '/profile.png'}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.src = 'https://via.placeholder.com/96?text=Photo'; }}
              />
            </div>
            <div className="space-y-2">
              <input
                name="imageUrl"
                value={profile?.imageUrl || ''}
                onChange={handleChange}
                className={inputClass}
                placeholder="/profile.png or https://..."
              />
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant text-sm">or</span>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  <Upload size={16} />
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-surface-container p-6 rounded-2xl glass-card space-y-5">
          <h3 className="font-bold text-lg">Basic Information</h3>

          <div>
            <label className="block text-sm font-label-md text-on-surface-variant mb-2">Full Name</label>
            <input name="name" value={profile?.name || ''} onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-label-md text-on-surface-variant mb-2">Professional Title / Tagline</label>
            <input name="title" value={profile?.title || ''} onChange={handleChange} required className={inputClass} placeholder="e.g. Digital Business Student | Creative Designer" />
            <p className="text-xs text-on-surface-variant mt-1">Shown as subtitle in Hero section</p>
          </div>
        </div>

        {/* Biography */}
        <div className="bg-surface-container p-6 rounded-2xl glass-card">
          <h3 className="font-bold text-lg mb-4">Biography / About Me</h3>
          <textarea
            name="bio"
            value={profile?.bio || ''}
            onChange={handleChange}
            rows={7}
            required
            className={inputClass}
            placeholder="Write your biography here..."
          />
          <p className="text-xs text-on-surface-variant mt-1">Shown in the About Me section</p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

