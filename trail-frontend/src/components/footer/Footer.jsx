import React from "react";
import { FaGithub, FaLinkedin, FaArrowRight } from "react-icons/fa6";

const Footer = () => {
  const teamMembers = [
    {
      name: "Shobhit Asthana",
      role: "Frontend Developer",
      github: "https://github.com/shobhitasthana1",
      linkedin: "https://www.linkedin.com/in/shobhit-asthana/",
    },
    {
      name: "Anshika Gupta",
      role: "Backend Developer",
      github: "https://github.com/anshikagknp",
      linkedin: "https://www.linkedin.com/in/anshikagknp/",
    },
    {
      name: "Abhay Raj",
      role: "Backend Developer",
      github: "https://github.com/abhayraj81",
      linkedin: "https://www.linkedin.com/in/abhayraj081/",
    },
    {
      name: "Sharad Savita",
      role: "Data / Power BI Analytics",
      github: "https://github.com/sharadsavita",
      linkedin: "https://www.linkedin.com/in/sharad-savita-a08955368/",
    },
  ];

  return (
    <footer id="contact" className="relative w-full bg-[#120D21] rounded-t-[2.5rem] px-6 md:px-12 lg:px-20 pt-12 md:pt-16 pb-8 text-white overflow-hidden z-10 border-t border-white/5">
      
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] md:w-[60%] h-[50%] bg-[#9D4EDD]/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-16 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <h2 className="font-satoshi text-[3.5rem] sm:text-[4.5rem] lg:text-[6rem] font-black leading-none tracking-tighter text-white mb-4 md:mb-6">
              Trail.
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium mb-8 md:mb-10 max-w-sm">
              Discover the right career path, learn the skills that matter, and track your progress. Built as an MCA final-year academic project.
            </p>
            
            <button className="group relative w-full sm:w-max px-6 py-2.5 rounded-full overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-500 flex items-center justify-between sm:justify-start gap-4 cursor-pointer shadow-lg">
              <span className="relative z-10 text-sm font-semibold text-white tracking-wide">Explore Roadmaps</span>
              <div className="relative z-10 w-9 h-9 rounded-full bg-white text-[#120D21] flex items-center justify-center transform group-hover:rotate-[-45deg] transition-transform duration-500 ease-out">
                <FaArrowRight size={14} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#9D4EDD]/0 via-[#9D4EDD]/10 to-[#9D4EDD]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
            </button>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-12 w-full">
            
            <div className="sm:col-span-4 flex flex-col gap-5 md:gap-6">
              <h4 className="text-white/30 text-xs uppercase tracking-[0.25em] font-bold">Explore</h4>
              <div className="flex flex-col gap-4 text-zinc-300 font-medium">
                {['Home', 'Explore', 'Roadmap', 'Progress', 'Resources'].map((link, index) => (
                  <a key={index} href="#" className="relative w-max group hover:text-white transition-colors duration-300 pb-1">
                    {link}
                    <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
              </div>
            </div>

            <div className="sm:col-span-8 flex flex-col">
              <h4 className="text-white/30 text-xs uppercase tracking-[0.25em] font-bold mb-5 md:mb-6">The Creators</h4>
              <div className="flex flex-col border-t border-white/10">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index} 
                    className="group flex flex-row items-center justify-between py-4 border-b border-white/10 lg:hover:px-4 transition-all duration-500 lg:hover:bg-white/5 cursor-default rounded-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <span className="text-white font-bold text-sm sm:text-base tracking-wide">{member.name}</span>
                      <span className="text-zinc-500 text-xs sm:text-sm font-medium">{member.role}</span>
                    </div>
                    <div className="flex gap-4 opacity-100 lg:opacity-50 lg:group-hover:opacity-100 transition-all duration-300 lg:translate-x-2 lg:group-hover:translate-x-0">
                      <a 
                        href={member.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/80 hover:text-white lg:hover:scale-110 transition-all duration-300"
                      >
                        <FaGithub size={18} />
                      </a>
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/80 hover:text-[#0A66C2] lg:hover:scale-110 transition-all duration-300"
                      >
                        <FaLinkedin size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/10 text-xs font-medium text-white/40 gap-6 md:gap-4 text-center md:text-left">
          <p>© {new Date().getFullYear()} Trail Platform. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;