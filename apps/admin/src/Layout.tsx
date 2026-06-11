import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCircle, Briefcase, FolderGit2, Star, Award } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Services', path: '/services', icon: Briefcase },
    { name: 'Portfolio', path: '/portfolio', icon: FolderGit2 },
    { name: 'Experience', path: '/experience', icon: Star },
    { name: 'Certifications', path: '/certifications', icon: Award },
  ];

  return (
    <div className="flex h-screen bg-background text-on-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-surface-variant bg-surface-container-low p-6 flex flex-col gap-8">
        <div>
          <h1 className="text-xl font-display font-bold text-primary">Admin Panel</h1>
          <p className="text-sm text-on-surface-variant">Portfolio Manager</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                    : 'hover:bg-surface text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
