import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Services() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/services`)
      .then(res => res.json())
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-4xl" id="services">
      <div className="container max-w-[1200px] mx-auto px-lg">
        <div className="text-center mb-3xl reveal active">
          <h2 className="font-headline-lg text-headline-lg mb-md">Specialized Services</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Leveraging a multi-disciplinary approach to deliver digital solutions that resonate and perform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
          {services.map((service, i) => (
            <div key={service.id} className="glass-card p-xl rounded-xl reveal active flex flex-col items-start" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-lg">
                <span className="material-symbols-outlined">{service.icon}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-md">{service.title}</h3>
              <p className="text-on-surface-variant text-sm mb-xl flex-grow">{service.description}</p>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full text-center py-12 text-on-surface-variant">
              Loading services...
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
