import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';

import { listLogEntries } from './API';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 3
  });

  useEffect(() =>{
    (async() => {
      const logEntries = await listLogEntries();
      setLogEntries(logEntries);
    })();
  });

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/albertoperez8/ckgzyhhym9qvl19marebmb3t0"
      ReactMapGL
      mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {logEntries.map((entry) => (
        <Marker
          key={entry._id}
          latitude={entry.latitude}
          longitude={entry.longitude}
          offsetLeft={-12}
          offsetTop={-24}
        >
        <img className='marker' src='https://i.imgur.com/y0G5YTX.png' alt='marker'></img>
        </Marker>
      ))}
    </ReactMapGL>
  );
}

export default App;