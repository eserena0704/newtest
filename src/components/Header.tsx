import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Instagram, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { to: "/", label: "Home", isRoute: true },
  { to: "/#services", label: "Services", isRoute: false },
  { to: "/store", label: "Store", isRoute: true },
  { to: "/#about", label: "About", isRoute: false },
  { to: "/#contact", label: "Location", isRoute: false },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-12 md:h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Beauskin" className="h-20 md:h-24 object-contain -my-6" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link to="/" className="luxury-subheading text-foreground/70 hover:text-foreground transition-colors">
            Home
          </Link>
          <a href="/#services" className="luxury-subheading text-foreground/70 hover:text-foreground transition-colors">
            Services
          </a>
          <Link to="/store" className="luxury-subheading text-foreground/70 hover:text-foreground transition-colors">
            Store
          </Link>
          <a href="/#about" className="luxury-subheading text-foreground/70 hover:text-foreground transition-colors">
            About
          </a>
          <a href="/#contact" className="luxury-subheading text-foreground/70 hover:text-foreground transition-colors">
            Location
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {/* Mobile hamburger menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="md:hidden p-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw-2rem,320px)]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 pt-6">
                {navLinks.map(({ to, label, isRoute }) =>
                  isRoute ? (
                    <Link
                      key={label}
                      to={to}
                      className="luxury-subheading py-3 px-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      key={label}
                      href={to}
                      className="luxury-subheading py-3 px-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </a>
                  )
                )}
                <a
                  href="https://wa.me/6589589156"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground luxury-subheading hover:bg-charcoal/90 transition-colors rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Now
                </a>
              </nav>
            </SheetContent>
          </Sheet>

          <a
            href="https://www.instagram.com/beauskin.sg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://wa.me/6589589156"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground luxury-subheading hover:bg-charcoal/90 transition-colors"
          >
            Book Now
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
