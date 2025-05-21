import "./ProjectCard.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IProject } from "@/app/page";
import Image from "next/image";

const ProjectCard: React.FC<IProject> = ({
  image,
  name,
  tags,
  desc,
  link,
  imageHeight,
  imageWidth,
  images,
  inDev = false,
}) => {
  return (
    <div className="rounded-md overflow-hidden grid grid-cols-1 sm:grid-cols-2 gap-1 h-full w-full bg-zinc-200/30 dark:bg-gray-800/30 transition backdrop-blur-xl p-4 text-left project z-100">
      <div>
        <div className="flex items-center px-4">
          <div className="inline-flex h-12 w-auto">
            <img className="m-w-full h-full" src={image} alt={name} />
          </div>
          <div className="inline-flex text-zinc-900 dark:text-zinc-100 text-2xl pl-2">
            <h3>{name}</h3>
          </div>
        </div>
        <div className="flex flex-col h-full">
          {tags && tags.length > 0 && (
            <div className="p-2 pt-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-800 text-white rounded pl-2 pr-2 m-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="p-4 pb-2 pt-2 text-zinc-800 dark:text-zinc-400">
            <span>{desc}</span>
          </div>
          <div className="py-4">
            {link &&
              (link.includes("github") ? (
                <button className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 border-0 rounded m-1 p-[1px] transition ease-in-out hover:-translate-y-1">
                  <span className="flex w-full bg-gray-800 text-white rounded p-2">
                    View Project
                    <div className="inline-block pl-2 h-6">
                      <img
                        className="h-full w-full"
                        src="/images/projects/github.png"
                        alt="github"
                      />
                    </div>
                  </span>
                </button>
              ) : (
                <button className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 border-0 rounded m-1 p-[1px] transition ease-in-out hover:-translate-y-1">
                  <div className="flex w-full bg-gray-800 text-white rounded p-2">
                    View Project
                    <div className="inline-block pl-2 h-6">
                      <img
                        className="h-full w-full"
                        src="/images/projects/website.png"
                        alt="github"
                      />
                    </div>
                  </div>
                </button>
              ))}
          </div>
          {inDev && (
            <div>
              <span className="inline-block bg-red-500 text-white rounded pl-2 pr-2 m-1 rounded-full">
                In Development
              </span>
            </div>
          )}
        </div>
      </div>
      {images && images.length > 0 && (
        <div className="mx-5 justify-center align-center my-auto">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className={`mySwiper max-w-[${imageWidth}px] max-h-[${imageHeight}px]`}
          >
            {images.map((image, index) => (
              <SwiperSlide
                key={index}
                className="mt-5 mb-10 rounded-xl overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`image ${index}`}
                  width={imageWidth}
                  height={imageHeight}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
