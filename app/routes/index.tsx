import { useEffect, useState } from 'react';
import { Outlet } from 'remix';

let ReactLeaflet: any;

export default function Index() {
  const position = [52.3139713, 4.9419641]
  const [hasWindowAndLeaflet, setHasWindowAndLeaflet] = useState(false);

  useEffect(() => {
    import('react-leaflet').then(reactLeaflet => {
      ReactLeaflet = reactLeaflet;
      setHasWindowAndLeaflet(true)
    })

  }, [])

  return (
    <div className='h-screen'>
      <header className='h-96 lg:h-auto bg-[url("/img/streets-pattern.png")] bg-no-repeat bg-cover'>
        <div className='relative flex flex-col gap-6 mx-6 lg:mx-0 justify-center items-center h-64 translate-y-48 lg:translate-y-12' style={{ zIndex: 500 }}>
          <h1 className='text-3xl text-white font-medium'>IP Address Tracker</h1>
          <form className='w-full lg:w-96 relative' method='post'>
            <label htmlFor="ip" className='sr-only'>IP address or domain</label>
            <input id="ip" className='w-full p-4 pr-14 rounded-2xl' placeholder='Search for any IP address or domain'></input>
            <button type='submit' className='w-14 h-full absolute top-0 right-0 rounded-r-2xl bg-black' />
          </form>
          <dl className='flex flex-col lg:flex-row justify-between items-stretch w-full lg:w-auto mt-4 lg:py-12 rounded-2xl bg-white'>
            <div className='flex flex-col py-6 lg:py-0 px-12 items-center lg:border-solid lg:border-r-2 lg:border-gray-200'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>IP address</dt>
              <dd className='text-gray-700 text-2xl font-bold'>Unavailable</dd>
            </div>
            <div className='flex flex-col py-6 lg:py-0 px-12 items-center lg:border-solid lg:border-r-2 lg:border-gray-200'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>Location</dt>
              <dd className='text-gray-700 text-2xl font-bold'>Unavailable</dd>
            </div>
            <div className='flex flex-col py-6 lg:py-0 px-12 items-center lg:border-solid lg:border-r-2 lg:border-gray-200'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>Timezone</dt>
              <dd className='text-gray-700 text-2xl font-bold'>Unavailable</dd>
            </div>
            <div className='flex flex-col py-6 lg:py-0 px-12 items-center'>
              <dt className='text-gray-400 text-sm font-bold uppercase tracking-widest'>ISP</dt>
              <dd className='text-gray-700 text-2xl font-bold'>Unavailable</dd>
            </div>
          </dl>
        </div>
      </header>
      <main className='h-full'>
        <section className='h-full'>
          <div id='map' className='h-full bg-gray-500'>
            {hasWindowAndLeaflet && <ReactLeaflet.MapContainer className='h-full' center={position} zoom={20} scrollWheelZoom={false}>
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
    </div>
  );
}
