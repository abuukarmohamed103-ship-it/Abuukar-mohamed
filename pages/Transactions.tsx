
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ShoppingBag,
  Trash2,
  Filter,
  History,
  Search,
  Info,
  Calendar,
  DollarSign,
  User,
  X
} from 'lucide-react';

const Transactions: React.FC = () => {
  const { state, addTransaction, deleteTransaction } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [type, setType] = useState<'TAKEN' | 'PAID'>('TAKEN');
  const [formData, setFormData] = useState({
    customerId: '',
    item: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredTransactions = useMemo(() => {
    return state.transactions.filter(t => {
      const search = searchTerm.toLowerCase();
      const itemMatch = t.item?.toLowerCase().includes(search);
      const descMatch = t.description?.toLowerCase().includes(search);
      const customer = state.customers.find(c => c.id === t.customerId);
      const customerMatch = customer?.name.toLowerCase().includes(search);
      return itemMatch || descMatch || customerMatch;
    });
  }, [state.transactions, searchTerm, state.customers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.amount) return;
    
    addTransaction({
      customerId: formData.customerId,
      item: formData.item,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      type,
    });
    
    setFormData({
      customerId: '',
      item: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">History</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Filter size={16} className="mr-2" /> New Entry
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by service, description or name..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(t => {
            const customer = state.customers.find(c => c.id === t.customerId);
            return (
              <div 
                key={t.id} 
                onClick={() => setSelectedTransaction({ ...t, customerName: customer?.name })}
                className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group relative overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.type === 'TAKEN' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <div className="flex items-center space-x-4 flex-1 mr-4 overflow-hidden">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${t.type === 'TAKEN' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {t.type === 'TAKEN' ? <ShoppingBag size={20} /> : <ArrowDownCircle size={20} />}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{customer?.name || 'Deleted Customer'}</h4>
                    <p className="text-slate-500 text-xs font-semibold truncate">
                      {t.item || (t.type === 'PAID' ? 'Payment Received' : 'General Debt')}
                    </p>
                    {t.description && (
                      <p className="text-slate-400 text-[10px] italic truncate mt-0.5">{t.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right flex items-center space-x-3 flex-shrink-0">
                  <div>
                    <p className={`font-bold text-sm ${t.type === 'TAKEN' ? 'text-slate-900' : 'text-green-600'}`}>
                      {t.type === 'TAKEN' ? '+' : '-'}{state.businessInfo.currency}{t.amount.toFixed(2)}
                    </p>
                    <p className="text-[9px] text-slate-300 font-medium">
                      {new Date(t.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center">
             <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <History size={32} />
              </div>
              <p className="text-slate-500 font-medium">No results found</p>
              <p className="text-slate-400 text-xs mt-1">Try a different search term or add an entry</p>
          </div>
        )}
      </div>

      {/* Entry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Add Entry</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
              <button 
                onClick={() => setType('TAKEN')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${type === 'TAKEN' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
              >
                <ArrowUpCircle size={18} className="mr-2" /> Taken
              </button>
              <button 
                onClick={() => setType('PAID')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${type === 'PAID' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500'}`}
              >
                <ArrowDownCircle size={18} className="mr-2" /> Paid
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Customer</label>
                <select 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                  value={formData.customerId}
                  onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                >
                  <option value="">Select a customer...</option>
                  {state.customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (Bal: {state.businessInfo.currency}{c.balance.toFixed(2)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Amount ({state.businessInfo.currency})</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-bold"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-xs"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              {type === 'TAKEN' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Item / Service (Bixis)</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Bananas, Grocery, Repair..."
                    value={formData.item}
                    onChange={(e) => setFormData({...formData, item: e.target.value})}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service Description</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Details of what the customer received..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="pt-4 pb-2">
                <button type="submit" className={`w-full py-4 rounded-2xl shadow-lg text-white font-bold transition-all ${type === 'TAKEN' ? 'bg-red-500 shadow-red-100 hover:bg-red-600' : 'bg-green-600 shadow-green-100 hover:bg-green-700'}`}>
                  Record {type === 'TAKEN' ? 'Debt' : 'Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${selectedTransaction.type === 'TAKEN' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                {selectedTransaction.type === 'TAKEN' ? <ShoppingBag size={24} /> : <ArrowDownCircle size={24} />}
              </div>
              <button onClick={() => setSelectedTransaction(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  {state.businessInfo.currency}{selectedTransaction.amount.toFixed(2)}
                </h3>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${selectedTransaction.type === 'TAKEN' ? 'text-red-500' : 'text-green-600'}`}>
                  {selectedTransaction.type === 'TAKEN' ? 'Debt (Bixis)' : 'Payment Received'}
                </p>
              </div>

              <div className="space-y-3 py-4 border-y border-slate-50">
                <div className="flex items-center space-x-3">
                  <User size={16} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Customer</p>
                    <p className="text-sm font-bold text-slate-800">{selectedTransaction.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Date of Entry</p>
                    <p className="text-sm font-bold text-slate-800">
                      {new Date(selectedTransaction.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Info size={16} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Service/Item</p>
                    <p className="text-sm font-bold text-slate-800">
                      {selectedTransaction.item || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {selectedTransaction.description && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Description</p>
                  <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 leading-relaxed italic border border-slate-100">
                    "{selectedTransaction.description}"
                  </div>
                </div>
              )}

              <button 
                onClick={() => {
                  if (confirm('Delete this record? This action will update the client balance.')) {
                    deleteTransaction(selectedTransaction.id);
                    setSelectedTransaction(null);
                  }
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
