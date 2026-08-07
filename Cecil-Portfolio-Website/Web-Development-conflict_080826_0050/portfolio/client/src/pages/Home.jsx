import Hero from '../components/Hero.jsx';
import Marquee from '../components/Marquee.jsx';
import About from '../components/About.jsx';
import Skills from '../components/Skills.jsx';
import Projects from '../components/Projects.jsx';
import Journey from '../components/Journey.jsx';
import Certifications from '../components/Certifications.jsx';
import LearningNow from '../components/LearningNow.jsx';
import GithubStats from '../components/GithubStats.jsx';
import Contact from '../components/Contact.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Certifications />
      <LearningNow />
      <GithubStats />
      <Contact />
    </>
  );
}
