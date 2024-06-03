import React from 'react';
import "./SkillCard.css";


interface SkillCardProps {
    image: string;
    name: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ image, name }) => {
    return (
        <div className='flex flex-col content-center justify-center items-center inline-block rounded-xl h-36 w-36 bg-[#202328] m-2 skill-item'>
            <div className='h-16 w-auto relative'>
                <img className='m-w-full h-full' src={image} alt={name} />  
            </div>
            <h3 className='pt-2 relative'>{name}</h3>
        </div>
    );
};

export default SkillCard;
