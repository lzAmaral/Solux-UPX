import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import api from '../../api/api';
import { Wallet, Zap, TrendingUp, Battery } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ClienteCreditos = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreditos = async () => {
      try {
        const [uniRes, ratRes] = await Promise.all([
          api.get('/unidades'),
          api.get('/rateios')
        ]);

        // Simula pegando as UCs do Cliente ID 1
        const minhasUcs = (uniRes.data || []).filter(u => u.idCliente === 1);
        const meusIdsUcs = minhasUcs.map(u => u.id);

        const meusRateios = (ratRes.data || []).filter(r => meusIdsUcs.includes(r.idUnidade));
        meusRateios.sort((a, b) => a.id - b.id);

        const creditosTotais = meusRateios.reduce((acc, curr) => acc + curr.energiaCreditadaKwh, 0);
        const ultimoRateio = meusRateios[meusRateios.length - 1] || {};

        // Dados por UC
        const creditosPorUc = minhasUcs.map(uc => {
          const rateiosUc = meusRateios.filter(r => r.idUnidade === uc.id);
          const totalCreditos = rateiosUc.reduce((acc, r) => acc + r.energiaCreditadaKwh, 0);
          const ultimoSaldo = rateiosUc.length > 0 ? rateiosUc[rateiosUc.length - 1].saldoCreditoKwh : 0;
          return {
            ...uc,
            totalCreditos,
            saldoAtual: ultimoSaldo,
            totalRateios: rateiosUc.length
          };
        });

        // Gráfico de evolução dos créditos
        const chartData = meusRateios.map((r, i) => ({
          name: `Mês ${i + 1}`,
          creditado: r.energiaCreditadaKwh,
          saldo: r.saldoCreditoKwh
        }));

        setDados({
          creditosTotais,
          saldoAtual: ultimoRateio.saldoCreditoKwh || 0,
          creditosMes: ultimoRateio.energiaCreditadaKwh || 0,
          totalUcs: minhasUcs.length,
          creditosPorUc,
          chartData,
          rateios: meusRateios
        });
      } catch (err) {
        console.error("Erro ao buscar créditos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreditos();
  }, []);

  if (loading || !dados) {
    return <div className="flex h-[80vh] items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Meus Créditos</h1>
        <p className="text-slate-500 dark:text-slate-400">Acompanhe seus créditos de energia solar injetados na rede.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-blue-100 font-medium">Saldo Atual</p>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{dados.saldoAtual.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kWh</p>
            <p className="text-blue-100 text-sm mt-2">Disponível para compensação</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-emerald-100 font-medium">Créditos no Mês</p>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{dados.creditosMes.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kWh</p>
            <p className="text-emerald-100 text-sm mt-2">Recebidos neste período</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Total Acumulado</p>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{dados.creditosTotais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kWh</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Histórico completo</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Unidades (UCs)</p>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                <Battery className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{dados.totalUcs}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Recebendo créditos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de evolução */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução dos Créditos (kWh)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dados.chartData}>
                <defs>
                  <linearGradient id="colorCredito" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value, name) => [`${value.toLocaleString('pt-BR')} kWh`, name === 'creditado' ? 'Creditado' : 'Saldo']}
                />
                <Area type="monotone" dataKey="creditado" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCredito)" />
                <Area type="monotone" dataKey="saldo" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSaldo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes por UC */}
      <Card>
        <CardHeader>
          <CardTitle>Créditos por Unidade Consumidora</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Nº da UC</th>
                <th className="px-6 py-4 font-medium">Distribuidora</th>
                <th className="px-6 py-4 font-medium">Localização</th>
                <th className="px-6 py-4 font-medium">% Rateio</th>
                <th className="px-6 py-4 font-medium">Total Creditado</th>
                <th className="px-6 py-4 font-medium">Saldo Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {dados.creditosPorUc.map((uc) => (
                <tr key={uc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{uc.numeroUc}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">
                      {uc.distribuidora}
                    </span>
                  </td>
                  <td className="px-6 py-4">{uc.cidade}/{uc.estado}</td>
                  <td className="px-6 py-4">{uc.percentualRateio}%</td>
                  <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-medium">
                    {uc.totalCreditos.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kWh
                  </td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold">
                    {uc.saldoAtual.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kWh
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Histórico detalhado */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Mensal de Créditos</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Referência</th>
                <th className="px-6 py-4 font-medium">Energia Creditada</th>
                <th className="px-6 py-4 font-medium">Saldo Após</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {dados.rateios.slice().reverse().map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Mês {dados.rateios.length - i}</td>
                  <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-medium">+{r.energiaCreditadaKwh.toLocaleString('pt-BR')} kWh</td>
                  <td className="px-6 py-4">{r.saldoCreditoKwh.toLocaleString('pt-BR')} kWh</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                      Compensado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ClienteCreditos;
