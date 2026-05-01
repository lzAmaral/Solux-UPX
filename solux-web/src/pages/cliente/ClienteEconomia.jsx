import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import api from '../../api/api';
import { PiggyBank, TrendingUp, ArrowUpRight, ArrowDownRight, Percent } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const ClienteEconomia = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEconomia = async () => {
      try {
        const [uniRes, ratRes] = await Promise.all([
          api.get('/unidades'),
          api.get('/rateios')
        ]);

        const minhasUcs = (uniRes.data || []).filter(u => u.idCliente === 1);
        const meusIdsUcs = minhasUcs.map(u => u.id);

        const meusRateios = (ratRes.data || []).filter(r => meusIdsUcs.includes(r.idUnidade));
        meusRateios.sort((a, b) => a.id - b.id);

        const economiaTotal = meusRateios.reduce((acc, curr) => acc + curr.valorEconomizado, 0);
        const ultimoRateio = meusRateios[meusRateios.length - 1] || {};
        const penultimoRateio = meusRateios.length >= 2 ? meusRateios[meusRateios.length - 2] : {};

        // Variação percentual mês a mês
        const variacao = penultimoRateio.valorEconomizado
          ? ((ultimoRateio.valorEconomizado - penultimoRateio.valorEconomizado) / penultimoRateio.valorEconomizado * 100).toFixed(1)
          : 0;

        // Média mensal
        const mediaMensal = meusRateios.length > 0 ? economiaTotal / meusRateios.length : 0;

        // Economia estimada anual (projeção)
        const projecaoAnual = mediaMensal * 12;

        // Dados do gráfico de barras (economia mensal)
        const chartBarras = meusRateios.map((r, i) => ({
          name: `Mês ${i + 1}`,
          economia: r.valorEconomizado
        }));

        // Dados do gráfico de área (economia acumulada)
        let acumulado = 0;
        const chartAcumulado = meusRateios.map((r, i) => {
          acumulado += r.valorEconomizado;
          return {
            name: `Mês ${i + 1}`,
            acumulado
          };
        });

        // Detalhes por mês para tabela
        const historico = meusRateios.map((r, i) => ({
          ...r,
          mes: i + 1,
          variacaoAnterior: i > 0
            ? ((r.valorEconomizado - meusRateios[i - 1].valorEconomizado) / meusRateios[i - 1].valorEconomizado * 100).toFixed(1)
            : null
        }));

        setDados({
          economiaTotal,
          economiaMes: ultimoRateio.valorEconomizado || 0,
          variacao: Number(variacao),
          mediaMensal,
          projecaoAnual,
          chartBarras,
          chartAcumulado,
          historico
        });
      } catch (err) {
        console.error("Erro ao buscar economia", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEconomia();
  }, []);

  if (loading || !dados) {
    return <div className="flex h-[80vh] items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Minha Economia</h1>
        <p className="text-slate-500 dark:text-slate-400">Acompanhe quanto você está economizando com energia solar.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-emerald-100 font-medium">Economia Total</p>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <PiggyBank className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(dados.economiaTotal)}</p>
            <p className="text-emerald-100 text-sm mt-2">Acumulado histórico</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-blue-100 font-medium">Economia no Mês</p>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(dados.economiaMes)}</p>
            <div className="flex items-center mt-2">
              {dados.variacao >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-300 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-300 mr-1" />
              )}
              <p className={`text-sm ${dados.variacao >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                {dados.variacao >= 0 ? '+' : ''}{dados.variacao}% vs mês anterior
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Média Mensal</p>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                <Percent className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(dados.mediaMensal)}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Média por mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Projeção Anual</p>
              <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(dados.projecaoAnual)}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Estimativa de economia</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Economia mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Economia Mensal (R$)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados.chartBarras}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Bar dataKey="economia" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Economia acumulada */}
        <Card>
          <CardHeader>
            <CardTitle>Economia Acumulada (R$)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dados.chartAcumulado}>
                  <defs>
                    <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#818cf8' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Area type="monotone" dataKey="acumulado" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAcumulado)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Detalhado de Economia</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Mês</th>
                <th className="px-6 py-4 font-medium">Energia Creditada</th>
                <th className="px-6 py-4 font-medium">Economia</th>
                <th className="px-6 py-4 font-medium">Variação</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {dados.historico.slice().reverse().map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Mês {r.mes}</td>
                  <td className="px-6 py-4 text-blue-600 dark:text-blue-400">{r.energiaCreditadaKwh.toLocaleString('pt-BR')} kWh</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(r.valorEconomizado)}</td>
                  <td className="px-6 py-4">
                    {r.variacaoAnterior !== null ? (
                      <span className={`inline-flex items-center text-sm font-medium ${Number(r.variacaoAnterior) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {Number(r.variacaoAnterior) >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        {Number(r.variacaoAnterior) >= 0 ? '+' : ''}{r.variacaoAnterior}%
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
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

export default ClienteEconomia;
