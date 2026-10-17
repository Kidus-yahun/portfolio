const base = import.meta.env?.BASE_URL || './';

export const siteConfig = {
  name: "Kidus Yahunsew",
  alias: "K_D",
  wordmark: "KIDUS", // Fired into place by the Ballista launcher (pivot is 'I')
  role: {
    bold: "Creative Developer",
    light: "& Cyber Builder"
  },
  available: true,
  status: "Available for Creative & Full-Stack projects",
  philosophy: "Design with imagination, code with precision, build with security.",
  bio: [
    "I am a creative developer who crafts visually engaging, interactive digital experiences and resilient full-stack systems.",
    "While I actively learn and ship projects in cybersecurity and AI defense, I'm not just a cyber guy—I'm fundamentally a creative developer who fuses visual craft, interactive code, and a deep security mindset."
  ],
  email: "yahunsewkidus@gmail.com",
  location: "Ethiopia 🇪🇹 · Open to Worldwide Remote",
  socials: [
    { label: "GitHub", href: "https://github.com/Kidus-yahun" },
    { label: "Telegram", href: "https://t.me/gromata" },
    { label: "Instagram", href: "https://www.instagram.com/kidus_ya3/" },
    { label: "Email", href: "mailto:yahunsewkidus@gmail.com" }
  ],
  services: [
    {
      id: "01",
      title: "Creative Development & Interactive UI",
      description: "Fluid web experiences, WebGL canvases, micro-interactions, and creative frontend interfaces that turn complex technology into intuitive, memorable interactions.",
      tags: ["Creative Dev", "WebGL / Canvas", "React 19", "GSAP & Motion", "Tailwind CSS", "UI/UX"]
    },
    {
      id: "02",
      title: "Cybersecurity Labs & AI Threat Defense",
      description: "Continuous learning and real-world security engineering: developing real-time AI phishing detection engines, Manifest V3 extensions, threat heuristics, and vulnerability research.",
      tags: ["Threat Forensics", "MV3 Extensions", "NLP / AI Defense", "Typosquatting Heuristics", "Kali Linux", "Bash"]
    },
    {
      id: "03",
      title: "Full-Stack Web & Backend Engineering",
      description: "High-throughput backend architectures, RESTful APIs, and scalable databases built with Python, Django, TypeScript, MongoDB, and MySQL.",
      tags: ["Python", "Django", "TypeScript", "Node.js", "MySQL", "MongoDB"]
    },
    {
      id: "04",
      title: "Cross-Platform Mobile & Civic Platforms",
      description: "Native-fidelity Flutter apps and real-world impact software—from automated transit logistics and route planning to nationwide Grade 12 educational assessment platforms.",
      tags: ["Flutter", "Dart", "Civic Tech", "EdTech", "GIS Routing", "System Design"]
    }
  ],
  projects: [
    {
      id: "01",
      title: "Anti-Phish Defense Engine",
      category: "Cybersecurity Lab · AI / NLP · MV3",
      year: "2026",
      image: `${base}projects/ecommerce.jpg`,
      description: "Real-time browser extension that neutralizes phishing vectors using NLP, domain homoglyph checking, and live email forensics.",
      link: "https://github.com/Kidus-yahun/anti_phishing_extension"
    },
    {
      id: "02",
      title: "Ethio-Matrix",
      category: "EdTech & Full-Stack · Python & Django",
      year: "2026",
      image: `${base}projects/expense.jpg`,
      description: "National Grade 12 educational assessment platform designed to deliver rapid test generation, analytics, and study aids.",
      link: "https://github.com/Kidus-yahun/Ethio-matrix"
    },
    {
      id: "03",
      title: "SmartBus Transit Logistics",
      category: "GIS & Civic Tech · Python",
      year: "2025",
      image: `${base}projects/habitflow.jpg`,
      description: "Map-based urban transit network facilitating real-time commuter station routing and schedule forecasting.",
      link: "https://github.com/Kidus-yahun/Smart-Bus-Booking"
    },
    {
      id: "04",
      title: "Anser AI Multimodal Solver",
      category: "AI Reasoning · Sub-400ms Engine",
      year: "2025",
      image: `${base}projects/mindpixel.jpg`,
      description: "High-speed multimodal AI reasoning extension with token extraction, non-blocking parallel consensus, and watchdog latency caps.",
      link: "https://github.com/Kidus-yahun/anser-extension"
    }
  ]
};
