import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, History, MessageSquareText, Settings, Bell, Search, User, Box, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlobalCopilot from '@/components/copilot/GlobalCopilot';

export default function SemanticLayout() {
  const location = useLocation();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 lg:w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col transition-all duration-300">
        <div className="h-14 flex items-center px-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-white">S</span>
          </div>
          <span className="ml-3 font-semibold text-slate-100 hidden lg:block truncate">语义治理平台</span>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          <NavItem to="/semantic/inbox" icon={<ListTodo size={20} />} label="语义待办" />
          <NavItem to="/semantic/releases" icon={<History size={20} />} label="版本发布" />
          <NavItem to="/semantic/workbench" icon={<LayoutDashboard size={20} />} label="工作台" />
          <NavItem to="/semantic/table-understanding/lv_005" icon={<BrainCircuit size={20} />} label="表理解" />
          <NavItem to="/semantic/objects/lv_005" icon={<Box size={20} />} label="对象生成" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <button className="flex items-center w-full px-2 py-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors">
            <Settings size={20} />
            <span className="ml-3 hidden lg:block text-sm">设置</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
        {/* Top Bar */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-slate-100">
              {location.pathname.includes('inbox') ? '语义待办箱' : 
               location.pathname.includes('releases') ? '版本发布管理' : '语义工作台'}
            </h1>
            <div className="h-4 w-px bg-slate-700 mx-2" />
            <div className="hidden md:flex items-center text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
              <Search size={12} className="mr-2" />
              <span>搜索资产、表...</span>
              <span className="ml-4 text-slate-600">⌘K</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className={cn(
                "p-2 rounded-full transition-colors relative",
                isCopilotOpen ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              )}
            >
              <MessageSquareText size={20} />
              {!isCopilotOpen && <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-300 border border-slate-600">
              OU
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          <Outlet context={{ setIsCopilotOpen }} />
        </div>

        {/* Global Copilot Overlay */}
        <GlobalCopilot isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-2 py-2 rounded-md text-sm font-medium transition-colors group",
          isActive
            ? "bg-indigo-600/10 text-indigo-400"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        )
      }
    >
      <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
      <span className="ml-3 hidden lg:block">{label}</span>
    </NavLink>
  );
}
