import { useRef, useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
// import moment from "moment";

import { loadInitialMap, updateMap } from "./util";

// import particles from "./wcofs_drift_test_v0.csv";

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const API_BASE = "http://api.current-lab.com:8000/currentdrift";
  const times =
    "iso_time_start=2023-12-15T06%3A00%3A00&iso_time_end=2023-12-18T03%3A00%3A00";

  const [particles, setParticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const setLatLon = (latlon) => {
    setLoading(true);

    // channel islands
    // const latlon = [34.11566703443491, -119.97697882291247];
    // trinidad
    // const latlon = [41.01000557450219, -124.24535478809032];
    fetch(
      `${API_BASE}?lon_start=${latlon[1]}&lat_start=${latlon[0]}&${times}&ocean_model=wcofs&radius=1000&number=30`,
      {
        headers: {
          Accept: "application/ison",
          "X-Api-Key": "cd0cf38e6219679009833a01d83ecf48",
        },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        setLoading(false);
        setParticles(data);
      });
  };

  useEffect(() => {
    if (map.current && particles.length) {
      updateMap(map, particles);
    } else if (particles.length) {
      loadInitialMap(mapContainer, map, particles, setLatLon);
    } else setLatLon([41.01000557450219, -124.24535478809032]);
    // fetch(particles)
    //   .then((res) => res.text())
    //   .then((result) => {
    //     const array = [];

    //     const lines = result.split("\n");
    //     const headers = lines[0].split(",");

    //     for (let i = 1; i < lines.length; i++) {
    //       var obj = {};
    //       var currentline = lines[i].split(",");
    //       for (let j = 0; j < headers.length; j++) {
    //         if (headers[j] === "lat" || headers[j] === "lon")
    //           obj[headers[j]] = +currentline[j];
    //         else if (headers[j] === "time") {
    //           obj[headers[j]] = moment(
    //             currentline[j],
    //             "YYYY-MM-DD HH:mm:ss"
    //           ).toDate();
    //         } else obj[headers[j]] = currentline[j];
    //       }
    //       array.push(obj);
    //     }

    //     loadInitialMap(mapContainer, map, array);
    //   });
  }, [particles]);

  return (
    <div
      ref={mapContainer}
      className="map-container"
      style={{
        opacity: loading ? 0.5 : 1,
        pointerEvents: loading ? "none" : "all",
      }}
    />
  );
}

export default Map;
