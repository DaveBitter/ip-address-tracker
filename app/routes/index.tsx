import { useEffect, useRef, useState } from 'react';
import { ActionFunction, Form, LoaderFunction, Outlet, useActionData, useLoaderData } from 'remix';

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

function validateIP(IP: string) {
  if (IP.length < 2) {
    return `That joke's name is too short`;
  }
}

type ActionData = {
  data?: any;
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content?: string | undefined;
  };
  fields?: {
    IP: string;
  };
};

export const action: ActionFunction = async ({
  request
}): Promise<Response | ActionData> => {

  const form = await request.formData();

  const IP = form.get("ip");

  if (
    typeof IP !== "string"
  ) {
    return { formError: `Form not submitted correctly.` };
  }

  const fieldErrors = {
    name: validateIP(IP)
  };
  const fields = { IP };
  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields };
  }

  const GEO_IP_API_KEY = 'at_lhknRFKpkdlDUiZmAA7Zmt2EGsvu2';
  const data = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${GEO_IP_API_KEY}&ipAddress=${IP}`).then(res => res.json())

  return { data, fields: { IP } };
};

type LoaderData = {
  userIP?: string;
};

export const loader: LoaderFunction = async ({ }) => {
  const userIP = await fetch('https://api.ipify.org?format=json').then(res => res.json())

  return { userIP: userIP.ip };
};

let ReactLeaflet: any;

export default function Index() {
  const [hasWindowAndLeaflet, setHasWindowAndLeaflet] = useState(false);
  const actionData = useActionData<
    ActionData | undefined
  >();

  const loaderData = useLoaderData<LoaderData>();

  const ipAddress = actionData?.data?.IP || loaderData?.userIP || ''


  const ipInputRef = useRef();
  const formRef = useRef();
  useEffect(() => {
    import('react-leaflet').then(reactLeaflet => {
      ReactLeaflet = reactLeaflet;
      setHasWindowAndLeaflet(true)
      // @ts-ignore
      !actionData?.data && ipInputRef?.current?.value && formRef?.current && formRef?.current?.submit();
    })
  }, [])

  const [map, setMap] = useState()
  const [position, setPosition] = useState([52.3139713, 4.9419641]);

  useEffect(() => {
    if (!actionData?.data?.location?.country) { return; }

    import('leaflet-geosearch').then(async (leafletGeosearch: any) => {
      const provider = new leafletGeosearch.OpenStreetMapProvider();
      const [locationData] = await provider.search({ query: `${actionData.data.location.country} ${actionData.data.location.region}` });

      // @ts-ignore
      if (locationData && map?.setView) {
        // @ts-ignore
        map.setView([locationData.y, locationData.x], 10)

        setPosition([locationData.y, locationData.x])
      }
    })
  }, [map])

  return (
    <div className='h-screen'>
      <header className='h-96 lg:h-auto bg-[url("/img/streets-pattern.png")] bg-no-repeat bg-cover'>
        <div className='relative flex flex-col gap-6 mx-6 lg:mx-0 justify-center items-center h-64 translate-y-48 lg:translate-y-12' style={{ zIndex: 500 }}>
          <h1 className='text-3xl text-white font-medium'>IP Address Tracker</h1>
          <Form className='w-full lg:w-96 relative' method='post' ref={formRef}>
            <label htmlFor="ip" className='sr-only'>IP address or domain</label>
            <input ref={ipInputRef} defaultValue={ipAddress} id="ip" name="ip" minLength={7} maxLength={15} size={15} pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$" className='w-full p-4 pr-14 rounded-2xl text-gray-700 text-xl font-medium' placeholder='Search for any IP address or domain'></input>
            <button type='submit' className='w-14 h-full absolute top-0 right-0 rounded-r-2xl bg-black hover:bg-gray-800 transition-colors bg-[url("/img/icons/arrow.svg")] bg-no-repeat bg-center' />
          </Form>
          <dl className='flex flex-col lg:flex-row justify-between items-stretch w-full lg:w-auto mt-4 lg:py-12 rounded-2xl bg-white shadow-lg'>
            <div className='flex flex-col py-6 lg:py-0 px-12 items-center lg:border-solid lg:border-r-2 lg:border-gray-200'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>IP address</dt>
              <dd className='text-gray-700 text-2xl font-bold'>{actionData?.fields?.IP || 'Unavailable'}</dd>
            </div>
            <div className='flex flex-col py-6 lg:py-0 px-12 items-center lg:border-solid lg:border-r-2 lg:border-gray-200'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>Location</dt>
              <dd className='text-gray-700 text-2xl font-bold'>{actionData?.data?.location?.country || 'Unavailable'}</dd>
            </div>
            <div className='flex flex-col py-6 lg:py-0 px-12 items-center lg:border-solid lg:border-r-2 lg:border-gray-200'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>Timezone</dt>
              <dd className='text-gray-700 text-2xl font-bold'>{actionData?.data?.location?.timezone || 'Unavailable'}</dd>
            </div>
            <div className='flex flex-col py-6 lg:py-0 px-12 items-center'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>ISP</dt>
              <dd className='text-gray-700 text-2xl font-bold'>{actionData?.data?.isp || 'Unavailable'}</dd>
            </div>
          </dl>
        </div>
      </header >
      <main className='h-full lg:h-[calc(100%_-_16rem)]'>
        <section className='h-full'>
          <div id='map' className='relative flex justify-center items-center h-full bg-gray-200'>
            <h1 className='fade-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center lg:whitespace-nowrap text-gray-700 text-2xl lg:text-6xl font-bold'>{actionData ? `${actionData.data.location.region}, ${actionData.data.location.country}` : ''}</h1>
            {hasWindowAndLeaflet && <ReactLeaflet.MapContainer className='h-full w-full' scrollWheelZoom={false} whenCreated={setMap}>
              <ReactLeaflet.TileLayer
                url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
              />
              <ReactLeaflet.Marker position={position}>
                <ReactLeaflet.Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
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
