
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  ShoppingBag,
  Info,
  Calendar,
  User,
  X,
  Search
} from 'lucide-react';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateCustomer, deleteCustomer, addTransaction, deleteTransaction } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [entryType, setEntryType] = useState<'TAKEN' | 'PAID'>('TAKEN');
  
  const customer = useMemo(() => state.customers.find(c => c.id === id), [state.customers, id]);
  const transactions = useMemo(() => {
    let filtered = state.transactions.filter(t => t.customerId === id);
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.item?.toLowerCase().includes(search) || 
        t.description?.toLowerCase().includes(search)
      );
    }
    return filtered;
  }, [state.transactions, id, searchTerm]);

  const [editForm, setEditForm] = useState(customer ? {
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address
  } : { name: '', phone: '', email: '', address: '' });

  const [entryForm, setEntryForm] = useState({
    item: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Customer not found.</p>
        <button onClick={() => navigate('/customers')} className="mt-4 text-indigo-600 font-bold">Back to list</button>
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomer(customer.id, editForm);
    setIsEditing(false);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryForm.amount) return;

    addTransaction({
      customerId: customer.id,
      item: entryForm.item,
      description: entryForm.description,
      amount: parseFloat(entryForm.amount),
      date: entryForm.date,
      type: entryType,
    });

    setEntryForm({
      item: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowEntryForm(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this customer and all their transactions?')) {
      deleteCustomer(customer.id);
      navigate('/customers');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-900">Customer Profile</h2>
        </div>
        <div className="flex space-x-1">
          <button onClick={() => setIsEditing(true)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
            <Edit2 size={20} />
          </button>
          <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-indigo-50/50"></div>
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto mb-4 overflow-hidden bg-white">
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} alt={customer.name} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight">{customer.name}</h3>
          <p className="text-slate-400 text-sm mb-6">Client since {new Date(customer.createdAt).toLocaleDateString()}</p>
          
          <div className={`p-4 rounded-2xl inline-block ${customer.balance > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            <p className="text-[10px] uppercase font-black tracking-widest mb-1">Total Outstanding</p>
            <p className="text-3xl font-black">{state.businessInfo.currency}{customer.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {customer.phone && (
          <a href={`tel:${customer.phone}`} className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm group active:bg-slate-50 transition-colors">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Phone size={18} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Phone</p>
              <p className="text-slate-800 font-medium">{customer.phone}</p>
            </div>
            <ExternalLink size={16} className="text-slate-300 group-hover:text-indigo-400" />
          </a>
        )}
        {customer.address && (
          <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Address</p>
              <p className="text-slate-800 font-medium">{customer.address}</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 px-1">
          <h4 className="text-lg font-bold text-slate-900">Debt History</h4>
          <button 
            onClick={() => setShowEntryForm(true)}
            className="flex items-center space-x-1 text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-full shadow-lg shadow-indigo-100 active:scale-95 transition-transform"
          >
            <Plus size={14} />
            <span>New Entry</span>
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search within this client's history..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none text-xs transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map(t => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTransaction({ ...t, customerName: customer.name })}
                className="bg-white p-4 rounded-2xl border border-slate-50 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${t.type === 'TAKEN' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    {t.type === 'TAKEN' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {t.item || (t.type === 'PAID' ? 'Payment Received' : 'Service Taken')}
                    </p>
                    <div className="flex items-center text-slate-400 text-[10px] font-medium mt-0.5">
                      <Clock size={10} className="mr-1" />
                      {new Date(t.date).toLocaleDateString()}
                    </div>
                    {t.description && (
                      <p className="text-slate-400 text-[10px] truncate mt-0.5 italic">{t.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-black ${t.type === 'TAKEN' ? 'text-slate-900' : 'text-green-600'}`}>
                    {t.type === 'TAKEN' ? '+' : '-'}{state.businessInfo.currency}{t.amount.toFixed(2)}
                  </p>
                  <p className="text-[8px] font-black uppercase text-slate-300 mt-0.5 tracking-widest">{t.type}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-12 text-center">
              <p className="text-slate-400 text-sm">No transactions matched</p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowEntryForm(true)}
                  className="mt-2 text-indigo-600 text-xs font-bold"
                >
                  Click 'New Entry' to start
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Customer Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Edit Customer</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone</label>
                <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Address</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors" value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} />
              </div>
              <div className="pt-4 pb-2">
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Entry Modal */}
      {showEntryForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">New Entry for {customer.name}</h3>
              <button onClick={() => setShowEntryForm(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
              <button 
                onClick={() => setEntryType('TAKEN')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${entryType === 'TAKEN' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
              >
                <ArrowUpCircle size={18} className="mr-2" /> Taken
              </button>
              <button 
                onClick={() => setEntryType('PAID')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${entryType === 'PAID' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500'}`}
              >
                <ArrowDownCircle size={18} className="mr-2" /> Paid
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Amount ({state.businessInfo.currency})</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-bold"
                    placeholder="0.00"
                    value={entryForm.amount}
                    onChange={(e) => setEntryForm({...entryForm, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-xs"
                    value={entryForm.date}
                    onChange={(e) => setEntryForm({...entryForm, date: e.target.value})}
                  />
                </div>
              </div>

              {entryType === 'TAKEN' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Item / Service (Bixis)</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Bananas, Repair..."
                    value={entryForm.item}
                    onChange={(e) => setEntryForm({...entryForm, item: e.target.value})}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description / Notes</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Details of service or payment notes..."
                  rows={3}
                  value={entryForm.description}
                  onChange={(e) => setEntryForm({...entryForm, description: e.target.value})}
                />
              </div>

              <div className="pt-4 pb-2">
                <button type="submit" className={`w-full py-4 rounded-2xl shadow-lg text-white font-bold transition-all ${entryType === 'TAKEN' ? 'bg-red-500 shadow-red-100 hover:bg-red-600' : 'bg-green-600 shadow-green-100 hover:bg-green-700'}`}>
                  Record {entryType === 'TAKEN' ? 'Debt' : 'Payment'}
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
                  if (confirm('Delete this record?')) {
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

export default CustomerDetail;
