
import React from 'react';
import { useStore } from '../store';
import { 
  Building2, 
  DollarSign, 
  Trash2, 
  Download, 
  Upload, 
  ChevronRight,
  ShieldCheck,
  Info
} from 'lucide-react';

const Settings: React.FC = () => {
  const { state, updateBusinessInfo, resetData } = useStore();

  const handleBackup = () => {
    const dataStr = JSON.stringify(state);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `deenraac_backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
      resetData();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-slate-900">Settings</h2>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Identity</h3>
        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
          <div className="p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Business Name</p>
                <p className="text-xs text-slate-400">{state.businessInfo.name}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
          <div className="p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Currency Symbol</p>
                <p className="text-xs text-slate-400">{state.businessInfo.currency} (USD Default)</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Data Management</h3>
        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
          <button onClick={handleBackup} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <Download size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Export Backup</p>
                <p className="text-xs text-slate-400">Save data as JSON file</p>
              </div>
            </div>
          </button>
          <div className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Upload size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Import Data</p>
                <p className="text-xs text-slate-400">Restore from JSON file</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 text-red-500">Danger Zone</h3>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <button 
            onClick={handleReset}
            className="w-full p-4 flex items-center space-x-4 hover:bg-red-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-red-600">Factory Reset</p>
              <p className="text-xs text-red-400">Delete all transactions and clients</p>
            </div>
          </button>
        </div>
      </section>

      <div className="pt-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-slate-400 mb-2">
          <ShieldCheck size={16} />
          <span className="text-xs font-medium">Local Data Storage (Secure)</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-slate-400">
          <Info size={16} />
          <span className="text-xs font-medium">DeenRaac v1.0.4 - Pro Edition</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
