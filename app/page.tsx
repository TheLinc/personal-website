"use client";

import ExperienceCard from "@/components/ExperienceCard";
import SkillCard from "../components/SkillCard";
import ProjectCard from "@/components/ProjectCard";
import "@/css/socials.css";
import { useEffect } from "react";
import AboutMeCard from "@/components/AboutMe/AboutME";

// Web Development
const webDevelopmentSkills: Array<{ name: string; image: string }> = [
  {
    name: "React",
    image: "images/webDevSkills/react.png",
  },
  {
    name: "Angular",
    image: "images/webDevSkills/angular.png",
  },
  {
    name: "Node.js",
    image: "images/webDevSkills/node.png",
  },
  {
    name: "JavaScript",
    image: "images/webDevSkills/js.png",
  },
  {
    name: "TypeScript",
    image: "images/webDevSkills/ts.png",
  },
  {
    name: "Bootstrap",
    image: "images/webDevSkills/bootstrap.png",
  },
  {
    name: "TailwindCSS",
    image: "images/webDevSkills/tailwind.png",
  },
  {
    name: "HTML/CSS",
    image: "images/webDevSkills/html.png",
  },
];

// Backend Development
const backendDevelopmentSkills: Array<{ name: string; image: string }> = [
  {
    name: "Python",
    image: "images/backendDevSkills/python.png",
  },
  {
    name: "Java",
    image: "images/backendDevSkills/java.png",
  },
  {
    name: "SQL",
    image: "images/backendDevSkills/sql.png",
  },
  {
    name: "C/C++",
    image: "images/backendDevSkills/c.png",
  },
];

// Cloud Services
const cloudServices: Array<{ name: string; image: string }> = [
  {
    name: "AWS",
    image: "images/cloudSkills/aws.png",
  },
  {
    name: "Firebase",
    image: "images/cloudSkills/firebase.png",
  },
];

// Containerization and Versioning
const containerizationAndVersioning: Array<{ name: string; image: string }> = [
  {
    name: "Docker",
    image: "images/containerizationSkills/docker.png",
  },
  {
    name: "Git",
    image: "images/containerizationSkills/git.png",
  },
];

// Design and Prototyping
const designAndPrototyping: Array<{ name: string; image: string }> = [
  {
    name: "Figma",
    image: "images/designSkills/figma.png",
  },
  {
    name: "Shopify",
    image: "images/designSkills/shopify.png",
  },
  {
    name: "Wix",
    image: "images/designSkills/wix.png",
  },
];

// Projects
const projects: Array<{
  name: string;
  image: string;
  tags: string[];
  desc: string;
  link: string;
}> = [
  {
    name: "Pipestream",
    image: "images/projects/play.png",
    tags: ["React", "Node.js", "Firebase", "Git", "API"],
    desc: "Web-Application and Search Engine that allows users to find which streaming services have their favorite movies and TV shows. This project was constructed using React, Firebase Firestore, Firebase Hosting, and public APIs. Firestore caches users searches and movie data to reduce API calls and increase response time",
    link: "https://www.pipestream.app",
  },
  {
    name: "Mask Detection Model",
    image: "images/projects/mask.png",
    tags: [
      "Machine Learning",
      "Python",
      "TensorFlow",
      "Numpy",
      "Keras",
      "Sklearn",
      "Git",
    ],
    desc: "Developed a machine learning model to detect if a person is wearing a mask. Implemented libraries such as Tensorflow, Sklearn, Numpy, and Pandas to create the model and demonstrate functionality. Used Keras to create model layers for deep learning",
    link: "https://github.com/TheLinc/Mask_Detection_ML",
  },
  {
    name: "NuViu - Smart Cane",
    image: "images/projects/white-cane.png",
    tags: [
      "Arduino",
      "3D Printing",
      "Git",
      "XBee",
      "Electrical Engineering",
      "Machine Learning",
    ],
    desc: "Designed and developed a smart cane that uses ultrasonic sensors to detect obstacles and notify the user. Using a chest mounted camera, NVIDIA Jetson and ML the cane was able to read signs and relay the information to the user. The project was developed using Arduino and 3D printed parts.",
    link: "",
  },
  {
    name: "Sweetacular Cookies",
    image: "images/projects/cookie.png",
    tags: ["Wix", "Research", "Freelance"],
    desc: "This project was developed for a clients small business. The client wanted a website that would allow customers to view their products and contact them for orders. The website was developed using Wix and was designed to be simple and easy to use. The website was also designed to be responsive and mobile friendly",
    link: "https://www.sweetacularcookies.com/",
  },
];

const experience: Array<{
  image: string;
  name: string;
  title: string;
  pos: string;
}> = [
  {
    image: "images/experience/os.png",
    name: "Opinion System",
    title: "Software Developer",
    pos: "left",
  },
  {
    image: "images/experience/GBatteries.png",
    name: "GBatteries",
    title: "Full Stack Developer",
    pos: "right",
  },
  {
    image: "images/experience/trading-central.png",
    name: "Trading Central",
    title: "Software Developer",
    pos: "left",
  },
  {
    image: "images/experience/cra.png",
    name: "Canada Revenue Agency (CRA)",
    title: "IT Analyst & Developer",
    pos: "right",
  },
];

// const button = document.getElementById("button");
// const arrow = document.getElementById("arrow");
// const progress = document.getElementById("progress");
// const check = document.getElementById("check");

// // Time for the download animation itself
// let loadingTime = 1000;
// let blocked = false;

// if(button && arrow && progress && check){
//     button.addEventListener("click", () => {
//         if(blocked) return;
//         blocked = true;

//         arrow.classList.add("animate-down");

//         let percent = 0;
//         let load = setInterval(() => {
//             percent++;
//             progress.style.height = percent + "%";
//         }, loadingTime / 100);

//         setTimeout(() => {
//             clearInterval(load);

//             setTimeout(() => {
//             progress.classList.remove("bg-opacity-20");
//             progress.classList.add("bg-opacity-0");
//             check.classList.remove("w-0");
//             check.classList.add("w-5");

//             setTimeout(() => {
//                 check.classList.add("w-0");
//                 check.classList.remove("w-5");
//                 setTimeout(() => {
//                 reset();
//                 }, 1000);
//             }, 1000);
//             }, 500);
//         }, loadingTime);
//     });
// }

// function reset() {
//     if (progress && arrow){
//         progress.style.height = "0%";
//         arrow.classList.remove("animate-down");

//         setTimeout(() => {
//             progress.classList.remove("bg-opacity-0");
//             progress.classList.add("bg-opacity-20");
//             blocked = false;
//         }, 200)
//     }
// }

// const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//             entry.target.classList.add('show-intro');
//         } else {
//             entry.target.classList.remove('show-intro');
//         }
//     });
// });

// var hiddenElements = null;
// var hiddenIntro = null;
// if (typeof document !== 'undefined') {
//     hiddenElements = document.querySelectorAll('.hidden');
//     hiddenIntro = document.querySelectorAll('.intro .hidden');
// }

// hiddenElements?.forEach((element) => observer.observe(element));
// const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//         if (entry.target.id === "about" && entry.isIntersecting) {
//             entry.target.classList.add("animate-fade-right");
//             observer.unobserve(entry.target);
//         }
//     });
// });

export default function Home() {
  useEffect(() => {
    const aboutElement = document.getElementById("about");

    const projectSection = document.querySelectorAll(".project-section");
    const projectCards = document.querySelectorAll(".project-card");

    const skillSection = document.querySelectorAll(".skill-section");
    const skillSubsection = document.querySelectorAll(".skill-subsection");

    const contactSection = document.querySelectorAll(".contact-section");
    const contactIcon = document.querySelectorAll(".contact-icon");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === "about" && entry.isIntersecting) {
          entry.target.classList.add("animate-fade-right");
          observer.unobserve(entry.target);
        } else if (
          entry.target.classList.contains("project-section") &&
          entry.isIntersecting
        ) {
          projectCards[0].classList.remove("hidden");
          projectCards[1].classList.remove("hidden");
          projectCards[2].classList.remove("hidden");
          projectCards[3].classList.remove("hidden");

          projectCards[0].classList.add("animate-fade-right");
          projectCards[1].classList.add("animate-fade-right");
          projectCards[2].classList.add("animate-fade-right");
          projectCards[3].classList.add("animate-fade-right");

          projectCards[0].classList.add("animate-ease-out");
          projectCards[1].classList.add("animate-ease-out");
          projectCards[2].classList.add("animate-ease-out");
          projectCards[3].classList.add("animate-ease-out");

          projectCards[0].classList.add("animate-delay-[500ms]");
          projectCards[1].classList.add("animate-delay-[1000ms]");
          projectCards[2].classList.add("animate-delay-[1500ms]");
          projectCards[3].classList.add("animate-delay-[2000ms]");

          projectCards[0].classList.add("backdrop-blur");
          projectCards[1].classList.add("backdrop-blur");
          projectCards[2].classList.add("backdrop-blur");
          projectCards[3].classList.add("backdrop-blur");

          observer.unobserve(entry.target);
        } else if (
          entry.target.classList.contains("skill-section") &&
          entry.isIntersecting
        ) {
          skillSubsection[0].classList.remove("hidden");
          skillSubsection[1].classList.remove("hidden");
          skillSubsection[2].classList.remove("hidden");
          skillSubsection[3].classList.remove("hidden");
          skillSubsection[4].classList.remove("hidden");

          skillSubsection[0].classList.add("animate-fade");
          skillSubsection[1].classList.add("animate-fade");
          skillSubsection[2].classList.add("animate-fade");
          skillSubsection[3].classList.add("animate-fade");
          skillSubsection[4].classList.add("animate-fade");

          skillSubsection[0].classList.add("animate-ease-out");
          skillSubsection[1].classList.add("animate-ease-out");
          skillSubsection[2].classList.add("animate-ease-out");
          skillSubsection[3].classList.add("animate-ease-out");
          skillSubsection[4].classList.add("animate-ease-out");

          skillSubsection[0].classList.add("animate-duration-[1500ms]");
          skillSubsection[1].classList.add("animate-duration-[1500ms]");
          skillSubsection[2].classList.add("animate-duration-[1500ms]");
          skillSubsection[3].classList.add("animate-duration-[1500ms]");
          skillSubsection[4].classList.add("animate-duration-[1500ms]");

          skillSubsection[0].classList.add("animate-delay-[500ms]");
          skillSubsection[1].classList.add("animate-delay-[800ms]");
          skillSubsection[2].classList.add("animate-delay-[1100ms]");
          skillSubsection[3].classList.add("animate-delay-[1400ms]");
          skillSubsection[4].classList.add("animate-delay-[1700ms]");

          observer.unobserve(entry.target);
        } else if (
          entry.target.classList.contains("contact-section") &&
          entry.isIntersecting
        ) {
          contactIcon[0].classList.remove("hidden");
          contactIcon[1].classList.remove("hidden");
          contactIcon[2].classList.remove("hidden");

          contactIcon[0].classList.add("animate-jump-in");
          contactIcon[1].classList.add("animate-jump-in");
          contactIcon[2].classList.add("animate-jump-in");

          contactIcon[0].classList.add("animate-ease-out");
          contactIcon[1].classList.add("animate-ease-out");
          contactIcon[2].classList.add("animate-ease-out");

          contactIcon[0].classList.add("animate-duration-[1500ms]");
          contactIcon[1].classList.add("animate-duration-[1500ms]");
          contactIcon[2].classList.add("animate-duration-[1500ms]");

          contactIcon[0].classList.add("animate-delay-[500ms]");
          contactIcon[1].classList.add("animate-delay-[800ms]");
          contactIcon[2].classList.add("animate-delay-[1100ms]");

          observer.unobserve(entry.target);
        }
      });
    });

    if (aboutElement) {
      observer.observe(aboutElement);
    }

    if (projectSection) {
      observer.observe(projectSection[0]);
    }

    if (skillSection) {
      observer.observe(skillSection[0]);
    }

    if (contactSection) {
      observer.observe(contactSection[0]);
    }
  }, []);

  return (
    <main>
      <div className="flex flex-col w-full h-full items-center">
        <div className="flex items-center w-full h-screen gap-5">
          <div className="flex justify-center w-full animate-fade-up animate-delay-1000">
            <div className="lamp">
              <div className="lava">
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                <div className="blob"></div>
                {/* <div className="blob top"></div> */}
                {/* <div className="blob bottom"></div> */}
              </div>
            </div>
            <svg
              className="hidden"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
            >
              <defs>
                <filter id="goo">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="10"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                    result="goo"
                  />
                  <feBlend in="SourceGraphic" in2="goo" />
                </filter>
              </defs>
            </svg>
            <div className="gap-5 max-w-[750px]">
              <div>
                <h1 className="text-[50px] font-semibold">
                  Hello, my name is Lincoln.
                  <div>
                    I am a
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 break-normal mix-blend-difference">
                      {" "}
                      <b>Software Developer</b>
                    </span>
                  </div>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6 md:pt-8 gap-5 w-full">
          <section className="pl-2 pt-6 md:pl-10">
            <div className="section-header">About me</div>
            <div className="flex flex-col-reverse md:flex-row section-content" id="about">
              <div className="grow max-w-[600px]">
                <div className="pt-4">
                  <div className="uppercase  font-bold pr-2">Name:</div>
                  <div>Lincoln Laylor</div>
                </div>
                <div className="pt-4">
                  <div className="uppercase  font-bold pr-2">Height:</div>
                  <div>5'8" (or 5'9" depending on who you ask)</div>
                </div>
                <div className="pt-4">
                  <div className="uppercase  font-bold pr-2">Profession:</div>
                  <div>Software Developer</div>
                </div>
                <div className="pt-4">
                  <div className="uppercase  font-bold pr-2">Graduating School:</div>
                  <div>University of Ottawa - 2023</div>
                </div>
                <div className="pt-4">
                  <div className="uppercase  font-bold pr-2">Graduating Program:</div>
                  <div>Computer Engineering</div>
                </div>
                <div className="pt-4">
                  <div className="uppercase font-bold pr-2">Bio:</div>
                  <div>
                    <div>
                      Hey there, I'm Lincoln, a software sorcerer armed with a
                      computer engineering degree from the University of Ottawa. By
                      day, I'm in the digital trenches, choreographing code that
                      dances on the edge of technological brilliance.
                    </div>
                    <div className="pt-2">
                      When I'm not conquering the binary ballroom, you'll catch me
                      at the gym, lifting weights with the precision of a
                      caffeinated cat on a keyboard. Rumor has it my biceps are as
                      robust as my bug-fixing skills. Video games? I don't just
                      play; I turn pixels into a symphony of victory. Boss battles?
                      Child's play.
                    </div>
                    <div className="pt-2">
                      In a world of 1s and 0s, I'm the hero you need—a software
                      sorcerer by day and a digital dynamo by night. Whether
                      crafting elegant code or conquering the virtual realm, I bring
                      intelligence and humor to every endeavor. Cheers to the
                      digital adventures ahead!
                    </div>
                </div>
              </div>
            </div>
              <div className="p-8 pl-12 pt-0 h-[500px]">
                <AboutMeCard />
              </div>
            </div>
          </section>
          <section className="pl-2 pt-6 md:pt-0 md:pl-10 skill-section">
            <div className="section-header">Skills</div>
            <div className="flex flex-wrap flex-row justify-center sm:justify-start">
              <div className="flex flex-wrap flex-col">
                <div className="bg-[#161B22] text-white rounded-xl max-w-[500px] m-2 hidden skill-subsection">
                  <div className="section-subheader">Frontend Development</div>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-1">
                    {webDevelopmentSkills.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-[#161B22] text-white rounded-xl max-w-[500px] m-2 lg:hidden">
                  <div className="section-subheader">Backend Development</div>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1">
                    {backendDevelopmentSkills.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap flex-col lg:flex">
                <div className="bg-[#161B22] text-white rounded-xl max-w-[500px] m-2 hidden skill-subsection">
                  <div className="section-subheader">Backend Development</div>
                  <div className="grid grid-cols-2 gap-1">
                    {backendDevelopmentSkills.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-[#161B22] text-white rounded-xl max-w-[500px] m-2 hidden skill-subsection">
                  <div className="section-subheader">Design & Prototyping</div>
                  <div className="grid grid-cols-2 gap-1">
                    {designAndPrototyping.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap flex-col">
                <div className="bg-[#161B22] text-white rounded-xl max-w-[325px] m-2 hidden skill-subsection">
                  <div className="section-subheader">Cloud Services</div>
                  <div className="grid grid-cols-2 gap-1">
                    {cloudServices.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-[#161B22] text-white rounded-xl max-w-[325px] m-2 hidden skill-subsection">
                  <div className="section-subheader">
                    Containerization & Versioning
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {containerizationAndVersioning.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-[#161B22] text-white rounded-xl max-w-[325px] m-2 lg:hidden">
                  <div className="section-subheader">Design & Prototyping</div>
                  <div className="grid grid-cols-2 gap-1">
                    {designAndPrototyping.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section
            className="mt-14 bg-cover backdrop-opacity-25"
            style={{ backgroundImage: "url(images/project-background.png)" }}
          >
            <div className="items-center pl-2 pt-10 md:pl-0 project-section">
              <div className="section-header text-center sm:text-left">
                Projects
              </div>
              <div className="pt-2 md:pt-8 justify-center text-center">
                {projects.map((project, index) => (
                  <div key={index} className="project-card inline-block hidden">
                    <ProjectCard
                      name={project.name}
                      image={project.image}
                      tags={project.tags}
                      desc={project.desc}
                      link={project.link}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* <section className='pl-2 pt-6 md:pl-10 hidden'>
                        <div className='section-header'>
                            Resume/CV
                        </div>
                        <div className='section-content'>
                            here is some resume content
                            {JSON.stringify(mousePosition)}
                            <div className="h-screen flex justify-center items-center">
                                <button id="button" className="group rounded-md shadow bg-gradient-to-r from-purple-500 to-cyan-500 text-white cursor-pointer flex justify-between items-center overflow-hidden transition-all hover:glow">
                                    <div className="relative w-12 h-12 bg-white bg-opacity-20 text-white flex justify-center items-center transition-all">
                                        <svg id="arrow" className="w-4 h-4 transition-all group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                    </svg>
                                    <svg id="check" className="absolute z-10 w-0 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <div id="progress" className="absolute w-full h-0 bg-white bg-opacity-20 top-0 duration-200"></div>
                                    </div>
                                    <p className="px-5">Files.zip</p>
                                </button>
                            </div>
                        </div>
                    </section> */}
          <section className="pl-2 pt-6 md:pl-10">
            <div className="section-header">Experience</div>
            <div className="section-content">
              <div className="flex flex-col md:grid grid-cols-9 mx-auto p-2 pt-10 text-blue-50">
                {experience.map((experience, index) => (
                  <ExperienceCard
                    key={index}
                    image={experience.image}
                    name={experience.name}
                    title={experience.title}
                    pos={experience.pos}
                  />
                ))}
              </div>
            </div>
          </section>
          <section className="pl-2 pt-6 md:pl-10 contact-section">
            <div className="section-header">Contact</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 section-content">
              <div className="p-2 inline-flex flex-col max-w-[500px]">
                <div className="pt-2 text-white">
                  Interested or have questions? Let's Connect?
                </div>
                <div className="pt-2">
                  Whether you're on the lookout for cutting-edge code, exploring
                  collaboration opportunities, or just fancy a virtual coffee
                  chat, you're in the right place.
                </div>
                <div className="pt-2">
                  The wizard behind the code, fluent in multiple languages, both
                  in syntax and conversation. Drop a line, and let's embark on a
                  journey where bugs fear to tread, and innovation knows no
                  limits.
                </div>
                <div className="pt-2">
                  Ready to turn ideas into digital wonders? Eager for a
                  collaboration that sings in perfect harmony? Up for a virtual
                  chat over the elixir of developers – coffee?
                </div>
                <div className="pt-2">
                  Feel free to shoot a message below, and let's make the binary
                  world a bit more human-friendly!
                </div>
              </div>
              <div className="p-2 inline-flex flex-col sm:flex-row items-center">
                <div className="wrapper p-4 bg-gray-800 rounded-full w-full max-w-[500px]">
                  <div className="wrapper__links">
                    <a
                      className="social-link social-link--email contact-icon hidden"
                      id="email"
                      href="mailto:lincolnlaylor@gmail.com"
                    >
                      <svg
                        className="social-svg"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Mail</title>
                        <g
                          className="social-group"
                          fill="none"
                          fillRule="evenodd"
                          transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, -7.105427357601002e-15)"
                        >
                          <circle
                            className="social-group__outline"
                            stroke="#000"
                            strokeWidth="20"
                            cx="300"
                            cy="300"
                            r="262.5"
                          />
                          <circle
                            className="social-group__inner-circle"
                            fill="#DA5988"
                            cx="300"
                            cy="300"
                            r="252.5"
                          />
                          <path
                            width="200"
                            height="200"
                            className="social-group__icon"
                            fillRule="nonzero"
                            d="M 136.634 216.076 C 136.634 194.897 155.25 177.734 178.216 177.734 L 427.713 177.734 C 450.679 177.734 469.295 194.897 469.295 216.076 L 469.295 369.435 C 469.295 390.609 450.679 407.777 427.713 407.777 L 178.216 407.777 C 155.25 407.777 136.634 390.609 136.634 369.435 L 136.634 216.076 Z M 178.216 196.905 C 166.735 196.905 157.424 205.488 157.424 216.076 L 157.424 220.235 L 302.966 300.752 L 448.507 220.235 L 448.507 216.076 C 448.507 205.488 439.199 196.905 427.713 196.905 L 178.216 196.905 Z M 448.507 242.59 L 350.62 296.744 L 448.507 352.281 L 448.507 242.59 Z M 447.803 374.4 L 330.534 307.861 L 302.966 323.105 L 275.395 307.861 L 158.135 374.384 C 160.558 382.77 168.803 388.606 178.216 388.606 L 427.713 388.606 C 437.122 388.611 445.363 382.782 447.803 374.4 Z M 157.424 352.281 L 255.309 296.744 L 157.424 242.59 L 157.424 352.281 Z"
                            fill="#000"
                          />
                        </g>
                      </svg>
                    </a>
                    <a
                      className="social-link social-link--github contact-icon hidden"
                      id="github"
                      href="https://github.com/TheLinc"
                      target="_blank"
                    >
                      <svg
                        className="social-svg"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>github</title>
                        <linearGradient
                          x1="0%"
                          y1="100%"
                          y2="0%"
                          id="simpleGithub"
                        >
                          <stop stopColor="#854FDE" offset="0%" />
                          <stop stopColor="#6469C4" offset="30%" />
                          <stop stopColor="#5236E9" offset="100%" />
                        </linearGradient>
                        <g
                          className="social-group"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <circle
                            className="social-group__outline"
                            stroke="#000"
                            strokeWidth="20"
                            cx="300"
                            cy="300"
                            r="262.5"
                          />
                          <circle
                            className="social-group__inner-circle social-group__inner-circle--github"
                            fill="url(#simpleGithub)"
                            cx="300"
                            cy="300"
                            r="252.5"
                          />
                          <path
                            className="social-group__icon"
                            d="M300 150c-82.8348 0-150 68.8393-150 153.817 0 67.9687 42.991 125.558 102.5893 145.9151 7.5 1.4063 10.2455-3.3482 10.2455-7.433 0-3.683-.134-13.3259-.2009-26.183-41.7187 9.308-50.558-20.625-50.558-20.625-6.8304-17.7456-16.6741-22.5-16.6741-22.5-13.5938-9.576 1.0044-9.375 1.0044-9.375 15.067 1.0714 22.9688 15.8705 22.9688 15.8705 13.3929 23.5045 35.0893 16.741 43.6607 12.7902 1.3393-9.9107 5.2232-16.741 9.509-20.558-33.2813-3.884-68.3036-17.076-68.3036-76.0045 0-16.808 5.8259-30.5357 15.4018-41.25-1.5402-3.884-6.6965-19.5536 1.4732-40.7143 0 0 12.5893-4.1518 41.25 15.7366 11.9866-3.4152 24.7768-5.0893 37.567-5.1562 12.7231.067 25.5803 1.741 37.5669 5.1562 28.6607-19.8884 41.183-15.7366 41.183-15.7366 8.1697 21.1607 3.0134 36.8304 1.4733 40.7143 9.5758 10.7812 15.4017 24.509 15.4017 41.25 0 59.0625-35.0892 72.0536-68.5044 75.8705 5.3571 4.7545 10.1785 14.1295 10.1785 28.4598 0 20.558-.2009 37.1652-.2009 42.1875 0 4.0849 2.6786 8.9063 10.3125 7.3661C407.076 429.308 450 371.7187 450 303.817 450 218.8393 382.8348 150 300 150z"
                            fill="#FFF"
                            fillRule="nonzero"
                          />
                        </g>
                      </svg>
                    </a>
                    <a
                      className="social-link social-link--linkedin contact-icon hidden"
                      id="linkedin"
                      href="https://www.linkedin.com/in/lincolnlaylor/"
                      target="_blank"
                    >
                      <svg
                        className="social-svg"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>linkedin</title>
                        <g
                          className="social-group"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <circle
                            className="social-group__outline"
                            stroke="#000"
                            strokeWidth="20"
                            cx="300"
                            cy="300"
                            r="262.5"
                          />
                          <circle
                            className="social-group__inner-circle"
                            fill="#2D76B0"
                            cx="300"
                            cy="300"
                            r="252.5"
                          />
                          <path
                            className="social-group__icon"
                            d="M278.9308 253.1923h43.5769v20.0539h.5923c6.0923-11.5077 20.9-23.6077 43.0692-23.6077 46.0308 0 54.577 30.2923 54.577 69.723v80.2154h-45.4385v-71.1615c0-17.0077-.2539-38.8385-23.6077-38.8385-23.6923 0-27.2462 18.5308-27.2462 37.5693v72.4307h-45.4384l-.0846-146.3846zm-74.1231 0h45.523V399.577h-45.523V253.1923zm22.8461-72.7692c14.5539 0 26.4 11.8461 26.4 26.4 0 14.5538-11.8461 26.4-26.4 26.4-14.6384 0-26.4-11.8462-26.4-26.4 0-14.5539 11.7616-26.4 26.4-26.4z"
                            fill="#000"
                            fillRule="nonzero"
                          />
                        </g>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
