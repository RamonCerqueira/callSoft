"use client";
import { Sidebar } from "../../../src/components/layout/Sidebar";
import { Header } from "../../../src/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "../../../src/components/ui/Card";
import { Badge } from "../../../src/components/ui/Badge";
import { Button } from "../../../src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../src/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { api, Ticket, Cotacao } from "../../../src/lib/api";
import { ArrowLeft, Clock, User, Mail, Phone, Calendar, Tag, AlertCircle, FileText, Plus, ShoppingCart, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Fetch Ticket
  const { data: ticket, isLoading } = useQuery<Ticket>({
    queryKey: ["ticket-detail", params.id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/tickets/${params.id}`);
      return res.data;
    }
  });

  // Fetch Quotes
  const { data: quotesData, isLoading: isLoadingQuotes } = useQuery<{ success: boolean; data: Cotacao[] | { items: Cotacao[] } }>({
    queryKey: ["ticket-quotes", params.id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/tickets/${params.id}/quotes`);
      return res.data;
    },
    enabled: !!ticket // Only fetch if ticket exists
  });

  const quotes = quotesData?.data ? (Array.isArray(quotesData.data) ? quotesData.data : quotesData.data.items) : [];

  const getStatusBadge = (status: string) => {
      const variants = {
          RESOLVIDO: "success",
          FECHADO: "success",
          NOVO: "warning",
          ABERTO: "warning",
          EM_ANDAMENTO: "info",
          AGUARDANDO_CLIENTE: "warning",
          AGUARDANDO_FORNECEDOR: "warning",
          CANCELADO: "error",
      } as const;

      return variants[status as keyof typeof variants] || "default";
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-8">
        <div className="mb-6 animate-slide-up">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:pl-2 transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Tickets
            </Button>
            
            {isLoading ? (
                <div className="text-slate-400">Carregando detalhes do ticket...</div>
            ) : !ticket ? (
                <div className="text-red-400">Ticket não encontrado.</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card variant="glass">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge variant={getStatusBadge(ticket.status)}>
                                            {ticket.status.replace(/_/g, " ")}
                                        </Badge>
                                        <span className="text-slate-400 text-sm">#{ticket.numero}</span>
                                    </div>
                                    <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                                </div>
                                <Badge variant={
                                    ticket.priority === 'URGENTE' ? 'error' :
                                    ticket.priority === 'ALTA' ? 'warning' :
                                    ticket.priority === 'MEDIA' ? 'info' : 'default'
                                }>
                                    {ticket.priority}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="details">
                                    <TabsList>
                                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                                        <TabsTrigger value="quotes">Cotações ({quotes.length})</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="details">
                                        <div className="prose prose-invert max-w-none mt-4">
                                            <p className="text-slate-300 whitespace-pre-wrap">{ticket.description}</p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="quotes">
                                        <div className="mt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-medium text-white">Cotações Vinculadas</h3>
                                                <Button size="sm" variant="gradient" onClick={() => router.push(`/tickets/${ticket.id}/quotes/new`)}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Nova Cotação
                                                </Button>
                                            </div>

                                            {isLoadingQuotes ? (
                                                <div className="text-slate-400 text-sm">Carregando cotações...</div>
                                            ) : quotes.length === 0 ? (
                                                <div className="text-center py-8 bg-white/5 rounded-lg border border-dashed border-white/10">
                                                    <ShoppingCart className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                                                    <p className="text-slate-400">Nenhuma cotação registrada para este ticket.</p>
                                                    <Button variant="link" onClick={() => router.push(`/tickets/${ticket.id}/quotes/new`)}>
                                                        Criar primeira cotação
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {quotes.map((quote) => (
                                                        <div key={quote.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="font-medium text-white">Cotação #{quote.numero}</span>
                                                                        <Badge variant={
                                                                            quote.status === 'APROVADA' ? 'success' :
                                                                            quote.status === 'REJEITADA' ? 'error' :
                                                                            quote.status === 'ENVIADA' ? 'info' : 'default'
                                                                        }>
                                                                            {quote.status}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-sm text-slate-400 flex items-center gap-1">
                                                                        <Building2 className="h-3 w-3" />
                                                                        {quote.fornecedor.nome}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-lg font-bold text-green-400">
                                                                        {quote.valorTotal ? `R$ ${quote.valorTotal.toFixed(2)}` : "-"}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        {new Date(quote.createdAt).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Details */}
                    <div className="space-y-6">
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">Detalhes do Cliente</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                                        <User className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{ticket.clientName}</p>
                                        <p className="text-xs text-slate-400">Cliente</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <p className="text-sm text-slate-300">{ticket.clientEmail}</p>
                                </div>
                                {ticket.clientPhone && (
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <p className="text-sm text-slate-300">{ticket.clientPhone}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg">Informações</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <Tag className="h-4 w-4" /> Categoria
                                    </span>
                                    <span className="text-white">{ticket.category}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Criado em
                                    </span>
                                    <span className="text-white">{new Date(ticket.createdAt).toLocaleDateString("pt-BR")}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <Clock className="h-4 w-4" /> Atualizado
                                    </span>
                                    <span className="text-white">{new Date(ticket.updatedAt).toLocaleDateString("pt-BR")}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
