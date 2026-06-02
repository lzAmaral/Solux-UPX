import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Sun, TrendingUp, ShieldCheck, BarChart3,
  ChevronRight, ArrowRight, Calculator, Users,
  Building2, Leaf, Star, CheckCircle2
} from 'lucide-react';

/* ─── Constants ─────────────────────────────────────────────────── */
const TARIFA_MEDIA = 0.85;   // R$/kWh média nacional ANEEL 2024
const FATOR_GD     = 0.80;   // Fator de aproveitamento real (desconta Fio B ~20%)
const REAJUSTE_ANUAL = 0.07; // Reajuste médio histórico da energia no Brasil (7% a.a.)

/* ─── Animated Counter ───────────────────────────────────────────── */
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 800;
    const step = (end - start) / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { start = end; clearInterval(timer); }
      setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  const formatted = display.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span>{prefix}{formatted}{suffix}</span>;
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function LandingPage() {
  const [gasto, setGasto]           = useState('');
  const [tarifa, setTarifa]         = useState(TARIFA_MEDIA.toString());
  const [percentual, setPercentual] = useState('10');
  const [geracao, setGeracao]       = useState('10000');
  const [resultado, setResultado]   = useState(null);
  const simulatorRef = useRef(null);

  /* ── Calculation Engine ─────────────────────────────────────────── */
  function calcular() {
    const gastoNum      = parseFloat(gasto);
    const tarifaNum     = parseFloat(tarifa)     || TARIFA_MEDIA;
    const percentualNum = parseFloat(percentual) || 10;
    const geracaoNum    = parseFloat(geracao)    || 10000;

    if (!gastoNum || gastoNum <= 0) return;

    // Passo 1: Consumo estimado
    const consumoKwh = gastoNum / tarifaNum;

    // Passo 2: Créditos recebidos da usina
    const creditosKwh = geracaoNum * (percentualNum / 100);

    // Passo 3: Créditos efetivamente aproveitados
    const creditosAproveitados = Math.min(creditosKwh, consumoKwh);

    // Passo 4: Economia bruta
    const economiaBruta = creditosAproveitados * tarifaNum;

    // Passo 5: Economia líquida (desconto Fio B regulatório)
    const economiaMensal = economiaBruta * FATOR_GD;

    // Projeções
    const economiaAnual   = economiaMensal * 12;
    const economia5anos   = economiaAnual * 5;
    const economia10anos  = economiaAnual * 10;
    const reducaoPercent  = (economiaMensal / gastoNum) * 100;

    // Projeção com reajuste composto (IPCA energia ~7% a.a.)
    let economia10Corrigida = 0;
    for (let i = 0; i < 10; i++) {
      economia10Corrigida += economiaAnual * Math.pow(1 + REAJUSTE_ANUAL, i);
    }

    setResultado({
      consumoKwh: consumoKwh.toFixed(0),
      creditosKwh: creditosKwh.toFixed(0),
      economiaMensal,
      economiaAnual,
      economia5anos,
      economia10anos,
      economia10Corrigida,
      reducaoPercent: Math.min(reducaoPercent, 100),
      contaFinal: Math.max(gastoNum - economiaMensal, gastoNum * 0.05),
    });
  }

  function handleGastoChange(e) {
    const raw = e.target.value.replace(/\D/g, '');
    setGasto(raw ? (parseInt(raw) / 100).toString() : '');
    setResultado(null);
  }

  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const scrollToSimulator = () =>
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Solux Energy</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToSimulator}
              className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              Simulador
            </button>
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Acessar Sistema
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-60 -left-40 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Leaf className="w-3.5 h-3.5" />
            Plataforma SaaS de Energia Solar
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
            Energia solar{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              sem planilha
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Automatizamos o rateio de créditos de energia solar e damos transparência total
            para gestores e clientes. Simule agora quanto você pode economizar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToSimulator}
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              <Calculator className="w-5 h-5" />
              Simular minha economia
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-4 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all duration-200 font-medium w-full sm:w-auto justify-center"
            >
              Acessar Plataforma
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative max-w-3xl mx-auto mt-20 grid grid-cols-3 gap-6">
          {[
            { value: '100%', label: 'Rateio automatizado' },
            { value: 'R$ 0', label: 'Erros de planilha' },
            { value: '< 1min', label: 'Para processar o mês' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Como funciona</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Três etapas que eliminam horas de trabalho manual todo mês
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Building2,
                color: 'emerald',
                title: 'Gestora cadastra a usina',
                desc: 'Registra a geração mensal da usina em kWh e a tarifa vigente. O sistema aceita múltiplas usinas.',
              },
              {
                step: '02',
                icon: Zap,
                color: 'teal',
                title: 'Motor de rateio processa',
                desc: 'O sistema distribui automaticamente os créditos para cada cliente de acordo com seu percentual de rateio.',
              },
              {
                step: '03',
                icon: BarChart3,
                color: 'cyan',
                title: 'Cliente acompanha tudo',
                desc: 'Cada cliente acessa seu painel com economia real, histórico de créditos e projeção anual.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative p-6 rounded-2xl bg-white/3 border border-white/8 hover:border-emerald-500/30 transition-all duration-300 group"
                >
                  <span className="text-6xl font-black text-white/5 absolute top-4 right-4 select-none">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SIMULATOR ────────────────────────────────────────────────── */}
      <section ref={simulatorRef} className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <Calculator className="w-3.5 h-3.5" />
              Simulador de Economia Solar
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Quanto você vai economizar?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Cálculo baseado na Resolução Normativa ANEEL nº 1.000/2021 e na tarifa média nacional de 2024.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Input Panel */}
            <div className="p-8 rounded-2xl bg-white/3 border border-white/8">
              <h3 className="text-lg font-semibold text-white mb-6">Seus dados</h3>

              <div className="space-y-5">
                {/* Gasto mensal */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sua conta de luz mensal (R$)
                    <span className="ml-2 text-xs text-emerald-400 font-normal">obrigatório</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={gasto ? parseFloat(gasto).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                      onChange={handleGastoChange}
                      placeholder="0,00"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none text-white text-lg font-medium transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">Valor médio antes da adesão à energia solar</p>
                </div>

                {/* Advanced fields */}
                <details className="group">
                  <summary className="cursor-pointer text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 select-none">
                    <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                    Configurações avançadas
                  </summary>
                  <div className="mt-4 space-y-4 pl-2 border-l border-white/5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Tarifa local (R$/kWh)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={tarifa}
                        onChange={e => { setTarifa(e.target.value); setResultado(null); }}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-white transition-all"
                      />
                      <p className="text-xs text-slate-500 mt-1">Média nacional: R$ 0,85/kWh (ANEEL 2024)</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Percentual de rateio (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="100"
                          value={percentual}
                          onChange={e => { setPercentual(e.target.value); setResultado(null); }}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Geração da usina (kWh/mês)
                        </label>
                        <input
                          type="number"
                          step="100"
                          value={geracao}
                          onChange={e => { setGeracao(e.target.value); setResultado(null); }}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </details>

                <button
                  onClick={calcular}
                  disabled={!gasto}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calcular minha economia
                </button>

                {/* Math footnote */}
                <div className="pt-2 border-t border-white/5">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <span className="text-slate-400 font-medium">Metodologia: </span>
                    Consumo (kWh) = Gasto ÷ Tarifa → Créditos = Geração × % Rateio → Economia = MIN(Créditos, Consumo) × Tarifa × 0,80
                    <br />
                    O fator 0,80 desconta o "Fio B" conforme escalonamento da Resolução ANEEL 1.000/2021.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div>
              {!resultado ? (
                <div className="h-full min-h-[400px] rounded-2xl bg-white/2 border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                    <Sun className="w-8 h-8 text-emerald-400 opacity-60" />
                  </div>
                  <p className="text-slate-400 text-sm">
                    Preencha sua conta de luz mensal<br />e clique em calcular
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Main savings card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30">
                    <p className="text-sm text-emerald-300 font-medium mb-1">Economia mensal estimada</p>
                    <p className="text-5xl font-black text-white">
                      <AnimatedNumber value={resultado.economiaMensal} prefix="R$ " decimals={2} />
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                          style={{ width: `${resultado.reducaoPercent}%` }}
                        />
                      </div>
                      <span className="text-emerald-400 font-bold text-sm">
                        {resultado.reducaoPercent.toFixed(0)}% da conta
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Sua conta cairia de {formatCurrency(parseFloat(gasto))} para{' '}
                      <span className="text-white font-medium">{formatCurrency(resultado.contaFinal)}</span>
                    </p>
                  </div>

                  {/* Projection grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-white/3 border border-white/8">
                      <p className="text-xs text-slate-400 mb-1">Economia anual</p>
                      <p className="text-2xl font-bold text-white">
                        <AnimatedNumber value={resultado.economiaAnual} prefix="R$ " decimals={0} />
                      </p>
                    </div>
                    <div className="p-5 rounded-xl bg-white/3 border border-white/8">
                      <p className="text-xs text-slate-400 mb-1">Em 5 anos</p>
                      <p className="text-2xl font-bold text-white">
                        <AnimatedNumber value={resultado.economia5anos} prefix="R$ " decimals={0} />
                      </p>
                    </div>
                  </div>

                  {/* 10-year highlight */}
                  <div className="p-5 rounded-xl bg-white/3 border border-white/8 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Em 10 anos (com reajuste de 7% a.a.)</p>
                      <p className="text-3xl font-bold text-emerald-400">
                        <AnimatedNumber value={resultado.economia10Corrigida} prefix="R$ " decimals={0} />
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-500/40 flex-shrink-0" />
                  </div>

                  {/* Technical breakdown */}
                  <details className="group">
                    <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5 select-none px-1">
                      <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
                      Ver memória de cálculo
                    </summary>
                    <div className="mt-3 p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 text-xs font-mono text-slate-400">
                      <p>Consumo estimado: <span className="text-slate-200">{resultado.consumoKwh} kWh/mês</span></p>
                      <p>Créditos recebidos: <span className="text-slate-200">{resultado.creditosKwh} kWh/mês</span></p>
                      <p>Fator Fio B: <span className="text-slate-200">0,80 (ANEEL RN 1.000/2021)</span></p>
                      <p>Reajuste projetado: <span className="text-slate-200">7,0% a.a. (média histórica)</span></p>
                    </div>
                  </details>

                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 rounded-xl transition-all duration-200 text-sm font-medium"
                  >
                    Quero acessar a plataforma
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Tudo que a gestora precisa</h2>
            <p className="text-slate-400">Do cadastro da usina ao relatório do cliente, em um só lugar.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Zap,         title: 'Rateio automatizado',       desc: 'Motor de cálculo distribui créditos para centenas de clientes em segundos.' },
              { icon: BarChart3,   title: 'Dashboard em tempo real',   desc: 'KPIs de geração, economia e créditos distribuídos sempre atualizados.' },
              { icon: Users,       title: 'Portal do cliente',         desc: 'Cada cliente acessa seu painel com histórico e projeção anual de economia.' },
              { icon: ShieldCheck, title: 'Seguro e rastreável',       desc: 'Autenticação separada por perfil. Toda operação é auditável.' },
              { icon: TrendingUp,  title: 'Projeção de economia',      desc: 'Baseado na média dos últimos 3 meses, com reajuste histórico de tarifa.' },
              { icon: Star,        title: 'Exportação CSV',            desc: 'Relatórios mensais prontos para envio ao cliente e para a distribuidora.' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-6 rounded-xl bg-white/2 border border-white/8 hover:border-emerald-500/20 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Menos planilha.<br />Mais energia.
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Acesse a plataforma e veja como o Solux transforma a gestão de créditos de GD.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="flex items-center gap-2 justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              >
                Acessar o Sistema
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={scrollToSimulator}
                className="flex items-center gap-2 justify-center px-8 py-4 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all duration-200"
              >
                <Calculator className="w-4 h-4" />
                Simular novamente
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
              <Sun className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Solux Energy</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Cálculos baseados na Resolução Normativa ANEEL nº 1.000/2021
          </div>
          <p className="text-xs text-slate-600">Projeto UPX · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
