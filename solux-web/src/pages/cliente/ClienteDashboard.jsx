import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import api from '../../api/api';
import { Zap, PiggyBank, TrendingUp, Wallet } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

const ClienteDashboard = () => {
  const { user } = useAuth();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClienteData = async () => {
      try {
        const [clientesRes, uniRes, ratRes, geracaoRes] = await Promise.all([
          api.get('/clientes'),
          api.get('/unidades'),
          api.get('/rateios'),
          api.get('/geracao')
        ]);

        // Encontrar o cliente pelo email do usuário logado
        const clientes = clientesRes.data || [];
        const clienteLogado = clientes.find(
          c => c.email?.toLowerCase() === user?.email?.toLowerCase()
        ) || clientes[0]; // fallback para o primeiro cliente caso email não bata

        const clienteId = clienteLogado?.id;

        const minhasUcs = (uniRes.data || []).filter(u => u.idCliente === clienteId);
        const meusIdsUcs = minhasUcs.map(u => u.id);

        const geracaoMap = (geracaoRes.data || []).reduce((acc, g) => {
          acc[g.id] = g;
          return acc;
        }, {});

        const meusRateios = (ratRes.data || []).filter(r => meusIdsUcs.includes(r.idUnidade));
        meusRateios.sort((a, b) => a.id - b.id);

        const economiaTotal = meusRateios.reduce((acc, curr) => acc + curr.valorEconomizado, 0);
        const ultimoRateio = meusRateios[meusRateios.length - 1] || {};

        // Projeção anual: média dos últimos 3 meses × 12
        const ultimos3 = meusRateios.slice(-3);
        const mediaUltimos3 = ultimos3.length > 0
          ? ultimos3.reduce((acc, r) => acc + r.valorEconomizado, 0) / ultimos3.length
          : 0;
        const projecaoAnual = mediaUltimos3 * 12;

        // Preparar dados para o gráfico com labels reais de mês/ano
        const chartData = meusRateios.map(r => {
          const geracao = geracaoMap[r.idGeracao];
          const label = geracao
            ? `${MESES[geracao.mes - 1]}/${String(geracao.ano).slice(-2)}`
            : `#${r.id}`;
          return {
            name: label,
            economia: r.valorEconomizado,
            creditos: r.energiaCreditadaKwh
          };
        }).slice(-6);

        setDados({
          nomeCliente: clienteLogado?.nome || user?.name,
          economiaTotal,
          economiaMes: ultimoRateio.valorEconomizado || 0,
          creditosMes: ultimoRateio.energiaCreditadaKwh || 0,
          saldoAtual: ultimoRateio.saldoCreditoKwh || 0,
          ucs: minhasUcs.length,
          distribuidora: minhasUcs[0]?.distribuidora || 'N/A',
          projecaoAnual,
          chartData
        });
      } catch (err) {
        console.error("Erro ao buscar dados do cliente", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClienteData();
  }, [user]);

  if (loading || !dados) {
    return <div className="flex h-[80vh] items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Olá, {dados.nomeCliente || user?.name}</h1>
        <p className="text-slate-500 dark:text-slate-400">Aqui está o resumo da sua economia com energia solar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-emerald-100 font-medium">Economia neste mês</p>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <PiggyBank className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(dados.economiaMes)}</p>
            <p className="text-emerald-100 text-sm mt-2">Total acumulado: {formatCurrency(dados.economiaTotal)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white mb-4">
              <p className="text-blue-100 font-medium">Créditos Recebidos</p>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{dados.creditosMes} kWh</p>
            <p className="text-blue-100 text-sm mt-2">Neste último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Saldo de Créditos</p>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{dados.saldoAtual} kWh</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Disponível na {dados.distribuidora}</p>
          </CardContent>
        </Card>

        {/* Projeção Anual */}
        <Card className="border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-amber-700 dark:text-amber-400 font-medium">Projeção Anual</p>
              <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(dados.projecaoAnual)}</p>
            <p className="text-amber-600 dark:text-amber-500 text-sm mt-2">Baseado na média dos últimos 3 meses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Economia (R$)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dados.chartData}>
                  <defs>
                    <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Area type="monotone" dataKey="economia" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEconomia)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Créditos Injetados (kWh)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#3b82f6' }}
                    formatter={(value) => `${value} kWh`}
                  />
                  <Bar dataKey="creditos" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClienteDashboard;
