"use client";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";
import { api } from "../../../lib/api";
import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Smartphone, MapPin, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

// Mock interface for connection events
interface ConnectionEvent {
  id: string;
  device: string;
  location: string;
  timestamp: string;
  status: "connected" | "disconnected";
}

export default function WhatsAppContatosPage() {
  const [qrText, setQrText] = useState<string>("");
  const [qrLoaded, setQrLoaded] = useState<boolean>(false);
  const [connectionHistory, setConnectionHistory] = useState<ConnectionEvent[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/api/v1/whatsapp/qr");
        const t = r.data?.qr ?? r.data?.qrCode ?? r.data;
        if (typeof t === "string" && t.length > 0) {
          setQrText(t);
          setQrLoaded(true);
        }
      } catch {
        setQrLoaded(false);
      }

      // Mock data for history - in a real app this would come from an API
      setConnectionHistory([
        {
          id: "1",
          device: "iPhone 13",
          location: "São Paulo, SP",
          timestamp: new Date().toISOString(),
          status: "connected"
        },
        {
          id: "2",
          device: "Chrome / Windows",
          location: "São Paulo, SP",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: "disconnected"
        }
      ]);
    })();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Code Section */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-400" />
              Conexão WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center sm:flex-row gap-8">
              <div className="relative group">
                <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg shadow-green-500/10 transition-transform group-hover:scale-105">
                  {qrText ? (
                    <img
                      alt="QR Code WhatsApp"
                      className="w-full h-full object-contain"
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                      <span className="text-sm">Carregando QR...</span>
                    </div>
                  )}
                </div>
                {qrText && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-lg">
                    Pronto para escanear
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <h3 className="text-lg font-medium text-slate-200 mb-1">Conecte seu dispositivo</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Abra o WhatsApp no seu celular, vá em <span className="text-white font-medium">Configurações {'>'} Aparelhos conectados</span> e escaneie o código ao lado.
                  </p>
                </div>
                
                {!qrLoaded && (
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-2">
                    <p className="text-slate-400 text-xs">
                      Caso o QR Code não carregue automaticamente:
                    </p>
                    <Input
                      placeholder="Cole o código do QR aqui"
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      className="h-8 text-xs bg-slate-900/50"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status / Instructions Card could go here or just keep full width history below */}
        <Card variant="glass" className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    Status da Conexão
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <div>
                        <p className="text-green-400 font-medium">Serviço Ativo</p>
                        <p className="text-green-400/70 text-sm">O gateway do WhatsApp está operando normalmente.</p>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-300">Dicas de conexão:</p>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                            Mantenha o celular conectado à internet
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                            Não feche o WhatsApp no celular durante o pareamento
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                            Recarregue a página se o QR Code expirar
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Connection History */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Histórico de Conexões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {connectionHistory.map((event, index) => (
              <div 
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        event.status === 'connected' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                        {event.status === 'connected' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-slate-200 font-medium">{event.device}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(event.timestamp)}
                    </div>
                    <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full border ${
                        event.status === 'connected' 
                        ? 'border-green-500/20 text-green-400 bg-green-500/5' 
                        : 'border-red-500/20 text-red-400 bg-red-500/5'
                    }`}>
                        {event.status === 'connected' ? 'Conectado' : 'Desconectado'}
                    </span>
                </div>
              </div>
            ))}
            
            {connectionHistory.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    Nenhum registro de conexão encontrado.
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
