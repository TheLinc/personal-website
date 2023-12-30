'use client';

import SkillCard from '../components/SkillCard';
import ProjectCard from '@/components/ProjectCard';
import { useEffect } from 'react';

// Web Development
const webDevelopmentSkills: Array<{ name: string; image: string }> = [
    { 
        name: 'React', 
        image: 'images/webDevSkills/react.png'
    },
    { 
        name: 'Angular', 
        image: 'images/webDevSkills/angular.png'
    },
    { 
        name: 'Node.js', 
        image: 'images/webDevSkills/node.png'
    },
    { 
        name: 'Bootstrap', 
        image: 'images/webDevSkills/bootstrap.png'
    },
    { 
        name: 'HTML/CSS', 
        image: 'images/webDevSkills/html.png'
    },
    { 
        name: 'JavaScript', 
        image: 'images/webDevSkills/js.png'
    },
    {
        name: 'TypeScript', 
        image: 'images/webDevSkills/ts.png'
    }
];

// Backend Development
const backendDevelopmentSkills: Array<{ name: string; image: string }> = [
    { 
        name: 'Python', 
        image: 'images/backendDevSkills/python.png'
    },
    { 
        name: 'Java', 
        image: 'images/backendDevSkills/java.png'
    },
    { 
        name: 'SQL', 
        image: 'images/backendDevSkills/sql.png'
    },
    { 
        name: 'C/C++', 
        image: 'images/backendDevSkills/c.png'
    },
];

// Cloud Services
const cloudServices: Array<{ name: string; image: string }> = [
    { 
        name: 'AWS', 
        image: 'images/cloudSkills/aws.png'
    },
    { 
        name: 'Firebase', 
        image: 'images/cloudSkills/firebase.png'
    },
];

// Containerization and Versioning
const containerizationAndVersioning: Array<{ name: string; image: string }> = [
    { 
        name: 'Docker', 
        image: 'images/containerizationSkills/docker.png'
    },
    { 
        name: 'Git', 
        image: 'images/containerizationSkills/git.png'
    },
];

// Design and Prototyping
const designAndPrototyping: Array<{ name: string; image: string }> = [
    { 
        name: 'Figma', 
        image: 'images/designSkills/figma.png'
    },
    { 
        name: 'Shopify', 
        image: 'images/designSkills/shopify.png'
    },
    { 
        name: 'Wix', 
        image: 'images/designSkills/wix.png'
    },
];

// Projects
const projects: Array<{ name: string; image: string; tags:string[]; desc: string; link: string }> = [
    { 
        name: 'Pipestream', 
        image: 'images/projects/play.png',
        tags: ['React', 'Node.js', 'Firebase', 'Git', 'API'],
        desc: 'Web-Application and Search Engine that allows users to find which streaming services have their favorite movies and TV shows. This project was constructed using React, Firebase Firestore, Firebase Hosting, and public APIs. Firestore caches users searches and movie data to reduce API calls and increase response time',
        link: 'https://www.pipestream.app'
    },
    { 
        name: 'Mask Detection Model', 
        image: 'images/projects/mask.png',
        tags: ['Machine Learning', 'Python', 'TensorFlow', 'Numpy', 'Keras', 'Sklearn', 'Git'],
        desc: 'Developed a machine learning model to detect if a person is wearing a mask. Implemented libraries such as Tensorflow, Sklearn, Numpy, and Pandas to create the model and demonstrate functionality. Used Keras to create model layers for deep learning',
        link: 'https://github.com/TheLinc/Mask_Detection_ML'
    },
    {
        name: 'NuViu - Smart Cane',
        image: 'images/projects/white-cane.png',
        tags: ['Arduino', '3D Printing', 'Git', 'XBee', 'Electrical Engineering', 'Machine Learning'],
        desc: 'Designed and developed a smart cane that uses ultrasonic sensors to detect obstacles and notify the user. Using a chest mounted camera, NVIDIA Jetson and ML the cane was able to read signs and relay the information to the user. The project was developed using Arduino and 3D printed parts.',
        link: ''
    },
    { 
        name: 'Sweetacular Cookies', 
        image: 'images/projects/cookie.png',
        tags: ['Wix', 'Research', 'Freelance'],
        desc: 'This project was developed for a clients small business. The client wanted a website that would allow customers to view their products and contact them for orders. The website was developed using Wix and was designed to be simple and easy to use. The website was also designed to be responsive and mobile friendly',
        link: 'https://www.sweetacularcookies.com/'
    }
]; 

const button = document.getElementById("button");
const arrow = document.getElementById("arrow");
const progress = document.getElementById("progress");
const check = document.getElementById("check");

// Time for the download animation itself
let loadingTime = 1000;
let blocked = false;

if(button && arrow && progress && check){
    button.addEventListener("click", () => {
        if(blocked) return;
        blocked = true;
        
        arrow.classList.add("animate-down");

        let percent = 0;
        let load = setInterval(() => {
            percent++;
            progress.style.height = percent + "%";
        }, loadingTime / 100);

        setTimeout(() => {
            clearInterval(load);

            setTimeout(() => {
            progress.classList.remove("bg-opacity-20");
            progress.classList.add("bg-opacity-0");
            check.classList.remove("w-0");
            check.classList.add("w-5");

            setTimeout(() => {
                check.classList.add("w-0");
                check.classList.remove("w-5");
                setTimeout(() => {
                reset();
                }, 1000);
            }, 1000);
            }, 500);
        }, loadingTime);
    });
}

function reset() {
    if (progress && arrow){
        progress.style.height = "0%";
        arrow.classList.remove("animate-down");

        setTimeout(() => {
            progress.classList.remove("bg-opacity-0");
            progress.classList.add("bg-opacity-20");
            blocked = false;
        }, 200)
    }
}
  
export default function Home() {
    return (
        <main>
            <div className='flex flex-col w-full h-full'>
                <div className='pl-2 pt-6 md:pl-16 md:pt-40 gap-5 max-w-[750px]'>
                    <div>
                        <h1 className='text-[50px] font-semibold'>
                            Hello, my name is Lincoln.
                            <div>
                                I am a
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 break-normal'>
                                    {" "}
                                    Software Developer
                                </span>
                            </div>
                        </h1>
                    </div>
                </div>
                <div className='pt-6 md:pt-40 gap-5'>
                    <section className='pl-2 pt-6 md:pl-10'>
                        <div className='section-header'>
                            About me
                        </div>
                        <div className='section-content text-base max-w-[750px] pl-2 pt-4'>
                            <div>
                                Hey there, I'm Lincoln, a software sorcerer armed with a 
                                computer engineering degree from the University of Ottawa. 
                                By day, I'm in the digital trenches, choreographing code that 
                                dances on the edge of technological brilliance.
                            </div>
                            <div className='pt-2'>
                                When I'm not conquering the binary ballroom, you'll catch me at the gym, 
                                lifting weights with the precision of a caffeinated cat on a keyboard. 
                                Rumor has it my biceps are as robust as my bug-fixing skills. Video games? 
                                I don't just play; I turn pixels into a symphony of victory. Boss battles? 
                                Child's play.
                            </div>
                            <div className='pt-2'>
                                But hold on, there's more! I'm not just a software savant; I'm a culinary conjurer. 
                                In the kitchen, I experiment with flavors like a mad scientist, turning mundane 
                                ingredients into culinary masterpieces. Forget about debugging; I'm busy debug-eating 
                                my latest gastronomic creations.
                            </div>
                            <div className='pt-2'>
                                In a world of 1s and 0s, I'm the hero you need—a software sorcerer by day and a culinary 
                                conqueror by night. Whether I'm crafting elegant code or a gourmet feast, I bring 
                                intelligence and humor to every endeavor. Cheers to the digital and culinary adventures ahead!
                            </div>
                        </div>
                    </section>
                    <section className='pl-2 pt-6 md:pl-10'>
                        <div className='section-header'>
                            Skills
                        </div>
                        <div className='flex flex-wrap flex-row'>
                            <div className='flex flex-wrap flex-col'>
                                <div className='bg-[#161B22] text-white rounded-xl max-w-[500px] m-2'>
                                    <div className='section-subheader'>
                                        Frontend Development
                                    </div>
                                    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-1'>
                                        {webDevelopmentSkills.map((skill, index) => (
                                            <SkillCard 
                                                key={index}
                                                name={skill.name} 
                                                image={skill.image} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className='bg-[#161B22] text-white rounded-xl max-w-[500px] m-2 lg:hidden'>
                                    <div className='section-subheader'>
                                        Backend Development
                                    </div>
                                    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1'>
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
                            <div className='flex flex-wrap flex-col hidden lg:flex'>
                                <div className='bg-[#161B22] text-white rounded-xl max-w-[500px] m-2'>
                                    <div className='section-subheader'>
                                        Backend Development
                                    </div>
                                    <div className='grid grid-cols-2 gap-1'>
                                        {backendDevelopmentSkills.map((skill, index) => (
                                            <SkillCard 
                                                key={index}
                                                name={skill.name} 
                                                image={skill.image} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className='bg-[#161B22] text-white rounded-xl max-w-[500px] m-2'>
                                    <div className='section-subheader'>
                                        Design & Prototyping
                                    </div>
                                    <div className='grid grid-cols-2 gap-1'>
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
                            <div className='flex flex-wrap flex-col'>
                                <div className='bg-[#161B22] text-white rounded-xl max-w-[325px] m-2'>
                                    <div className='section-subheader'>
                                        Cloud Services
                                    </div>
                                    <div className='grid grid-cols-2 gap-1'>
                                        {cloudServices.map((skill, index) => (
                                            <SkillCard 
                                                key={index}
                                                name={skill.name} 
                                                image={skill.image} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className='bg-[#161B22] text-white rounded-xl max-w-[325px] m-2'>
                                    <div className='section-subheader'>
                                        Containerization & Versioning
                                    </div>
                                    <div className='grid grid-cols-2 gap-1'>
                                        {containerizationAndVersioning.map((skill, index) => (
                                            <SkillCard 
                                                key={index}
                                                name={skill.name} 
                                                image={skill.image} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className='bg-[#161B22] text-white rounded-xl max-w-[325px] m-2 lg:hidden'>
                                    <div className='section-subheader'>
                                        Design & Prototyping
                                    </div>
                                    <div className='grid grid-cols-2 gap-1'>
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
                    <section className='mt-14 bg-cover bg-opacity-75' style={{backgroundImage: "url(images/project-background.png)"}}>
                        <div className='pl-2 pt-10 md:pl-10 project-section'>
                            <div className='section-header'>
                                Projects
                            </div>
                            <div className='pt-2 md:pt-8 justify-center'>
                                {projects.map((project, index) => (
                                    <ProjectCard 
                                        key={index}
                                        name={project.name}
                                        image={project.image} 
                                        tags={project.tags}
                                        desc={project.desc}
                                        link={project.link}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className='pl-2 pt-6 md:pl-10'>
                        <div className='section-header'>
                            Resume/CV
                        </div>
                        <div className='section-content'>
                            here is some resume content
                            {/* {JSON.stringify(mousePosition)} */}
                            <div className="w-screen h-screen bg-gray-700 flex justify-center items-center">
                                <button id="button" className="group rounded-md shadow bg-blue-500 text-white cursor-pointer flex justify-between items-center overflow-hidden transition-all hover:glow">
                                    <div className="relative w-12 h-12 bg-white bg-opacity-20 text-white flex justify-center items-center transition-all"><svg id="arrow" className="w-4 h-4 transition-all group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                    </svg>
                                    <svg id="check" className="absolute z-10 w-0 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <div id="progress" className="absolute w-full h-0 bg-white bg-opacity-20 top-0 duration-200"></div>
                                    </div>
                                    <p className="px-5">Files.zip</p>
                                </button>
                            </div>
                        </div>
                    </section>
                    <section className='pl-2 pt-6 md:pl-10'>
                        <div className='section-header'>
                            Contact
                        </div>
                        <div className='section-content'>
                            here is some contact content
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
