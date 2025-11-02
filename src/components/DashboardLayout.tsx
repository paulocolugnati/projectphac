import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Shield, 
  Lock, 
  Key, 
  Activity, 
  History, 
  User,
  LogOut,
  CreditCard,
  LayoutDashboard
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair");
    } else {
      toast.success("Logout realizado com sucesso");
      navigate("/");
    }
  };

  const menuSections = [
    {
      title: "PRINCIPAL",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" }
      ]
    },
    {
      title: "SERVIÇOS DE PROTEÇÃO",
      items: [
        { icon: Lock, label: "Criptografia", path: "/dashboard/encrypt" },
        { icon: Key, label: "Gerenciamento de Keys", path: "/dashboard/keys" },
        { icon: Activity, label: "Análise de Vulnerabilidade", path: "/dashboard/analysis" }
      ]
    },
    {
      title: "LOGS E SUPORTE",
      items: [
        { icon: History, label: "Histórico", path: "/dashboard/history" }
      ]
    },
    {
      title: "CONFIGURAÇÕES",
      items: [
        { icon: User, label: "Perfil", path: "/dashboard/profile" },
        { icon: CreditCard, label: "Planos", path: "/dashboard/plans" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Minimalista */}
      <aside className="w-64 border-r border-border flex flex-col" style={{ background: 'hsl(var(--sidebar-background))' }}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Shield className="h-5 w-5 text-primary" />
            <span>
              <span className="text-primary">Phac</span>
              <span className="text-foreground">Protect</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider px-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.label} to={item.path}>
                      <button
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth
                          ${isActive 
                            ? 'bg-sidebar-accent text-primary' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50'
                          }
                        `}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer com Plano e Créditos */}
        {profile && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="glass-strong rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground tracking-wider">
                  PLANO ATUAL
                </span>
                <span className="text-xs font-bold text-accent uppercase">
                  {profile.plan === 'trial' ? 'INICIAL' : profile.plan === 'basic' ? 'BÁSICO' : 'INFINITE'}
                </span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Créditos Restantes</span>
                <span className="text-base font-bold text-accent">
                  {profile.plan === 'infinite' ? '∞' : profile.credits}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Fixo */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 glass-strong sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow"></div>
            <span className="text-sm font-medium text-muted-foreground">Sistema Operacional</span>
          </div>
          
          <div className="flex items-center gap-4">
            {profile && (
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{profile.name}</p>
                <p className="text-xs text-muted-foreground">{profile.company_name}</p>
              </div>
            )}
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
