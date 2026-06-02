import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import LandingPage from './pages/LandingPage';
import AdminLayout from './components/layout/AdminLayout';
import ClienteLayout from './components/layout/ClienteLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClientes from './pages/admin/AdminClientes';
import AdminClienteDetalhe from './pages/admin/AdminClienteDetalhe';
import AdminRateios from './pages/admin/AdminRateios';
import AdminExportacoes from './pages/admin/AdminExportacoes';
import AdminUsinas from './pages/admin/AdminUsinas';
import AdminUnidades from './pages/admin/AdminUnidades';
import AdminGeracao from './pages/admin/AdminGeracao';
import ClienteDashboard from './pages/cliente/ClienteDashboard';
import ClienteCreditos from './pages/cliente/ClienteCreditos';
import ClienteEconomia from './pages/cliente/ClienteEconomia';
import ClienteRelatorios from './pages/cliente/ClienteRelatorios';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rotas de Admin */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="clientes" element={<AdminClientes />} />
              <Route path="clientes/:id" element={<AdminClienteDetalhe />} />
              <Route path="usinas" element={<AdminUsinas />} />
              <Route path="unidades" element={<AdminUnidades />} />
              <Route path="geracao" element={<AdminGeracao />} />
              <Route path="rateios" element={<AdminRateios />} />
              <Route path="exportacoes" element={<AdminExportacoes />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Rotas de Cliente */}
      <Route path="/cliente/*" element={
        <ProtectedRoute allowedRole="cliente">
          <ClienteLayout>
            <Routes>
              <Route path="dashboard" element={<ClienteDashboard />} />
              <Route path="relatorios" element={<ClienteRelatorios />} />
              <Route path="creditos" element={<ClienteCreditos />} />
              <Route path="economia" element={<ClienteEconomia />} />
              <Route path="*" element={<Navigate to="/cliente/dashboard" replace />} />
            </Routes>
          </ClienteLayout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/simulador" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
