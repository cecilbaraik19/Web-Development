// Served as JSON at GET /api/skills. Edit this file to update the Skills section.
const skillsData = {
  current: [
    { category: 'Frontend', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'] },
    { category: 'Backend', skills: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose'] },
    { category: 'Programming', skills: ['C', 'Core Java'] },
    { category: 'Cloud', skills: ['AWS (Learning)'] },
    {
      category: 'Cybersecurity',
      skills: ['Bug Bounty Hunting', 'Web Application Penetration Testing'],
    },
  ],
  future: [
    'CCNA',
    'Network Penetration Testing',
    'Capture The Flag',
    'Cyber Forensics',
    'Blue Teaming',
    'Red Teaming',
    'OSCP',
    'OSWE',
    'PHP',
    'Laravel',
    'Python',
    'Django',
    'Java',
    'Advanced Java',
    'Spring Boot',
    'Android Development',
  ],
};

export default skillsData;
