import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FolderOpen, LogOut, Hexagon } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
      ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`
    }
  >
    <Icon size={20} />
    <span>{label}</span>
  </NavLink>
);

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', background: 'white', borderRight: '1px solid var(--border)', 
        padding: '32px 24px', display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh'
      }}>
        <div className="flex items-center gap-2 mb-10 px-2 text-indigo-600">
          <Hexagon size={28} strokeWidth={2.5} />
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Form Banao</h1>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem to="/admin" icon={LayoutDashboard} label="Overview" />
          <SidebarItem to="/admin/create" icon={PlusCircle} label="Create Form" />
          <SidebarItem to="/admin/responses" icon={FolderOpen} label="Responses" />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <SidebarItem to="/" icon={LogOut} label="Sign Out" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;