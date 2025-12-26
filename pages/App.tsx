
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  History, 
  Settings as SettingsIcon,
  PlusCircle
} from 'lucide-react';
import Dashboard from './Dashboard';
import Customers from './Customers';
import CustomerDetail from './CustomerDetail';
import Transactions from './Transactions';
import Settings from './Settings';
import { StoreProvider } from '../store';

const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center w-full py-2 space-y-1 transition-colors ${
        isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={24} />
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </Link>
  );
};

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-1 z-50 flex items-center justify-between safe-area-pb">
      <NavItem to="/" icon={LayoutDashboard} label="Home" />
      <NavItem to="/customers" icon={Users} label="Clients" />
      <div className="flex flex-col items-center justify-center -mt-8">
         <Link to="/transactions" className="bg-indigo-600 p-4 rounded-full text-white shadow-lg shadow-indigo-200 border-4 border-slate-50 hover:bg-indigo-700 transition-transform active:scale-95">
           <PlusCircle size={24} />
         </Link>
      </div>
      <NavItem to="/history" icon={History} label="History" />
      <NavItem to="/settings" icon={SettingsIcon} label="Settings" />
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <div className="min-h-screen pb-24 md:max-w-md md:mx-auto md:shadow-xl md:bg-white bg-slate-50">
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              DeenRaac
            </h1>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=business" alt="Avatar" />
            </div>
          </header>

          <main className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customer/:id" element={<CustomerDetail />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/history" element={<Transactions />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>

          <Navigation />
        </div>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;
