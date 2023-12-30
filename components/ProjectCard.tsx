interface ProjectCardProps {
    image: string;
    name: string;
    tags: string[];
    desc: string;
    link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, name, tags, desc, link }) => {
    return (
        <div className='inline-flex flex-col border border-gray-800 rounded-xl w-[350px] bg-black backdrop-blur bg-opacity-35 m-2 p-4 h-[550px]'>
            <div className="flex items-center pt-4">
                <div className='inline-flex h-12 w-auto'>
                    <img className='m-w-full h-full' src={image} alt={name} />  
                </div>
                <div className="inline-flex text-white text-2xl pl-2">
                    <h3>{name}</h3>
                </div>
            </div>
            <div className='flex flex-col h-full'>
                <div className='p-2 pt-4 h-[115px]'>
                    {tags.map((tag, index) => (
                        <div key={index} className='inline-block bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full m-1 p-[1px]'>
                            <span className='flex bg-gray-800 text-white rounded pl-2 pr-2 rounded-full'>{tag}</span>
                        </div>
                    ))}
                </div>
                <div className='p-4 pb-2 pt-2 section-content'>
                    <span>{desc}</span>
                </div>
                <div className='p-4 mt-auto'>
                    {link && (
                        link.includes("github") ? (
                            <button className='inline-block bg-gradient-to-r from-purple-500 to-cyan-500 border-0 rounded m-1 p-[1px] hover:brightness-125'>
                                <span className="flex w-full bg-gray-800 text-white rounded p-2">
                                    View Project
                                    <div className='inline-block pl-2 h-6'>
                                        <img className='h-full w-full' src='/images/projects/github.png' alt='github'/>
                                    </div>
                                </span>
                            </button>
                        ) : (
                            <button className='inline-block bg-gradient-to-r from-purple-500 to-cyan-500 border-0 rounded m-1 p-[1px] hover:brightness-125'>
                                <div className="flex w-full bg-gray-800 text-white rounded p-2">
                                    View Project
                                    <div className='inline-block pl-2 h-6'>
                                        <img className='h-full w-full' src='/images/projects/website.png' alt='github'/>
                                    </div>
                                </div>
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;