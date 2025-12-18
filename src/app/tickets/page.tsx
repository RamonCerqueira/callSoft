"use client";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/Input";
import { Search, Filter, Download, MessageCircle, Eye, Phone, CheckCircle2, XCircle, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, Ticket, TicketListResponse } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getUserFromToken } from "../../lib/auth";
import { useNotificationStore } from "../../store/notificationStore";

export default function TicketsPage() {
    const router = useRouter();
    const user = getUserFromToken();
    const { addNotification } = useNotificationStore();
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [priorityFilter, setPriorityFilter] = useState<string>("");
    const [searchText, setSearchText] = useState<string>("");
    
    // Create Ticket States
    const [showNew, setShowNew] = useState<boolean>(false);
    const [newLoading, setNewLoading] = useState<boolean>(false);
    const [newClientName, setNewClientName] = useState("");
    const [newClientEmail, setNewClientEmail] = useState("");
    const [newClientPhone, setNewClientPhone] = useState("");
    const [newSubject, setNewSubject] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPriority, setNewPriority] = useState<string>("MEDIA");

    const { data, isLoading, refetch } = useQuery<TicketListResponse>({
        queryKey: ["tickets", statusFilter, dateFrom, dateTo, priorityFilter],
        queryFn: async () => {
            const res = await api.get("/api/v1/tickets", {
                params: {
                    status: statusFilter || undefined,
                    dateFrom: dateFrom || undefined,
                    dateTo: dateTo || undefined,
                    priority: priorityFilter || undefined
                },
            });
            return res.data;
        },
    });

    const getStatusBadge = (status: string) => {
        const variants = {
            RESOLVIDO: "success",
            FECHADO: "success",
            NOVO: "warning",
            ABERTO: "warning",
            EM_ANDAMENTO: "info",
            AGUARDANDO_CLIENTE: "warning",
            AGUARDANDO_FORNECEDOR: "warning",
            CANCELADO: "destructive",
        } as const;

        return variants[status as keyof typeof variants] || "default";
    };

    const handleCreateTicket = async () => {
        setNewLoading(true);
        try {
            await api.post("/api/v1/tickets", {
                clientName: newClientName,
                clientEmail: newClientEmail,
                clientPhone: newClientPhone,
                subject: newSubject,
                description: newDescription,
                priority: newPriority,
                category: "SUPORTE" // Default category
            });
            setShowNew(false);
            // Reset form
            setNewClientName("");
            setNewClientEmail("");
            setNewClientPhone("");
            setNewSubject("");
            setNewDescription("");
            setNewPriority("MEDIA");
            
            await refetch();
        } catch (error) {
            console.error("Error creating ticket:", error);
        } finally {
            setNewLoading(false);
        }
    };

    const tickets = data?.data?.items || [];
    const [detailsOpenId, setDetailsOpenId] = useState<string | null>(null);

    const handleOpenDetails = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDetailsOpenId(id);
    };

    const handleWhatsApp = (e: React.MouseEvent, phone?: string) => {
        e.stopPropagation();
        if (!phone) return;
        const digits = phone.replace(/\D/g, "");
        if (!digits) return;
        const url = `https://wa.me/${digits}`;
        window.open(url, "_blank");
    };

    const transitionStatus = async (e: React.MouseEvent, id: string, status: Ticket["status"]) => {
        e.stopPropagation();
        try {
            await api.post(`/api/v1/tickets/${id}/status`, { status });
            addNotification({
                title: "Status atualizado",
                message: `Ticket atualizado para ${status.replace(/_/g, " ")}`,
                type: "success",
                category: "system"
            });
            await refetch();
        } catch (error: any) {
            addNotification({
                title: "Erro",
                message: error?.response?.data?.message || "Falha ao atualizar status.",
                type: "error",
                category: "system"
            });
        }
    };

    

    return (
        <div className="min-h-screen">
            <Sidebar />
            <Header />

            <main className="ml-64 pt-16">
                <div className="p-8">
                    {/* Page Header */}
                    <div className="mb-8 flex items-center justify-between animate-slide-up">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Tickets</h1>
                            <p className="mt-2 text-slate-400">
                                Gerencie todos os pedidos e tickets do sistema
                            </p>
                        </div>
                        <div className="flex gap-2">
                        <Button variant="gradient" onClick={() => setShowNew(true)}>
                            + Novo Ticket
                        </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="glass rounded-lg p-4 mb-6 animate-slide-up">
                        <div className="flex flex-col gap-4">
                            {/* Search Bar - Full Width */}
                            <div className="w-full">
                                <Input
                                    type="search"
                                    placeholder="Buscar por assunto, cliente..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    leftIcon={<Search className="h-4 w-4" />}
                                    className="w-full"
                                />
                            </div>

                            {/* Filters Row */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-lg bg-slate-dark border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                                >
                                    <option value="">Status</option>
                                    <option value="NOVO">Novo</option>
                                    <option value="ABERTO">Aberto</option>
                                    <option value="EM_ANDAMENTO">Em Andamento</option>
                                    <option value="RESOLVIDO">Resolvido</option>
                                    <option value="CANCELADO">Cancelado</option>
                                </select>
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="w-full rounded-lg bg-slate-dark border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                                >
                                    <option value="">Prioridade</option>
                                    <option value="BAIXA">Baixa</option>
                                    <option value="MEDIA">Média</option>
                                    <option value="ALTA">Alta</option>
                                    <option value="URGENTE">Urgente</option>
                                </select>
                                <div className="md:col-span-2 flex gap-2">
                                    <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full" />
                                    <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <Button variant="outline" onClick={() => refetch()}>
                                <Filter className="h-4 w-4 mr-2" />
                                Aplicar
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="glass rounded-lg overflow-hidden animate-slide-up">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-white/10">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">
                                            Ticket ID
                                        </th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">
                                            Assunto
                                        </th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">
                                            Cliente
                                        </th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">
                                            Contatos
                                        </th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">
                                            Status
                                        </th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">
                                            Prioridade
                                        </th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">
                                            Criado em
                                        </th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-400">
                                                Carregando tickets...
                                            </td>
                                        </tr>
                                    ) : tickets.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-400">
                                                Nenhum ticket encontrado
                                            </td>
                                        </tr>
                                    ) : (
                                        tickets
                                            .filter((ticket) => {
                                                if (!searchText) return true;
                                                const searchLower = searchText.toLowerCase();
                                                return (
                                                    ticket.subject.toLowerCase().includes(searchLower) ||
                                                    ticket.clientName.toLowerCase().includes(searchLower) ||
                                                    ticket.clientEmail.toLowerCase().includes(searchLower) ||
                                                    (ticket.clientPhone ? ticket.clientPhone.toLowerCase().includes(searchLower) : false) ||
                                                    ticket.numero.toString().includes(searchLower)
                                                );
                                            })
                                            .map((ticket) => (
                                            <tr
                                                key={ticket.id}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/tickets/${ticket.id}`)}
                                            >
                                                <td className="p-4 text-sm text-white font-medium">
                                                    #{ticket.numero}
                                                </td>
                                                <td className="p-4 text-sm text-slate-300">
                                                    {ticket.subject}
                                                </td>
                                                <td className="p-4 text-sm text-slate-300">
                                                    <p className="text-white">{ticket.clientName}</p>
                                                </td>
                                                <td className="p-4 text-sm text-slate-300">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-slate-500">{ticket.clientEmail}</p>
                                                        {ticket.clientPhone && (
                                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                                <Phone className="h-3 w-3" /> {ticket.clientPhone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={getStatusBadge(ticket.status)}>
                                                        {ticket.status.replace(/_/g, " ")}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={
                                                        ticket.priority === 'URGENTE' ? 'destructive' :
                                                        ticket.priority === 'ALTA' ? 'warning' :
                                                        ticket.priority === 'MEDIA' ? 'info' : 'default'
                                                    }>
                                                        {ticket.priority}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 text-sm text-slate-300">
                                                    {new Date(ticket.createdAt).toLocaleDateString("pt-BR")}
                                                </td>
                                                <td className="p-4 flex gap-2">
                                                    <button
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                                                        onClick={(e) => handleOpenDetails(e, ticket.id)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {ticket.clientPhone && (
                                                        <button
                                                            className="p-2 hover:bg-whatsapp/20 rounded-lg transition-colors text-whatsapp"
                                                            onClick={(e) => handleWhatsApp(e, ticket.clientPhone)}
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-green-400"
                                                        onClick={(e) => transitionStatus(e, ticket.id, "RESOLVIDO")}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                                        onClick={(e) => transitionStatus(e, ticket.id, "CANCELADO")}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                                                        onClick={(e) => transitionStatus(e, ticket.id, "ABERTO")}
                                                    >
                                                        <Info className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination - Simple Implementation based on API response */}
                        {data?.data && (
                            <div className="flex items-center justify-between p-4 border-t border-white/10">
                                <p className="text-sm text-slate-400">
                                    Página {data.data.page} de {data.data.pages} (Total: {data.data.total})
                                </p>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        disabled={data.data.page <= 1}
                                        onClick={() => {
                                            // Implement pagination logic if needed, e.g. state for page
                                        }}
                                    >
                                        Anterior
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        disabled={data.data.page >= data.data.pages}
                                        onClick={() => {
                                            // Implement pagination logic
                                        }}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            {showNew && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="glass rounded-xl w-full max-w-lg p-6 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">Novo Ticket</h3>
                            <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-white">
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Cliente *</label>
                                <Input 
                                    placeholder="Nome do cliente" 
                                    value={newClientName} 
                                    onChange={(e) => setNewClientName(e.target.value)} 
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                                    <Input 
                                        placeholder="email@cliente.com" 
                                        value={newClientEmail} 
                                        onChange={(e) => setNewClientEmail(e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Telefone</label>
                                    <Input 
                                        placeholder="+55 11 99999-9999" 
                                        value={newClientPhone} 
                                        onChange={(e) => setNewClientPhone(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Assunto *</label>
                                <Input 
                                    placeholder="Resumo do problema" 
                                    value={newSubject} 
                                    onChange={(e) => setNewSubject(e.target.value)} 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Prioridade</label>
                                <select 
                                    className="w-full rounded-lg bg-slate-dark border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                                    value={newPriority}
                                    onChange={(e) => setNewPriority(e.target.value)}
                                >
                                    <option value="BAIXA">Baixa</option>
                                    <option value="MEDIA">Média</option>
                                    <option value="ALTA">Alta</option>
                                    <option value="URGENTE">Urgente</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Descrição *</label>
                                <textarea 
                                    className="w-full rounded-lg bg-slate-dark border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500 min-h-[100px]"
                                    placeholder="Detalhes completos da solicitação..."
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
                            <Button variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
                            <Button
                                variant="gradient"
                                isLoading={newLoading}
                                onClick={handleCreateTicket}
                                disabled={!newClientName || !newClientEmail || !newSubject || !newDescription}
                            >
                                Criar Ticket
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {detailsOpenId && (
                <TicketDetailsModal id={detailsOpenId} onClose={() => setDetailsOpenId(null)} />
            )}
        </div>
    );
}

function TicketDetailsModal({ id, onClose }: { id: string; onClose: () => void }) {
    const { data: detail, isLoading } = useQuery<{ success?: boolean; data?: Ticket } & Ticket>({
        queryKey: ["ticket-detail-inline", id],
        queryFn: async () => {
            const res = await api.get(`/api/v1/tickets/${id}`);
            return res.data;
        }
    });
    const { data: historyData, isLoading: isLoadingHistory } = useQuery<{ success?: boolean; data?: Array<{ id: string; userName: string; status: string; timestamp: string; note?: string }> }>({
        queryKey: ["ticket-history-inline", id],
        queryFn: async () => {
            try {
                const res = await api.get(`/api/v1/tickets/${id}/history`);
                return res.data;
            } catch {
                return { success: true, data: [] };
            }
        }
    });
    const ticket = (detail as any)?.data || detail;
    const history = historyData?.data || [];
    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
            <div className="glass rounded-xl w-full max-w-2xl p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        Detalhes do Ticket {ticket ? `#${ticket.numero}` : ""}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                </div>
                {isLoading ? (
                    <div className="p-8 text-center text-slate-400">Carregando...</div>
                ) : !ticket ? (
                    <div className="p-8 text-center text-red-400">Ticket não encontrado.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-sm text-slate-400">Assunto</p>
                                <p className="text-white">{ticket.subject}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-sm text-slate-400">Descrição</p>
                                <p className="text-slate-300 whitespace-pre-wrap">{ticket.description}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-sm text-slate-400">Cliente</p>
                                <div className="space-y-1">
                                    <p className="text-white">{ticket.clientName}</p>
                                    <p className="text-xs text-slate-500">{ticket.clientEmail}</p>
                                    {ticket.clientPhone && <p className="text-xs text-slate-400">{ticket.clientPhone}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-sm text-slate-400">Histórico</p>
                                {isLoadingHistory ? (
                                    <div className="text-slate-400 text-sm mt-2">Carregando histórico...</div>
                                ) : history.length === 0 ? (
                                    <div className="text-slate-500 text-sm mt-2">Nenhum evento registrado.</div>
                                ) : (
                                    <div className="space-y-3 mt-2">
                                        {history.map((h) => (
                                            <div key={h.id} className="flex items-start gap-3">
                                                <div className="h-2 w-2 rounded-full bg-purple-400 mt-2" />
                                                <div>
                                                    <p className="text-sm text-white">
                                                        {h.userName} • {h.status.replace(/_/g, " ")}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{new Date(h.timestamp).toLocaleString("pt-BR")}</p>
                                                    {h.note && <p className="text-xs text-slate-400 mt-1">{h.note}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button variant="outline" onClick={onClose}>Fechar</Button>
                </div>
            </div>
        </div>
    );
}
