import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import api from '../../api/api';
import { FileText, Download, Calendar, PiggyBank, Zap, TrendingUp, Wallet } from 'lucide-react';

const MESES_NOME = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const ClienteRelatorios = () => {
  const [rateios, setRateios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mesFiltro, setMesFiltro] = useState('TODOS');

  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const [uniRes, ratRes] = await Promise.all([
          api.get('/unidades'),
          api.get('/rateios')
        ]);
        const minhasUcs = (uniRes.data || []).filter(u => u.idCliente === 1);
        const meusIdsUcs = minhasUcs.map(u => u.id);
        const meusRateios = (ratRes.data || []).filter(r => meusIdsUcs.includes(r.idUnidade));

        // Enriquece cada rateio com dados da UC e número do mês
        const rateiosComUc = meusRateios
          .sort((a, b) => a.id - b.id)
          .map((r, i) => {
            const uc = minhasUcs.find(u => u.id === r.idUnidade);
            return { ...r, unidade: uc, mesNumero: i + 1 };
          });

        setRateios(rateiosComUc);
      } catch (err) {
        console.error("Erro ao buscar relatórios", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRelatorios();
  }, []);

  if (loading) {
    return <div className="flex h-[80vh] items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Filtro por mês
  const rateiosFiltrados = mesFiltro === 'TODOS'
    ? rateios
    : rateios.filter(r => r.mesNumero === Number(mesFiltro));

  // Totais gerais (sempre sobre TODOS os rateios para o resumo geral)
  const totaisGerais = {
    economiaTotal: rateios.reduce((acc, r) => acc + r.valorEconomizado, 0),
    energiaTotal: rateios.reduce((acc, r) => acc + r.energiaCreditadaKwh, 0),
    saldoAtual: rateios.length > 0 ? rateios[rateios.length - 1].saldoCreditoKwh : 0,
    totalMeses: rateios.length,
    mediaMensal: rateios.length > 0
      ? rateios.reduce((acc, r) => acc + r.valorEconomizado, 0) / rateios.length
      : 0,
  };

  // Totais do filtro atual (para a seção filtrada)
  const totaisFiltro = {
    economia: rateiosFiltrados.reduce((acc, r) => acc + r.valorEconomizado, 0),
    energia: rateiosFiltrados.reduce((acc, r) => acc + r.energiaCreditadaKwh, 0),
    registros: rateiosFiltrados.length,
  };

  // Gera o CSV para exportação
  const gerarCSV = (dados, nomeArquivo) => {
    const BOM = '\uFEFF';
    const header = 'Unidade Consumidora;Distribuidora;Mês;Energia Creditada (kWh);Saldo (kWh);Economia (R$);Status\n';
    const linhas = dados.map(r =>
      `${r.unidade?.numeroUc || r.idUnidade};${r.unidade?.distribuidora || '-'};Mês ${r.mesNumero};${r.energiaCreditadaKwh};${r.saldoCreditoKwh};${r.valorEconomizado};Processado`
    ).join('\n');

    const totalLinha = `\nTOTAL;;;${dados.reduce((a, r) => a + r.energiaCreditadaKwh, 0).toFixed(2)};;${dados.reduce((a, r) => a + r.valorEconomizado, 0).toFixed(2)};`;

    const csvContent = BOM + header + linhas + totalLinha;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeArquivo);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExportarFiltrado = () => {
    const sufixo = mesFiltro === 'TODOS' ? 'todos_meses' : `mes_${mesFiltro}`;
    gerarCSV(rateiosFiltrados, `relatorio_${sufixo}.csv`);
  };

  const handleExportarTudo = () => {
    gerarCSV(rateios, 'relatorio_completo_todos_meses.csv');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Meus Relatórios</h1>
        <p className="text-slate-500 dark:text-slate-400">Histórico detalhado de faturamento e economia.</p>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-white mb-3">
              <p className="text-emerald-100 text-sm font-medium">Economia Total</p>
              <PiggyBank className="w-5 h-5 text-emerald-200" />
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(totaisGerais.economiaTotal)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-white mb-3">
              <p className="text-blue-100 text-sm font-medium">Energia Creditada</p>
              <Zap className="w-5 h-5 text-blue-200" />
            </div>
            <p className="text-2xl font-bold text-white">{totaisGerais.energiaTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kWh</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Saldo Atual</p>
              <Wallet className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totaisGerais.saldoAtual.toLocaleString('pt-BR')} kWh</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Média Mensal</p>
              <TrendingUp className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totaisGerais.mediaMensal)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Meses Processados</p>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totaisGerais.totalMeses}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela com filtros */}
      <Card>
        {/* Barra de filtros + exportação */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Calendar className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <select
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white text-sm"
            >
              <option value="TODOS">Todos os meses</option>
              {rateios.map((_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  {MESES_NOME[i + 1] || `Mês ${i + 1}`} / 2026
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportarFiltrado}
              className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition-colors text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {mesFiltro === 'TODOS' ? 'Exportar Tudo' : `Exportar ${MESES_NOME[Number(mesFiltro)] || `Mês ${mesFiltro}`}`}
            </button>
            {mesFiltro !== 'TODOS' && (
              <button
                onClick={handleExportarTudo}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl shadow-sm transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Completo
              </button>
            )}
          </div>
        </div>

        {/* Resumo do filtro ativo (quando filtrado por mês) */}
        {mesFiltro !== 'TODOS' && (
          <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Mês selecionado: </span>
              <span className="text-slate-900 dark:text-white font-bold">{MESES_NOME[Number(mesFiltro)] || `Mês ${mesFiltro}`} / 2026</span>
            </div>
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Economia: </span>
              <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(totaisFiltro.economia)}</span>
            </div>
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Energia: </span>
              <span className="text-slate-900 dark:text-white font-bold">{totaisFiltro.energia.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kWh</span>
            </div>
          </div>
        )}

        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-emerald-600" />
            {mesFiltro === 'TODOS'
              ? 'Rateios Mensais — Todos os Meses'
              : `Rateio de ${MESES_NOME[Number(mesFiltro)] || `Mês ${mesFiltro}`} / 2026`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 uppercase dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-medium">Unidade Consumidora</th>
                  <th className="px-6 py-4 font-medium">Mês/Ano</th>
                  <th className="px-6 py-4 font-medium">Distribuidora</th>
                  <th className="px-6 py-4 font-medium">Energia Creditada</th>
                  <th className="px-6 py-4 font-medium">Saldo</th>
                  <th className="px-6 py-4 font-medium">Economia</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rateiosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">Nenhum relatório encontrado para este período.</td>
                  </tr>
                ) : (
                  rateiosFiltrados.slice().reverse().map((rateio) => (
                    <tr key={rateio.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        UC-{rateio.unidade?.numeroUc || rateio.idUnidade}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {MESES_NOME[rateio.mesNumero] || `Mês ${rateio.mesNumero}`} / 2026
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">
                          {rateio.unidade?.distribuidora || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium">
                        {rateio.energiaCreditadaKwh.toLocaleString('pt-BR')} kWh
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {rateio.saldoCreditoKwh.toLocaleString('pt-BR')} kWh
                      </td>
                      <td className="px-6 py-4 text-slate-900 dark:text-white font-bold">
                        {formatCurrency(rateio.valorEconomizado)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                          Processado
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {/* Rodapé com totais */}
              {rateiosFiltrados.length > 0 && (
                <tfoot className="bg-slate-50 dark:bg-slate-800/80 border-t-2 border-slate-300 dark:border-slate-600">
                  <tr>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white" colSpan="3">
                      TOTAL {mesFiltro === 'TODOS' ? '(Todos os meses)' : `(${MESES_NOME[Number(mesFiltro)] || `Mês ${mesFiltro}`})`}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {totaisFiltro.energia.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kWh
                    </td>
                    <td className="px-6 py-4 text-slate-500">—</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-lg">
                      {formatCurrency(totaisFiltro.economia)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {totaisFiltro.registros} registro(s)
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteRelatorios;
