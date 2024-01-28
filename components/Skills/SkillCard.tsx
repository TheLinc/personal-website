import React from 'react';
import "./SkillCard.css";


interface SkillCardProps {
    image: string;
    name: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ image, name }) => {
    return (
        <div className='flex flex-col content-center justify-center items-center border border-gray-800 inline-block rounded-xl h-36 w-36 bg-gray-800 m-2 skill-item'>
            <div className='h-16 w-auto'>
                <img className='m-w-full h-full' src={image} alt={name} />  
            </div>
            <h3 className='pt-2'>{name}</h3>
        </div>
    );
};

export default SkillCard;
