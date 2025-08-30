import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/kocs", label: "Danh sách KOC" },
    { path: "/brands", label: "Danh sách Brand" },
    { path: "/register", label: "Đăng ký" },
  ];

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            KOC Connect
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button variant="outline" size="sm" className="md:hidden">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;