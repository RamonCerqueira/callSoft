import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface TicketMetrics {
  periodo: {
    from: string;
    to: string;
  };
  totais: {
    total: number;
    novos: number;
    abertos: number;
    emAndamento: number;
    resolvidos: number;
    fechados: number;
    cancelados: number;
  };
  porPrioridade: {
    BAIXA: number;
    MEDIA: number;
    ALTA: number;
    URGENTE: number;
  };
  porCategoria: Record<string, number>;
  tempos: {
    tempoMedioResolucao: number | null;
    tempoMedioPrimeiraResposta: number | null;
  };
  taxas: {
    taxaResolucao: number;
    taxaCancelamento: number;
  };
  distribuicao: {
    porUsuario: Array<{
      userId: string;
      userName: string;
      total: number;
      resolvidos: number;
      emAndamento: number;
    }>;
    porDia: Array<{
      data: string;
      total: number;
      novos: number;
      resolvidos: number;
      emAndamento: number;
    }>;
  };
}

export interface CreateTicketRequest {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  subject: string;
  description: string;
  priority?: "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";
  category?: string;
}

export interface Ticket {
  id: string;
  numero: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  subject: string;
  description: string;
  status: "NOVO" | "ABERTO" | "EM_ANDAMENTO" | "AGUARDANDO_CLIENTE" | "AGUARDANDO_FORNECEDOR" | "RESOLVIDO" | "FECHADO" | "CANCELADO";
  priority: "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";
  category: string;
  assignedToId?: string | null;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
}

export interface TicketListResponse {
  success: boolean;
  data: {
    items: Ticket[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface StatusTransitionRequest {
  status: "NOVO" | "ABERTO" | "EM_ANDAMENTO" | "AGUARDANDO_CLIENTE" | "AGUARDANDO_FORNECEDOR" | "RESOLVIDO" | "FECHADO" | "CANCELADO";
  observacao?: string;
  resolucao?: string;
}

// --- Novos Schemas ---

export interface ItemCotacao {
  codigoPeca?: string;
  descricao: string;
  quantidade: number;
  unidade?: string;
  precoUnitario?: number;
  descontoItem?: number;
  descontoTipo?: "PERCENTUAL" | "VALOR_ABSOLUTO";
}

export interface CreateCotacaoRequest {
  ticketId: string;
  fornecedorId: string;
  itens: ItemCotacao[];
  descontoGlobal?: number;
  descontoTipo?: "PERCENTUAL" | "VALOR_ABSOLUTO";
  prazoEntregaDias?: number;
  dataExpiracao?: string;
  observacoes?: string;
}

export interface Cotacao {
  id: string;
  numero: number;
  ticketId: string;
  fornecedor: {
    id: string;
    nome: string;
    pais: string;
  };
  status: "RASCUNHO" | "ENVIADA" | "RESPONDIDA" | "APROVADA" | "REJEITADA" | "EXPIRADA" | "CANCELADA";
  valorTotal?: number | null;
  itens: ItemCotacao[];
  dataPrevistaEntrega?: string | null;
  createdAt: string;
}

export interface CreateFornecedorRequest {
  nome: string;
  razaoSocial?: string;
  cnpj?: string;
  pais: string;
  cidade?: string;
  estado?: string;
  endereco?: string;
  cep?: string;
  email: string;
  telefone?: string;
  contato?: string;
  observacoes?: string;
  especialidades?: string[];
}

export interface Fornecedor {
  id: string;
  nome: string;
  razaoSocial?: string;
  cnpj?: string;
  pais?: string;
  cidade?: string;
  estado?: string;
  endereco?: string;
  cep?: string;
  email?: string;
  telefone?: string;
  contato?: string;
  observacoes?: string;
  especialidades?: string[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FornecedorStats {
  fornecedor: Fornecedor;
  stats: {
    totalCotacoes: number;
    cotacoesAprovadas: number;
    cotacoesPendentes: number;
    taxaAprovacao: number;
    valorTotalCotacoes: number;
    tempoMedioResposta: number | null;
    ultimaCotacao: string | null;
  };
}

export interface UpdateFornecedorRequest {
  nome?: string;
  razaoSocial?: string;
  cnpj?: string;
  pais?: string;
  cidade?: string;
  estado?: string;
  endereco?: string;
  cep?: string;
  email?: string;
  telefone?: string;
  contato?: string;
  observacoes?: string;
  especialidades?: string[];
}

export interface FornecedorListResponse {
  success: boolean;
  data: {
    items: Fornecedor[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CotacaoListResponse {
  success: boolean;
  data: {
    items: Cotacao[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
