import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { clienteService } from '../../services/clienteService';
import api from '../../api/api';
import { ArrowLeft, User, MapPin, Zap, Download, PiggyBank, History, CheckCircle2, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const AdminClienteDetalhe = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [rateios, setRateios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalhes = async () => {
      try {
        const [cliRes, uniRes, ratRes] = await Promise.all([
          clienteService.getClienteById(id),
          api.get('/unidades'),
          api.get('/rateios')
        ]);
        
        setCliente(cliRes);
        
        // Simular a filtragem no frontend (já que não temos endpoint específico ainda)
        const ucsCliente = (uniRes.data || []).filter(u => u.idCliente === Number(id));
        setUnidades(ucsCliente);

        const ucsIds = ucsCliente.map(u => u.id);
        const rateiosCliente = (ratRes.data || []).filter(r => ucsIds.includes(r.idUnidade));
        
        // Ordenar por data mais recente simulada
        rateiosCliente.sort((a, b) => b.id - a.id);
        
        setRateios(rateiosCliente);
      } catch (err) {
        console.error('Erro ao buscar detalhes do cliente', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalhes();
  }, [id]);

  const handleExportIndividual = () => {
    // Simulação da exportação individual
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Mês/Ano,Energia Creditada kWh,Valor Economizado\n"
      + rateios.map(r => `Mês Simulado,${r.energiaCreditadaKwh},${r.valorEconomizado}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_cliente_${cliente?.nome.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) {
    return <div className="flex h-[80vh] items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!cliente) {
    return <div className="text-center py-10">Cliente não encontrado.</div>;
  }

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const economiaTotal = rateios.reduce((acc, curr) => acc + curr.valorEconomizado, 0);
  const ultimoRateio = rateios[0]; // já ordenado desc
  const saldoAtual = ultimoRateio?.saldoCreditoKwh || 0;
  const mediaMensal = rateios.length > 0 ? economiaTotal / rateios.length : 0;
  const projecaoAnual = mediaMensal * 12;

  // Badge de saúde do cliente
  const statusConfig = {
    ATIVO: { label: 'Ativo', icon: CheckCircle2, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' },
    INATIVO: { label: 'Inativo', icon: XCircle, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
    SUSPENSO: { label: 'Suspenso', icon: AlertTriangle, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' },
  };
  const saude = statusConfig[cliente.status] || statusConfig.ATIVO;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/clientes" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{cliente.nome}</h1>
            <p className="text-slate-500 dark:text-slate-400">Detalhes completos do cliente.</p>
          </div>
        </div>
        <button 
          onClick={handleExportIndividual}
          className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium rounded-xl shadow-sm transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </button>
      </div>

      {/* Badge de Saúde */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border ${saude.bg}`}>
        <div className={`flex items-center gap-2 font-semibold text-sm ${saude.color}`}>
          <saude.icon className="w-5 h-5" />
          Cliente {saude.label}
        </div>
        <div className="flex flex-wrap gap-4 sm:ml-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">{rateios.length}</strong> meses de rateio processados
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Saldo atual: <strong className={saldoAtual > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}>{saldoAtual} kWh</strong>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Média mensal: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(mediaMensal)}</strong>
            </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">CPF / CNPJ</p>
              <p className="font-medium text-slate-900 dark:text-white">{cliente.cpfCnpj}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">E-mail</p>
              <p className="font-medium text-slate-900 dark:text-white">{cliente.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Telefone</p>
              <p className="font-medium text-slate-900 dark:text-white">{cliente.telefone || 'Não informado'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Localização e Unidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
              Localização & UCs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Endereço</p>
              <p className="font-medium text-slate-900 dark:text-white">{cliente.endereco || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Unidades Consumidoras</p>
              {unidades.length > 0 ? (
                <ul className="mt-1 space-y-2">
                  {unidades.map(u => (
                    <li key={u.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2 rounded-lg text-sm">
                      <span className="font-medium text-slate-900 dark:text-white">{u.numeroUc}</span>
                      <span className="text-xs text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">{u.distribuidora} ({u.percentualRateio}%)</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-medium text-slate-900 dark:text-white">Nenhuma cadastrada</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PiggyBank className="w-5 h-5 mr-2 text-emerald-500" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Economia Total</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(economiaTotal)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Projeção Anual</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                {formatCurrency(projecaoAnual)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Rateios Processados</p>
              <p className="font-medium text-slate-900 dark:text-white">{rateios.length} meses</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Rateios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2 text-slate-500" />
            Histórico de Créditos
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">ID Referência</th>
                <th className="px-6 py-4 font-medium">Energia Creditada</th>
                <th className="px-6 py-4 font-medium">Economia Gerada</th>
                <th className="px-6 py-4 font-medium">Saldo de Crédito</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {rateios.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Rateio #{r.id}</td>
                  <td className="px-6 py-4 text-amber-600 dark:text-amber-400 font-medium">+{r.energiaCreditadaKwh} kWh</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium">
                    {formatCurrency(r.valorEconomizado)}
                  </td>
                  <td className="px-6 py-4">{r.saldoCreditoKwh} kWh</td>
                </tr>
              ))}
              {rateios.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    Nenhum rateio registrado para este cliente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminClienteDetalhe;
