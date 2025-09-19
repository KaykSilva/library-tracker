"use client";

import React, { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Menu, Home, Settings, Users, Bell, SquareX, BookOpen, RefreshCw, Search } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

export default function NextLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const navItems = [
    { label: "Início", icon: <Home size={16} />, href: "/" },
    { label: "Livros", icon: <BookOpen size={16} />, href: "/livros" },
    { label: "Empréstimos", icon: <RefreshCw size={16} />, href: "/emprestimos" },
    { label: "Buscar", icon: <Search size={16} />, href: "/buscar-livro" },
    { label: "Usuários", icon: <Users size={16} />, href: "/usuarios" },
    { label: "Configurações", icon: <Settings size={16} />, href: "/settings" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Desktop - FIXO */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r shadow-sm transition-all duration-200 ease-in-out overflow-hidden fixed h-full ${collapsed ? "w-16" : "w-64"
          }`}
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">LT</div>
            {!collapsed && <span className="font-semibold text-stone-400">Library Tracker</span>}
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors text-slate-700 ${collapsed ? "justify-center" : ""
                    }`}
                >
                  {item.icon}
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <Avatar>
                <span className="bg-slate-300 rounded-full h-8 w-8 flex items-center justify-center">K</span>
              </Avatar>
              {!collapsed && (
                <div className="flex-1">
                  <div className="text-sm font-medium">Kayk Silva</div>
                  <div className="text-xs text-slate-500">Admin</div>
                </div>
              )}
              <Button variant="ghost" size="sm" className="ml-auto">
                <LogOut size={16} />
              </Button>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Mobile Sheet for small screens */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger className="md:hidden p-2 m-2 absolute left-0 top-0 z-30">
          <Menu size={20} color="black" className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>


          <div className="absolute right-2 top-2 z-40">
            <SheetClose asChild>
              <Button variant="ghost" size="lg" className="h-8 w-8 p-0">
                <SquareX size={16} />
                <span className="sr-only">Fechar menu</span>
              </Button>
            </SheetClose>
          </div>

          <div className="h-full flex flex-col">
            <div className="px-4 py-4 border-b flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">ç
                <img src="https://i.pinimg.com/736x/2c/8b/20/2c8b20d42f081aeff20db75b2da72113.jpg" alt="coveira" className="radius" />
              </div>
              <div className="font-semibold text-gray-800">Libraty Tracker</div>
            </div>
            <nav className="p-4 flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700"
                      onClick={() => setSheetOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t">
              <Card>
                <CardContent className="flex items-center gap-3 p-3">
                  <Avatar>
                    <span className="bg-slate-300 rounded-full h-8 w-8 flex items-center justify-center">K</span>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Kayk Silva</div>
                    <div className="text-xs text-slate-500">Admin</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <LogOut size={16} />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area - COM MARGEM PARA A SIDEBAR */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${collapsed ? "md:ml-16" : "md:ml-64"
        }`}>
          
        {/* Topbar */}
        <header className="flex items-center gap-2 px-4 py-3 bg-white border-b sticky top-0 z-20 h-18">
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setCollapsed((s) => !s)} className="cursor-pointer">
              <Menu size={16} color="black" />
            </Button>
          </div>

          <div className="flex items-center gap-2 justify-end flex-1">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell size={16} color="black" />
              <span className="sr-only text-gray-600">Notificações</span>
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right mr-2 hidden lg:block">
                <div className="text-sm font-medium text-zinc-800">Kayk Silva</div>
                <div className="text-xs text-slate-500">Admin</div>
              </div>
              <Avatar className="h-9 w-9">
                <span className="bg-slate-300 rounded-full h-9 w-9 flex items-center justify-center">K</span>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page container - ÁREA ROLÁVEL */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-4 md:p-6  mx-auto w-full">
            {children}
          </div>
        </main>

        <footer className="text-center py-4 text-sm text-slate-500 bg-white border-t">
          © {new Date().getFullYear()} Library Tracker. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}