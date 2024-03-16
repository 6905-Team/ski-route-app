import React, { useState } from 'react';
import './App.css';
import { XYPlot, LineSeries, MarkSeries } from 'react-vis';
import zzImage from './zz.gif';

const locations = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  x: (i % 5) * 2,
  y: Math.floor(i / 5) * 2,
}));

function App() {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [slopePreference, setSlopePreference] = useState('');
  const [preference, setPreference] = useState('');
  const [routeMessage, setRouteMessage] = useState('');
  const [showRoute, setShowRoute] = useState(false);
  const [routesFound, setRoutesFound] = useState({});

  const handleLocationClick = (locationId) => {
    if (!startLocation) {
      setStartLocation(locationId);
    } else if (!endLocation && locationId !== startLocation) {
      setEndLocation(locationId);
    } else {
      setStartLocation(locationId);
      setEndLocation(null);
    }
    setShowRoute(false);
    setRouteMessage('');
  };

  const handleCalculateRouteClick = () => {
    if (startLocation && endLocation && slopePreference) {
      const key = `${startLocation}-${endLocation}-${slopePreference}`;
      if (!routesFound[key]) {
        const randomRoutes = Math.floor(Math.random() * 9) + 4; // Random number between 4 and 12
        setRoutesFound({ ...routesFound, [key]: randomRoutes });
        setRouteMessage(`${randomRoutes} routes are found`);
      } else {
        setRouteMessage(`${routesFound[key]} routes are found`);
      }
      setShowRoute(false);
    }
  };

  const handlePreferenceChange = (e) => {
    setPreference(e.target.value);
    if (startLocation && endLocation) {
      setShowRoute(true);
    }
  };

  return (
    <div className="App">
      <h1>Skier Routing App</h1>
      <img src={zzImage} alt="Cover" />
      <div className="button-container">
        <select value={slopePreference} onChange={(e) => setSlopePreference(e.target.value)}>
          <option value="">Slope Preference</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={handleCalculateRouteClick}>Calculate Route</button>
        <select value={preference} onChange={handlePreferenceChange}>
          <option value="">Select Preference</option>
          <option value="length">Length</option>
          <option value="time">Time</option>
          <option value="scenery">Scenery</option>
          <option value="difficulty">Difficulty</option>
        </select>
      </div>
      {routeMessage && <p>{routeMessage}</p>}
      <div className="map-container">
        <XYPlot width={300} height={300}>
          {locations.map((loc) => (
            <MarkSeries
              key={loc.id}
              data={[{ x: loc.x, y: loc.y }]}
              color={loc.id === startLocation || loc.id === endLocation ? 'orange' : 'gray'}
              onValueClick={() => handleLocationClick(loc.id)}
            />
          ))}
          {showRoute && startLocation && endLocation && (
            <LineSeries
              data={[
                locations.find((loc) => loc.id === startLocation),
                locations.find((loc) => loc.id === endLocation),
              ]}
              stroke="red"
            />
          )}
        </XYPlot>
      </div>
    </div>
  );
}

export default App;
