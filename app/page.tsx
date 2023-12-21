import Image from 'next/image'
import { Comic_Neue } from 'next/font/google';

const comicNeue = Comic_Neue({
  weight: "700",
  subsets: ["latin"]
});

export default function Home() {
  return (
    <main className='w-screen h-screen relative'>
      <div className='flex items-center w-full h-full'>
        <div className='pl-20 md:pl-40 pb-56 sm:pb-20 flex flex-col gap-5 z-[10] max-w-[750px]'>
              <h1 className='text-[50px] text-black font-semibold'>
                Hello, my name is  
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500'>
                  {" "}
                  Lincoln Laylor
                </span>
              </h1>
              <p className='text-gray-200 hidden md:block'>
                and this is my personal website
              </p>
        </div> 
      </div>
    </main>
  )
}
