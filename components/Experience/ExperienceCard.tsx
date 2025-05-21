import { useRef, useState } from "react";
import "./ExperienceCard.css";

interface ExperienceCardProps {
  image: string;
  name: string;
  title: string;
  desc: string[];
  size?: string;
  pos: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  image,
  name,
  title,
  desc,
  size = "s",
  pos,
}) => {
  const toggleDescription = () => {
    var card = document.getElementById(name) as HTMLElement;
    var plusIcon = document.getElementById(`${name}-plus`) as HTMLElement;
    var minusIcon = document.getElementById(`${name}-minus`) as HTMLElement;

    if (!card.classList.contains("experience-card-active")) {
      card.classList.add("experience-card-active");
      minusIcon.classList.remove("hidden");
      plusIcon.classList.add("hidden");
    } else {
      card.classList.remove("experience-card-active");
      minusIcon.classList.add("hidden");
      plusIcon.classList.remove("hidden");
    }
  };

  return pos.includes("left") ? (
    <div className="flex flex-row-reverse md:contents">
      <div
        id={name}
        className={`bg-white dark:bg-gray-800 col-start-1 col-end-5 p-4 rounded-xl my-4 mr-auto md:ml-auto md:mr-0 shadow-md experience-card border-gray-200 dark:border-zinc-700 ${
          size === "l" ? "experience-card--large" : ""
        }`}
        onClick={toggleDescription}
      >
        <div className="flex">
          <div className="inline-flex items-center pr-4">
            <img className="w-12" src={image} alt={name} />
          </div>
          <div className="inline-flex flex-col flex-grow">
            <h3 className="font-semibold text-lg mb-1 text-zinc-900 dark:text-zinc-100">
              {name}
            </h3>
            <div className="text-justify text-zinc-600 dark:text-zinc-400 p-0 text-sm">
              {title}
            </div>
          </div>
          <div
            id={`${name}-plus`}
            className="inline-flex items-center p-2 text-purple-500 hover:text-cyan-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <div
            id={`${name}-minus`}
            className="inline-flex items-center p-2 hidden text-cyan-500 hover:text-purple-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </div>
        <div id={`${name}-desc`} className="p-4">
          <ul className="list-disc">
            {desc.map((item, index) => (
              <li key={index} className="text-[#8b949e] p-0 pb-1 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-start-5 col-end-6 md:mx-auto relative mr-10">
        <div className="h-full w-6 flex items-center justify-center">
          <div className="h-full w-1 bg-zinc-100 dark:bg-gray-800 pointer-events-none"></div>
        </div>
        <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-zinc-100 dark:bg-gray-800 shadow"></div>
      </div>
    </div>
  ) : (
    <div className="flex md:contents">
      <div className="col-start-5 col-end-6 mr-10 md:mx-auto relative">
        <div className="h-full w-6 flex items-center justify-center">
          <div className="h-full w-1 bg-zinc-100 dark:bg-gray-800 pointer-events-none"></div>
        </div>
        <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-zinc-100 dark:bg-gray-800 shadow"></div>
      </div>
      <div
        id={name}
        className={`bg-white dark:bg-gray-800 col-start-6 col-end-10 p-4 rounded-xl my-4 mr-auto shadow-md experience-card border-gray-200 dark:border-zinc-700 ${
          size === "l" ? "experience-card--large" : ""
        }`}
        onClick={toggleDescription}
      >
        <div className="flex">
          <div className="inline-flex items-center pr-4">
            <img className="w-12" src={image} alt={name} />
          </div>
          <div className="inline-flex flex-col flex-grow">
            <div className="inline-flex flex-col flex-grow">
              <h3 className="font-semibold text-lg mb-1 text-zinc-900 dark:text-zinc-100">
                {name}
              </h3>
              <div className="text-justify text-zinc-600 dark:text-zinc-400 p-0 text-sm">
                {title}
              </div>
            </div>
          </div>

          <div
            id={`${name}-plus`}
            className="inline-flex items-center p-2 text-purple-500 hover:text-cyan-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          <div
            id={`${name}-minus`}
            className="inline-flex items-center p-2 hidden text-cyan-500 hover:text-purple-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </div>

        <div id={`${name}-desc`} className="p-4">
          <ul className="list-disc">
            {desc.map((item, index) => (
              <li key={index} className="text-[#8b949e] p-0 pb-1 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
