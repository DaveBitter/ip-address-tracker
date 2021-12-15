// Libs
import { NavLink, Outlet } from "remix";

// Utils

// Components

// Asset links
export const links = () => [
    {
        rel: "preload",
        href: "/img/icons/pin.svg",
        as: "image",
        type: "image/svg+xml"
    },
    {
        rel: "preload",
        href: "/img/streets-pattern.png",
        as: "image",
        type: "image/png"
    }
];

// Component
const About = () => {
    return <div className='flex flex-col lg:flex-row justify-stretch items-center w-full lg:min-h-screen'>
        <aside className='bg-gray-200 w-full lg:h-screen lg:w-64 bg-[url("/img/streets-pattern.png")] lg:bg-[url("/img/streets-pattern-vertical.png")] bg-no-repeat bg-cover'>
            <nav>
                <ul className='flex gap-4 lg:gap-2 lg:flex-col p-4'>
                    <li>
                        <NavLink className='text-white text-md lg:text-lg font-bold' to='/' prefetch='intent'>IP Address Tracker</NavLink>
                    </li>
                    <li>
                        <NavLink className='text-white text-md lg:text-lg font-bold' to='/about' prefetch='intent'>About</NavLink>
                        <ul className='flex lg:flex-col gap-2 pt-2'>
                            <li>
                                <NavLink className={({ isActive }) => `lg:ml-4 text-white text-sm lg:text-md font-medium ${isActive && 'border-solid border-b-2 border-white'}`} to='remix' prefetch='intent'>Remix</NavLink>
                            </li>
                            <li>
                                <NavLink className={({ isActive }) => `lg:ml-4 text-white text-sm lg:text-md font-medium ${isActive && 'border-solid border-b-2 border-white'}`} to='this-project' prefetch='intent'>This project</NavLink>
                            </li>
                            <li>
                                <NavLink className={({ isActive }) => `lg:ml-4 text-white text-sm lg:text-md font-medium ${isActive && 'border-solid border-b-2 border-white'}`} to='me' prefetch='intent'>Me</NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </aside>
        <main className='w-full max-w-2xl min-h-screen p-4 lg:py-8 mx-auto'>
            <Outlet />
        </main>
    </div>;
};

export default About;