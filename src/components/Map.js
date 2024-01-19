import { useRef, useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import moment from "moment";

import { loadInitialMap, updateMap } from "./util";

// import particles from "./wcofs_drift_test_v0.csv";

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const API_BASE = "http://api.current-lab.com:8000/currentdrift";

  const [particles, setParticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const startDate = "2023-12-17T06:00:00";
  const format = "YYYY-MM-DDTHH:mm:ss";

  const setLatLon = (latlon) => {
    // setLoading(true);

    const startTime = moment(startDate, format);

    const times = [];

    for (let i = 0; i < 24; i++) {
      times.push(startTime.subtract(1, "hour").format(format));
    }

    const API_END = "direction=backward&duration=2&radius=0&number=1";

    const promiseArray = times.map((time, index) => {
      // Assuming some asynchronous operation is performed for each item
      return new Promise((resolve, reject) => {
        fetch(
          `${API_BASE}?lon=${latlon[1]}&lat=${latlon[0]}&iso_time_start=${time}&${API_END}`,
          {
            headers: {
              Accept: "application/ison",
              "X-Api-Key": "cd0cf38e6219679009833a01d83ecf48",
            },
          }
        )
          .then((resp) => resp.json())
          .then((data) => {
            const filtered = data
              .filter((d) => d.lat > -90 && d.lat < 90)
              .map((t) => {
                t.id = index;
                return t;
              });

            resolve(filtered);
          });
      });
    });

    Promise.all(promiseArray)
      .then((results) => {
        setLoading(false);
        setParticles(results.flat());
      })
      .catch((error) => {
        console.error(error);
      });

    console.log(times);

    // channel islands
    // const latlon = [34.11566703443491, -119.97697882291247];
    // trinidad
    // const latlon = [41.01000557450219, -124.24535478809032];
  };

  useEffect(() => {
    if (map.current && particles.length) {
      updateMap(map, particles);
    } else if (particles.length) {
      loadInitialMap(mapContainer, map, particles, setLatLon);
    } //else setLatLon([41.01000557450219, -124.24535478809032]);
    else setLatLon([33.97372074546406, -119.93403561106437]);
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
