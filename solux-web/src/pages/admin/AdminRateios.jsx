import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import api from '../../api/api';
import { exportacaoService } from '../../services/exportacaoService';
import { Filter, Download, Calendar, User } from 'lucide-react';

const AdminRateios = () => {
  const [rateios, setRateios] = useState([]);
  const [ucMap, setUcMap] = useState({});
  const [clienteMap, setClienteMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState('12');
  const [ano, setAno] = useState('2026');

  const fetchRateios = async () => {
    setLoading(true);
    try {
      const [ratRes, uniRes, cliRes] = await Promise.all([
        api.get('/rateios'),
        api.get('/unidades'),
        api.get('/clientes')
      ]);

      const dados = ratRes.data || [];

      // Mapear UCs e clientes para lookup rápido
      const ucs = (uniRes.data || []).reduce((acc, u) => {
        acc[u.id] = u;
        return acc;
      }, {});
      const clientes = (cliRes.data || []).reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
      }, {});

      setUcMap(ucs);
      setClienteMap(clientes);
      setRateios(dados.slice(0, 50));
    } catch (err) {
      console.error('Erro ao buscar rateios', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRateios();
  }, []);

  const handleExport = async () => {
    try {
      const blob = await exportacaoService.exportarRateiosMensal(Number(mes), Number(ano));
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rateios_${mes}_${ano}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Erro ao exportar rateios');
    }
  };

  if (loading && rateios.length === 0) {
    return <div className="flex h-[80vh] items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rateios</h1>
          <p className="text-slate-500 dark:text-slate-400">Distribuição de créditos de energia por cliente e unidade.</p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Calendar className="h-5 w-5 text-slate-400" />
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={String(i+1).padStart(2, '0')}>Mês {i+1}</option>
              ))}
            </select>
            <select
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition-colors w-full sm:w-auto ml-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV do Mês
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Unidade Consumidora</th>
                <th className="px-6 py-4 font-medium">% Rateio</th>
                <th className="px-6 py-4 font-medium">Energia (kWh)</th>
                <th className="px-6 py-4 font-medium">Economia (R$)</th>
                <th className="px-6 py-4 font-medium">Saldo (kWh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {rateios.map((r) => {
                const uc = ucMap[r.idUnidade];
                const cliente = uc ? clienteMap[uc.idCliente] : null;
                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {cliente?.nome || `Cliente ID ${uc?.idCliente || '?'}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {uc?.numeroUc || `UC ${r.idUnidade}`}
                      </span>
                      {uc?.distribuidora && (
                        <span className="ml-2 text-xs text-slate-400">{uc.distribuidora}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{r.percentualRateio}%</td>
                    <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-medium">{r.energiaCreditadaKwh}</td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium">{formatCurrency(r.valorEconomizado)}</td>
                    <td className="px-6 py-4">{r.saldoCreditoKwh}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-4 text-center text-xs text-slate-500">
            Mostrando os últimos 50 rateios. Para o relatório completo do mês, use o botão Exportar.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminRateios;
