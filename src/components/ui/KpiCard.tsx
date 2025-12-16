"use client";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./Card";
import { cn } from "../../lib/utils";

interface KpiCardProps {
    title: string;
    value: number | string;
    description?: string;
    icon?: React.ReactNode;
    variant?: "glass" | "glass-blue" | "glass-purple" | "glass-cyan" | "glass-pink" | "glass-orange";
}

const iconGradients = {
    glass: "bg-white/10",
    "glass-blue": "bg-blue-500/20 text-blue-400",
    "glass-purple": "bg-purple-500/20 text-purple-400",
    "glass-cyan": "bg-cyan-500/20 text-cyan-400",
    "glass-pink": "bg-pink-500/20 text-pink-400",
    "glass-orange": "bg-orange-500/20 text-orange-400",
};

export function KpiCard({
    title,
    value,
    description,
    icon,
    variant = "glass-orange",
}: KpiCardProps) {
    return (
        <Card variant={variant} hoverable className="flex flex-col h-full overflow-hidden border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                    {title}
                </CardTitle>
                {icon && (
                    <div
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur-md",
                            iconGradients[variant]
                        )}
                    >
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-white mt-4">{value}</div>
            </CardContent>
            {description && (
                <CardFooter className="pt-0 mt-auto">
                    <p className="text-xs font-medium text-slate-500">{description}</p>
                </CardFooter>
            )}
        </Card>
    );
}

// Componente específico para "Chamados em Aberto"
interface OpenTicketsKpiProps {
    count: number;
}

export function OpenTicketsKpi({ count = 57 }: OpenTicketsKpiProps) {
    return (
        <KpiCard
            title="Chamados em Aberto"
            value={count}
            description="Aguardando atendimento"
            icon={<AlertCircle className="h-5 w-5" />}
            variant="glass-orange"
        />
    );
}
