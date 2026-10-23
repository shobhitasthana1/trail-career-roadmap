import React from "react";
import { Link } from "react-router-dom";
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
    <footer id="contact" className="relative w-full bg-[#0E0A1A] rounded-t-[2rem] sm:rounded-t-[2.5rem] px-5 sm:px-6 md:px-12 lg:px-20 pt-16 md:pt-20 pb-10 text-white overflow-hidden z-10 border-t border-white/10 shadow-[0_-20px_50px_rgba(157,78,221,0.05)]">
      
      <div className="absolute top-[-20%] left-1/3 -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[40%] h-[50%] bg-[#9D4EDD]/25 blur-[100px] md:blur-[140px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-[-10%] right-1/4 translate-x-1/4 w-[70%] md:w-[50%] lg:w-[30%] h-[40%] bg-[#4E2ADD]/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto flex flex-col gap-14 md:gap-16 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8 items-start">
          
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <h2 className="font-geist text-[4rem] sm:text-[4.5rem] lg:text-[6rem] font-bold leading-[0.96] tracking-[-0.045em] text-white mb-5 md:mb-6">
              Trail<span className="font-iowan italic font-normal text-[#C4B5FD]">.</span>
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed font-inter mb-8 md:mb-10 max-w-sm pr-4 sm:pr-0">
              Discover the right career path, learn the skills that matter, and track your progress. Built as an MCA final-year academic project.
            </p>
            
            <Link to="/explore" className="group relative w-full sm:w-max px-6 py-3 sm:py-2.5 rounded-full overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-500 flex items-center justify-between gap-4 cursor-pointer shadow-lg active:scale-[0.98]">
              <span className="relative z-10 text-sm font-semibold text-white tracking-wide ml-2 sm:ml-0 font-geist">Explore Roadmaps</span>
              <div className="relative z-10 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white text-[#120D21] flex items-center justify-center transform group-hover:rotate-[-45deg] transition-transform duration-500 ease-out shrink-0">
                <FaArrowRight size={14} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#9D4EDD]/0 via-[#9D4EDD]/20 to-[#9D4EDD]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-12 w-full">
            
            <div className="sm:col-span-4 flex flex-col gap-6">
              <h4 className="text-white/40 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold font-exo">Explore</h4>
              <div className="flex flex-col gap-5 sm:gap-4 text-white/70 font-medium text-[15px] sm:text-base font-inter">
                {[
                  { name: "Home", path: "/" },
                  { name: "Explore", path: "/explore" },
                  { name: "Roadmap", path: "/roadmap" },
                  { name: "Progress", path: "/progress" },
                  { name: "Resources", path: "/resources" },
                ].map((link, index) => (
                  <Link key={index} to={link.path} className="relative w-max group hover:text-white transition-colors duration-300 pb-1">
                    {link.name}
                    <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#9D4EDD] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="sm:col-span-8 flex flex-col">
              <h4 className="text-white/40 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold mb-6 font-exo">The Creators</h4>
              <div className="flex flex-col border-t border-white/10">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index} 
                    className="group flex flex-row items-center justify-between py-4 sm:py-4 border-b border-white/10 lg:hover:px-4 transition-all duration-500 lg:hover:bg-white/5 cursor-default rounded-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <span className="text-white font-geist font-bold text-[15px] sm:text-base tracking-tight">{member.name}</span>
                      <span className="text-white/50 text-[13px] sm:text-sm font-inter font-medium">{member.role}</span>
                    </div>
                    <div className="flex gap-4 sm:gap-5 opacity-100 lg:opacity-50 lg:group-hover:opacity-100 transition-all duration-300 lg:translate-x-2 lg:group-hover:translate-x-0 ml-4 shrink-0">
                      <a 
                        href={member.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/70 hover:text-white lg:hover:scale-110 transition-all duration-300"
                        aria-label={`${member.name} GitHub`}
                      >
                        <FaGithub size={18} className="sm:w-5 sm:h-5" />
                      </a>
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/70 hover:text-white lg:hover:scale-110 transition-all duration-300"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <FaLinkedin size={18} className="sm:w-5 sm:h-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-[11px] sm:text-xs font-medium text-white/40 font-inter gap-6 md:gap-4 text-center md:text-left">
          <p>© {new Date().getFullYear()} Trail Platform. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
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