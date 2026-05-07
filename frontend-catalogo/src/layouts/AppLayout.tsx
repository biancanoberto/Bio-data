import { BarChart3, ListTree, Plus } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { cn } from '../utils/classNames';

const links = [
  { icon: ListTree, label: 'Especies', to: '/' },
  { icon: BarChart3, label: 'Dashboard', to: '/dashboard' },
  { icon: Plus, label: 'Novo', to: '/animals/new' },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-emerald-900/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <Link
            aria-label="Ir para a listagem de especies"
            className="inline-flex items-center"
            to="/"
          >
            <img
              alt="BioData Manager"
              className="h-12 w-auto max-w-[220px] object-contain sm:h-14"
              height="346"
              src="/logo-estendida.png"
              width="720"
            />
          </Link>

          <nav className="flex flex-wrap gap-2">
            {links.map(({ icon: Icon, label, to }) => (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition',
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                  )
                }
                end={to === '/'}
                key={to}
                to={to}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <Outlet />
      </main>
    </div>
  );
}
