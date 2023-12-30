interface ExperienceCardProps {
    image: string;
    name: string;
    title: string;
    pos: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ image, name, title, pos }) => {
    return (
        pos.includes('left') ? (
            <div className="flex flex-row-reverse md:contents">
                <div className="flex bg-gray-800 col-start-1 col-end-5 p-4 rounded-xl my-4 mr-auto md:ml-auto md:mr-0 shadow-md">
                    <div className="inline-flex items-center pr-4">
                        <img className="w-12" src={image} alt={name}/>
                    </div>
                    <div className='inline-flex flex-col'>
                        <h3 className="font-semibold text-lg mb-1">{name}</h3>
                        <p className="leading-tight text-justify">
                            {title}
                        </p>  
                    </div>
                </div>
                <div className="col-start-5 col-end-6 md:mx-auto relative mr-10">
                    <div className="h-full w-6 flex items-center justify-center">
                        <div className="h-full w-1 bg-[#161B22] pointer-events-none"></div>
                    </div>
                    <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-gray-800 shadow"></div>
                </div>
            </div>
        ):(
        <div className="flex md:contents">
            <div className="col-start-5 col-end-6 mr-10 md:mx-auto relative">
                <div className="h-full w-6 flex items-center justify-center">
                    <div className="h-full w-1 bg-[#161B22] pointer-events-none"></div>
                </div>
                <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-gray-800 shadow"></div>
            </div>
            <div className="flex bg-gray-800 col-start-6 col-end-10 p-4 rounded-xl my-4 mr-auto shadow-md">
                <div className="inline-flex items-center pr-4">
                    <img className="w-12" src={image} alt={name}/>
                </div>
                <div className='inline-flex flex-col'>
                    <h3 className="font-semibold text-lg mb-1">{name}</h3>
                    <p className="leading-tight text-justify">
                        {title}
                    </p>  
                </div>
            </div>
        </div>
        )
    );
};

export default ExperienceCard;