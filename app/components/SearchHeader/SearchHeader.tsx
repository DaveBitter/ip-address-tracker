// Libs
import { MutableRefObject } from 'react';
import { Form, NavLink } from 'remix';

// Utils

// Resources

// Components

// Interface
export type SearchHeaderDataType = Array<{
    label: string;
    value: string;

}>

interface IProps {
    data?: SearchHeaderDataType;
    defaultSearchInputValue?: string;
    formState: 'idle' | 'submitting' | 'loading';
    refs: { formRef: MutableRefObject<HTMLFormElement | null>; inputRef: MutableRefObject<HTMLInputElement | null>; };
}

// Component
const getIconBackgroundImageClass = (formState: IProps['formState']) => ({
    idle: 'bg-[url("/img/icons/submit.svg")]',
    submitting: 'bg-[url("/img/icons/upload.svg")]',
    loading: 'bg-[url("/img/icons/download.svg")]'
}[formState])

const SearchHeader = ({ data, defaultSearchInputValue, formState, refs, ...attributes }: IProps) => {
    console.log(formState);
    return <header className='h-96 lg:h-auto lg:p-4 bg-[url("/img/streets-pattern.png")] bg-no-repeat bg-cover' {...attributes}>
        <div className='relative flex flex-col gap-6 mx-6 lg:mx-0 justify-center items-center h-64 translate-y-48 lg:translate-y-12' style={{ zIndex: 500 }}>
            <nav className='w-full'>
                <ul className='flex justify-end gap-4 lg:gap-2'>
                    <li>
                        <NavLink className='text-white text-md lg:text-lg font-bold' to='/about/this-project' prefetch='intent'>About</NavLink>
                    </li>
                </ul>
            </nav>

            <h1 className='text-3xl text-white font-medium'>IP Address Tracker</h1>

            <Form className='w-full lg:w-96 relative' method='post' ref={refs.formRef}>
                <label htmlFor='ip' className='sr-only'>IP address or domain</label>
                <input ref={refs.inputRef} defaultValue={defaultSearchInputValue} id='ip' name='ip' minLength={7} maxLength={15} size={15} pattern='^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$' className='w-full p-4 pr-14 rounded-2xl text-gray-700 text-xl font-medium' placeholder='Search for any IP address or domain'></input>
                <button type='submit' className={`w-14 h-full absolute top-0 right-0 rounded-r-2xl bg-black hover:bg-gray-800 transition-colors ${getIconBackgroundImageClass(formState)} bg-no-repeat bg-center`} style={{ backgroundSize: 'auto 18px' }}>
                    <span className='sr-only'>Retrieve IP information</span>
                </button>
            </Form>

            {!!data?.length && <dl className='flex flex-col lg:flex-row justify-between items-stretch w-full lg:w-auto mt-4 lg:py-12 rounded-2xl bg-white shadow-lg'>
                {data.map(({ label, value }) => <div key={label} className='flex flex-col items-center max-w-md py-6 lg:py-0 px-12 lg:border-solid lg:border-r-2 lg:border-gray-200 text-center'>
                    <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>{label}</dt>
                    <dd className='text-gray-700 text-2xl font-bold max-w-full whitespace-nowrap overflow-hidden text-ellipsis' title={value}>{value}</dd>
                </div>)}
            </dl>}
        </div>
    </header>
};

// Props
SearchHeader.defaultProps = {};

export default SearchHeader;