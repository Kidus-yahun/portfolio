const base = import.meta.env?.BASE_URL || './';

export const siteConfig = {
  name: "Kidus Yahunsew",
  alias: "K_D",
  wordmark: "KIDUS", // Fired into place by the Ballista launcher (pivot is 'I')
  role: {
    bold: "Cybersecurity & Full-Stack",
    light: "Developer"
  },
  available: true,
  status: "Available for Security & Full-Stack builds",
  philosophy: "Spot the gaps, engineer the defense, build for impact.",
  bio: [
    "I engineer AI defense systems, cybersecurity solutions, and resilient full-stack applications with an ethical-first mindset.",
    "Specialized in AI phishing detection engines, Python/Django architectures, cross-platform Flutter apps, and civic tech."
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
      title: "Cybersecurity & AI Phishing Defense",
      description: "Real-time threat heuristics, typosquatting algorithms, email forensics, and Manifest V3 security extensions powered by NLP and threat intelligence.",
      tags: ["Threat Forensics", "MV3", "NLP / AI", "Typosquatting", "Kali Linux", "Bash"]
    },
    {
      id: "02",
      title: "Full-Stack Web & Backend Engineering",
      description: "High-throughput backend architectures, RESTful APIs, and scalable databases built with Python, Django, TypeScript, MongoDB, and MySQL.",
      tags: ["Python", "Django", "TypeScript", "Node.js", "MySQL", "MongoDB"]
    },
    {
      id: "03",
      title: "Cross-Platform Mobile Apps (Flutter)",
      description: "Native-fidelity iOS & Android applications with offline-first synchronization, map integrations, and seamless user experiences.",
      tags: ["Flutter", "Dart", "State Management", "REST APIs", "Map SDKs"]
    },
    {
      id: "04",
      title: "Civic Tech & Educational Platforms",
      description: "Building software that creates real-world social impact—from automated transit logistics and route planning to nationwide exam preparation systems.",
      tags: ["Civic Tech", "EdTech", "GIS Routing", "System Design"]
    }
  ],
  projects: [
    {
      id: "01",
      title: "Anti-Phish Defense Engine",
      category: "Cybersecurity · AI / NLP · MV3",
      year: "2026",
      image: `${base}projects/ecommerce.jpg`,
      description: "Real-time browser extension that neutralizes phishing vectors using NLP, domain homoglyph checking, and live email forensics.",
      link: "https://github.com/Kidus-yahun/anti_phishing_extension"
    },
    {
      id: "02",
      title: "Ethio-Matrix",
      category: "EdTech · Python & Django",
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
  ],
  play: {
    headline: ["Break it", "if you can."],
    caption: "Spot the gaps, engineer the defense. Interactive physics headline."
  }
};
