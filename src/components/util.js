import mapboxgl from "mapbox-gl";
import { extent, groups } from "d3-array";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export const loadInitialMap = function (mapContainer, map, particles) {
  map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: "mapbox://styles/binx/cleyiayif000101r4z2u9y49q",
  });

  console.log(particles);

  const latExtent = extent(particles, (d) => d.lat);
  const lonExtent = extent(particles, (d) => d.lon);

  console.log(latExtent, lonExtent);

  map.current.fitBounds([
    [lonExtent[0], latExtent[0]],
    [lonExtent[1], latExtent[1]],
  ]);

  map.current.on("load", () => {
    const parts = groups(particles, (d) => d.id)
      .map((d) => {
        const coords = d[1].map((e) => [e.lon, e.lat]);

        return {
          type: "Feature",
          properties: { id: +d[0] },
          geometry: {
            type: "LineString",
            coordinates: coords,
          },
        };
      })
      .filter((d) => d);

    if (!map.current.getSource("particle-path")) {
      map.current.addSource("particle-path", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: parts,
        },
      });
    }

    if (!map.current.getLayer("particle-lines")) {
      map.current.addLayer({
        id: "particle-lines",
        type: "line",
        source: "particle-path",
        layout: {},
        paint: {
          // "line-color": "rgba(174,111,160, 1)",
          "line-color": {
            property: "id",
            stops: [
              [1, "#ff0"],
              [40, "#f0f"],
            ],
          },
          "line-width": 2,
        },
      });
    }
  });
};
