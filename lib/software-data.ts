export interface SoftwareUpdate {
  softwareName: string;
  currentVersion: string;
  availableVersion: string;
  status: 'Upgradable' | 'Available';
  agentName: string;
  customerName: string;
  deviceGuid: string;
  deviceType: string;
  os: string;
}

// In the Atera console:
// Total of 5 Devices are missing software updates (TRAC-SPARE-001, AD-TEST-2025, TIME-ATERA, WINDOWS10-DBS, ME-LOGS360).
// Total number of pending software updates = 11 + 9 + 5 + 4 + 4 = 33 updates.
export const mockSoftwareUpdates: SoftwareUpdate[] = [
  // TRAC-SPARE-001 (Customer: TRAC) -> 11 Updates
  {
    softwareName: "Google Chrome",
    currentVersion: "120.0.6099.109",
    availableVersion: "121.0.6167.85",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },
  {
    softwareName: "Zoom Client",
    currentVersion: "5.16.10",
    availableVersion: "5.17.5",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },
  {
    softwareName: "Adobe Acrobat Reader",
    currentVersion: "23.008.20343",
    availableVersion: "23.008.20352",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },
  {
    softwareName: "Microsoft Edge",
    currentVersion: "120.0.2210.133",
    availableVersion: "121.0.2277.83",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },
  {
    softwareName: "Git for Windows",
    currentVersion: "2.43.0",
    availableVersion: "2.43.2",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },
  {
    softwareName: "WinRAR",
    currentVersion: "6.24",
    availableVersion: "7.00",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },
  {
    softwareName: "7-Zip",
    currentVersion: "23.01",
    availableVersion: "24.01",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },
  {
    softwareName: "Notepad++",
    currentVersion: "8.5.8",
    availableVersion: "8.6.2",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },
  {
    softwareName: "VLC Media Player",
    currentVersion: "3.0.18",
    availableVersion: "3.0.20",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },
  {
    softwareName: "Slack",
    currentVersion: "4.35.0",
    availableVersion: "4.36.140",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },
  {
    softwareName: "Microsoft Teams",
    currentVersion: "24020.0.0.0",
    availableVersion: "24033.811.2738.2546",
    status: "Available",
    agentName: "TRAC-SPARE-001",
    customerName: "TRAC",
    deviceGuid: "7975d2ca-bd4e-406e-a054-edbfc6c59cdc",
    deviceType: "Workstation",
    os: "Windows 11 Pro"
  },

  // AD-TEST-2025 (Customer: Unassigned) -> 9 Updates
  {
    softwareName: "Google Chrome",
    currentVersion: "120.0.6099.109",
    availableVersion: "121.0.6167.85",
    status: "Available",
    agentName: "AD-TEST-2025",
    customerName: "Unassigned",
    deviceGuid: "8df323ee-3a4d-4560-96fb-6666091c0c7c",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Adobe Acrobat Reader",
    currentVersion: "23.008.20343",
    availableVersion: "23.008.20352",
    status: "Available",
    agentName: "AD-TEST-2025",
    customerName: "Unassigned",
    deviceGuid: "8df323ee-3a4d-4560-96fb-6666091c0c7c",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Microsoft Edge",
    currentVersion: "120.0.2210.133",
    availableVersion: "121.0.2277.83",
    status: "Available",
    agentName: "AD-TEST-2025",
    customerName: "Unassigned",
    deviceGuid: "8df323ee-3a4d-4560-96fb-6666091c0c7c",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Git for Windows",
    currentVersion: "2.43.0",
    availableVersion: "2.43.2",
    status: "Available",
    agentName: "AD-TEST-2025",
    customerName: "Unassigned",
    deviceGuid: "8df323ee-3a4d-4560-96fb-6666091c0c7c",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Notepad++",
    currentVersion: "8.5.8",
    availableVersion: "8.6.2",
    status: "Available",
    agentName: "AD-TEST-2025",
    customerName: "Unassigned",
    deviceGuid: "8df323ee-3a4d-4560-96fb-6666091c0c7c",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "7-Zip",
    currentVersion: "23.01",
    availableVersion: "24.01",
    status: "Available",
    agentName: "AD-TEST-2025",
    customerName: "Unassigned",
    deviceGuid: "8df323ee-3a4d-4560-96fb-6666091c0c7c",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "WinRAR",
    currentVersion: "6.24",
    availableVersion: "7.00",
    status: "Available",
    agentName: "AD-TEST-2025",
    customerName: "Unassigned",
    deviceGuid: "8df323ee-3a4d-4560-96fb-6666091c0c7c",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Zoom Client",
    currentVersion: "5.16.10",
    availableVersion: "5.17.5",
    status: "Available",
    agentName: "AD-TEST-2025",
    customerName: "Unassigned",
    deviceGuid: "8df323ee-3a4d-4560-96fb-6666091c0c7c",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Node.js",
    currentVersion: "20.10.0",
    availableVersion: "20.11.0",
    status: "Available",
    agentName: "AD-TEST-2025",
    customerName: "Unassigned",
    deviceGuid: "8df323ee-3a4d-4560-96fb-6666091c0c7c",
    deviceType: "Server",
    os: "Windows Server 2025"
  },

  // TIME-ATERA (Customer: Unassigned) -> 5 Updates
  {
    softwareName: "Google Chrome",
    currentVersion: "120.0.6099.109",
    availableVersion: "121.0.6167.85",
    status: "Available",
    agentName: "TIME-ATERA",
    customerName: "Unassigned",
    deviceGuid: "df7b15fd-0925-4307-a826-ad82615aa076",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Microsoft Edge",
    currentVersion: "120.0.2210.133",
    availableVersion: "121.0.2277.83",
    status: "Available",
    agentName: "TIME-ATERA",
    customerName: "Unassigned",
    deviceGuid: "df7b15fd-0925-4307-a826-ad82615aa076",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Adobe Acrobat Reader",
    currentVersion: "23.008.20343",
    availableVersion: "23.008.20352",
    status: "Available",
    agentName: "TIME-ATERA",
    customerName: "Unassigned",
    deviceGuid: "df7b15fd-0925-4307-a826-ad82615aa076",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Git for Windows",
    currentVersion: "2.43.0",
    availableVersion: "2.43.2",
    status: "Available",
    agentName: "TIME-ATERA",
    customerName: "Unassigned",
    deviceGuid: "df7b15fd-0925-4307-a826-ad82615aa076",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Notepad++",
    currentVersion: "8.5.8",
    availableVersion: "8.6.2",
    status: "Available",
    agentName: "TIME-ATERA",
    customerName: "Unassigned",
    deviceGuid: "df7b15fd-0925-4307-a826-ad82615aa076",
    deviceType: "Server",
    os: "Windows Server 2025"
  },

  // WINDOWS10-DBS (Customer: Unassigned) -> 4 Updates
  {
    softwareName: "Google Chrome",
    currentVersion: "120.0.6099.109",
    availableVersion: "121.0.6167.85",
    status: "Available",
    agentName: "WINDOWS10-DBS",
    customerName: "Unassigned",
    deviceGuid: "ba07ac51-9e57-4a52-b1e2-86d9d66733a7",
    deviceType: "Workstation",
    os: "Windows 10 Pro"
  },
  {
    softwareName: "Microsoft Edge",
    currentVersion: "120.0.2210.133",
    availableVersion: "121.0.2277.83",
    status: "Available",
    agentName: "WINDOWS10-DBS",
    customerName: "Unassigned",
    deviceGuid: "ba07ac51-9e57-4a52-b1e2-86d9d66733a7",
    deviceType: "Workstation",
    os: "Windows 10 Pro"
  },
  {
    softwareName: "Adobe Acrobat Reader",
    currentVersion: "23.008.20343",
    availableVersion: "23.008.20352",
    status: "Available",
    agentName: "WINDOWS10-DBS",
    customerName: "Unassigned",
    deviceGuid: "ba07ac51-9e57-4a52-b1e2-86d9d66733a7",
    deviceType: "Workstation",
    os: "Windows 10 Pro"
  },
  {
    softwareName: "WinRAR",
    currentVersion: "6.24",
    availableVersion: "7.00",
    status: "Available",
    agentName: "WINDOWS10-DBS",
    customerName: "Unassigned",
    deviceGuid: "ba07ac51-9e57-4a52-b1e2-86d9d66733a7",
    deviceType: "Workstation",
    os: "Windows 10 Pro"
  },

  // ME-LOGS360 (Customer: Unassigned) -> 4 Updates
  {
    softwareName: "Google Chrome",
    currentVersion: "120.0.6099.109",
    availableVersion: "121.0.6167.85",
    status: "Available",
    agentName: "ME-LOGS360",
    customerName: "Unassigned",
    deviceGuid: "caff222c-3333-4d7e-b2cc-c413c0fbd2bb",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Microsoft Edge",
    currentVersion: "120.0.2210.133",
    availableVersion: "121.0.2277.83",
    status: "Available",
    agentName: "ME-LOGS360",
    customerName: "Unassigned",
    deviceGuid: "caff222c-3333-4d7e-b2cc-c413c0fbd2bb",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Adobe Acrobat Reader",
    currentVersion: "23.008.20343",
    availableVersion: "23.008.20352",
    status: "Available",
    agentName: "ME-LOGS360",
    customerName: "Unassigned",
    deviceGuid: "caff222c-3333-4d7e-b2cc-c413c0fbd2bb",
    deviceType: "Server",
    os: "Windows Server 2025"
  },
  {
    softwareName: "Zoom Client",
    currentVersion: "5.16.10",
    availableVersion: "5.17.5",
    status: "Available",
    agentName: "ME-LOGS360",
    customerName: "Unassigned",
    deviceGuid: "caff222c-3333-4d7e-b2cc-c413c0fbd2bb",
    deviceType: "Server",
    os: "Windows Server 2025"
  }
];
