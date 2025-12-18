"use client";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/Input";
import { Search, Filter, Download, Plus, MapPin, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, FornecedorListResponse } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";

export default function SuppliersPage() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery<FornecedorListResponse>({
        queryKey: ["suppliers", page, searchText],
        queryFn: async () => {
            const res = await api.get("/api/v1/suppliers", {
                params: {
                    page,
                    search: searchText || undefined,
                    limit: 10
                }
            });
            return res.data;
        }
    });

    const suppliers = data?.data.items || [];

    return (
        <div className="min-h-screen">
            <Sidebar />
            <Header />

            <main className="ml-64 pt-16">
                <div className="p-8">
                    {/* Page Header */}
                    <div className="mb-8 flex items-center justify-between animate-slide-up">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Fornecedores</h1>
                            <p className="mt-2 text-slate-400">
                                Gerencie sua base de fornecedores e parceiros
                            </p>
                        </div>
                        <Button variant="gradient" onClick={() => router.push("/suppliers/new")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Empresa
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="glass rounded-lg p-4 mb-6 animate-slide-up">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    type="search"
                                    placeholder="Buscar por nome, email ou CNPJ..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    leftIcon={<Search className="h-4 w-4" />}
                                    className="w-full"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtros
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                        </div>
                    </div>

                    {/* Grid of Suppliers (Card view might be better for suppliers, but table is standard) */}
                    <div className="glass rounded-lg overflow-hidden animate-slide-up">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-white/10">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">Nome / Razão Social</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">Contato</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">Localização</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">Especialidades</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">Status</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-300">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-400">Carregando fornecedores...</td>
                                        </tr>
                                    ) : suppliers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-400">Nenhum fornecedor encontrado.</td>
                                        </tr>
                                    ) : (
                                        suppliers.map((supplier) => (
                                            <tr 
                                                key={supplier.id} 
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/suppliers/${supplier.id}`)}
                                            >
                                                <td className="p-4">
                                                    <div>
                                                        <p className="text-white font-medium">{supplier.nome}</p>
                                                        {supplier.razaoSocial && (
                                                            <p className="text-xs text-slate-400">{supplier.razaoSocial}</p>
                                                        )}
                                                        {supplier.cnpj && (
                                                            <p className="text-xs text-slate-500 font-mono mt-1">{supplier.cnpj}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-sm text-slate-300">
                                                            <Mail className="h-3 w-3 mr-2 text-slate-500" />
                                                            {supplier.email}
                                                        </div>
                                                        {supplier.telefone && (
                                                            <div className="flex items-center text-sm text-slate-300">
                                                                <Phone className="h-3 w-3 mr-2 text-slate-500" />
                                                                {supplier.telefone}
                                                            </div>
                                                        )}
                                                        {supplier.contato && (
                                                            <p className="text-xs text-slate-400 pl-5">{supplier.contato}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-start text-sm text-slate-300">
                                                        <MapPin className="h-3 w-3 mr-2 mt-1 text-slate-500" />
                                                        <div>
                                                            <p>{supplier.cidade ? `${supplier.cidade}, ${supplier.estado || ''}` : '-'}</p>
                                                            <p className="text-xs text-slate-400">{supplier.pais}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {supplier.especialidades?.slice(0, 3).map((spec, i) => (
                                                            <span key={i} className="inline-flex items-center rounded-full bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-700/10">
                                                                {spec}
                                                            </span>
                                                        ))}
                                                        {(supplier.especialidades?.length || 0) > 3 && (
                                                            <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300">
                                                                +{supplier.especialidades!.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={supplier.ativo ? "success" : "secondary"}>
                                                        {supplier.ativo ? "Ativo" : "Inativo"}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <Button variant="ghost" size="sm">
                                                        Detalhes
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination controls could go here */}
                    </div>
                </div>
            </main>
        </div>
    );
}
