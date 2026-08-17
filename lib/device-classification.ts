export type DevicePlatform = 'linux' | 'macos' | 'windows' | 'unknown';

export interface DeviceClassificationInput {
  deviceType?: unknown;
  osType?: unknown;
  os?: unknown;
}

const linuxMarkers = [
  'linux', 'ubuntu', 'debian', 'fedora', 'centos', 'red hat', 'rhel',
  'rocky', 'alma', 'suse', 'opensuse', 'arch', 'gentoo', 'raspbian', 'kali',
  'oracle linux', 'amazon linux',
];

export function normalizeDeviceValue(value: unknown): string {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

export function getDevicePlatform({ osType, os }: DeviceClassificationInput): DevicePlatform {
  const operatingSystem = `${normalizeDeviceValue(osType)} ${normalizeDeviceValue(os)}`.toLowerCase();

  if (linuxMarkers.some(marker => operatingSystem.includes(marker))) return 'linux';
  if (operatingSystem.includes('mac') || operatingSystem.includes('darwin') || operatingSystem.includes('os x')) return 'macos';
  if (operatingSystem.includes('windows') || operatingSystem.includes('win32') || operatingSystem.includes('win64')) return 'windows';

  return 'unknown';
}

export function isServerDevice({ deviceType, osType }: DeviceClassificationInput): boolean {
  const type = normalizeDeviceValue(deviceType).toLowerCase();
  const osCategory = normalizeDeviceValue(osType).toLowerCase();
  return type.includes('server') || osCategory.includes('server') || osCategory.includes('controller');
}