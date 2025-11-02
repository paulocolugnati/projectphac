import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] glass-strong border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold hover:scale-105 transition-smooth">
            <span className="text-accent">Phac</span>Protect
          </Link>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-white text-sm">
                Cadastro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
