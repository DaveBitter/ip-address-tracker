// Libs
import { NavLink } from 'remix';

// Utils

// Resources

// Components

// Interface
export type SideNavLinkType = {
    label: string;
    to: string;
    subLinks?: Array<SideNavLinkType>;
}

interface IProps {
    links: Array<SideNavLinkType>
}

// Component
const SideNav = ({ links, ...attributes }: IProps) => {
    return <aside className='bg-gray-200 w-full lg:h-screen lg:w-64 sticky top-0 bg-[url("/img/streets-pattern.png")] lg:bg-[url("/img/streets-pattern-vertical.png")] bg-no-repeat bg-cover' {...attributes}>
        {!!links.length && <nav>
            <ul className='flex gap-4 lg:gap-2 lg:flex-col p-4'>
                {links.map(({ label, to, subLinks }) => <li key={to}>
                    <NavLink className='text-white text-md lg:text-lg font-bold' to={to} prefetch='intent'>{label}</NavLink>
                    {subLinks && <ul className='flex lg:flex-col gap-2 pt-2'>
                        {subLinks.map(({ label, to }) => <li key={to}>
                            <NavLink className={({ isActive }) => `lg:ml-4 text-white text-sm lg:text-md font-medium ${isActive && 'border-solid border-b-2 border-white'}`} to={to} prefetch='intent'>{label}</NavLink>
                        </li>)}
                    </ul>}
                </li>)}
            </ul>
        </nav>}
    </aside>
};

// Props
SideNav.defaultProps = {};

export default SideNav;