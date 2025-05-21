import React from "react";
import "./SkillCard.css";
import Image from "next/image";

interface SkillCardProps {
  image: string;
  name: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ image, name }) => {
  return (
    <div className="flex flex-col content-center justify-center items-center inline-flex rounded-xl h-34 w-34 bg-zinc-100 dark:bg-zinc-900 m-2 skill-item text-zinc-600 dark:text-zinc-400">
      <div className="h-16 w-16 flex items-center justify-self-center relative">
        <Image
          src={image}
          alt={name}
          width={64}
          height={64}
          className="object-contain h-full w-full "
        />
      </div>
      <h3 className="pt-2 justify-self-center relative">{name}</h3>
    </div>
  );
};

export default SkillCard;
