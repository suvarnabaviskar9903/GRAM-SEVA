import {
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock,
  FilePlus2,
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  Map,
  MessageSquareHeart,
  SearchCheck,
  Settings,
  UserCircle2,
  Users,
  UserCheck,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!user) return null;

  const citizenLinks: NavItem[] = [
    { to: '/citizen', label: t.nav.dashboard, icon: LayoutDashboard, end: true },
    { to: '/citizen/submit', label: t.nav.submitComplaint, icon: FilePlus2 },
    { to: '/citizen/complaints', label: t.nav.myComplaints, icon: ClipboardList },
    { to: '/track', label: t.nav.trackComplaint, icon: SearchCheck },
    { to: '/map', label: t.nav.villageMap, icon: Map },
    { to: '/notifications', label: t.nav.notifications, icon: Bell },
    { to: '/profile', label: t.nav.profile, icon: UserCircle2 },
  ];

  const adminLinks: NavItem[] = [
    { to: '/admin', label: t.nav.overview, icon: LayoutDashboard, end: true },
    { to: '/admin/complaints', label: t.nav.allComplaints, icon: ClipboardList },
    { to: '/admin/complaints?status=submitted', label: t.nav.newComplaints, icon: FilePlus2 },
    { to: '/admin/complaints?status=pending', label: t.nav.pendingComplaints, icon: Clock },
    { to: '/admin/complaints?status=assigned', label: t.nav.assignedComplaints, icon: UserCheck },
    { to: '/admin/staff', label: t.nav.staffManagement, icon: Users },
    { to: '/admin/citizens', label: t.nav.citizenManagement, icon: UserCircle2 },
    { to: '/admin/departments', label: t.nav.departments, icon: Building2 },
    { to: '/admin/categories', label: t.nav.categories, icon: FolderKanban },
    { to: '/map', label: t.nav.villageMap, icon: Map },
    { to: '/admin/analytics', label: t.nav.analytics, icon: BarChart3 },
    { to: '/admin/feedback', label: t.nav.feedback, icon: MessageSquareHeart },
    { to: '/notifications', label: t.nav.notifications, icon: Bell },
    { to: '/admin/settings', label: t.nav.settings, icon: Settings },
  ];

  const staffLinks: NavItem[] = [
    { to: '/staff', label: t.nav.dashboard, icon: LayoutDashboard, end: true },
    { to: '/staff/tasks', label: t.nav.assignedTasks, icon: ClipboardList },
    { to: '/staff/completed', label: t.nav.completedTasks, icon: CheckCircle2 },
    { to: '/map', label: t.nav.villageMap, icon: Map },
    { to: '/notifications', label: t.nav.notifications, icon: Bell },
    { to: '/profile', label: t.nav.profile, icon: UserCircle2 },
  ];

  const links =
    user.role === 'admin'
      ? adminLinks
      : user.role === 'staff'
      ? staffLinks
      : citizenLinks;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const content = (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64">
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
        <NavLink
          to="/"
          onClick={onClose}
          className="text-lg font-bold tracking-tight text-[#14532D] dark:text-[#22C55E] whitespace-nowrap"
        >
          {t.brand.name}
        </NavLink>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
          {user.fullName}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {t.roles[user.role]} · {t.common.wardPrefix} {user.wardNumber}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#F0FDF4] dark:bg-emerald-950/60 text-[#14532D] dark:text-[#22C55E]'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1 shrink-0">
        <NavLink
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>{t.nav.home}</span>
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{t.nav.logout}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0">{content}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/60" onClick={onClose} />
          <div className="relative z-10 h-full">{content}</div>
        </div>
      )}
    </>
  );
}
