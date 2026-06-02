import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { geracaoService } from '../../services/geracaoService';
import { usinaService } from '../../services/usinaService';
import { Plus, X, Factory } from 'lucide-react';

const AdminGeracao = () => {
  const [geracoes, setGeracoes] = useState([]);
  const [usinas, setUsinas] = useState([]);
  const [selectedUsinaId, setSelectedUsinaId] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    energiaGeradaKwh: '',
    tarifaKwh: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [geracaoData, usinasData] = await Promise.all([
        geracaoService.getGeracao(),
        usinaService.getUsinas()
      ]);
      
      // Sort geracao by Ano then Mes descending
      const sortedGeracao = geracaoData.sort((a, b) => {
        if (a.ano !== b.ano) return b.ano - a.ano;
        return b.mes - a.mes;
      });
      
      setGeracoes(sortedGeracao);
      setUsinas(usinasData);
      
      if (usinasData.length > 0 && selectedUsinaId === null) {
        setSelectedUsinaId(usinasData[0].id);
      }
    } catch (err) {
      console.error('Erro ao buscar dados de geracao/usinas', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUsinaId) {
      alert("Selecione uma usina primeiro.");
      return;
    }
    
    try {
      await geracaoService.createGeracao({
        ...formData,
        idUsina: selectedUsinaId,
        mes: parseInt(formData.mes),
        ano: parseInt(formData.ano),
        energiaGeradaKwh: parseFloat(formData.energiaGeradaKwh),
        tarifaKwh: parseFloat(formData.tarifaKwh)
      });
      setIsModalOpen(false);
      setFormData({ 
        mes: new Date().getMonth() + 1, 
        ano: new Date().getFullYear(), 
        energiaGeradaKwh: '', 
        tarifaKwh: '' 
      });
      fetchData();
    } catch (err) {
      alert('Erro ao registrar geração: ' + (err.response?.data || err.message));
    }
  };

  if (loading && usinas.length === 0) {
    return <div className="flex h-[80vh] items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const filteredGeracoes = geracoes.filter(g => g.idUsina === selectedUsinaId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Geração Mensal</h1>
          <p className="text-slate-500 dark:text-slate-400">Selecione uma usina para visualizar ou registrar sua geração.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedUsinaId}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Geração
        </button>
      </div>

      {/* Cards de Seleção de Usina */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {usinas.map(usina => (
          <div 
            key={usina.id}
            onClick={() => setSelectedUsinaId(usina.id)}
            className={`cursor-pointer rounded-xl p-5 border transition-all duration-200 ${
              selectedUsinaId === usina.id 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md ring-1 ring-blue-500' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${selectedUsinaId === usina.id ? 'bg-blue-100 dark:bg-blue-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
                <Factory className={`w-6 h-6 ${selectedUsinaId === usina.id ? 'text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${selectedUsinaId === usina.id ? 'text-blue-900 dark:text-blue-100' : 'text-slate-900 dark:text-white'}`}>
                  {usina.nome}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">ID: {usina.id} • {usina.capacidadeKwp} kWp</p>
              </div>
            </div>
          </div>
        ))}
        {usinas.length === 0 && (
          <div className="col-span-3 p-4 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            Nenhuma usina cadastrada. Cadastre uma usina primeiro na aba "Usinas".
          </div>
        )}
      </div>

      {/* Tabela de Geração da Usina Selecionada */}
      {selectedUsinaId && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-medium">Data (Mês/Ano)</th>
                  <th className="px-6 py-4 font-medium">Energia Gerada</th>
                  <th className="px-6 py-4 font-medium">Tarifa (kWh)</th>
                  <th className="px-6 py-4 font-medium">Valor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredGeracoes.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {String(g.mes).padStart(2, '0')}/{g.ano}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium">+{g.energiaGeradaKwh} kWh</td>
                    <td className="px-6 py-4">{formatCurrency(g.tarifaKwh)}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(g.energiaGeradaKwh * g.tarifaKwh)}</td>
                  </tr>
                ))}
                {filteredGeracoes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      Nenhum registro de geração encontrado para esta usina.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Registrar Geração</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="p-3 mb-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Usina Selecionada: {usinas.find(u => u.id === selectedUsinaId)?.nome}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mês</label>
                  <input required value={formData.mes} onChange={e => setFormData({...formData, mes: e.target.value})} type="number" min="1" max="12" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ano</label>
                  <input required value={formData.ano} onChange={e => setFormData({...formData, ano: e.target.value})} type="number" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Energia Gerada (kWh)</label>
                  <input required value={formData.energiaGeradaKwh} onChange={e => setFormData({...formData, energiaGeradaKwh: e.target.value})} type="number" step="0.01" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tarifa (R$/kWh)</label>
                  <input required value={formData.tarifaKwh} onChange={e => setFormData({...formData, tarifaKwh: e.target.value})} type="number" step="0.001" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGeracao;
