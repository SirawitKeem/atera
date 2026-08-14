'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  Laptop, 
  AlertTriangle, 
  FileText, 
  Settings,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  workspaceName?: string;
  userRole?: string;
  userInitials?: string;
}

export default function Sidebar({ 
  activeItem = 'Overview', 
  onItemClick,
  workspaceName = 'Workspace',
  userRole = 'Atera IT Admin',
  userInitials = 'KM'
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'Customers', label: 'Customers', icon: Users },
    { id: 'Devices', label: 'Devices', icon: Laptop },
    { id: 'Tickets', label: 'Tickets', icon: Ticket },
    { id: 'Alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'Executive Report', label: 'Executive Report', icon: FileText },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 left-0 transition-all duration-300 no-print  z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className={`flex items-center justify-between p-5 border-b border-slate-100 h-16 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
            <TrendingUp className="h-5 w-5 text-white animate-pulse" />
          </div>
          {!isCollapsed && (
            <span className="text-base font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent truncate">
              ATERA WORKSPACE
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer hidden md:block"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-none">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer group ${
                isActive
                  ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
              </div>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Profile Card & Collapse footer */}
      <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-2 py-1.5'}`}>
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0 ">
            {userInitials}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-slate-800 truncate leading-none">{workspaceName}</span>
              <span className="block text-[10px] text-slate-400 mt-1 truncate">{userRole}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 transition-all cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse Menu</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
