import "./AboutMe.css";

// const AboutMeCard = () => {
//   return (
//     <div className="container border-gray-800 border-4">
//       <div className="pic">
//         <div className="pic-counter-wrapper">
//           <span className="dot" id="active"></span>
//           <span className="dot"></span>
//           <span className="dot"></span>
//           <span className="dot"></span>
//           <span className="dot"></span>
//         </div>
//         <div className="arrow-box">
//           <svg className="arrow" width="24" height="24" viewBox="0 0 24 24">
//             <path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"></path>
//           </svg>
//         </div>
//         <img className="h-full" src="images/about/profile-photo.png"/>
//       </div>
//       <div className="name-box">
//         <h2>
//           Lincoln, <span className="age"> 218</span>
//         </h2>
//         <p>13 miles away</p>
//         <svg className="dots-up" width="24" height="24" viewBox="0 0 24 24">
//           <path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z"></path>
//         </svg>
//         <svg className="arrow-up" width="24" height="24" viewBox="0 0 24 24">
//           <path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"></path>
//         </svg>
//       </div>
//       <div>
//         <p>
//           Hey there, I'm Lincoln, a software sorcerer armed with a
//           computer engineering degree from the University of Ottawa. By
//           day, I'm in the digital trenches, choreographing code that
//           dances on the edge of technological brilliance.
//         </p>
//       </div>
//       <div className="footer">
//         <button className="circle" id="circleone">
//           <svg className="back" width="24" height="24" viewBox="0 0 24 24">
//             <path d="M22,3H7C6.31,3 5.77,3.35 5.41,3.88L0,12L5.41,20.11C5.77,20.64 6.31,21 7,21H22A2,2 0 0,0 24,19V5A2,2 0 0,0 22,3M19,15.59L17.59,17L14,13.41L10.41,17L9,15.59L12.59,12L9,8.41L10.41,7L14,10.59L17.59,7L19,8.41L15.41,12"></path>
//           </svg>
//         </button>
//         <button className="circle" id="circletwo">
//           <svg className="star" width="24" height="24" viewBox="0 0 24 24">
//             <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
//           </svg>
//         </button>
//         <button className="circle" id="circlethree">
//           <svg className="heart" width="24" height="24" viewBox="0 0 24 24">
//             <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AboutMeCard;

import React, { useState } from 'react';
import './AboutMe.css';

const AboutMeCard = () => {
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: { currentTarget?: any; clientX?: any; clientY?: any; }) => {
    const card = e.currentTarget;
    const { offsetWidth: width, offsetHeight: height } = card;
    const { clientX: x, clientY: y } = e;

    const moveX = (x / width - 0.5) * 30;
    const moveY = (y / height - 0.5) * -30;

    setStyle({
      transform: `rotateY(${moveX}deg) rotateX(${moveY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'rotateY(0deg) rotateX(0deg)',
    });
  };

  return (
    <div className="about-me">
      <div
        className="card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
      >
        <div className="card-content">
          <div className="card-front">
            <img src="images/about/profile-photo.png" alt="Your Photo" />
            <h2>Lincoln</h2>
            <p>Software Developer</p>
          </div>
          <div className="card-back">
            <h2>About Me</h2>
            <p>
              Hi, I'm [Your Name], a passionate software developer specializing in [Your Specialty]. I love creating interactive and engaging web experiences.
            </p>
            <p>Skills: JavaScript, Python, React, CSS, HTML</p>
            <p>Experience: 5+ years in the industry</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMeCard;

