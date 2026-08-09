import React from 'react';
import ButtonOne from './ButtonOne';

const Navbar = () => {
  const navLinks = ['Home', 'Explore', 'Roadmap', 'Progress', 'Resources'];

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 fixed top-0 z-50">
      <div className="w-full mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        
        <div className="flex-shrink-0 cursor-pointer">
          <img 
            className="w-24 md:w-28 object-contain" 
            src="/images/logo.webp" 
            alt="TRAIL Logo" 
          />
        </div>

        <div className="hidden md:flex items-center gap-10 text-gray-600 font-medium">
          {navLinks.map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-sm tracking-wide flex items-center gap-2"
            >
              {item === 'Roadmap' && (
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              )}
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <ButtonOne text="Get Started" />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;