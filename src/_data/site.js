const url = "https://ravensorbit.com";
const email = "hello@ravensorbit.com";
export default {
  url, email,
  year: new Date().getFullYear(),
  categories: ["Performance", "Search & AI", "Conversion", "Lifecycle", "Brand & Strategy"],
  social: [],
  schema: {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfessionalService", "@id": url + "/#organization",
        name: "RavensOrbit Digital", alternateName: "RODA", url,
        logo: url + "/assets/img/logo-color.png", image: url + "/assets/img/og-image.png",
        description: "Marketing agency in Nigeria connecting paid media, SEO and AI visibility, conversion and customer retention into one growth plan.",
        email, address: { "@type": "PostalAddress", addressLocality: "Lagos", addressRegion: "Lagos", addressCountry: "NG" },
        areaServed: [{ "@type": "Country", name: "Nigeria" }, { "@type": "Place", name: "Africa" }],
        knowsAbout: ["Performance marketing", "Paid media", "Search engine optimisation", "Generative engine optimisation", "Conversion rate optimisation", "Lifecycle marketing", "CRM"],
        founder: [{ "@type": "Person", name: "Okugboye Olayinka D.", jobTitle: "Growth & Strategy Lead" }, { "@type": "Person", name: "Roqeebat Alao", jobTitle: "Performance Marketing Consultant" }] },
      { "@type": "WebSite", "@id": url + "/#website", url, name: "RavensOrbit Digital", publisher: { "@id": url + "/#organization" } }
    ]
  }
};
