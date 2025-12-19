"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/Switch";
import { useNotificationStore, NotificationCategory } from "@/store/notificationStore";
import { Bell, Shield, Users, Server, DollarSign, MessageSquare } from "lucide-react";
import WhatsAppContatosPage from "../whatsapp/contatos/page";

export default function SettingsPage() {
  const { preferences, togglePreference } = useNotificationStore();

  const notificationSettings = [
    {
      id: 'users',
      title: 'Gerenciamento de Usuários',
      description: 'Receba alertas sobre criação, edição e exclusão de usuários.',
      icon: Users,
    },
    {
      id: 'system',
      title: 'Sistema e Manutenção',
      description: 'Avisos sobre status do sistema, atualizações e manutenções.',
      icon: Server,
    },
    {
      id: 'security',
      title: 'Segurança',
      description: 'Alertas de login, tentativas de acesso e alterações de senha.',
      icon: Shield,
    },
    {
      id: 'financial',
      title: 'Financeiro',
      description: 'Notificações sobre faturas, pagamentos e relatórios.',
      icon: DollarSign,
    },
    {
      id: 'tickets',
      title: 'Tickets e Suporte',
      description: 'Atualizações sobre chamados e interações de suporte.',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-navy-deep">
      <Sidebar />
      <Header />

      <main className="ml-64 mt-16 p-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Configurações</h1>
          <p className="text-slate-400 mt-2">Gerencie as preferências do sistema</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="bg-slate-800/50 p-1 border border-slate-700/50">
            <TabsTrigger 
              value="general"
              className="px-6 py-2 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100"
            >
              Geral
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="px-6 py-2 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100"
            >
              Notificações
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="px-6 py-2 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100"
            >
              Segurança
            </TabsTrigger>
            <TabsTrigger 
              value="whatsapp"
              className="px-6 py-2 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100"
            >
              WhatsApp
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-400" />
                  Preferências de Notificação
                </CardTitle>
                <CardDescription>
                  Escolha quais tipos de alertas você deseja receber no sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="divide-y divide-slate-700/50">
                  {notificationSettings.map((setting) => {
                    const Icon = setting.icon;
                    return (
                      <div key={setting.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-slate-700/50 text-slate-300">
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">{setting.title}</p>
                            <p className="text-sm text-slate-400">{setting.description}</p>
                          </div>
                        </div>
                        <Switch 
                          checked={preferences[setting.id as NotificationCategory]}
                          onCheckedChange={() => void togglePreference(setting.id as NotificationCategory)}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center text-slate-400">
                <p>Configurações gerais em desenvolvimento.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center text-slate-400">
                <p>Configurações de segurança em desenvolvimento.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="whatsapp">
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center text-slate-400">
               <WhatsAppContatosPage />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
