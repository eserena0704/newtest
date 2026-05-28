import { Link } from "react-router-dom";
import { Instagram, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Left: Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Beauskin" className="h-36 md:h-44 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-xs">
              Your premier destination for luxury beauty treatments in Singapore. Experience the art of skincare with us.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/beauskin.sg/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/6589589156"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Middle: Quick links */}
          <div>
            <h3 className="luxury-subheading text-primary-foreground font-medium mb-4">
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#services" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Services
                </a>
              </li>
              <li>
                <Link to="/store" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Store
                </Link>
              </li>
              <li>
                <a href="/#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Right: Visit us */}
          <div>
            <h3 className="luxury-subheading text-primary-foreground font-medium mb-4">
              VISIT US
            </h3>
            <a
              href="https://www.google.com/maps/search/?api=1&query=190+Clemenceau+Avenue+Singapore+Shopping+Centre"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm leading-relaxed"
            >
              <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
              <span>
                190 Clemenceau Avenue<br />
                Singapore Shopping Centre<br />
                #03-21, Singapore 239924
              </span>
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} BEAUSKIN. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
