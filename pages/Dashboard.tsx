
import React, { useMemo } from 'react';
import { useStore } from '../store';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Wallet,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-xs font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {trend > 0 ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownLeft size={12} className="mr-1" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-xl font-bold text-slate-900 mt-1">{value}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  const { state } = useStore();
  const { customers, transactions, businessInfo } = state;

  const stats = useMemo(() => {
    const totalDebt = customers.reduce((sum, c) => sum + Math.max(0, c.balance), 0);
    const totalPaid = transactions
      .filter(t => t.type === 'PAID')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalDebt,
      totalPaid,
      activeCustomers: customers.length,
      recentTransactions: transactions.slice(0, 5)
    };
  }, [customers, transactions]);

  const chartData = [
    { name: 'Paid', value: stats.totalPaid, color: '#10b981' },
    { name: 'Pending', value: stats.totalDebt, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl"></div>
        <p className="text-indigo-100 text-sm font-medium mb-1">Total Outstanding</p>
        <h2 className="text-4xl font-black mb-4">
          {businessInfo.currency}{stats.totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <TrendingUp size={16} className="text-green-300" />
            <span className="text-xs font-medium">Healthy Cashflow</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          title="Total Paid" 
          value={`${businessInfo.currency}${stats.totalPaid.toLocaleString()}`} 
          icon={Wallet} 
          color="green" 
          trend={12}
        />
        <StatCard 
          title="Clients" 
          value={stats.activeCustomers} 
          icon={Users} 
          color="blue" 
          trend={3}
        />
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Portfolio Split</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-2">
          {chartData.map(item => (
            <div key={item.name} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs font-medium text-slate-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          <a href="#/history" className="text-sm font-medium text-indigo-600">See all</a>
        </div>
        <div className="space-y-3">
          {stats.recentTransactions.length > 0 ? (
            stats.recentTransactions.map(t => {
              const customer = customers.find(c => c.id === t.customerId);
              return (
                <div key={t.id} className="bg-white p-3 rounded-xl border border-slate-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${t.type === 'TAKEN' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {t.type === 'TAKEN' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{customer?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{t.item}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${t.type === 'TAKEN' ? 'text-slate-900' : 'text-green-600'}`}>
                      {t.type === 'TAKEN' ? '-' : '+'}{businessInfo.currency}{t.amount.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl py-8 text-center">
              <p className="text-slate-400 text-sm">No recent transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
