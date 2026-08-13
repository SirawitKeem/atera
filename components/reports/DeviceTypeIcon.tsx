'use client';

import React from 'react';
import { Monitor, Laptop, Server, Terminal } from 'lucide-react';

interface DeviceTypeIconProps {
  deviceType?: string;
  osType?: string;
  os?: string;
  className?: string;
}

export default function DeviceTypeIcon({ 
  deviceType = '', 
  osType = '', 
  os = '', 
  className = 'w-3.5 h-3.5 flex-shrink-0' 
}: DeviceTypeIconProps) {
  const type = String(deviceType || '').toLowerCase();
  const ost = String(osType || '').toLowerCase();
  const osName = String(os || '').toLowerCase();

  // 1. Check for Server / Domain Controller
  if (type.includes('server') || ost.includes('server') || ost.includes('controller') || osName.includes('server')) {
    return <Server className={`${className} text-indigo-500`} />;
  }

  // 2. Check for Linux
  if (type.includes('linux') || ost.includes('linux') || osName.includes('linux') || osName.includes('ubuntu') || osName.includes('debian')) {
    return <Terminal className={`${className} text-emerald-600`} />;
  }

  // 3. Check for Mac / Apple
  if (type.includes('mac') || type.includes('apple') || ost.includes('mac') || osName.includes('mac') || osName.includes('darwin')) {
    return <Laptop className={`${className} text-slate-700`} />;
  }

  // 4. Check for PC / Workstation / Desktop (Windows client OS)
  if (type.includes('pc') || type.includes('workstation') || type.includes('desktop') || ost.includes('work station') || ost.includes('workstation') || ost.includes('desktop') || osName.includes('win')) {
    return <Monitor className={`${className} text-blue-500`} />;
  }

  // Default fallback
  return <Monitor className={`${className} text-slate-400`} />;
}
