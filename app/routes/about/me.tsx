// Libs

import { LoaderFunction, useLoaderData } from 'remix';

// Utils

// Components

// Asset links
export const links = () => [
    {
        rel: 'preload',
        href: '/img/dave.jpg',
        as: 'image',
        type: 'image/jpg'
    }
];

/*** Loader handler ***/
type LoaderData = {
    articles?: Partial<ArticleData>[];
};

type ArticleData = {
    type: string
    body: string,
    date: string,
    intro: string,
    tags: { key: string, value: string }[],
    slug: string,
    teaserCopy: string,
    teaserImage: string,
    title: string,
    as: string,
    href: string,
    city?: string,
    countryCode?: string,
    event?: string;
}

export const loader: LoaderFunction = async ({ }) => {
    const { articles } = await fetch('https://davebitter.com/api/content/articles').then(res => res.json())

    return {
        articles: articles
            .splice(0, 5)
            .map(({ title, slug }: ArticleData) => ({ title, slug }))
    };
};

// Component
const Me = () => {
    const loaderData = useLoaderData<LoaderData | undefined>();

    return <article>
        <h1 className='mb-2 lg:mb-4 text-2xl lg:text-5xl font-medium'>Hi, I'm Dave</h1>
        <p className='mb-2 lg:mb-4 text-xl lg:text-3xl'>I am a Developer Advocate &amp; Senior Front-end Developer/Consultant.</p>
        <img className='max-w-xs rounded-xl mb-2 lg:mb-4' src='/img/dave.jpg' />
        <p className='mb-2 lg:mb-4 text-lg lg:text-2xl'>I'm a Senior Front-end developer and Consultant with a background in both design and development. I have a rich experience in creating state of the art human-centred web applications using Next.js, React.js and the power of the web. Due to my diverse background, I take lead in projects to deliver the best quality of work, work multidisciplinary, guide others and am a point of contact for all.</p>
        <p className='mb-2 lg:mb-4 text-lg lg:text-2xl'>As a Developer Advocate, I'm continuously on the hunt to learn new techniques, tools and possibilities and share them. I revel in sharing the wonderful world of the web in the form of speaking at meetups, speaking at conferences, creating video content, writing articles and more.</p>
        <p className='mb-2 lg:mb-4 text-lg lg:text-2xl'>I get to enjoy my passion every day as a Developer Advocate &amp; Front-end developer/Consultant and am excited about what the future will bring!</p>
        <p className='mb-2 lg:mb-4'><a className='text-lg lg:text-2xl text-blue-600' href='https://davebitter.com' target='_blank'>Drop by my website for a collections of my talks, videos and articles covering a wide range of topics</a></p>
        <p className='text-lg lg:text-2xl'>Latest articles:</p>
        {!!loaderData?.articles?.length && <ul className='ml-4 lg:ml-0 list-disc'>
            {loaderData.articles.map(({ title, slug }: Partial<ArticleData>) => <li key={slug}>
                <a className='text-md lg:text-lg text-blue-600' href={`https://davebitter.com/articles/${slug}`} target='_blank'>{title}</a>
            </li>)}
        </ul>}

    </article>;
};

export default Me;