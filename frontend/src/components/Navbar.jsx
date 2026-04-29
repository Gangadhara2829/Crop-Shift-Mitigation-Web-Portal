import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          <div className="flex flex-1 items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              <div className="bg-nature-50 p-2 rounded-xl group-hover:bg-nature-100 transition-colors">
                 <Leaf className="h-6 w-6 text-nature-600" />
              </div>
              <span className="font-extrabold text-2xl text-nature-900 tracking-tight">CropShift<span className="text-nature-500">.</span></span>
            </Link>
          </div>
          
          <div className="flex items-center gap-1 md:gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isCurrent('/dashboard') ? 'bg-nature-50 text-nature-700' : 'text-gray-500 hover:bg-gray-50 hover:text-nature-600'}`}>Dashboard</Link>
                <Link to="/schemes" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isCurrent('/schemes') ? 'bg-nature-50 text-nature-700' : 'text-gray-500 hover:bg-gray-50 hover:text-nature-600'}`}>Government Schemes</Link>
                <div className="flex items-center gap-4 ml-2 pl-4 md:ml-4 md:pl-6 border-l border-gray-200">
                    <div className="hidden md:flex flex-col items-end">
                       <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Farmer</span>
                       <span className="text-sm font-bold text-gray-800">{user.name}</span>
                    </div>
                    <div className="h-10 w-10 bg-gradient-to-tr from-nature-400 to-nature-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
                       {user.name.charAt(0).toUpperCase()}
                    </div>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all ml-2" title="Logout">
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
              </>
            ) : (
                <Link to="/schemes" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isCurrent('/schemes') ? 'bg-nature-50 text-nature-700' : 'text-gray-500 hover:bg-gray-50 hover:text-nature-600'}`}>Government Schemes</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
