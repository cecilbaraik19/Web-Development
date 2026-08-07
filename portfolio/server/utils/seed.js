import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import Certification from '../models/Certification.js';
import Journey from '../models/Journey.js';

dotenv.config();

const projects = [
  {
    title: 'Swiggy Clone',
    description:
      'A food-delivery app inspired by Swiggy with restaurant listings, search, cart flow and order placement built on the MERN stack.',
    techStack: ['React', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB'],
    githubUrl: 'https://github.com/cecilbaraik/swiggy-clone',
    liveUrl: '',
    category: 'MERN',
    status: 'Completed',
    completedAt: new Date('2025-06-15'),
  },
  {
    title: 'Netflix Clone',
    description:
      'A Netflix-style browsing experience with dynamic rows, movie detail modals and real data pulled from the TMDB API.',
    techStack: ['React', 'CSS', 'TMDB API'],
    githubUrl: 'https://github.com/cecilbaraik/netflix-clone',
    liveUrl: '',
    category: 'Frontend',
    status: 'Completed',
    completedAt: new Date('2025-03-10'),
  },
  {
    title: 'Weather App',
    description:
      'Live weather dashboard with city search, 5-day forecast and dynamic backgrounds powered by the OpenWeather API.',
    techStack: ['JavaScript', 'OpenWeather API', 'CSS'],
    githubUrl: 'https://github.com/cecilbaraik/weather-app',
    liveUrl: '',
    category: 'Frontend',
    status: 'Completed',
    completedAt: new Date('2024-12-05'),
  },
  {
    title: 'News App',
    description:
      'A headline reader with category filters, infinite scroll and bookmarks, built on top of a public news API.',
    techStack: ['React', 'News API', 'Tailwind CSS'],
    githubUrl: 'https://github.com/cecilbaraik/news-app',
    liveUrl: '',
    category: 'Frontend',
    status: 'Completed',
    completedAt: new Date('2025-01-20'),
  },
  {
    title: 'Task Manager API',
    description:
      'A REST API for tasks with full CRUD, input validation and clean controller/route separation — my backend practice ground.',
    techStack: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
    githubUrl: 'https://github.com/cecilbaraik/task-manager-api',
    liveUrl: '',
    category: 'Backend',
    status: 'Completed',
    completedAt: new Date('2025-05-02'),
  },
  {
    title: 'Cloud Static Hosting Pipeline',
    description:
      'Deploying a static site to AWS with S3, CloudFront and Route53 while learning IAM, buckets and CDN caching hands-on.',
    techStack: ['AWS S3', 'CloudFront', 'Route53'],
    githubUrl: '',
    liveUrl: '',
    category: 'Cloud',
    status: 'In Progress',
  },
  {
    title: 'Home SOC Lab',
    description:
      'Placeholder for an upcoming home SOC / SIEM lab: forwarding logs from a vulnerable VM into Splunk and writing detection rules.',
    techStack: ['Splunk', 'Sysmon', 'VirtualBox'],
    githubUrl: '',
    liveUrl: '',
    category: 'Cybersecurity',
    status: 'Planned',
  },
  {
    title: 'Network Recon Scanner',
    description:
      'Placeholder for a future network reconnaissance tool that wraps Nmap scans and reports open services in a clean dashboard.',
    techStack: ['Python', 'Nmap', 'Networking'],
    githubUrl: '',
    liveUrl: '',
    category: 'Cybersecurity',
    status: 'Planned',
  },
];

const certifications = [
  {
    title: 'Bug Bounty Hunting',
    issuer: 'Online Course',
    status: 'Earned',
    issueDate: new Date('2025-02-01'),
    order: 1,
  },
  {
    title: 'Web Application Penetration Testing',
    issuer: 'Online Course',
    status: 'Earned',
    issueDate: new Date('2025-04-01'),
    order: 2,
  },
  { title: 'CCNA', issuer: 'Cisco', status: 'Planned', order: 3 },
  { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', status: 'Planned', order: 4 },
  { title: 'OSCP', issuer: 'OffSec', status: 'Planned', order: 5 },
  { title: 'OSWE', issuer: 'OffSec', status: 'Planned', order: 6 },
];

const journey = [
  {
    title: 'Learning Web Development',
    description: 'HTML, CSS and JavaScript fundamentals — the first lines of code.',
    period: '2024',
    status: 'done',
    order: 1,
  },
  {
    title: 'Learning MERN',
    description: 'MongoDB, Express.js, React and Node.js — connecting frontend to backend.',
    period: '2024 — 2025',
    status: 'done',
    order: 2,
  },
  {
    title: 'Building Projects',
    description: 'Clones, apps and APIs — turning tutorials into things that actually ship.',
    period: 'Now',
    status: 'current',
    order: 3,
  },
  {
    title: 'Learning AWS',
    description: 'Cloud fundamentals: EC2, S3, IAM and how the internet is really hosted.',
    period: 'Now',
    status: 'current',
    order: 4,
  },
  {
    title: 'Learning Networking',
    description: 'Working toward CCNA — subnets, routing, switching and protocols.',
    period: 'Next',
    status: 'next',
    order: 5,
  },
  {
    title: 'Learning Cybersecurity',
    description: 'From bug bounty hunting to structured penetration testing and defense.',
    period: 'Next',
    status: 'next',
    order: 6,
  },
  {
    title: 'DevSecOps Journey',
    description: 'The destination: securing every stage of the build, ship and run pipeline.',
    period: 'Future',
    status: 'next',
    order: 7,
  },
];

// Seeds collections only when they are empty — safe to run on every boot.
export const seedIfEmpty = async () => {
  try {
    if ((await Project.countDocuments()) === 0) {
      await Project.insertMany(projects);
      console.log(`Seeded ${projects.length} projects`);
    }
    if ((await Certification.countDocuments()) === 0) {
      await Certification.insertMany(certifications);
      console.log(`Seeded ${certifications.length} certifications`);
    }
    if ((await Journey.countDocuments()) === 0) {
      await Journey.insertMany(journey);
      console.log(`Seeded ${journey.length} journey steps`);
    }
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
  }
};

// Allows `npm run seed` for manual reseeding
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  connectDB().then(async () => {
    await seedIfEmpty();
    process.exit(0);
  });
}
