// Libs
import { MetaFunction, Outlet } from 'remix';

// Utils

// Components
import SideNav, { SideNavLinkType } from '~/components/SideNav/SideNav';

// Asset links
export const links = () => [
    {
        rel: 'preload',
        href: '/img/streets-pattern.png',
        as: 'image',
        type: 'image/png'
    }
];

export const meta: MetaFunction = () => {
    return {
        title: 'IP Address Tracker | About'
    };
};

const SideNavLinks: Array<SideNavLinkType> = [
    { label: 'IP Address Tracker', to: '/' },
    {
        label: 'About', to: '/about', subLinks: [
            { label: 'This project', to: '/about/this-project' },
            { label: 'Remix', to: '/about/remix' },
            { label: 'Me', to: '/about/me' }
        ]
    }
]

// Component
const About = () => {
    return <div className='flex flex-col lg:flex-row justify-stretch items-center lg:items-start w-full lg:min-h-screen'>
        <SideNav links={SideNavLinks} />
        <main className='w-full max-w-2xl min-h-screen p-4 lg:py-8 mx-auto'>
            <Outlet />
        </main>
    </div >;
};

export default About;