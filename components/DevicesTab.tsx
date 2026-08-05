'use client';

import React, { useState, useMemo } from 'react';
import { 
  Laptop, 
  Apple, 
  Layers, 
  Globe, 
  Monitor, 
  Clock,
  ArrowUpDown,
  Search
} from 'lucide-react';

interface Device {
  AgentID: number;
  MachineName: string;
  OS: string;
  CustomerID: number;
  CustomerName: string;
  Online: boolean;
  DeviceType: string;
  IPAddress: string;
}

interface DevicesTabProps {
  agents: Device[];
}

export default function DevicesTab({ agents }: DevicesTabProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'online' | 'offline'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOs, setSelectedOs] = useState<string>('__all');
  
  const [sortField, setSortField] = useState<string>('MachineName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getOsInfo = (osName?: string) => {
    const cls = (osName || '').toLowerCase();
    if (cls.includes('win') && cls.includes('server')) {
      return {
        name: 'Windows Server',
        icon: (
          <svg className="w-4.5 h-4.5 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z" />
          </svg>
        )
      };
    }
    if (cls.includes('win')) {
      return {
        name: 'Windows',
        icon: (
          <svg className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z" />
          </svg>
        )
      };
    }
    if (cls.includes('mac') || cls.includes('apple') || cls.includes('darwin')) {
      return {
        name: 'macOS',
        icon: <Apple className="w-4.5 h-4.5 text-slate-700 flex-shrink-0" />
      };
    }
    if (cls.includes('linux') || cls.includes('ubuntu') || cls.includes('debian')) {
      return {
        name: 'Linux',
        icon: (
          <svg className="w-4.5 h-4.5 text-slate-800 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c-.96 0-1.88.36-2.5 1-.63.64-.9 1.48-.9 2.5 0 1.25.6 2.76 1.15 3.86a6.83 6.83 0 0 0-3.75 6.09c0 3.03 2.5 5.55 5.75 5.55s5.75-2.52 5.75-5.55a6.83 6.83 0 0 0-3.75-6.09c.55-1.1 1.15-2.61 1.15-3.86 0-1.02-.27-1.86-.9-2.5-.62-.64-1.54-1-2.5-1zm0 1.5c.57 0 .97.3 1.25.6.3.3.45.8.45 1.4 0 .95-.5 2.25-.95 3.15-.22.45-.48.9-.75 1.35a.5.5 0 0 1-.7 0c-.27-.45-.53-.9-.75-1.35-.45-.9-.95-2.2-.95-3.15 0-.6.15-1.1.45-1.4.28-.3.68-.6 1.25-.6zm-1.8 11.5a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zm6 0a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zm-3 1.5c-.83 0-1.5.34-1.5.75S11.17 18 12 18s1.5-.34 1.5-.75-.67-.75-1.5-.75z" />
          </svg>
        )
      };
    }
    return {
      name: 'Generic',
      icon: <Monitor className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
    };
  };

  const counts = useMemo(() => {
    const all = agents.length;
    const online = agents.filter(a => a.Online).length;
    const offline = all - online;
    return { all, online, offline };
  }, [agents]);

  const uniqueOSClasses = useMemo(() => {
    const set = new Set<string>();
    agents.forEach(a => {
      if (a.OS) {
        const info = getOsInfo(a.OS);
        set.add(info.name);
      }
    });
    return Array.from(set).sort();
  }, [agents]);

  const filteredDevices = useMemo(() => {
    let list = agents.map(a => {
      const osInfo = getOsInfo(a.OS);
      return {
        ...a,
        osInfo
      };
    });

    // filter by tab
    if (selectedTab === 'online') {
      list = list.filter(d => d.Online);
    } else if (selectedTab === 'offline') {
      list = list.filter(d => !d.Online);
    }

    // filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(d => 
        d.MachineName.toLowerCase().includes(q) || 
        d.CustomerName.toLowerCase().includes(q) ||
        d.IPAddress.toLowerCase().includes(q)
      );
    }

    // filter by OS select dropdown
    if (selectedOs !== '__all') {
      list = list.filter(d => d.osInfo.name === selectedOs);
    }

    // sort logic
    list.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      switch (sortField) {
        case 'MachineName':
          valA = a.MachineName.toLowerCase();
          valB = b.MachineName.toLowerCase();
          break;
        case 'CustomerName':
          valA = a.CustomerName.toLowerCase();
          valB = b.CustomerName.toLowerCase();
          break;
        case 'OS':
          valA = a.osInfo.name.toLowerCase();
          valB = b.osInfo.name.toLowerCase();
          break;
        case 'DeviceType':
          valA = a.DeviceType.toLowerCase();
          valB = b.DeviceType.toLowerCase();
          break;
        case 'Online':
          valA = a.Online ? 1 : 0;
          valB = b.Online ? 1 : 0;
          break;
        case 'IPAddress':
          valA = a.IPAddress.toLowerCase();
          valB = b.IPAddress.toLowerCase();
          break;
        default:
          valA = a.MachineName.toLowerCase();
          valB = b.MachineName.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [agents, selectedTab, searchQuery, selectedOs, sortField, sortDirection]);

  const renderHeader = (label: string, field: string) => {
    const isSorted = sortField === field;
    return (
      <th
        onClick={() => handleSort(field)}
        className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/50 transition-colors group"
      >
        <div className="flex items-center gap-1.5 justify-start font-bold">
          <span>{label}</span>
          <span className="text-slate-400 group-hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100 duration-200">
            <ArrowUpDown className={`h-3 w-3 ${isSorted ? 'text-blue-600' : ''}`} />
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-6 border-b border-slate-100 pb-px">
        {[
          { id: 'all', label: 'All Devices', count: counts.all, color: 'bg-slate-100 text-slate-600' },
          { id: 'online', label: 'Active (Online)', count: counts.online, color: 'bg-emerald-50 text-emerald-700' },
          { id: 'offline', label: 'Offline', count: counts.offline, color: 'bg-rose-50 text-rose-700' }
        ].map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`pb-3.5 text-sm font-semibold relative transition-colors cursor-pointer flex items-center gap-2 select-none ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tab.color}`}>
                  {tab.count}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Control panel */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by device or client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="relative">
            <select
              value={selectedOs}
              onChange={(e) => setSelectedOs(e.target.value)}
              className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-700 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-8.5"
            >
              <option value="__all">All Systems</option>
              {uniqueOSClasses.map(os => (
                <option key={os} value={os}>{os}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {(searchQuery || selectedOs !== '__all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedOs('__all');
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer select-none"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Loaded <span className="text-slate-800 font-bold">{filteredDevices.length}</span> agents
        </div>
      </div>

      {/* Main Devices Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                <th className="px-6 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded-sm border-slate-300 accent-blue-600 cursor-pointer" />
                </th>
                {renderHeader('Machine Name', 'MachineName')}
                {renderHeader('Client Account', 'CustomerName')}
                {renderHeader('System / OS', 'OS')}
                {renderHeader('Device Type', 'DeviceType')}
                {renderHeader('IP Address', 'IPAddress')}
                {renderHeader('Online Status', 'Online')}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-slate-400 font-medium">
                    No devices matched the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDevices.map((dev) => (
                  <tr key={dev.AgentID} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded-sm border-slate-300 accent-blue-600" />
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        {dev.osInfo.icon}
                        <span>{dev.MachineName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {dev.CustomerName}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                      {dev.OS}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {dev.DeviceType}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {dev.IPAddress}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        dev.Online
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                          : 'bg-slate-50 text-slate-400 border-slate-200/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dev.Online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        {dev.Online ? 'Online' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
