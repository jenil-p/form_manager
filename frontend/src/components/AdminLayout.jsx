import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FolderOpen, LogOut } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`
    }
    style={({ isActive }) => ({
      backgroundColor: isActive ? '#EEF2FF' : 'transparent',
      color: isActive ? 'var(--primary)' : 'var(--text-muted)'
    })}
  >
    <Icon size={20} />
    <span>{label}</span>
  </NavLink>
);

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '40px', display:'flex', alignItems:'center', gap:'10px' }}>
           FormFlow
        </h1>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <SidebarItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/admin/create" icon={PlusCircle} label="Create Form" />
          <SidebarItem to="/admin/responses" icon={FolderOpen} label="Responses" />
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <SidebarItem to="/" icon={LogOut} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;