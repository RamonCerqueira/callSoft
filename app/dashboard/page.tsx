"use client";
import { Sidebar } from "../../src/components/layout/Sidebar";
import { Header } from "../../src/components/layout/Header";
import { StatCard } from "../../src/components/ui/StatCard";
import { StatusPieChart } from "../../src/components/charts/StatusPieChart";
import { OpenTicketsKpi } from "../../src/components/ui/KpiCard";
import { Ticket as TicketIcon, MessageCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/Badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api, TicketMetrics, TicketListResponse } from "../../src/lib/api";

export default function DashboardPage() {
    const { data: metrics, isLoading: isLoadingMetrics } = useQuery<TicketMetrics>({
        queryKey: ["dashboard-metrics"],
        queryFn: async () => {
            const res = await api.get("/api/v1/dashboard/metrics");
            return res.data;
        }
    });

    const { data: recentTicketsData, isLoading: isLoadingTickets } = useQuery<TicketListResponse>({
        queryKey: ["recent-tickets"],
        queryFn: async () => {
            const res = await api.get("/api/v1/tickets", { params: { page: 1, limit: 5 } });
            return res.data;
        }
    });

    const stats = [
        {
            title: "Total de Tickets",
            value: metrics?.totais.total.toString() || "0",
            icon: TicketIcon,
            trend: { value: 0, isPositive: true },
            variant: "glass-blue" as const,
        },
        {
            title: "Novos Tickets",
            value: metrics?.totais.novos.toString() || "0",
            icon: MessageCircle,
            trend: { value: 0, isPositive: true },
            variant: "glass-cyan" as const,
        },
        {
            title: "Tickets Resolvidos",
            value: metrics?.totais.resolvidos.toString() || "0",
            icon: CheckCircle,
            trend: { value: metrics?.taxas.taxaResolucao || 0, isPositive: true },
            variant: "glass-purple" as const,
        },
        {
            title: "Tempo Médio (min)",
            value: metrics?.tempos.tempoMedioResolucao ? Math.round(metrics.tempos.tempoMedioResolucao / 60).toString() : "0",
            icon: Clock,
            trend: { value: 0, isPositive: false },
            variant: "glass-pink" as const,
        },
    ];

    const chamadosEmAberto = metrics ? (metrics.totais.abertos + metrics.totais.emAndamento) : 0;

    const lineData = metrics?.distribuicao.porDia.map(d => ({
        name: new Date(d.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        value: d.total
    })) || [];

    const pieData = metrics ? [
        { name: "Novos", value: metrics.totais.novos, color: "#f59e0b" },
        { name: "Abertos", value: metrics.totais.abertos, color: "#3b82f6" },
        { name: "Em Andamento", value: metrics.totais.emAndamento, color: "#8b5cf6" },
        { name: "Resolvidos", value: metrics.totais.resolvidos, color: "#22c55e" },
        { name: "Cancelados", value: metrics.totais.cancelados, color: "#ef4444" }
    ] : [];

    const recentTickets = recentTicketsData?.data.items || [];

    return (
        <div className="min-h-screen">
            <Sidebar />
            <Header />

            <main className="ml-64 pt-16">
                <div className="p-8">
                    {/* Header Section matching reference */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 animate-slide-up gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span>
                                CALLSOFT Analytics
                            </h1>
                            <p className="mt-1 text-slate-400 text-sm ml-4">
                                Visão geral de métricas e performance
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span>Hoje: {new Date().toLocaleDateString('pt-BR')}</span>
                            </div>
                            <button className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors">
                                Export (PDF, CSV)
                            </button>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid gap-6 lg:grid-cols-5 mb-8 animate-slide-up">
                        <OpenTicketsKpi count={chamadosEmAberto} />
                        {stats.map((stat, index) => (
                            <div key={stat.title} className="h-full" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                                <StatCard {...stat} />
                            </div>
                        ))}
                    </div>

                    {/* Main Chart Section */}
                    <div className="grid gap-6 lg:grid-cols-3 mb-8 animate-slide-up">
                        <div className="lg:col-span-2">
                            <Card variant="glass" className="h-full border-0 bg-slate-900/40">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Tendência de Tickets (Últimos 30 dias)</CardTitle>
                                        <p className="text-sm text-slate-400 mt-1">Volume diário de aberturas</p>
                                    </div>
                                    <select className="bg-slate-800 border-slate-700 text-xs rounded px-2 py-1 text-slate-400">
                                        <option>Automático</option>
                                    </select>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={lineData}>
                                                <defs>
                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                                                <XAxis 
                                                    dataKey="name" 
                                                    stroke="#64748b" 
                                                    tick={{fill: '#64748b', fontSize: 12}}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    dy={10}
                                                />
                                                <YAxis 
                                                    stroke="#64748b" 
                                                    tick={{fill: '#64748b', fontSize: 12}}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    dx={-10}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                                        borderRadius: "8px",
                                                        color: "#fff",
                                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                    itemStyle={{ color: "#fff" }}
                                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="value" 
                                                    stroke="#8b5cf6" 
                                                    strokeWidth={3}
                                                    dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                                                    activeDot={{ r: 6, fill: "#fff", stroke: "#8b5cf6" }}
                                                    fill="url(#colorValue)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Secondary Chart / Stats */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <Card variant="glass" className="flex-1 border-0 bg-slate-900/40">
                                <CardHeader>
                                    <CardTitle>Status dos Tickets</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <StatusPieChart data={pieData} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    
                    {/* Recent Tickets Table */}
                    <Card variant="glass" className="mb-8 animate-slide-up border-0 bg-slate-900/40">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Últimos Tickets</CardTitle>
                                <p className="text-sm text-slate-400 mt-1">Acompanhe as solicitações mais recentes</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                Ver todos
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5 text-left">
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ticket ID</th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Assunto</th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Solicitante</th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Prioridade</th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Criado</th>
                                            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {isLoadingTickets ? (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        Carregando...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : recentTickets.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">Nenhum ticket recente.</td>
                                            </tr>
                                        ) : (
                                            recentTickets.map((row) => (
                                            <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 text-sm text-white font-medium">#{row.numero}</td>
                                                <td className="p-4 text-sm text-slate-300 font-medium">{row.subject}</td>
                                                <td className="p-4 text-sm text-slate-300">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                            {row.clientName.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        {row.clientName}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <Badge variant={
                                                        row.status === 'RESOLVIDO' ? 'success' :
                                                        row.status === 'NOVO' ? 'warning' :
                                                        'info'
                                                    }>
                                                        {row.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <Badge variant={
                                                        row.priority === 'URGENTE' ? 'destructive' :
                                                        row.priority === 'ALTA' ? 'warning' :
                                                        'info'
                                                    }>
                                                        {row.priority}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-sm text-slate-400">
                                                    {new Date(row.createdAt).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="p-4 text-sm text-right">
                                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Detalhes
                                                    </Button>
                                                </td>
                                            </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
