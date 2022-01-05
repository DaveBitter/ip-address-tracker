import { useEffect, useRef, useState } from 'react';
import { ActionFunction, Form, LoaderFunction, NavLink, Outlet, useActionData, useLoaderData } from 'remix';

/*** Asset links ***/
export const links = () => [
  {
    rel: "preload",
    href: "/img/icons/arrow.svg",
    as: "image",
    type: "image/svg+xml"
  },
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

/*** Action handler ***/
type ActionData = {
  location?: {
    country: string;
    region: string;
    timezone: string;
  };
  ip?: string;
  isp?: string;
};

export const action: ActionFunction = async ({
  request
}): Promise<Response | ActionData> => {
  const form = await request.formData();

  const ip = form.get("ip") as string;

  const GEO_IP_API_KEY = 'at_lhknRFKpkdlDUiZmAA7Zmt2EGsvu2';
  const { location, isp } = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${GEO_IP_API_KEY}&ipAddress=${ip}`).then(res => res.json())

  return { location, isp, ip };
};

/*** Loader handler ***/
type LoaderData = {
  userIP?: string;
};

export const loader: LoaderFunction = async ({ }) => {
  const userIP = await fetch('https://api.ipify.org?format=json').then(res => res.json())

  return { userIP: userIP.ip };
};

let ReactLeaflet: any;
let LeafletGeoSearch: any;
let hasAutoSubmitted = false;

/*** Component ***/
const Index = () => {
  const actionData = useActionData<ActionData | undefined>();
  const loaderData = useLoaderData<LoaderData>();

  const ipAddress = actionData?.ip || loaderData?.userIP || ''

  /*** Leaflet map ***/
  const ipInputRef = useRef<null | HTMLInputElement>(null);
  const formRef = useRef<null | HTMLFormElement>(null);

  const [hasWindowAndLeaflet, setHasWindowAndLeaflet] = useState(false);
  const [map, setMap] = useState<null | { setView: (latLng: [number, number], zoom: number) => void }>(null)
  const [position, setPosition] = useState([52.3139713, 4.9419641]);

  useEffect(() => {
    async function loadLeaflet() {
      if (!ReactLeaflet) { ReactLeaflet = await import('react-leaflet') }
      setHasWindowAndLeaflet(true) // NOTE: added to force rerender and load the map in the DOM
    }

    async function fetchLocationData() {
      if (!LeafletGeoSearch) { LeafletGeoSearch = await import('leaflet-geosearch') }

      const provider = new LeafletGeoSearch.OpenStreetMapProvider();
      const [locationData] = await provider.search({ query: `${actionData?.location?.country} ${actionData?.location?.region}` });

      if (locationData && map?.setView) {
        map.setView([locationData.y, locationData.x], 10)

        setPosition([locationData.y, locationData.x])
      }
    }

    function autoSubmitForm() {
      hasAutoSubmitted = true;
      formRef.current?.submit();
    }

    const shouldFetchLocationData = actionData?.location?.country;
    const shouldAutoSubmitForm = !hasAutoSubmitted && !actionData?.location && ipInputRef?.current?.value && formRef?.current;

    loadLeaflet();
    shouldFetchLocationData && fetchLocationData();
    shouldAutoSubmitForm && autoSubmitForm();
  }, [map, actionData?.location])

  return (
    <div className='h-screen'>
      <header className='h-96 lg:h-auto lg:p-4 bg-[url("/img/streets-pattern.png")] bg-no-repeat bg-cover'>
        <div className='relative flex flex-col gap-6 mx-6 lg:mx-0 justify-center items-center h-64 translate-y-48 lg:translate-y-12' style={{ zIndex: 500 }}>
          <nav className='w-full'>
            <ul className='flex justify-end gap-4 lg:gap-2'>
              <li>
                <NavLink className='text-white text-md lg:text-lg font-bold' to='/about/this-project' prefetch='intent'>About</NavLink>
              </li>
            </ul>
          </nav>
          <h1 className='text-3xl text-white font-medium'>IP Address Tracker</h1>
          <Form className='w-full lg:w-96 relative' method='post' ref={formRef}>
            <label htmlFor="ip" className='sr-only'>IP address or domain</label>
            <input ref={ipInputRef} defaultValue={ipAddress} id="ip" name="ip" minLength={7} maxLength={15} size={15} pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$" className='w-full p-4 pr-14 rounded-2xl text-gray-700 text-xl font-medium' placeholder='Search for any IP address or domain'></input>
            <button type='submit' className='w-14 h-full absolute top-0 right-0 rounded-r-2xl bg-black hover:bg-gray-800 transition-colors bg-[url("/img/icons/arrow.svg")] bg-no-repeat bg-center'>
              <span className='sr-only'>Retrieve IP information</span>
            </button>
          </Form>
          <dl className='flex flex-col lg:flex-row justify-between items-stretch w-full lg:w-auto mt-4 lg:py-12 rounded-2xl bg-white shadow-lg'>
            <div className='flex flex-col items-center max-w-md py-6 lg:py-0 px-12 lg:border-solid lg:border-r-2 lg:border-gray-200 text-center'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>IP address</dt>
              <dd className='text-gray-700 text-2xl font-bold max-w-full whitespace-nowrap overflow-hidden text-ellipsis' title={actionData?.ip || 'Unavailable'}>{actionData?.ip || 'Unavailable'}</dd>
            </div>
            <div className='flex flex-col items-center max-w-md py-6 lg:py-0 px-12 lg:border-solid lg:border-r-2 lg:border-gray-200 text-center'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>Location</dt>
              <dd className='text-gray-700 text-2xl font-bold max-w-full whitespace-nowrap overflow-hidden text-ellipsis' title={actionData?.location?.country || 'Unavailable'}>{actionData?.location?.country || 'Unavailable'}</dd>
            </div>
            <div className='flex flex-col items-center max-w-md py-6 lg:py-0 px-12 lg:border-solid lg:border-r-2 lg:border-gray-200 text-center'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>Timezone</dt>
              <dd className='text-gray-700 text-2xl font-bold max-w-full whitespace-nowrap overflow-hidden text-ellipsis' title={actionData?.location?.timezone || 'Unavailable'}>{actionData?.location?.timezone || 'Unavailable'}</dd>
            </div>
            <div className='flex flex-col items-center max-w-md py-6 lg:py-0 px-12 text-center'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>ISP</dt>
              <dd className='text-gray-700 text-2xl font-bold max-w-full whitespace-nowrap overflow-hidden text-ellipsis' title={actionData?.isp || 'Unavailable'}>{actionData?.isp || 'Unavailable'}</dd>
            </div>
          </dl>
        </div>
      </header >
      <main className='h-full lg:h-[calc(100%_-_18rem)]'>
        <section className='h-full'>
          <div id='map' className='relative flex justify-center items-center h-full bg-gray-200'>
            <h1 className='fade-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center lg:whitespace-nowrap text-gray-700 text-2xl lg:text-6xl font-bold'>{actionData?.location ? `${actionData.location.region}, ${actionData.location.country}` : ''}</h1>
            {hasWindowAndLeaflet && <ReactLeaflet.MapContainer className='h-full w-full' scrollWheelZoom={false} whenCreated={setMap}>
              <ReactLeaflet.TileLayer
                url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
              />
              <ReactLeaflet.Marker position={position}>
                <ReactLeaflet.Popup>
                  {actionData?.location ? `${actionData.location.region}, ${actionData.location.country}` : ''}
                </ReactLeaflet.Popup>
              </ReactLeaflet.Marker>
            </ReactLeaflet.MapContainer>}
          </div>
          <Outlet />
        </section>
      </main>
    </div >
  );
}

export default Index
