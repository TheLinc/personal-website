"use client";

import ExperienceCard from "@/components/Experience/ExperienceCard";
import SkillCard from "@/components/Skills/SkillCard";
import ProjectCard from "@/components/Project/ProjectCard";
import TypingAnimation from "@/components/TypingAnimation/TypingAnimation";

import "@/css/socials.css";
import LayoutCard from "@/components/LayoutCard/LayoutCard";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import DownArrowIcon from "@/public/images/general/DownArrowIcon";
import Image from "next/image";
import LinkedInIcon from "@/public/images/social/LinkedInIcon";
import GithubIcon from "@/public/images/social/GithubIcon";
import EmailIcon from "@/public/images/social/EmailIcon";

// Web Development
const webDevelopmentSkills: Array<{ name: string; image: string }> = [
  {
    name: "React",
    image: "/images/webDevSkills/react.png",
  },
  {
    name: "Next.js",
    image: "/images/webDevSkills/nextjs.png",
  },
  {
    name: "Angular",
    image: "/images/webDevSkills/angular.png",
  },
  {
    name: "Node.js",
    image: "/images/webDevSkills/node.png",
  },
  {
    name: "JavaScript",
    image: "/images/webDevSkills/js.png",
  },
  {
    name: "TypeScript",
    image: "/images/webDevSkills/ts.png",
  },
  {
    name: "Expo",
    image: "/images/webDevSkills/expo.png",
  },
  {
    name: "Bootstrap",
    image: "/images/webDevSkills/bootstrap.png",
  },
  {
    name: "TailwindCSS",
    image: "/images/webDevSkills/tailwind.png",
  },
  {
    name: "HTML/CSS",
    image: "/images/webDevSkills/html.png",
  },
];

// Backend Development
const backendDevelopmentSkills: Array<{ name: string; image: string }> = [
  {
    name: "Python",
    image: "/images/backendDevSkills/python.png",
  },
  {
    name: "SQL",
    image: "/images/backendDevSkills/sql.png",
  },
  {
    name: "Symfony",
    image: "/images/backendDevSkills/symfony.png",
  },
];

// Cloud Services
const cloudServices: Array<{ name: string; image: string }> = [
  {
    name: "AWS",
    image: "/images/cloudSkills/aws.png",
  },
  {
    name: "Firebase",
    image: "/images/cloudSkills/firebase.png",
  },
  {
    name: "Supabase",
    image: "/images/cloudSkills/supabase.png",
  },
];

// Containerization and Versioning
const containerizationAndVersioning: Array<{ name: string; image: string }> = [
  {
    name: "Docker",
    image: "/images/containerizationSkills/docker.png",
  },
  {
    name: "Git",
    image: "/images/containerizationSkills/git.png",
  },
];

// Design and Prototyping
const designAndPrototyping: Array<{ name: string; image: string }> = [
  {
    name: "Figma",
    image: "/images/designSkills/figma.png",
  },
  {
    name: "Shopify",
    image: "/images/designSkills/shopify.png",
  },
  {
    name: "Wix",
    image: "/images/designSkills/wix.png",
  },
];

export interface IProject {
  name: string;
  image: string;
  tags: string[];
  desc: string;
  link?: string;
  imageWidth?: number;
  imageHeight?: number;
  images?: string[];
  inDev?: boolean;
}

// Projects
const projects: Array<IProject> = [
  {
    name: "Spotlight",
    image: "/images/projects/spotlightV1/spotlight-logo.png",
    tags: ["React Native", "Expo", "Firebase", "Supabase", "Git"],
    desc: "Mobile App combining YouTube and Netflix features, enabling content creators to upload and organize amateur content into structured shows. Built with React Native, Firebase, Supabase, Expo, and React Native Paper.",
    imageWidth: 234,
    imageHeight: 506,
    images: [
      "/images/projects/spotlightV1/spotlight1.png",
      "/images/projects/spotlightV1/spotlight2.png",
      "/images/projects/spotlightV1/spotlight3.png",
      "/images/projects/spotlightV1/spotlight4.png",
      "/images/projects/spotlightV1/spotlight5.png",
      "/images/projects/spotlightV1/spotlight6.png",
      "/images/projects/spotlightV1/spotlight7.png",
      "/images/projects/spotlightV1/spotlight8.png",
      "/images/projects/spotlightV1/spotlight9.png",
    ],
    inDev: true,
  },
  {
    name: "Pipestream",
    image: "/images/projects/pipestream/play.png",
    tags: ["React", "Node.js", "Firebase", "Git", "API"],
    desc: "Web-Application and Search Engine that allows users to find which streaming services have their favorite movies and TV shows. This project was constructed using React, Firebase Firestore, Firebase Hosting, and public APIs. Firestore caches users searches and movie data to reduce API calls and increase response time.",
    link: "https://www.pipestream.app",
    imageWidth: 1000,
    imageHeight: 500,
    images: [
      "/images/projects/pipestream/pipestream1.png",
      "/images/projects/pipestream/pipestream2.png",
      "/images/projects/pipestream/pipestream3.png",
    ],
  },
  {
    name: "Mask Detection Model",
    image: "/images/projects/maskDetection/mask.png",
    tags: [
      "Machine Learning",
      "Python",
      "TensorFlow",
      "Numpy",
      "Keras",
      "Sklearn",
      "Git",
    ],
    desc: "Developed a machine learning model to detect if a person is wearing a mask. Implemented libraries such as Tensorflow, Sklearn, Numpy, and Pandas to create the model and demonstrate functionality. Used Keras to create model layers for deep learning.",
    link: "https://github.com/TheLinc/Mask_Detection_ML",
    imageWidth: 1000,
    imageHeight: 500,
    images: ["/images/projects/maskDetection/maskDetection1.png"],
  },
  {
    name: "NuViu - Smart Cane",
    image: "/images/projects/white-cane.png",
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
    image: "/images/projects/sweetacularcookies/sweetacularcookies-logo.png",
    tags: ["Wix", "Research", "Freelance"],
    desc: "Developed a clean, responsive website for a small business client to showcase their products and streamline customer inquiries. Built using Wix, the site focuses on simplicity and ease of use, ensuring a smooth experience across both desktop and mobile devices. The project helped the client establish a professional online presence and made it easier for customers to connect and place orders.",
    link: "https://www.sweetacularcookies.com/",
    imageHeight: 917,
    imageWidth: 1834,
    images: [
      "/images/projects/sweetacularcookies/sweetacularcookies1.png",
      "/images/projects/sweetacularcookies/sweetacularcookies2.png",
    ],
  },
];

const experience: Array<{
  image: string;
  name: string;
  title: string;
  desc: string[];
  size?: string;
  pos: string;
}> = [
  {
    image: "/images/experience/os.png",
    name: "Opinion System",
    title: "Software Developer",
    desc: [
      "Implemented a responsive design overhaul with Next.js and Material UI, leading to marked gains in accessibility and user satisfaction.",
      "Led the redevelopment of web tools using PHP and JavaScript, enhancing front-end scalability and boosting overall system performance.",
      "Oversaw mobile development for a new animation feature in React Native, ensuring task management and clear communication to meet quality standards.",
      "Played a crucial role in overhauling back-end infrastructure with MySQL and Symfony, optimizing database interactions for improved efficiency.",
      "Fostered a team-oriented environment, promoting open communication and collaboration to drive project success and enhance user experience.",
      "Developed chrome extension that utilizes the GitLab API to provide our team with custom GitLab actions",
    ],
    pos: "left",
  },
  {
    image: "/images/experience/GBatteries.png",
    name: "GBatteries",
    title: "Full Stack Developer",
    desc: [
      "Developed Python app to simulate hardware, enhancing testing efficiency and reducing errors.",
      "Created and deployed Docker containers on Amazon ECS, streamlining software distribution.",
      "Built PyPI library to simplify code reuse, boosting developer productivity and code quality.",
      "Implemented socket servers for data collection, improving analytics with richer data points.",
    ],
    pos: "right",
  },
  {
    image: "/images/experience/trading-central.png",
    name: "Trading Central",
    title: "Software Developer",
    desc: [
      "Engineered React.js front-end for stock analysis apps, enhancing user interaction and data display.",
      "Built Angular components for new web app, mastering SVGs and improving design integration.",
      "Collaborated on API integration, ensuring seamless data flow and user experience.",
      "Utilized Figma designs to create responsive layouts, boosting application accessibility.",
      "Enhanced front-end functionality, contributing to overall project success and user satisfaction.",
    ],
    pos: "left",
  },
  {
    image: "/images/experience/cra.png",
    name: "Canada Revenue Agency (CRA)",
    title: "IT Analyst & Developer",
    desc: [
      "Led research to improve the organization's approach to interacting with testing data, introducing a more efficient and effective methodology.",
      "Established connections with diverse companies, engaging in meaningful discussions about their products and solutions to maintain industry best practices.",
      "Conducted extensive research on advanced data masking/obfuscation techniques, data fabrication, and data security, contributing valuable insights to enhance the organization's data protection strategies.",
      "Developed and implemented automated testing scripts specifically tailored for the organization's custom Jira features, utilizing UFT to streamline and optimize testing processes.",
    ],
    size: "l",
    pos: "right",
  },
];

export default function Home() {
  return (
    <main>
      <div className="flex flex-col w-full h-full items-center">
        <div className="self-end">
          <ThemeToggle />
        </div>
        <div className="flex flex-row items-center w-full h-screen gap-5">
          <div className="h-full md:h-auto flex flex-col items-center w-full animate-fade-up animate-delay-1000">
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
            <div className="gap-5 max-w-[750px] pl-4">
              <h1 className="h-[460px] md:h-auto text-[50px] font-semibold">
                Hello, my name is Lincoln.
                <div>
                  <div className="inline-block h-[85px] mr-[14px]">I am a </div>
                  <div className="inline-block h-[85px] ">
                    {" "}
                    <TypingAnimation />
                  </div>
                </div>
              </h1>
            </div>
            <a
              className="mt-5 md:mt-50 arrow-down w-5 h-5 fill-purple-500 hover:fill-cyan-500 dark:fill-indigo-400 dark:hover:fill-cyan-500"
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                const aboutSection = document.querySelector("#about");
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <DownArrowIcon className="w-10 h-10 " />
            </a>
          </div>
        </div>
        <div className="pt-6 md:pt-8 gap-5 flex flex-col items-center w-full">
          <section
            className="pl-2 pr-2 my-6 md:pl-10 md:pr-10 w-full max-w-[1200px]"
            id="about"
          >
            <div className="py-4 section-header text-center sm:text-left">
              About me
            </div>
            <div className="flex flex-col-reverse md:flex-row items-center gap-5">
              <div className="max-w-150 text-justify text-zinc-600 dark:text-zinc-400 py-2 px-4 text-lg">
                Hey, I&#39;m Lincoln — a full stack developer with a passion for
                building thoughtful, user-focused software. With 4 years of
                hands-on experience, I&#39;ve worked across the stack using
                tools like React, Next.js, PHP, and AWS to deliver fast,
                accessible, and scalable applications. Right now, I&#39;m
                focused on{" "}
                <span className="font-semibold italic">Spotlight</span>
                {" — "}a mobile app that blends the best of YouTube and Netflix
                to help creators organize and share content like full-on shows.
                It&#39;s been a fun challenge in React Native, Firebase, and
                Supabase! I&#39;m always diving into new technologies and best
                practices, whether it&#39;s experimenting with performance
                optimization, fine-tuning accessibility, or just trying out a
                new framework on the weekend. I love learning, building, and
                turning good ideas into real, working products.
                <br />
                <span className="font-bold">#PoweredByCoffee </span>
                <span role="img" aria-label="coffee">
                  ☕
                </span>
              </div>
              <div></div>
              <Image
                src={"/images/about/action-figure.png"}
                alt="lincoln action figure"
                className="w-80 shadow-md rounded-lg my-2"
                width={1024}
                height={1536}
              />
            </div>
          </section>
          <section className="w-full p-2 my-6 text-center sm:text-left lg:pt-0 md:pl-10 skill-section max-w-[1200px]">
            <div className="section-header">Skills</div>
            <div className="px-2 pt-4 pb-6 text-zinc-600 dark:text-zinc-400 text-lg">
              Here&#39;s a quick look at the skills and technologies I work with
              most often. I&#39;m always learning, so this list might be
              slightly out of date by the time you see it!
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[5px] md:max-w-[700px] lg:max-w-full ">
              <div className="flex flex-wrap flex-col items-center">
                <LayoutCard
                  header="Frontend Development"
                  className="w-[325px] justify-self-center"
                >
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-1">
                    {webDevelopmentSkills.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </LayoutCard>
                {/* Displayed on md screen, hidden on lg */}
                <LayoutCard
                  header="Cloud Services"
                  className="w-[325px] lg:hidden"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {cloudServices.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </LayoutCard>
              </div>
              <div className="flex flex-wrap flex-col lg:flex items-center">
                <LayoutCard header="Backend Development" className="w-[325px]">
                  <div className="grid grid-cols-2 gap-1">
                    {backendDevelopmentSkills.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </LayoutCard>
                <LayoutCard header="Design & Prototyping" className="w-[325px]">
                  <div className="grid grid-cols-2 gap-1">
                    {designAndPrototyping.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </LayoutCard>

                {/* Displayed on md screen, hidden on lg */}
                <LayoutCard
                  header="Containerization & Versioning"
                  className="w-[325px] lg:hidden"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {containerizationAndVersioning.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </LayoutCard>
              </div>
              <div className="flex flex-wrap flex-col">
                {/* Displayed on lg screen, hidden on md */}
                <LayoutCard
                  header="Cloud Services"
                  className="w-[325px] hidden lg:flex"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {cloudServices.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </LayoutCard>

                {/* Displayed on lg screen, hidden on md */}
                <LayoutCard
                  header="Containerization & Versioning"
                  className="w-[325px] hidden lg:flex"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {containerizationAndVersioning.map((skill, index) => (
                      <SkillCard
                        key={index}
                        name={skill.name}
                        image={skill.image}
                      />
                    ))}
                  </div>
                </LayoutCard>
              </div>
            </div>
          </section>
          <section className="p-2 my-6 md:pl-10 w-full max-w-[1200px]">
            <div className="section-header text-center sm:text-left">
              Experience
            </div>
            <div className="section-content section-header text-center sm:text-left">
              <div className="flex flex-col md:grid grid-cols-9 mx-auto p-2 pt-10 text-blue-50 items-center ">
                {experience.map((experience, index) => (
                  <ExperienceCard
                    key={index}
                    image={experience.image}
                    name={experience.name}
                    title={experience.title}
                    desc={experience.desc}
                    size={experience.size}
                    pos={experience.pos}
                  />
                ))}
              </div>
            </div>
          </section>
          <section className="items-center my-6 px-4 pt-10 project-section relative overflow-visible max-w-[1200px] w-full">
            <div className="section-header text-center sm:text-left">
              Personal Projects
            </div>
            <div className="p-2 text-center md:text-left text-zinc-600 dark:text-zinc-400 text-lg">
              Here are some of my personal projects! Shuffle{" "}
              <span role="img" aria-label="swipe">
                👉
              </span>{" "}
              through the photos if you want to see more{" "}
            </div>
            <div className="flex flex-col gap-5 mt-5 mb-10">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  image={project.image}
                  name={project.name}
                  tags={project.tags}
                  desc={project.desc}
                  link={project.link}
                  imageHeight={project.imageHeight}
                  imageWidth={project.imageWidth}
                  images={project.images}
                  inDev={project.inDev}
                />
              ))}
            </div>
            <Image
              width={600}
              height={350}
              alt="project-shape-2"
              src="/images/projects/design/project-shape-2.webp"
              className="design-shape-2 w-[600px] h-[350px] aspect-auto"
            />
            <Image
              width={706}
              height={338}
              alt="project-shape-1"
              src="/images/projects/design/project-shape-1.webp"
              className="design-shape-1 w-[706px] h-[338px] aspect-auto"
            />
          </section>
          <section className="p-4 my-10 contact-section w-full z-10 bg-zinc-50 dark:bg-gray-900 flex justify-center">
            <div className="max-w-[1200px] w-full align-center justify-center py-4">
              <div className="section-header">Contact Me</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 section-content">
                <div className="p-2 inline-flex flex-col max-w-[500px]">
                  Let’s build something cool 👨‍💻🚀 Whether you’ve got a big idea,
                  need a fresh set of eyes on a project, or just want to chat
                  dev stuff—drop me a line! I’m always up for collaborating on
                  meaningful tech that makes life better. Reach out anytime 📬
                </div>
                <div className="p-2 inline-flex justify-around items-center">
                  <a
                    className=""
                    id="email"
                    href="mailto:lincolnlaylor@gmail.com"
                  >
                    <EmailIcon className="w-15 h-15 fill-purple-500 hover:fill-cyan-500 dark:fill-indigo-400 dark:hover:fill-cyan-500" />
                  </a>
                  <a
                    className="social-link social-link--github contact-icon"
                    id="github"
                    href="https://github.com/TheLinc"
                    target="_blank"
                  >
                    <GithubIcon className="w-15 h-15 fill-purple-500 hover:fill-cyan-500 dark:fill-indigo-400 dark:hover:fill-cyan-500" />
                  </a>
                  <a
                    className="social-link social-link--linkedin contact-icon"
                    id="linkedin"
                    href="https://www.linkedin.com/in/lincolnlaylor/"
                    target="_blank"
                  >
                    <LinkedInIcon className="w-15 h-15 fill-purple-500 hover:fill-cyan-500 dark:fill-indigo-400 dark:hover:fill-cyan-500" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <footer>
        <div className="flex flex-col items-center justify-center w-full h-20 bg-zinc-50 dark:bg-gray-900">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            © 2023 Lincoln Laylor. All rights reserved.
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Built with Next.js, Tailwind CSS, and a sprinkle of magic ✨
          </div>
        </div>
      </footer>
    </main>
  );
}
