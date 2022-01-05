// Libs
import { Link } from 'remix';


// Utils

// Components

// Component
const ThisProject = () => {
    return <article>
        <h1 className='mb-2 lg:mb-4 text-2xl lg:text-5xl font-medium'>About this project</h1>
        <p className='mb-2 lg:mb-4 text-lg lg:text-2xl'>I build this IP Address Tracker as a demo project to show how you can build an interactive web application using <a className='text-blue-600' href='https://remix.run' target='_blank'>Remix</a>. Head over to <Link className='text-blue-600' to='/about/remix' prefetch='intent'>About&gt;Remix</Link> for more information on the framework itself. </p>
        <p className='mb-2 lg:mb-4 text-lg lg:text-2xl'>I use this web application as part of a talk on the basics of Remix. Head over to <a className='text-blue-600' href='https://davebitter.com/talks' target='_blank'>my website</a> for an overview of the talks I give and/or shoot me a message at <a className='text-blue-600' href='mailto:daveybitter@gmail.com' target='_blank'>daveybitter@gmail.com</a> if you are interested in me giving this talk at your event!</p>
        <p className='mb-2 lg:mb-4 text-lg lg:text-2xl'>This application is a more extensive version of <a className='text-blue-600' href='https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0/' target='_blank'>this frontend challenge by frontendmentor.io</a>. The goal is to create a nicely designed web application that will make some calls to an API to retrieve information for a passed IP address and display an interactive map with the retrieved location. </p>
        <p><a className='text-lg lg:text-2xl text-blue-600' href='https://github.com/DaveBitter/remix-ip-tracker' target='_blank'>View this project on GitHub</a></p>
    </article>;
};

export default ThisProject;