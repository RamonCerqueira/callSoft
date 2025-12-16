"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Ticket,
    Truck,
    MessageCircle,
    BarChart3,
    Settings,
    Building2,
    ListChecks,
    LucideIcon,
    User2Icon,
    LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { clearAuthToken } from "../../lib/auth";
import router from "next/router";

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Fornecedores", href: "/suppliers", icon: Truck },
    { name: "Contatos WhatsApp", href: "/whatsapp/contatos", icon: ListChecks },
    { name: "Config Chatbot", href: "/whatsapp/config", icon: Settings },
    { name: "Relatórios", href: "/reports", icon: BarChart3 },
    { name: "Configurações", href: "/settings", icon: Settings },
    { name: "Criar Empresa", href: "/settings/criar-empresa", icon: Building2 },
    { name: "Criar Usuario", href: "/settings/criar-usuario", icon: User2Icon },
];

export function Sidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await api.post("/api/v1/auth/logout");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            clearAuthToken();
            router.push("/login");
        }
    };

    const { data: userProfile } = useQuery({
        queryKey: ['auth-me'],
        queryFn: async () => {
            const res = await api.get('/api/v1/auth/me');
            return res.data;
        },
        retry: false
    });

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass border-r border-white/10">
            {/* Logo */}
            <div className="flex h-16 items-center justify-center border-b border-white/10">
                <h1 className="text-2xl font-bold gradient-text">CALLSOFT</h1>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                isActive
                                    ? "gradient-primary text-white shadow-lg"
                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="absolute bottom-4 left-4 right-4">
                <div className="glass-hover rounded-lg p-3 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                            U
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Usuário</p>
                            <p className="text-xs text-slate-400 truncate">user@callsoft.com</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-2 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Sair"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
