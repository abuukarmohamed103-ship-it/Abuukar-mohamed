
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Search, UserPlus, Phone, ChevronRight, Users } from 'lucide-react';

const Customers: React.FC = () => {
  const { state, addCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '' });

  const filteredCustomers = useMemo(() => {
    return state.customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm)
    ).sort((a, b) => b.balance - a.balance);
  }, [state.customers, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name) return;
    addCustomer(newCustomer);
    setNewCustomer({ name: '', phone: '', email: '', address: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white p-2 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={20} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or phone..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(c => (
            <Link 
              key={c.id} 
              to={`/customer/${c.id}`}
              className="block bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`} alt={c.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{c.name}</h4>
                    <div className="flex items-center text-slate-400 text-xs mt-0.5">
                      <Phone size={10} className="mr-1" />
                      {c.phone || 'No phone'}
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-3">
                  <div>
                    <p className={`text-sm font-bold ${c.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {state.businessInfo.currency}{c.balance.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Current Balance</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Users size={32} />
            </div>
            <p className="text-slate-500 font-medium">No customers found</p>
            <p className="text-slate-400 text-xs mt-1">Add your first customer to get started</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Add New Customer</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-2">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Abuukar Mohamed"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. +252 61..."
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
              </div>
              <div className="pt-4 pb-2">
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
