"use client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/button";
import { useRouter } from "next/navigation";
import { api } from "../../src/lib/api";
import { setAuthToken } from "../../src/lib/auth";
import { useNotificationStore } from "../../src/store/notificationStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../src/components/ui/dialog";

export default function LoginPage() {
    const router = useRouter();
    const { addNotification } = useNotificationStore();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [isResetLoading, setIsResetLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post("/api/v1/auth/login", {
                email,
                password,
                tenantId: process.env.NEXT_PUBLIC_TENANT_ID
            });

            const { success, data } = res.data;
            
            if (success && data?.token) {
                setAuthToken(data.token);
                // Opcional: Salvar dados do usuário se necessário
                // localStorage.setItem("user", JSON.stringify(data.user));

                addNotification({
                    title: "Bem-vindo!",
                    message: `Login realizado com sucesso. Olá, ${data.user.name}!`,
                    type: "success",
                    category: "system"
                });
                router.push("/dashboard"); 
            } else {
                throw new Error("Resposta inválida do servidor");
            }

        } catch (error: any) {
            console.error("Login error:", error);
            addNotification({
                title: "Erro no Login",
                message: error.response?.data?.message || "Falha ao autenticar. Verifique suas credenciais.",
                type: "error",
                category: "security"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsResetLoading(true);
        try {
            await api.post("/api/v1/auth/password-reset/request", {
                email: resetEmail,
                tenantId: process.env.NEXT_PUBLIC_TENANT_ID
            });
            addNotification({
                title: "Email Enviado",
                message: "Verifique sua caixa de entrada para redefinir a senha.",
                type: "success",
                category: "system"
            });
            setIsResetOpen(false);
            setResetEmail("");
        } catch (error: any) {
             addNotification({
                title: "Erro",
                message: error.response?.data?.message || "Falha ao solicitar redefinição.",
                type: "error",
                category: "system"
            });
        } finally {
            setIsResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Gradient */}
            <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
                <div className="max-w-md animate-slide-up">
                    <h1 className="text-5xl font-bold text-white mb-6">CALLSOFT</h1>
                    <p className="text-xl text-white/90 mb-8">
                        Sistema de Gestão de Tickets e Integração WhatsApp
                    </p>
                    <div className="space-y-4 text-white/80">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                ✓
                            </div>
                            <p>Gerencie tickets de forma eficiente</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                ✓
                            </div>
                            <p>Integração completa com WhatsApp</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                ✓
                            </div>
                            <p>Relatórios detalhados em tempo real</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-dark">
                <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: "100ms" }}>
                    <div className="glass rounded-2xl p-8">
                        {/* Logo Mobile */}
                        <div className="text-center mb-8 lg:hidden">
                            <h1 className="text-3xl font-bold gradient-text">CALLSOFT</h1>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h2>
                        <p className="text-slate-400 mb-8">
                            Entre com suas credenciais para acessar o sistema
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Login */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="admin@callsoft.com"
                                    leftIcon={<Mail className="h-4 w-4" />}
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Senha
                                </label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    leftIcon={<Lock className="h-4 w-4" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-slate-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    }
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end mb-6">
                                <button
                                    type="button"
                                    onClick={() => setIsResetOpen(true)}
                                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                                disabled={isLoading}
                            >
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Reset Password Dialog */}
            <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Redefinir Senha</DialogTitle>
                    </DialogHeader>
                    <p className="text-slate-400 mb-4 text-sm">
                        Digite seu email para receber o link de redefinição.
                    </p>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <Input 
                                type="email" 
                                placeholder="seu@email.com" 
                                value={resetEmail} 
                                onChange={e => setResetEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsResetOpen(false)}>Cancelar</Button>
                            <Button type="submit" variant="gradient" isLoading={isResetLoading}>Enviar</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
