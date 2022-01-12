import { useEffect, useMemo, useRef, useState } from 'react';
import { ActionFunction, LoaderFunction, Outlet, useActionData, useLoaderData, useTransition } from 'remix';

import SearchHeader, { SearchHeaderDataType } from '~/components/SearchHeader/SearchHeader';

/*** Asset links ***/
export const links = () => [
  {
    rel: 'preload',
    href: '/img/icons/arrow.svg',
    as: 'image',
    type: 'image/svg+xml'
  },
  {
    rel: 'preload',
    href: '/img/streets-pattern.png',
    as: 'image',
    type: 'image/png'
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

  const ip = form.get('ip') as string;

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
  const { state: formState } = useTransition();

  const ipAddress = actionData?.ip || loaderData?.userIP || ''

  /*** Leaflet map ***/
  const inputRef = useRef<null | HTMLInputElement>(null);
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
    const shouldAutoSubmitForm = !hasAutoSubmitted && !actionData?.location && inputRef?.current?.value && formRef?.current;

    loadLeaflet();
    shouldFetchLocationData && fetchLocationData();
    shouldAutoSubmitForm && autoSubmitForm();
  }, [map, actionData?.location])

  const searchHeaderData: SearchHeaderDataType = useMemo(() => [
    { label: 'IP address', value: actionData?.ip || 'Unavailable' },
    { label: 'Location', value: actionData?.location?.country || 'Unavailable' },
    { label: 'Timezone', value: actionData?.location?.timezone || 'Unavailable' },
    { label: 'ISP', value: actionData?.isp || 'Unavailable' }
  ], [actionData]);

  return (
    <div className='h-screen'>
      <SearchHeader data={searchHeaderData} defaultSearchInputValue={ipAddress} formState={formState} refs={{ formRef, inputRef }} />

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
