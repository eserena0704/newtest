import { MapPin, Clock, Instagram, Heart } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-background text-foreground">
      <div className="container mx-auto px-6">
        {/* Find Us header - matching screenshot layout */}
        <div className="text-center mb-12">
          <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-rose-gold mb-3">
            Find Us
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-5">
            Visit Our{" "}
            <span className="text-rose-gold">Studio</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans text-base">
            We're conveniently located in the heart of Singapore. Drop by for a consultation or reach out to us anytime.
          </p>
        </div>

        {/* Two-column: Map (left) | Contact card (right) */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-0 lg:gap-0 rounded-2xl overflow-hidden shadow-lg max-w-6xl mx-auto mb-16">
          {/* Left: Google Map (greyscale) */}
          <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:min-h-[420px] rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none overflow-hidden grayscale">
            <iframe
              title="Beauskin Studio - Singapore Shopping Centre"
              src="https://www.google.com/maps?q=190+Clemenceau+Avenue+Singapore+Shopping+Centre&output=embed"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Right: Contact info card */}
          <div className="bg-card text-card-foreground rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none p-8 lg:p-10 flex flex-col justify-center shadow-sm">
            {/* Our Location */}
            <div className="flex gap-4 mb-6">
              <div className="shrink-0 w-11 h-11 rounded-full bg-rose-gold/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-charcoal" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-2">Our Location</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  190 Clemenceau Avenue<br />
                  Singapore Shopping Centre<br />
                  #03-21, Singapore 239924
                </p>
              </div>
            </div>

            <div className="border-t border-border my-6" />

            {/* Opening Hours */}
            <div className="flex gap-4 mb-6">
              <div className="shrink-0 w-11 h-11 rounded-full bg-rose-gold/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-charcoal" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-2">Opening Hours</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Monday – Sunday<br />
                  10:00 AM – 8:00 PM
                </p>
              </div>
            </div>

            <div className="border-t border-border my-6" />

            {/* Get in Touch */}
            <div>
              <h3 className="font-serif text-xl font-light text-foreground mb-4">Get in Touch</h3>
              <a
                href="https://wa.me/6589589156"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl bg-[#25D366] text-white font-sans font-medium text-sm hover:opacity-90 transition-opacity mb-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
              <a
                href="https://www.instagram.com/beauskin.sg/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl border-2 border-rose-gold text-rose-gold font-sans font-medium text-sm hover:bg-rose-gold/10 transition-colors mb-4"
              >
                <Instagram className="w-5 h-5" />
                Follow on Instagram
              </a>
              <p className="text-sm text-muted-foreground font-sans flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-gold fill-rose-gold" />
                DM us for any enquiries!
              </p>
            </div>
          </div>
        </div>

        {/* Open in Google Maps link */}
        <p className="text-center text-sm text-muted-foreground mb-12">
          <a
            href="https://www.google.com/maps/search/?api=1&query=190+Clemenceau+Avenue+Singapore+Shopping+Centre"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-gold hover:underline transition-colors"
          >
            View larger map
          </a>
        </p>

        {/* CTA */}
        <div className="text-center">
          <p className="luxury-subheading text-muted-foreground mb-6">Ready to book your appointment?</p>
          <a
            href="https://wa.me/6589589156"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-charcoal text-cream luxury-subheading hover:bg-rose-gold hover:text-charcoal transition-all hover-lift text-base rounded-sm"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Us Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
