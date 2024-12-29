import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center ml-2 lg:ml-0">
              <span className="text-xl font-semibold flex items-center gap-2">
                Construction Management
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder="Search..."
                />
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <NotificationsIcon className="w-6 h-6" />
            </button>
            <button className="flex items-center text-sm p-2 rounded-lg hover:bg-gray-100">
              <PersonIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}