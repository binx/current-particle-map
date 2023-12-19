import { useEffect, useState } from "react";
import Map from "./components/Map";

function App() {
  const API_BASE = "http://api.current-lab.com:8000/currentdrift";
  const times =
    "iso_time_start=2023-12-15T06%3A00%3A00&iso_time_end=2023-12-18T03%3A00%3A00";

  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // channel islands
    // const latlon = [34.11566703443491, -119.97697882291247];

    // trinidad
    const latlon = [41.01000557450219, -124.24535478809032];
    fetch(
      `${API_BASE}?lon_start=${latlon[1]}&lat_start=${latlon[0]}&${times}&ocean_model=wcofs&radius=3000&number=30`,
      {
        headers: {
          Accept: "application/ison",
          "X-Api-Key": "cd0cf38e6219679009833a01d83ecf48",
        },
      }
    )
      .then((resp) => resp.json())
      .then((data) => setParticles(data));
  }, []);

  return <Map particles={particles} />;
}

export default App;
