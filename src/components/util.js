import mapboxgl from "mapbox-gl";
import { extent, groups } from "d3-array";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export const updateMap = function (map, particles) {
  findAndFitExtent(map, particles);

  const parts = getParticleGroups(particles);

  if (!map.current || !map.current.getSource("particle-path")) return;

  map.current.getSource("particle-path").setData({
    type: "FeatureCollection",
    features: parts,
  });
};

function findAndFitExtent(map, particles) {
  if (!particles.length) return;

  const latExtent = extent(particles, (d) => d.lat);
  const lonExtent = extent(particles, (d) => d.lon);

  map.current.fitBounds([
    [lonExtent[0], latExtent[0]],
    [lonExtent[1], latExtent[1]],
  ]);
}

function getParticleGroups(particles) {
  return groups(particles, (d) => d.id)
    .map((d) => {
      const coords = d[1].map((e) => [e.lon, e.lat]);

      return {
        type: "Feature",
        properties: { id: d[0] },
        geometry: {
          type: "LineString",
          coordinates: coords,
        },
      };
    })
    .filter((d) => d);
}

export const loadInitialMap = function (
  mapContainer,
  map,
  particles,
  setLatLon
) {
  map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: "mapbox://styles/binx/cleyiayif000101r4z2u9y49q",
  });

  findAndFitExtent(map, particles);

  map.current.on("load", () => {
    const parts = getParticleGroups(particles);

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

    map.current.on("click", function (e) {
      setLatLon([e.lngLat.lat, e.lngLat.lng]);
    });
  });
};
