interface ProjectCardProps {
    image: string;
    name: string;
    tags: string[];
    desc: string;
    link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, name, tags, desc, link }) => {
    return (
        <div className='flex flex-col border border-gray-800 rounded-xl w-[350px] bg-black backdrop-blur bg-opacity-35 m-2 p-4'>
            <div className="flex items-center pt-4">
                <div className='inline-flex h-12 w-auto'>
                    <img className='m-w-full h-full' src={image} alt={name} />  
                </div>
                <div className="inline-flex text-white text-2xl pl-2">
                    <h3>{name}</h3>
                </div>
            </div>
            <div className='flex flex-col h-full'>
                <div className='p-2 pt-4 h-24'>
                    {tags.map((tag, index) => (
                        <div key={index} className='inline-block shadow-sm shadow-cyan-500 rounded-full m-1'>
                            <span className='pt-1 pb-1 pl-2 pr-2'>{tag}</span>
                        </div>
                    ))}
                </div>
                <div className='p-4 pt-2 section-content'>
                    <span>{desc}</span>
                </div>
                <div className='p-4 mt-auto'>
                    <button className='inline-block bg-gradient-to-r from-purple-500 to-cyan-500 border-0 rounded m-1 p-[1px]'>
                       <span className="flex w-full bg-gray-800 text-white rounded p-2">View Project</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;