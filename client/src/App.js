import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 18.2208,
    longitude: -66.5901,
    zoom: 8
  });

 
  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  }
   
  useEffect(() => {
    getEntries();
  },[]);

  const showAddMarkerPopup = (event) =>{
    const [ longitude, latitude ] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    })
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/albertoperez8/ckgzyhhym9qvl19marebmb3t0"
      ReactMapGL
      mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <React.Fragment key={entry._id}>
          <Marker
            
            latitude={entry.latitude}
            longitude={entry.longitude}
          >
            <div
              onClick={() => setShowPopup({
                [entry._id]: true,
              })}
            >
              <img className='marker' 
                src= "https://i.stack.imgur.com/6cDGi.png"
                alt='marker'
              />
            </div>
          </Marker>
            {
              showPopup[entry._id] ? (
                <Popup
                  latitude={entry.latitude}
                  longitude={entry.longitude}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setShowPopup({})}
                  anchor="top"
                  dynamicPosition={true}
                  >
                  <div className='popup'>
                    <h3>{entry.title}</h3>
                    <p>{entry.comments}</p>
                    {entry.image && <img src={entry.image} alt={entry.title}/>}
                    {entry.rating && <p>Rating:{entry.rating}/10</p>}
                    <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>

                  </div>
                </Popup>
              ) : null
              }
        </React.Fragment>
        
      ))
    }
    {
      addEntryLocation ? (
        <>
          <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <div>
                <img className='new-marker' 
                  src= "https://i.stack.imgur.com/6cDGi.png"
                  alt='marker'
                />
              </div>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setAddEntryLocation(null)}
            anchor="top"
            dynamicPosition={true} >
            <div className='popup'>
              <h3>Add new log entry!</h3>
              <LogEntryForm onClose={() =>{
                setAddEntryLocation(null);
                getEntries();
              }} location={addEntryLocation} />
            </div>
          </Popup>
          
        </>
      ) : null
    }
    </ReactMapGL>
  );
}

export default App;