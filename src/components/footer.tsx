"use client";

import Link from "next/link";

export const Footer = ({ loading }: { loading: boolean }) => {
  return (
    <footer
      className={`${
        loading && "hidden"
      } z-50 fixed bottom-0 !w-full overflow-hidden 
        py-2 sm:py-3 px-2 sm:px-4
        border-t border-gray-100 
        bg-gradient-to-r from-gray-100 to-white 
        shadow-xl 
        dark:from-gray-900 dark:to-black dark:border-gray-800
        text-gray-400`}
    >
      <div className="flex flex-row justify-center items-center text-center overflow-hidden">
        {[...Array(1)].map((_, i) => (
          <div
            key={i}
            className="animate-bounce-x-big whitespace-nowrap flex flex-row gap-4 sm:gap-6 md:gap-8 px-3 sm:px-6"
          >
            <div className="flex flex-row items-center gap-3 sm:gap-6">
              <span className="text-[10px] sm:text-xs text-gray-600">◆</span>

              <span className="text-[10px] sm:text-sm md:text-base tracking-widest group-hover:text-pink-400 transition-colors whitespace-nowrap">
                © {new Date().getFullYear()} – Shendy Putra Perdana Yohansah
              </span>

              <span className="text-[10px] sm:text-xs text-gray-600">◆</span>

              <Link
                href="https://calendly.com/shendyppy/30min"
                target="_blank"
                className="group flex flex-row items-center gap-1"
              >
                <span className="text-[10px] sm:text-sm md:text-base tracking-widest group-hover:text-green-400 transition-colors whitespace-nowrap">
                  Any ideas for collaboration?{" "}
                </span>
                <div
                  className="px-2 py-1 sm:px-3 sm:py-1.5 
                    rounded-full text-white font-semibold shadow-md
                    text-[10px] sm:text-xs md:text-sm
                    bg-gradient-to-r from-gray-400 to-black 
                    group-hover:from-pink-500 group-hover:to-yellow-500 
                    transition-all"
                >
                  Let&apos;s connect! 🚀
                </div>
              </Link>

              <span className="text-[10px] sm:text-xs text-gray-600">◆</span>

              <span className="text-[10px] sm:text-sm md:text-base tracking-widest group-hover:text-teal-400 transition-colors whitespace-nowrap">
                Front End Developer, Full Stack Developer, Business Analyst
              </span>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
