import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Terminal,
  X,
  Youtube,
} from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PROFILE = {
  name: "Naveen Kumar",
  email: "nk1910479@gmail.com",
  phone: "+91 8467817027",
  location: "Kanpur, Uttar Pradesh, India",
  college: "Apollo Institute of Technology (AIT), Kanpur",
  degree: "B.Tech — Computer Science & Engineering",
  graduation: "September 2026",
  cgpa: "7.2 / 10.0",
  rank: "Top 5%",
  availability: "Open to full-time and internship opportunities",
};

const ROLES = [
  "Full Stack Developer",
  "MERN Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Java Developer",
];

const SKILLS = {
  Frontend: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript (ES6+)",
    "Tailwind CSS",
    "Three.js",
    "Framer Motion",
    "HTML5 / CSS3",
    "Bootstrap",
  ],
  Backend: ["Node.js", "Express.js", "REST APIs", "WebSocket / Socket.io", "Spring Boot"],
  Database: ["MongoDB", "MySQL", "SQL"],
  "Tools & Languages": [
    "Git / GitHub",
    "Firebase",
    "Java",
    "Python",
    "Postman",
    "Vercel",
    "Netlify",
    "MongoDB Atlas",
  ],
};

const PROJECTS = [
  {
    title: "Streamify",
    type: "Major project",
    subtitle: "Video & chat calling platform",
    description:
      "A full-stack real-time communication platform with peer-to-peer video, secure authentication, profiles, and call history.",
    stack: ["React", "Node.js", "WebRTC", "Socket.io", "MongoDB", "JWT"],
    color: "cyan",
    icon: "SF",
    year: "2026",
    github: "https://github.com/naveenkashyap2/streamify-video-call",
    demo: "https://neon-chat-3.onrender.com/",
  },
  {
    title: "Resumify AI",
    type: "AI product",
    subtitle: "ATS-ready résumé builder",
    description:
      "An AI-assisted résumé builder with live preview, modern templates, real-time editing, and a polished PDF export workflow.",
    stack: ["React", "Tailwind", "Framer Motion", "JavaScript"],
    color: "violet",
    icon: "RA",
    year: "2026",
    github: "https://github.com/naveenkashyap2/Resume-builder",
    demo: "https://resume-builder-74fb.vercel.app/",
  },
  {
    title: "DashFlow",
    type: "Frontend project",
    subtitle: "Modern admin dashboard",
    description:
      "A responsive analytics dashboard with user management, dark mode, data-rich layouts, and smooth interface motion.",
    stack: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    color: "amber",
    icon: "DF",
    year: "2026",
    github: "https://github.com/naveenkashyap2/user-dash",
    demo: "https://user-dash-orcin.vercel.app/",
  },
  {
    title: "WeatherAI",
    type: "API project",
    subtitle: "Real-time weather tracker",
    description:
      "Live weather, geolocation, location search, conditions, humidity, wind data, and an animated five-day forecast.",
    stack: ["React", "OpenWeather API", "CSS", "JavaScript"],
    color: "cyan",
    icon: "WA",
    year: "2025",
    github: "https://github.com/naveenkashyap2/WeatherAI1",
    demo: "https://weather-ai-uxbg.vercel.app/",
  },
  {
    title: "Nova Todo",
    type: "Productivity app",
    subtitle: "AI-integrated task manager",
    description:
      "A smooth CRUD task manager with priorities, due dates, categories, filters, and persistent local state.",
    stack: ["React", "LocalStorage", "Tailwind", "JavaScript"],
    color: "green",
    icon: "NT",
    year: "2025–26",
    github: "https://github.com/naveenkashyap2/modern-todo",
    demo: "https://novatodo2.netlify.app/",
  },
  {
    title: "Neon Chat",
    type: "Major project",
    subtitle: "Real-time messaging",
    description:
      "Room-based messaging with online presence, typing feedback, message timestamps, and emoji support.",
    stack: ["React", "Socket.io", "Node.js", "Express.js"],
    color: "violet",
    icon: "NC",
    year: "2025–26",
    github: "https://github.com/naveenkashyap2",
    demo: "https://neon-chat-3.onrender.com/",
  },
  {
    title: "AI Code Generator",
    type: "Major project",
    subtitle: "OpenAI-powered developer tool",
    description:
      "Generates, previews, and copies code from natural-language prompts, with API pipelines and stored user history.",
    stack: ["React", "Node.js", "Express", "MongoDB", "OpenAI API"],
    color: "violet",
    icon: "AI",
    year: "2026",
    github: "https://github.com/naveenkashyap2",
  },
  {
    title: "E-Commerce Platform",
    type: "Major project",
    subtitle: "Next.js full-stack store",
    description:
      "An SEO-focused store with product discovery, cart, multi-step checkout, image optimization, and code splitting.",
    stack: ["Next.js", "React", "Tailwind", "Node.js", "MongoDB"],
    color: "amber",
    icon: "EC",
    year: "2025–26",
    github: "https://github.com/naveenkashyap2",
  },
  {
    title: "Mini E-Commerce",
    type: "Frontend project",
    subtitle: "Responsive shopping UI",
    description:
      "Product search, category and price filters, cart management, responsive grids, and a product detail modal.",
    stack: ["React", "Tailwind", "Context API", "JavaScript"],
    color: "green",
    icon: "ME",
    year: "2025",
    github: "https://github.com/naveenkashyap2",
  },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/naveenkashyap2", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/naveen-kashyap08/", icon: Linkedin },
  { label: "LeetCode", href: "https://leetcode.com/naveenkyp854", icon: Code2 },
  { label: "YouTube", href: "https://www.youtube.com/@naveen08vlog", icon: Youtube },
  { label: "Instagram", href: "https://www.instagram.com/naveenkashyap2130", icon: Instagram },
];

const NAV_ITEMS = ["about", "skills", "projects", "experience", "contact"];

function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -60%", threshold: [0, 0.1, 0.35] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

function ParticleCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(70, Math.floor(width / 18)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.2 + 0.35,
        alpha: Math.random() * 0.35 + 0.1,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        if (!reduceMotion) {
          particle.x = (particle.x + particle.vx + width) % width;
          particle.y = (particle.y + particle.vy + height) % height;
        }
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(128, 218, 255, ${particle.alpha})`;
        context.fill();

        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 105) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(86, 180, 220, ${(1 - distance / 105) * 0.06})`;
            context.lineWidth = 0.6;
            context.stroke();
          }
        }
      });
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas className="particle-canvas" ref={ref} aria-hidden="true" />;
}

function PointerEffects() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    let ringX = -100;
    let ringY = -100;
    let mouseX = -100;
    let mouseY = -100;

    const move = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
      gsap.to(glow, { x: mouseX, y: mouseY, duration: 0.55, ease: "power2.out" });
    };
    const tick = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      gsap.set(ring, { x: ringX, y: ringY });
    };
    const over = (event) => {
      if (event.target.closest("a, button, input, .project-card")) {
        document.body.classList.add("pointer-active");
      }
    };
    const out = (event) => {
      if (event.target.closest("a, button, input, .project-card")) {
        document.body.classList.remove("pointer-active");
      }
    };
    const ripple = (event) => {
      const node = document.createElement("span");
      node.className = "pointer-ripple";
      node.style.left = `${event.clientX}px`;
      node.style.top = `${event.clientY}px`;
      document.body.appendChild(node);
      node.addEventListener("animationend", () => node.remove(), { once: true });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", ripple);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", ripple);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      <span ref={glowRef} className="pointer-glow" aria-hidden="true" />
      <span ref={ringRef} className="pointer-ring" aria-hidden="true" />
      <span ref={dotRef} className="pointer-dot" aria-hidden="true" />
    </>
  );
}

function RoleCycler() {
  const [role, setRole] = useState(0);
  const roleRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      gsap.to(roleRef.current, {
        opacity: 0,
        y: -12,
        filter: "blur(5px)",
        duration: 0.25,
        onComplete: () => {
          setRole((current) => (current + 1) % ROLES.length);
          gsap.fromTo(
            roleRef.current,
            { opacity: 0, y: 12, filter: "blur(5px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35 },
          );
        },
      });
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  return <span ref={roleRef}>{ROLES[role]}</span>;
}

function Header({ active, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const navigate = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <button className="brand" onClick={() => navigate("home")} aria-label="Go to home">
        <span className="brand-mark">NK</span>
        <span className="brand-copy">
          <strong>NAVEEN</strong>
          <small>FULL STACK DEV</small>
        </span>
      </button>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            className={active === item ? "active" : ""}
            onClick={() => navigate(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <a className="header-resume" href="/Naveen_Kumar_Resume.pdf" download>
          Résumé <Download size={15} />
        </a>
        <button
          className={`menu-toggle ${open ? "open" : ""}`}
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div className={`mobile-nav ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-nav-index">MENU / 01—05</div>
        {NAV_ITEMS.map((item, index) => (
          <button key={item} onClick={() => navigate(item)}>
            <span>0{index + 1}</span>
            {item}
            <ArrowRight />
          </button>
        ))}
        <div className="mobile-nav-socials">
          {SOCIALS.slice(0, 3).map(({ label, href }) => (
            <a href={href} target="_blank" rel="noreferrer" key={label}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="section-heading reveal">
      <p className="eyebrow"><span />{eyebrow}</p>
      <div className="heading-row">
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
    </div>
  );
}

function Hero({ onNavigate }) {
  return (
    <section className="hero" id="home">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <div className="availability hero-animate">
          <span><i /></span>
          Available for opportunities
        </div>
        <p className="hero-kicker hero-animate">HELLO, I&apos;M</p>
        <h1 className="hero-animate">
          NAVEEN
          <span>KUMAR</span>
        </h1>
        <div className="role-line hero-animate">
          <span className="role-prompt">~/role</span>
          <RoleCycler />
          <i />
        </div>
        <p className="hero-summary hero-animate">
          I build fast, thoughtful digital products—from responsive interfaces to scalable MERN
          applications and AI-powered experiences.
        </p>
        <div className="hero-actions hero-animate">
          <button className="button button-primary" onClick={() => onNavigate("projects")}>
            Explore my work <ArrowRight size={18} />
          </button>
          <button className="button button-ghost" onClick={() => onNavigate("contact")}>
            Let&apos;s talk
          </button>
        </div>
        <div className="hero-meta hero-animate">
          <div><strong>09+</strong><span>Projects shipped</span></div>
          <div><strong>01+</strong><span>Year experience</span></div>
          <div><strong>TOP 5%</strong><span>Class rank</span></div>
        </div>
      </div>

      <div className="hero-visual hero-animate" aria-label="Interactive developer visual">
        <div className="visual-orbit orbit-one"><i /><i /></div>
        <div className="visual-orbit orbit-two"><i /></div>
        <div className="visual-card code-card">
          <div className="window-bar"><span /><span /><span /><em>naveen.js</em></div>
          <pre>
            <code>
              <span className="code-violet">const</span> developer = &#123;{`\n`}
              &nbsp;&nbsp;name: <span className="code-green">&quot;Naveen Kumar&quot;</span>,{`\n`}
              &nbsp;&nbsp;role: <span className="code-green">&quot;Full Stack&quot;</span>,{`\n`}
              &nbsp;&nbsp;stack: [<span className="code-cyan">&quot;React&quot;</span>, <span className="code-cyan">&quot;Node&quot;</span>],{`\n`}
              &nbsp;&nbsp;coffee: <span className="code-amber">true</span>,{`\n`}
              &nbsp;&nbsp;build: () =&gt; <span className="code-green">&quot;impact&quot;</span>{`\n`}
              &#125;;
            </code>
          </pre>
          <div className="code-status"><Check size={13} /> Ready to collaborate</div>
        </div>
        <div className="floating-pill pill-react">REACT</div>
        <div className="floating-pill pill-node">NODE.JS</div>
        <div className="floating-pill pill-mongo">MONGODB</div>
        <div className="visual-index">01 / DEVELOPER</div>
      </div>

      <button className="scroll-cue" onClick={() => onNavigate("about")} aria-label="Scroll to about">
        <span>SCROLL</span><ArrowDown size={17} />
      </button>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about-section">
      <SectionHeading
        eyebrow="About me"
        title={<>Driven by curiosity.<br />Built for impact.</>}
        copy="I enjoy turning complex ideas into clean, useful digital experiences that feel as good as they perform."
      />
      <div className="about-layout">
        <div className="about-portrait reveal">
          <div className="portrait-frame">
            <div className="portrait-noise" />
            <div className="portrait-monogram">NK</div>
            <div className="portrait-ring ring-a" />
            <div className="portrait-ring ring-b" />
            <div className="portrait-label"><span>Based in</span>Kanpur, India</div>
          </div>
          <div className="portrait-stamp"><Sparkles size={17} /> OPEN TO WORK</div>
        </div>

        <div className="about-content reveal">
          <p className="about-lead">
            I&apos;m <strong>Naveen Kumar</strong>, a final-year Computer Science student and Full Stack
            Developer focused on the MERN ecosystem.
          </p>
          <p>
            My work blends thoughtful frontend engineering with practical backend architecture. I&apos;ve
            built real-time communication tools, AI-powered products, dashboards, weather applications,
            and e-commerce experiences—always with responsiveness and usability at the center.
          </p>
          <p>
            During my frontend internship at <strong>CODEXINTERN</strong>, I delivered responsive React
            interfaces, integrated REST APIs, and collaborated in Agile sprints while expanding into
            Node.js, Express, and MongoDB.
          </p>

          <div className="about-facts">
            <div><span>NAME</span><strong>Naveen Kumar</strong></div>
            <div><span>LOCATION</span><strong>Kanpur, Uttar Pradesh</strong></div>
            <div><span>EDUCATION</span><strong>B.Tech CSE · 2026</strong></div>
            <div><span>FOCUS</span><strong>MERN + AI products</strong></div>
          </div>

          <div className="about-links">
            <a className="button button-primary" href="/Naveen_Kumar_Resume.pdf" download>
              Download A4 résumé <Download size={17} />
            </a>
            <a className="text-link" href="https://github.com/naveenkashyap2" target="_blank" rel="noreferrer">
              View GitHub <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const categoryIcons = [Code2, Terminal, DatabaseIcon, BriefcaseBusiness];
  return (
    <section id="skills" className="section skills-section">
      <SectionHeading
        eyebrow="Technical toolkit"
        title="Skills that ship."
        copy="A practical, full-stack toolkit for building, testing, and deploying production-ready web applications."
      />
      <div className="skills-grid">
        {Object.entries(SKILLS).map(([category, skills], index) => {
          const Icon = categoryIcons[index];
          return (
            <article className="skill-card reveal" key={category}>
              <div className="skill-card-head">
                <span><Icon size={20} /></span>
                <em>0{index + 1}</em>
              </div>
              <h3>{category}</h3>
              <div className="skill-list">
                {skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </article>
          );
        })}
      </div>
      <div className="skills-marquee" aria-hidden="true">
        <div>
          {["REACT.JS", "NODE.JS", "MONGODB", "EXPRESS", "TYPESCRIPT", "NEXT.JS", "SOCKET.IO", "JAVA", "REST APIs"].map((item) => (
            <span key={item}>{item}<i>✦</i></span>
          ))}
          {["REACT.JS", "NODE.JS", "MONGODB", "EXPRESS", "TYPESCRIPT", "NEXT.JS", "SOCKET.IO", "JAVA", "REST APIs"].map((item) => (
            <span key={`${item}-copy`}>{item}<i>✦</i></span>
          ))}
        </div>
      </div>
    </section>
  );
}

function DatabaseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
    </svg>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  const handleMove = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const card = cardRef.current;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    gsap.to(card, {
      rotateY: x * 5,
      rotateX: -y * 5,
      transformPerspective: 900,
      duration: 0.3,
      ease: "power2.out",
    });
    card.style.setProperty("--mouse-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--mouse-y", `${event.clientY - bounds.top}px`);
  };

  const reset = () => gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.45 });

  return (
    <article
      className={`project-card project-${project.color} reveal`}
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      <div className="project-glow" />
      <div className="project-topline"><span>0{index + 1}</span><em>{project.year}</em></div>
      <div className="project-symbol">{project.icon}</div>
      <p className="project-type">{project.type}</p>
      <h3>{project.title}</h3>
      <h4>{project.subtitle}</h4>
      <p className="project-description">{project.description}</p>
      <div className="project-stack">
        {project.stack.map((technology) => <span key={technology}>{technology}</span>)}
      </div>
      <div className="project-actions">
        <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub repository`}>
          <Github size={17} /> Code
        </a>
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer" aria-label={`${project.title} live demo`}>
            <ExternalLink size={17} /> Live demo
          </a>
        )}
      </div>
    </article>
  );
}

function Projects() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? PROJECTS : PROJECTS.slice(0, 6);

  return (
    <section id="projects" className="section projects-section">
      <SectionHeading
        eyebrow="Selected work"
        title="Projects with purpose."
        copy="From real-time platforms to AI-enabled tools—each project solves a concrete problem and sharpens a different part of my stack."
      />
      <div className="project-grid">
        {visible.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}
      </div>
      <button className="show-projects" onClick={() => setShowAll((current) => !current)}>
        {showAll ? "Show selected projects" : "View all 9 projects"}
        <ChevronRight size={17} />
      </button>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="section experience-section">
      <SectionHeading
        eyebrow="Experience & education"
        title="The journey so far."
        copy="Learning by building, collaborating, and translating classroom fundamentals into real products."
      />
      <div className="timeline">
        <article className="timeline-item reveal">
          <div className="timeline-marker"><BriefcaseBusiness size={18} /></div>
          <div className="timeline-date">MAY — SEP 2025</div>
          <div className="timeline-card">
            <div className="timeline-heading">
              <div><p>CODEXINTERN</p><h3>Frontend Developer Intern</h3></div>
              <span>REMOTE</span>
            </div>
            <ul>
              <li>Built responsive React.js interfaces across 5+ projects using Tailwind CSS, Bootstrap, and modern JavaScript.</li>
              <li>Integrated REST APIs and dynamic data flows while gaining hands-on backend experience with Node.js, Express, and MongoDB.</li>
              <li>Added Framer Motion interactions and contributed through Agile sprint cycles using component-based architecture.</li>
            </ul>
            <div className="timeline-tags"><span>React.js</span><span>REST API</span><span>Agile</span><span>MERN</span></div>
          </div>
        </article>

        <article className="timeline-item reveal">
          <div className="timeline-marker"><GraduationCap size={18} /></div>
          <div className="timeline-date">2022 — 2026</div>
          <div className="timeline-card">
            <div className="timeline-heading">
              <div><p>APOLLO INSTITUTE OF TECHNOLOGY, KANPUR</p><h3>B.Tech · Computer Science & Engineering</h3></div>
              <span>FINAL YEAR</span>
            </div>
            <p className="timeline-copy">
              Building a strong foundation in software engineering, data structures, databases, computer networks, and modern web development.
            </p>
            <div className="education-stats">
              <div><span>CGPA</span><strong>7.2 / 10</strong></div>
              <div><span>CLASS RANK</span><strong>Top 5%</strong></div>
              <div><span>GRADUATION</span><strong>Sep 2026</strong></div>
            </div>
          </div>
        </article>
      </div>

      <div className="achievement-row reveal">
        <div><span>01</span><p><strong>Microsoft Azure Fundamentals</strong>Cloud certification</p></div>
        <div><span>02</span><p><strong>Best Performer · Cricket</strong>AIT Kanpur</p></div>
        <div><span>03</span><p><strong>Technical clubs</strong>Coding contests & activities</p></div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <div className="contact-card reveal">
        <div className="contact-copy">
          <p className="eyebrow"><span />Let&apos;s work together</p>
          <h2>Have an idea?<br /><em>Let&apos;s build it.</em></h2>
          <p>
            I&apos;m currently open to full-time roles, internships, and meaningful collaborations.
            If you&apos;re looking for a developer who cares about both code and craft, let&apos;s talk.
          </p>
          <a className="contact-mail" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}<ArrowRight size={21} />
          </a>
        </div>

        <div className="contact-details">
          <a href={`tel:${PROFILE.phone.replace(/\s/g, "")}`}>
            <span><Phone size={19} /></span><p><small>CALL ME</small>{PROFILE.phone}</p><ExternalLink size={15} />
          </a>
          <div>
            <span><MapPin size={19} /></span><p><small>BASED IN</small>Kanpur, Uttar Pradesh, India</p>
          </div>
          <a href="/Naveen_Kumar_Resume.pdf" download>
            <span><Download size={19} /></span><p><small>MY PROFILE</small>Download A4 résumé</p><ExternalLink size={15} />
          </a>
          <div className="social-links">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a href={href} target="_blank" rel="noreferrer" key={label} aria-label={label} title={label}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const CHAT_SUGGESTIONS = ["Tell me about Naveen", "Skills", "Projects", "Internship", "Contact details"];

function assistantReply(rawInput) {
  const input = rawInput.toLowerCase().trim();
  const has = (...terms) => terms.some((term) => input.includes(term));

  if (has("all detail", "everything", "about naveen", "who is", "naveen ke bare", "नवीन", "profile")) {
    return `Naveen Kumar is a Full Stack / MERN Developer based in Kanpur, Uttar Pradesh. He is completing a B.Tech in Computer Science & Engineering at Apollo Institute of Technology, Kanpur (2022–2026), with a 7.2/10 CGPA and a Top 5% class rank.\n\nHe interned as a Frontend Developer at CODEXINTERN from May to September 2025, building responsive React applications, integrating REST APIs, and working with Node.js, Express, MongoDB, and Agile workflows.\n\nHis featured work includes Streamify, Resumify AI, DashFlow, WeatherAI, Nova Todo, Neon Chat, an AI Code Generator, and e-commerce applications.\n\nContact: nk1910479@gmail.com · +91 8467817027 · Kanpur, India. He is currently open to opportunities.`;
  }
  if (has("name", "naam", "who")) {
    return "His name is Naveen Kumar. He is a Full Stack Developer, MERN Stack Developer, and final-year B.Tech Computer Science student based in Kanpur, India.";
  }
  if (has("skill", "tech", "stack", "technology", "kya aata")) {
    return "Naveen’s toolkit includes React.js, Next.js, TypeScript, JavaScript, Tailwind CSS, Framer Motion, Three.js, HTML/CSS, Node.js, Express.js, REST APIs, Socket.io, Spring Boot, MongoDB, MySQL, SQL, Java, Python, Git/GitHub, Firebase, Postman, Vercel, Netlify, and MongoDB Atlas.";
  }
  if (has("intern", "experience", "job", "codex")) {
    return "Naveen worked as a Frontend Developer Intern at CODEXINTERN from May 2025 to September 2025. He built responsive React apps across 5+ projects, integrated REST APIs, used Tailwind CSS, Bootstrap, and Framer Motion, gained MERN backend experience, and worked in Agile sprint cycles.";
  }
  if (has("college", "education", "degree", "study", "cgpa", "rank", "graduat")) {
    return "Naveen is pursuing a B.Tech in Computer Science & Engineering at Apollo Institute of Technology (AIT), Kanpur, from September 2022 to September 2026. His CGPA is 7.2/10 and he ranks in the Top 5% of his class.";
  }
  if (has("project", "work", "built", "portfolio")) {
    return "Naveen’s featured projects are Streamify (video/chat calling), Resumify AI (ATS résumé builder), DashFlow (admin dashboard), WeatherAI, Nova Todo, Neon Chat, AI Code Generator, a Next.js E-Commerce Platform, and Mini E-Commerce. Ask me for a specific project or open the Projects section for code and live links.";
  }
  if (has("streamify", "video", "webrtc")) {
    return "Streamify is Naveen’s full-stack real-time video and chat platform, built with React, Node.js, MongoDB, WebRTC, Socket.io, Tailwind CSS, JWT, and Express. It includes peer-to-peer calls, user profiles, authentication, and call history.";
  }
  if (has("resume", "cv", "resumify")) {
    return "You can download Naveen’s professional A4 résumé from the Résumé button in the header or the About and Contact sections. Resumify AI is also one of his projects—an ATS résumé builder with live editing, templates, and PDF export.";
  }
  if (has("contact", "email", "phone", "mobile", "address", "location", "where", "pata")) {
    return `You can reach Naveen at ${PROFILE.email} or ${PROFILE.phone}. He is based in ${PROFILE.location}. The contact section also includes his GitHub, LinkedIn, LeetCode, YouTube, and Instagram profiles.`;
  }
  if (has("available", "hire", "opportunity", "open to work")) {
    return "Yes—Naveen is open to full-time developer roles, internships, and meaningful collaborations. The fastest way to connect is by email at nk1910479@gmail.com.";
  }
  if (has("certificate", "certification", "achievement", "award", "cricket")) {
    return "Naveen holds a Microsoft Azure Fundamentals certification, was recognized as Best Performer in cricket at AIT, participates in technical clubs and coding contests, and ranks in the Top 5% of his class.";
  }
  if (has("social", "github", "linkedin", "leetcode", "instagram", "youtube")) {
    return "Naveen’s social profiles are linked in the About, Contact, and footer sections: GitHub (naveenkashyap2), LinkedIn (naveen-kashyap08), LeetCode (naveenkyp854), YouTube (@naveen08vlog), and Instagram (@naveenkashyap2130).";
  }
  if (has("hello", "hi", "hey", "namaste")) {
    return "Hi! I’m Navi, Naveen’s portfolio assistant. I can tell you about his skills, education, internship, projects, contact details, achievements, or availability. What would you like to know?";
  }
  return "I can help with Naveen’s profile, skills, projects, internship, education, contact details, résumé, achievements, or availability. Try asking “Tell me everything about Naveen” for a complete overview.";
}

function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I’m Navi, Naveen’s portfolio assistant. Ask me anything about his work, skills, education, or experience.",
    },
  ]);
  const endRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("keydown", close);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  const ask = (question) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || typing) return;
    setMessages((current) => [...current, { role: "user", text: cleanQuestion }]);
    setInput("");
    setTyping(true);
    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [...current, { role: "assistant", text: assistantReply(cleanQuestion) }]);
      setTyping(false);
    }, 650);
  };

  const submit = (event) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <div className={`assistant ${open ? "assistant-open" : ""}`}>
      {open && (
        <div className="assistant-panel" role="dialog" aria-label="Ask Navi about Naveen" aria-modal="false">
          <div className="assistant-head">
            <div className="assistant-avatar"><Bot size={21} /><span /></div>
            <div><strong>Ask Navi</strong><small><i /> Portfolio assistant · online</small></div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant"><X size={19} /></button>
          </div>

          <div className="assistant-messages" aria-live="polite">
            <div className="assistant-date">TODAY</div>
            {messages.map((message, index) => (
              <div className={`message message-${message.role}`} key={`${message.role}-${index}`}>
                {message.role === "assistant" && <span className="mini-avatar">N</span>}
                <p>{message.text}</p>
              </div>
            ))}
            {typing && (
              <div className="message message-assistant">
                <span className="mini-avatar">N</span>
                <p className="typing"><i /><i /><i /></p>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="assistant-suggestions">
            {CHAT_SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} onClick={() => ask(suggestion)} disabled={typing}>{suggestion}</button>
            ))}
          </div>
          <form className="assistant-input" onSubmit={submit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about Naveen…"
              aria-label="Ask about Naveen"
            />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Send message"><Send size={17} /></button>
          </form>
          <p className="assistant-note">Local portfolio assistant · No data is stored</p>
        </div>
      )}

      <button
        className="assistant-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close portfolio assistant" : "Open portfolio assistant"}
        aria-expanded={open}
      >
        {open ? <X size={23} /> : <MessageCircle size={23} />}
        {!open && <span>Ask about me</span>}
        {!open && <i />}
      </button>
    </div>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer>
      <button className="footer-brand" onClick={() => onNavigate("home")}><span>NK</span>NAVEEN KUMAR</button>
      <p>Designed & built with intention · © 2026</p>
      <div>
        {SOCIALS.slice(0, 3).map(({ label, href }) => (
          <a href={href} target="_blank" rel="noreferrer" key={label}>{label}</a>
        ))}
      </div>
    </footer>
  );
}

export default function App() {
  const active = useActiveSection();
  const appRef = useRef(null);

  const navigate = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.from(".hero-animate", {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.09,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 34,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
    }, appRef);

    return () => context.revert();
  }, []);

  return (
    <div className="app" ref={appRef}>
      <ParticleCanvas />
      <PointerEffects />
      <Header active={active} onNavigate={navigate} />
      <main>
        <Hero onNavigate={navigate} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer onNavigate={navigate} />
      <PortfolioAssistant />
    </div>
  );
}
