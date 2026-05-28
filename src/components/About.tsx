import logo from "@/assets/logo.png";

const About = () => {
  const stats = [
    { value: "10+", label: "Years Experience", icon: "✦" },
    { value: "5000+", label: "Happy Clients", icon: "♥" },
    { value: "4.9", label: "Star Rating", icon: "★" },
  ];

  return (
    <section id="about" className="relative py-28 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blush/30 via-background to-background" aria-hidden />
      <div
        className="absolute top-0 right-0 w-[min(80vw,600px)] h-[min(80vw,600px)] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--rose-gold)) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 w-[min(60vw,400px)] h-[min(60vw,400px)] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--rose-gold)) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="relative">
            {/* Ornamental line above subheading */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className="h-px w-12 flex-shrink-0"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--rose-gold)))" }}
              />
              <p className="luxury-subheading text-muted-foreground tracking-[0.2em]">About Us</p>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] font-light mb-6 leading-[1.15]">
              <span className="block">Where Beauty</span>
              <span className="italic text-rose-gold block mt-1">Meets Excellence</span>
            </h2>
            <div className="luxury-divider !ml-0 mb-8" />

            <div className="space-y-6 mb-10">
              <p className="text-muted-foreground leading-[1.8] text-[15px]">
                At BEAUSKIN, we believe that every woman deserves to feel confident and beautiful.
                Our team of experienced beauty professionals is dedicated to providing personalized
                treatments that enhance your natural radiance.
              </p>
              <p className="text-muted-foreground leading-[1.8] text-[15px]">
                Located in the heart of Singapore at the Singapore Shopping Centre, we offer a
                serene escape where you can indulge in premium beauty treatments. From advanced
                LPG body contouring to luxurious facials, every service is designed with your
                unique beauty needs in mind.
              </p>
            </div>

            {/* Stats as refined cards */}
            <div className="flex flex-wrap gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group flex flex-col min-w-[100px]"
                >
                  <span className="font-serif text-2xl text-rose-gold/80 group-hover:text-rose-gold transition-colors mb-0.5">
                    {stat.icon}
                  </span>
                  <p className="font-serif text-3xl md:text-4xl text-rose-gold tabular-nums">
                    {stat.value}
                  </p>
                  <p className="luxury-subheading text-muted-foreground mt-1 text-[11px] tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image block with layered frame */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Outer decorative frame */}
              <div
                className="absolute -inset-4 border border-rose-gold/20 rounded-sm"
                aria-hidden
              />
              <div
                className="absolute -inset-8 border border-rose-gold/10 rounded-sm"
                aria-hidden
              />
              {/* Main content box */}
              <div className="relative aspect-square bg-gradient-to-br from-blush to-blush/80 flex items-center justify-center p-12 sm:p-16 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)]">
                <img
                  src={logo}
                  alt="Beauskin Logo"
                  className="w-full max-w-md object-contain relative z-10"
                />
              </div>
              {/* Corner accents */}
              <div
                className="absolute -bottom-5 -left-5 w-20 h-20 border-l-2 border-b-2 border-rose-gold/60"
                aria-hidden
              />
              <div
                className="absolute -top-5 -right-5 w-20 h-20 border-r-2 border-t-2 border-rose-gold/60"
                aria-hidden
              />
            </div>
            {/* Small decorative quote/trust line */}
            <p className="mt-8 text-center font-serif text-sm italic text-muted-foreground/90 max-w-xs mx-auto">
              Crafting confidence, one treatment at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
