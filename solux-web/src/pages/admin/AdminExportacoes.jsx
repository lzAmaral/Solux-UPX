import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { exportacaoService } from '../../services/exportacaoService';
import { clienteService } from '../../services/clienteService';
import { Download, Users, FileSpreadsheet, AlertCircle, Zap } from 'lucide-react';

const AdminExportacoes = () => {
  const [mes, setMes] = useState('12');
  const [ano, setAno] = useState('2026');
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingRateios, setLoadingRateios] = useState(false);
  const [loadingGeracao, setLoadingGeracao] = useState(false);

  const handleExportClientes = async () => {
    setLoadingClientes(true);
    try {
      const blob = await clienteService.exportarClientes();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'clientes_exportacao.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Erro ao exportar clientes');
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleExportRateios = async () => {
    setLoadingRateios(true);
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
    } finally {
      setLoadingRateios(false);
    }
  };

  const handleExportGeracao = async () => {
    setLoadingGeracao(true);
    try {
      const blob = await exportacaoService.exportarGeracaoMensal();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'geracao_historico.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Erro ao exportar geracao');
    } finally {
      setLoadingGeracao(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Exportações de Dados</h1>
        <p className="text-slate-500 dark:text-slate-400">Gere relatórios CSV consolidados para análise no Excel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card: Base de Clientes */}
        <Card className="hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Base de Clientes Completa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Exporta todos os clientes ativos e inativos, incluindo dados de contato, endereço, consumo médio e dados financeiros consolidados.
            </p>
            <div className="flex items-start bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                O arquivo gerado utiliza encoding UTF-8 (com BOM) e separador ponto-e-vírgula (;) para abrir perfeitamente no Excel Brasileiro.
              </p>
            </div>
            <button 
              onClick={handleExportClientes}
              disabled={loadingClientes}
              className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl shadow-sm transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              {loadingClientes ? 'Gerando CSV...' : 'Baixar Clientes (CSV)'}
            </button>
          </CardContent>
        </Card>

        {/* Card: Rateios Mensais */}
        <Card className="hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="w-5 h-5 mr-2 text-emerald-500" />
              Rateios por Mês/Ano
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Exporta a distribuição detalhada de créditos gerados em um mês específico, informando quanto cada UC recebeu em kWh e a economia em R$.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mês Referência</label>
                <select
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white text-sm"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={String(i+1).padStart(2, '0')}>Mês {i+1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Ano Referência</label>
                <select
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white text-sm"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleExportRateios}
              disabled={loadingRateios}
              className="w-full flex justify-center items-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-xl shadow-sm transition-colors mt-2"
            >
              <Download className="w-4 h-4 mr-2" />
              {loadingRateios ? 'Gerando CSV...' : 'Baixar Rateios (CSV)'}
            </button>
          </CardContent>
        </Card>

        {/* Card: Histórico de Geração */}
        <Card className="hover:border-yellow-300 dark:hover:border-yellow-700 transition-colors md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Histórico de Geração (Série Histórica)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Exporta a série histórica de energia gerada pelas Usinas. Formato tabular limpo, substituindo exportações complexas de inversores solares.
            </p>
            <div className="flex items-start bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                Colunas organizadas: ID Usina, Nome, Mês/Ano e Energia Gerada (kWh).
              </p>
            </div>
            <button 
              onClick={handleExportGeracao}
              disabled={loadingGeracao}
              className="w-full flex justify-center items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 text-white font-medium rounded-xl shadow-sm transition-colors mt-2"
            >
              <Download className="w-4 h-4 mr-2" />
              {loadingGeracao ? 'Gerando CSV...' : 'Baixar Geração (CSV)'}
            </button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminExportacoes;
