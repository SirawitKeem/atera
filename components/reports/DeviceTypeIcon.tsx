'use client';

import { Laptop, Monitor, Server } from 'lucide-react';
import { FaLinux } from 'react-icons/fa';
import { getDevicePlatform, isServerDevice } from '@/lib/device-classification';

interface DeviceTypeIconProps {
  deviceType?: string;
  osType?: string;
  os?: string;
  className?: string;
}

export default function DeviceTypeIcon({ deviceType, osType, os, className = 'w-3.5 h-3.5 flex-shrink-0' }: DeviceTypeIconProps) {
  const dt = String(deviceType || '').toLowerCase();
  const ot = String(osType || '').toLowerCase();
  const o = String(os || '').toLowerCase();

  // If any input value indicates Linux, return the Linux penguin icon immediately
  const isLinux = dt.includes('linux') || ot.includes('linux') || o.includes('linux');
  if (isLinux) return <FaLinux className={`${className} text-status-online`} aria-label="Linux device" />;

  const platform = getDevicePlatform({ osType, os });

  // Device Type remains authoritative for server hardware. Platform comes only
  // from OS values returned by the API; unknown data uses a neutral icon.
  if (isServerDevice({ deviceType, osType })) return <Server className={`${className} text-report-heading`} />;
  if (platform === 'macos') return <Laptop className={`${className} text-report-heading`} />;
  if (platform === 'windows') return <Monitor className={`${className} text-severity-moderate`} />;

  return <Monitor className={`${className} text-report-muted`} />;
}