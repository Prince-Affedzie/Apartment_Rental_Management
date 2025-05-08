import { Bell, Menu, X } from 'lucide-react';
import { useProfileContext } from '../../Context/fetchProfileContext';
import { useEffect } from 'react';

export default function TopNav({ toggleMobileMenu, mobileMenuOpen }) {
  const {profile,getProfile} = useProfileContext()
 
  useEffect(()=>{
     if(!profile){
      getProfile()
     }
  },[])

  return (
    <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-30">
      <div className="flex justify-between items-center flex-wrap gap-4">
        {/* Mobile Menu + Branding */}
        <div className="flex items-center gap-4">
          <button onClick={toggleMobileMenu} className="md:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold md:hidden">{profile?.name}</h1>
          <h1 className="hidden md:block text-2xl font-bold">Dashboard</h1>
        </div>

        {/* Notification & Profile */}
        <div className="flex items-center gap-6 ml-auto">
          {/*<div className="relative">
            <Bell size={20} className="text-gray-500 cursor-pointer" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">3</span>
          </div> */}

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 text-white font-medium rounded-full flex items-center justify-center">
            {profile?.name.slice(0,2)}
            </div>
            <div className="hidden md:block leading-tight">
              <p className="font-medium">{profile?.name}</p>
              <p className="text-xs text-gray-500">{profile?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
