import serviceLpg from "@/assets/service-lpg.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceLash from "@/assets/service-lash.jpg";
import serviceIpl from "@/assets/service-ipl.jpg";

const services = [
  {
    title: "LPG Treatments",
    description: "Advanced body contouring technology for smoother, firmer skin and reduced cellulite appearance.",
    image: serviceLpg,
  },
  {
    title: "Facials",
    description: "Luxurious facial treatments customized to your skin type for a radiant, youthful complexion.",
    image: serviceFacial,
  },
  {
    title: "Lash Extensions",
    description: "Premium lash extensions for fuller, longer lashes that enhance your natural beauty.",
    image: serviceLash,
  },
  {
    title: "IPL Treatments",
    description: "Gentle yet effective IPL technology for hair removal and skin rejuvenation.",
    image: serviceIpl,
  },
];

const Services = () => {
  return (
    <section id="services" className="pt-24 pb-12 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="luxury-subheading text-muted-foreground mb-4">What We Offer</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light">Our Services</h2>
          <div className="luxury-divider" />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="group bg-card hover-lift overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="https://wa.me/6589589156" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground luxury-subheading hover:bg-charcoal/90 transition-all hover-lift"
          >
            Book Your Treatment
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
