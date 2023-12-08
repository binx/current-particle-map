import { useRef, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import moment from "moment";

import { loadInitialMap } from "./util";

import particles from "./wcofs_drift_test_v0.csv";

function Map({}) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    fetch(particles)
      .then((res) => res.text())
      .then((result) => {
        const array = [];

        const lines = result.split("\n");
        const headers = lines[0].split(",");

        for (let i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(",");
          for (let j = 0; j < headers.length; j++) {
            if (headers[j] === "lat" || headers[j] === "lon")
              obj[headers[j]] = +currentline[j];
            else if (headers[j] === "time") {
              obj[headers[j]] = moment(
                currentline[j],
                "YYYY-MM-DD HH:mm:ss"
              ).toDate();
            } else obj[headers[j]] = currentline[j];
          }
          array.push(obj);
        }

        loadInitialMap(mapContainer, map, array);
      });
  }, []);

  return <div ref={mapContainer} className="map-container" />;
}

export default Map;
