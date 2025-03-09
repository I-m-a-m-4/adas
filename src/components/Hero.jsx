import React from "react";
import styles from "../style";
import Robot from "../assets/robots.png";
// Import your orange arc image
import OrangeArc from "../assets/Line 3.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      // Use a radial gradient for the entire hero background
      className={`
        relative min-h-screen overflow-x-hidden overflow-hidden
   
        ${styles.paddingY}
      `}
    >
      {/* Main container (flex for desktop, stacked for mobile) */}
      <div className="mx-auto px-4 flex flex-col md:flex-row items-start text-left h-full">
        {/* Left Content */}

        <div className="relative z-10 flex-1 w-full flex flex-col px-6 sm:px-16 py-8">
          {/* Title */}
          <div className="w-full  mb-6 mt-4 ">
            <h1
              className="
                font-poppins font-bold
                text-[2rem]  /* Larger on mobile */
                md:text-[4rem]
                leading-[2.2rem]
                md:leading-[4.5rem]
                text-black
                lg:mt-24
              "
            >
              Welcome to{" "}
              <span className="relative inline-block">
                {/* Gradient text */}
                <span
                  className="
                    bg-gradient-to-r from-[#6A0DAD] via-[#6E3995] to-[#9E0DAD]
                    bg-clip-text text-transparent
                  "
                >
                  ADAS
                </span>
                {/* Orange Arc image under ADAS */}
                <img
                  src={OrangeArc}
                  alt="Orange arc"
                  className="absolute w-[200px] left-1/2 mt-6 transform -translate-x-1/2 bottom-[-8px]"
                />
              </span>
            </h1>
          </div>

          {/* Description */}
          <p
            className="
              max-w-[35rem]
              mt-[1.5rem]
              text-black font-[400]
              text-lg md:text-xl 
              
            "
          >
            ADAS is the go-to platform for hosting, managing, and promoting
            events of all kinds. Whether it's a corporate conference or a
            community gathering, ADAS provides tools you would need to make your
            event unforgettable.
          </p>

          {/* Button */}
          <Link to="/create-event-form">
          <button
            className="
    w-[15rem] 
    bg-gradient-to-r from-[#6A0DAD] via-[#6E3995] to-[#9E0DAD]
    text-white font-bold
    py-3
    rounded-lg shadow-lg
    hover:opacity-90
    transition duration-300
    mt-10
  "
          >
            Host Your Next Event Here
          </button>
          </Link>
         
        </div>

        {/* Right Content (Image) */}
        <div
          className="
            relative z-10 flex-1
            flex justify-center items-center
            md:my-0 my-10
          "
        >
          <img
            src={Robot}
            alt="event hosting"
            className="w-full max-w-full h-full relative z-[5] rounded-lg object-cover"
          />

          {/* Optional gradient decorations */}
          <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
          <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
          <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        </div>
      </div>

      {/* Thin line at the bottom */}
      <div className="container mx-auto lg:mt-7 px-4">
        <div className="w-full border-b border-[#9E0DADB2] mt-4 mb-4" />
      </div>
    </section>
  );
};

export default Hero;
