import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { dashboardService } from '../../services/apiService';
import api from '../../api/api';
import { Users, Zap, BatteryCharging, PiggyBank, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
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

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [ciclo, setCiclo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [stats, geracaoRes] = await Promise.all([
          dashboardService.getStats(),
          api.get('/geracao')
        ]);
        setData(stats);

        // Calcular status do ciclo mensal
        const geracoes = geracaoRes.data || [];
        const agora = new Date();
        const mesAtual = agora.getMonth() + 1;
        const anoAtual = agora.getFullYear();

        // Última geração registrada
        const ultima = geracoes.sort((a, b) => {
          if (a.ano !== b.ano) return b.ano - a.ano;
          return b.mes - a.mes;
        })[0];

        const mesAtualProcessado = ultima
          ? (ultima.mes === mesAtual && ultima.ano === anoAtual)
          : false;

        setCiclo({
          ultimoMes: ultima ? `${MESES[ultima.mes - 1]}/${ultima.ano}` : null,
          mesAtualProcessado,
          mesAtual: `${MESES[mesAtual - 1]}/${anoAtual}`,
          totalGeracoes: geracoes.length,
        });
      } catch (err) {
        setError('Não foi possível carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
        {error}
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const kpis = [
    { title: 'Total de Clientes', value: data.totalClientes, sub: `${data.clientesAtivos} ativos`, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { title: 'Economia Total', value: formatCurrency(data.economiaTotal), sub: 'Acumulado histórico', icon: PiggyBank, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { title: 'Energia Gerada', value: `${data.energiaTotalGerada.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kWh`, sub: `${data.totalUsinas} usinas ativas`, icon: BatteryCharging, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { title: 'Créditos Distribuídos', value: `${data.creditosDistribuidos.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kWh`, sub: 'Injetados na rede', icon: Zap, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Visão Geral</h1>
        <p className="text-slate-500 dark:text-slate-400">Acompanhe os principais indicadores da operação GD.</p>
      </div>

      {/* Status do Ciclo Mensal */}
      {ciclo && (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border ${
          ciclo.mesAtualProcessado
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
            : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
        }`}>
          <div className={`p-2 rounded-lg flex-shrink-0 ${
            ciclo.mesAtualProcessado
              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
          }`}>
            {ciclo.mesAtualProcessado ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <p className={`font-semibold text-sm ${
              ciclo.mesAtualProcessado ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'
            }`}>
              {ciclo.mesAtualProcessado
                ? `Ciclo de ${ciclo.mesAtual} processado com sucesso`
                : `Geração de ${ciclo.mesAtual} ainda não foi lançada`
              }
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {ciclo.ultimoMes
                ? `Último período processado: ${ciclo.ultimoMes} • Total de ${ciclo.totalGeracoes} registros de geração`
                : 'Nenhuma geração registrada ainda'
              }
            </p>
          </div>
          {!ciclo.mesAtualProcessado && (
            <div className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-3 py-1.5 rounded-full flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              Ir para Geração
            </div>
          )}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.title}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Geração Mensal de Energia (kWh)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.geracaoChartData}>
                  <defs>
                    <linearGradient id="colorGeracao" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Area type="monotone" dataKey="geracao" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGeracao)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Clientes */}
        <Card>
          <CardHeader>
            <CardTitle>Maiores Economias (R$)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topClientes} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Bar dataKey="valor" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminDashboard;
