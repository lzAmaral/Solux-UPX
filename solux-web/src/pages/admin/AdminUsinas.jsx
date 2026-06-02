import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { usinaService } from '../../services/usinaService';
import { Plus, X } from 'lucide-react';

const AdminUsinas = () => {
  const [usinas, setUsinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    idEmpresa: 1, // Defaulting to 1 for simulation since there's no auth context providing this yet
    nome: '',
    localizacao: '',
    capacidadeKwp: '',
    distribuidora: ''
  });

  const fetchUsinas = async () => {
    try {
      const data = await usinaService.getUsinas();
      setUsinas(data);
    } catch (err) {
      console.error('Erro ao buscar usinas', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsinas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usinaService.createUsina({
        ...formData,
        capacidadeKwp: parseFloat(formData.capacidadeKwp)
      });
      setIsModalOpen(false);
      setFormData({ idEmpresa: 1, nome: '', localizacao: '', capacidadeKwp: '', distribuidora: '' });
      setLoading(true);
      fetchUsinas();
    } catch (err) {
      alert('Erro ao criar usina: ' + (err.response?.data || err.message));
    }
  };

  if (loading) {
    return <div className="flex h-[80vh] items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Usinas</h1>
          <p className="text-slate-500 dark:text-slate-400">Gerencie as usinas solares da operação.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Usina
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Capacidade (kWp)</th>
                <th className="px-6 py-4 font-medium">Distribuidora</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {usinas.map((usina) => (
                <tr key={usina.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                  <td className="px-6 py-4">{usina.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{usina.nome}</td>
                  <td className="px-6 py-4">{usina.capacidadeKwp}</td>
                  <td className="px-6 py-4">{usina.distribuidora}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                      ATIVA
                    </span>
                  </td>
                </tr>
              ))}
              {usinas.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    Nenhuma usina cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Nova Usina</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome da Usina</label>
                <input required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Distribuidora</label>
                <input required value={formData.distribuidora} onChange={e => setFormData({...formData, distribuidora: e.target.value})} type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Capacidade (kWp)</label>
                  <input required value={formData.capacidadeKwp} onChange={e => setFormData({...formData, capacidadeKwp: e.target.value})} type="number" step="0.01" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Localização</label>
                  <input value={formData.localizacao} onChange={e => setFormData({...formData, localizacao: e.target.value})} type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
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

export default AdminUsinas;
