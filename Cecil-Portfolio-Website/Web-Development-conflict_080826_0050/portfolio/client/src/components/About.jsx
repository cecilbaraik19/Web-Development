import { useRef } from "react";
import { useInView } from "framer-motion";
import { FaCode, FaShieldAlt, FaCloud, FaNetworkWired } from "react-icons/fa";
import { SectionHeading } from "./SectionHeading.jsx";
import { Reveal } from "./Reveal.jsx";
import { GlowCard } from "./GlowCard.jsx";
import { useCountUp } from "../hooks/useCountUp.js";
import profileImage from "../assests/profile.jpeg";

const FOCUS_AREAS = [
  {
    Icon: FaCode,
    title: "Full Stack Development",
    text: "Building end-to-end apps with the MERN stack.",
  },
  {
    Icon: FaShieldAlt,
    title: "Cybersecurity",
    text: "Bug bounty hunting and web app penetration testing.",
  },
  {
    Icon: FaCloud,
    title: "Cloud",
    text: "Learning AWS — compute, storage and identity.",
  },
  {
    Icon: FaNetworkWired,
    title: "Networking",
    text: "Protocols, subnets and how packets really move.",
  },
];

const Stat = ({ end, suffix, label, started }) => {
  const value = useCountUp(end, started);
  return (
    <div>
      <div className="font-display text-3xl font-semibold text-accent">
        {value}
        {suffix}
      </div>
      <div className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
        {label}
      </div>
    </div>
  );
};

export default function About() {
  const statsRef = useRef(null);
  const statsVisible = useInView(statsRef, { once: true, margin: "-60px" });

  return (
    <section
      id="about"
      data-testid="about-section"
      className="mx-auto max-w-6xl px-6 py-28"
    >
      <SectionHeading
        number="01"
        eyebrow="About"
        title="A learner with a target."
        description="Every project here is a step on a longer road — from writing my first HTML tag to securing the systems I deploy."
      />

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Profile picture placeholder with scanning frame */}
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-secondary">
            <div className="bg-grid absolute inset-0 opacity-70" />
            <div className="absolute inset-0">
              <img
                src={profileImage}
                alt="Cecil Baraik"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Corner brackets */}
            <span className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-accent" />
            <span className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-accent" />
            <span className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-accent" />
            <span className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-accent" />
            {/* Scan line */}
            <span className="absolute left-0 h-px w-full animate-scan bg-accent/60" />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              CECIL BARAIK
            </span>
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal delay={0.1}>
            <p className="text-base leading-relaxed text-muted md:text-lg">
              I'm Cecil — I started with curiosity about how websites work, and
              that curiosity turned into a habit of building. My learning
              journey took me from HTML and CSS to shipping full stack apps with
              MongoDB, Express, React and Node.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              Right now my focus is split between sharpening my MERN skills and
              going deeper into AWS, while studying for networking and security
              fundamentals. I hunt bugs on the side to understand how attackers
              think.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              The goal ahead: become a{" "}
              <span className="text-accent">DevSecOps engineer</span> — someone
              who builds software and knows how to defend it.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div ref={statsRef} className="mt-10 grid grid-cols-3 gap-6">
              <Stat
                end={10}
                suffix="+"
                label="Projects Built"
                started={statsVisible}
              />
              <Stat
                end={12}
                suffix="+"
                label="Technologies Explored"
                started={statsVisible}
              />
              <Stat
                end={2}
                suffix=""
                label="Certifications Earned"
                started={statsVisible}
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Focus area cards */}
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FOCUS_AREAS.map(({ Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.1}>
            <GlowCard className="p-6">
              <Icon className="mb-4 text-2xl text-accent" />
              <h3 className="font-display text-base font-semibold text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
