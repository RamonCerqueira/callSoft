"use client";
import { Search, Bell, User } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { useNotificationStore } from "../../store/notificationStore";
import { NotificationDropdown } from "./NotificationDropdown";
import { ToastContainer } from "../ui/ToastContainer";
import { useState } from "react";
import { UserDropdown } from "./UserDropdown";

export function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { unreadCount } = useNotificationStore();

   const [isDropdownOpenUser, setIsDropdownOpenUser] = useState(false);
    

    return (
        <header className="fixed left-64 right-0 top-0 z-30 h-16 glass border-b border-white/10">
            <div className="flex h-full items-center justify-between px-6">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <Input
                        type="search"
                        placeholder="Buscar tickets, clientes, pedidos..."
                        leftIcon={<Search className="h-4 w-4" />}
                        className="w-full"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 relative">
                    {/* Notifications */}
                    <Button 
                        variant="ghost-glass" 
                        size="icon" 
                        className="relative"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                        )}
                    </Button>

                    <NotificationDropdown 
                        isOpen={isDropdownOpen} 
                        onClose={() => setIsDropdownOpen(false)} 
                    />

                    {/* User Menu */}
                    <div className="relative">
                        <Button 
                            variant="ghost-glass" 
                            size="icon"
                            onClick={() => setIsDropdownOpenUser(!isDropdownOpenUser)}
                        >
                            <User className="h-5 w-5" />
                        </Button>
                        
                        <UserDropdown 
                            isOpen={isDropdownOpenUser} 
                            onClose={() => setIsDropdownOpenUser(false)} 
                        />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </header>
    );
}
