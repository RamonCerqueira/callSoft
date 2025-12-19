"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api, type TicketStatus } from "@/lib/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Plus } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";

type TicketHistoryItem = {
  id: number;
  statusAnterior?: TicketStatus | null;
  statusNovo?: TicketStatus | null;
  historico: string;
  motivo?: string | null;
  observacao?: string | null;
  horaProposta?: string | null;
  autorTipo?: "BOT" | "PORTAL" | null;
  createdAt: string;
};

type TicketDetail = {
  id: string;
  pedido: number;
  contatoWpp: string;
  solicitacao: string;
  status: TicketStatus;
  horaProposta: string | null;
  empresa?: string | null;
  responsavel?: string | null;
  prioridade?: string | null;
  createdAt: string;
  updatedAt: string;
  historico: TicketHistoryItem[];
  cotacoes?: Array<{
    id: string;
    numero: number;
    fornecedor: { id: string; nome: string; pais: string };
    status: string;
    valorTotal: number | null;
    prazoEntregaDias?: number | null;
    dataPrevistaEntrega?: string | null;
    createdAt: string;
  }>;
};

function statusBadgeVariant(status: TicketStatus) {
  switch (status) {
    case "CONCLUIDO":
      return "success" as const;
    case "CANCELADO":
      return "destructive" as const;
    case "SOLICITADO":
      return "warning" as const;
    default:
      return "info" as const;
  }
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { data: ticket, isLoading, refetch } = useQuery<TicketDetail>({
    queryKey: ["ticket-detail", params.id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/tickets/${params.id}`);
      return res.data.data;
    },
  });

  const whatsappUrl = useMemo(() => {
    const digits = ticket?.contatoWpp?.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : null;
  }, [ticket?.contatoWpp]);

  const transitionStatus = async (status: TicketStatus) => {
    if (!ticket) return;
    setIsUpdatingStatus(true);
    try {
      await api.post(`/api/v1/tickets/${ticket.id}/status`, { status });
      addNotification({
        title: "Status atualizado",
        message: `Ticket atualizado para ${status.replace(/_/g, " ")}.`,
        type: "success",
        category: "system",
      });
      await refetch();
    } catch (error: any) {
      addNotification({
        title: "Erro",
        message: error?.response?.data?.message || "Falha ao atualizar status.",
        type: "error",
        category: "system",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
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
              <div className="lg:col-span-2 space-y-6">
                <Card variant="glass">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={statusBadgeVariant(ticket.status)}>{ticket.status.replace(/_/g, " ")}</Badge>
                        <span className="text-slate-400 text-sm">#{ticket.pedido}</span>
                      </div>
                      <CardTitle className="text-2xl">{ticket.empresa ?? "Ticket"}</CardTitle>
                      <p className="mt-2 text-slate-300 whitespace-pre-wrap">{ticket.solicitacao}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {whatsappUrl && (
                        <Button variant="ghost" size="icon" onClick={() => window.open(whatsappUrl, "_blank")} title="WhatsApp">
                          <MessageCircle className="h-4 w-4 text-green-400" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/tickets/${ticket.id}/quotes/new`)} title="Nova cotação">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Contato WhatsApp</p>
                        <p className="text-slate-200">{ticket.contatoWpp}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Responsável</p>
                        <p className="text-slate-200">{ticket.responsavel ?? "--"}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Prioridade</p>
                        <p className="text-slate-200">{ticket.prioridade ?? "--"}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Criado em</p>
                        <p className="text-slate-200">{new Date(ticket.createdAt).toLocaleString("pt-BR")}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button variant="outline" disabled={isUpdatingStatus} onClick={() => transitionStatus("PENDENTE_ATENDIMENTO")}>
                        Pendente
                      </Button>
                      <Button variant="outline" disabled={isUpdatingStatus} onClick={() => transitionStatus("EM_ATENDIMENTO")}>
                        Em atendimento
                      </Button>
                      <Button variant="outline" disabled={isUpdatingStatus} onClick={() => transitionStatus("CONCLUIDO")}>
                        Concluir
                      </Button>
                      <Button variant="outline" disabled={isUpdatingStatus} onClick={() => transitionStatus("CANCELADO")}>
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Histórico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ticket.historico?.length ? (
                      <div className="space-y-3">
                        {ticket.historico
                          .slice()
                          .reverse()
                          .map((h) => (
                            <div key={h.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm text-slate-200">
                                  <span className="text-slate-400">{h.statusAnterior ?? "—"}</span>
                                  <span className="text-slate-500"> → </span>
                                  <span className="text-slate-200">{h.statusNovo ?? "—"}</span>
                                </p>
                                <p className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString("pt-BR")}</p>
                              </div>
                              {(h.motivo || h.observacao || h.historico) && (
                                <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap">
                                  {h.observacao || h.motivo || h.historico}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">Sem histórico.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Cotações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ticket.cotacoes?.length ? (
                      <div className="space-y-3">
                        {ticket.cotacoes.map((c) => (
                          <div key={c.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                            <p className="text-sm text-slate-200 font-medium">Cotação #{c.numero}</p>
                            <p className="text-xs text-slate-400">Fornecedor: {c.fornecedor.nome}</p>
                            <p className="text-xs text-slate-400">Status: {c.status}</p>
                            <p className="text-xs text-slate-400">
                              Valor: {c.valorTotal != null ? c.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "--"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">Nenhuma cotação associada.</p>
                    )}
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
