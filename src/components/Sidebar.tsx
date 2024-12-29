import React from 'react';
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuGroups = [
  {
    title: 'Main',
    items: [
      { text: 'Dashboard', icon: HomeIcon, path: '/' },
      { text: 'Projects', icon: BusinessIcon, path: '/proyecto' },
      { text: 'Activities', icon: DashboardIcon, path: '/actividad' }
    ]
  },
  {
    title: 'Management',
    items: [
      { text: 'Structures', icon: BusinessIcon, path: '/estructura' },
      { text: 'Locations', icon: LocationIcon, path: '/ubicacion-estructura' },
      { text: 'Personnel', icon: PeopleIcon, path: '/persona' },
      { text: 'Companies', icon: WorkIcon, path: '/empresa' }
    ]
  },
  {
    title: 'Settings',
    items: [
      { text: 'Activity Types', icon: SettingsIcon, path: '/tipo-actividad' },
      { text: 'Structure Types', icon: SettingsIcon, path: '/tipo-estructura' },
      { text: 'Roles', icon: SettingsIcon, path: '/rol' }
    ]
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(null);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen pt-16 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 lg:translate-x-0 w-64`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-4">
              <button
                onClick={() => setExpandedGroup(expandedGroup === group.title ? null : group.title)}
                className="flex items-center justify-between w-full px-4 py-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <span className="text-sm font-semibold">{group.title}</span>
                <ExpandMoreIcon
                  className={`w-4 h-4 transition-transform ${
                    expandedGroup === group.title ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`mt-2 space-y-1 ${
                  expandedGroup === group.title ? 'block' : 'hidden'
                }`}
              >
                {group.items.map((item) => (
                  <a
                    key={item.text}
                    href={item.path}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}