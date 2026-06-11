import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Activity, Users, FolderOpen, Award, Briefcase } from 'lucide-react';

import { API_URL } from '../config';
const API_BASE = `${API_URL}/api`;


export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    certifications: 0,
    services: 0,
  });
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Check API health
    Promise.all([
      axios.get(`${API_BASE}/profile`),
      axios.get(`${API_BASE}/projects`),
      axios.get(`${API_BASE}/experience`),
      axios.get(`${API_BASE}/certifications`),
      axios.get(`${API_BASE}/services`),
    ])
      .then(([profileRes, projectsRes, expRes, certRes, svcRes]) => {
        setApiStatus('online');
        setProfile(profileRes.data);
        setStats({
          projects: projectsRes.data.length,
          experience: expRes.data.length,
          certifications: certRes.data.length,
          services: svcRes.data.length,
        });
      })
      .catch(() => setApiStatus('offline'));
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Experience', value: stats.experience, icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Certifications', value: stats.certifications, icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Services', value: stats.services, icon: Users, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-1">Dashboard</h2>
        <p className="text-on-surface-variant">Welcome back! Manage your portfolio content from here.</p>
      </div>

      {/* API Status */}
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${apiStatus === 'online' ? 'border-green-500/30 bg-green-500/5' : apiStatus === 'offline' ? 'border-red-500/30 bg-red-500/5' : 'border-on-surface/10 bg-surface-variant'}`}>
        <div className={`w-2.5 h-2.5 rounded-full ${apiStatus === 'online' ? 'bg-green-400 animate-pulse' : apiStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'}`}></div>
        <Activity size={16} className={apiStatus === 'online' ? 'text-green-400' : 'text-red-400'} />
        <span className="text-sm font-semibold">
          API Server: {apiStatus === 'online' ? `✅ Online — ${API_URL}` : apiStatus === 'offline' ? '❌ Offline — Start the API server first!' : '⏳ Checking...'}
        </span>
      </div>

      {/* Profile Quick View */}
      {profile && (
        <div className="bg-surface-container p-6 rounded-2xl glass-card flex items-center gap-5">
          <img
            src={profile.imageUrl || '/profile.png'}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
            onError={e => { e.currentTarget.src = 'https://via.placeholder.com/64?text=P'; }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold">{profile.name}</h3>
            <p className="text-primary text-sm font-semibold">{profile.title}</p>
            <p className="text-on-surface-variant text-sm mt-1 line-clamp-1">{profile.bio}</p>
          </div>
          <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors"
          >
            <ExternalLink size={16} />
            View Website
          </a>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-surface-container p-5 rounded-xl glass-card text-center">
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon size={22} className={card.color} />
              </div>
              <div className="text-3xl font-bold mb-1">{apiStatus === 'online' ? card.value : '–'}</div>
              <div className="text-on-surface-variant text-sm">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-surface-container p-6 rounded-2xl glass-card">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Edit Profile & Hero', path: '/profile', desc: 'Update your name, photo, and bio', icon: '👤' },
            { label: 'Manage Portfolio', path: '/portfolio', desc: 'Add or edit project showcases', icon: '🎨' },
            { label: 'Update Experience', path: '/experience', desc: 'Work history and leadership roles', icon: '💼' },
            { label: 'Add Certifications', path: '/certifications', desc: 'Upload certificates with PDF/image', icon: '🏆' },
          ].map(item => (
            <a key={item.label} href={item.path}
              className="flex items-start gap-3 p-4 rounded-xl border border-on-surface/5 hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="text-on-surface-variant text-xs mt-0.5">{item.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Instructions */}
      {apiStatus === 'offline' && (
        <div className="border border-red-500/30 bg-red-500/5 p-5 rounded-xl">
          <h4 className="font-bold text-red-400 mb-2">⚠️ API Server is Offline</h4>
          <p className="text-sm text-on-surface-variant mb-3">The admin panel cannot load data without the API server. Run this command to start it:</p>
          <code className="block bg-surface-variant p-3 rounded-lg text-xs font-mono text-primary">
            cd d:\website\fathan-porto\apps\api && npx tsx --watch src/index.ts
          </code>
        </div>
      )}
    </div>
  );
}

