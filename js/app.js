mapboxgl.accessToken = 'access_token';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [144.9631, -37.8136], // Melbourne coordinates
  zoom: 12
});

map.on('load', function() {
  map.addSource('traffic', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-traffic-v1'
  });
  map.addLayer({
    id: 'traffic-layer',
    type: 'line',
    source: 'traffic',
    'source-layer': 'traffic',
    layout: { visibility: 'none' },
    paint: {
      'line-width': 2,
      'line-color': [
        'case',
        ['==', ['get', 'congestion'], 'low'], '#00ff00',
        ['==', ['get', 'congestion'], 'moderate'], '#ffff00',
        ['==', ['get', 'congestion'], 'heavy'], '#ff0000',
        ['==', ['get', 'congestion'], 'severe'], '#800000',
        '#000000'
      ]
    }
  });

  navigator.geolocation.getCurrentPosition(async function(position) {
    const userLocation = [position.coords.longitude, position.coords.latitude];
    updateParkingData(userLocation);
  });

  async function fetchParkingData(userLocation) {
    const [longitude, latitude] = userLocation;
    const response = await fetch(`https://api.tomtom.com/search/2/categorySearch/parking.json?key=apikey&lat=${latitude}&lon=${longitude}&categorySet=7369`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results;
  }

  async function updateParkingData(userLocation) {
    const data = await fetchParkingData(userLocation);
    let nearestParking = null;
    let minDistance = Infinity;

    const geojson = {
      type: 'FeatureCollection',
      features: data.map(parking => {
        const parkingLocation = [parking.position.lon, parking.position.lat];
        const distance = turf.distance(userLocation, parkingLocation);

        if (distance < minDistance) {
          minDistance = distance;
          nearestParking = parking;
        }

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: parkingLocation
          },
          properties: {
            title: parking.poi.name,
            isNearest: parking === nearestParking
          }
        };
      })
    };

    map.getSource('parking').setData(geojson);

    if (nearestParking) {
      calculateRoute(userLocation, [nearestParking.position.lon, nearestParking.position.lat]);
    }
  }

  map.addSource('parking', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addLayer({
    id: 'parking-layer',
    type: 'circle',
    source: 'parking',
    paint: {
      'circle-radius': 8,
      'circle-color': [
        'case',
        ['==', ['get', 'availableSpaces'], 0], '#ff0000',
        '#007cbf'
      ]
    }
  });

  map.addLayer({
    id: '3d-buildings',
    source: 'composite',
    'source-layer': 'building',
    filter: ['==', 'extrude', 'true'],
    type: 'fill-extrusion',
    minzoom: 15,
    paint: {
      'fill-extrusion-color': '#aaa',
      'fill-extrusion-height': [
        'interpolate', ['linear'], ['zoom'],
        15, 0, 15.05, ['get', 'height']
      ],
      'fill-extrusion-base': [
        'interpolate', ['linear'], ['zoom'],
        15, 0, 15.05, ['get', 'min_height']
      ],
      'fill-extrusion-opacity': 0.6
    },
    layout: { visibility: 'none' }
  });

  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addLayer({
    id: 'route-layer',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#888',
      'line-width': 8
    }
  });

  document.getElementById('toggle-3d').addEventListener('click', function() {
    const visibility = map.getLayoutProperty('3d-buildings', 'visibility');
    if (visibility === 'visible') {
      map.setLayoutProperty('3d-buildings', 'visibility', 'none');
    } else {
      map.setLayoutProperty('3d-buildings', 'visibility', 'visible');
    }
  });

  document.getElementById('toggle-traffic').addEventListener('click', function() {
    const visibility = map.getLayoutProperty('traffic-layer', 'visibility');
    if (visibility === 'visible') {
      map.setLayoutProperty('traffic-layer', 'visibility', 'none');
    } else {
      map.setLayoutProperty('traffic-layer', 'visibility', 'visible');
    }
  });

  document.getElementById('toggle-route').addEventListener('click', function() {
    const visibility = map.getLayoutProperty('route-layer', 'visibility');
    if (visibility === 'visible') {
      map.setLayoutProperty('route-layer', 'visibility', 'none');
    } else {
      map.setLayoutProperty('route-layer', 'visibility', 'visible');
    }
  });

  async function calculateRoute(start, end) {
    const query = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(',')};${end.join(',')}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`);
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const distance = data.distance / 1000;

    document.getElementById('distance').innerText = `Distance to nearest parking: ${distance.toFixed(2)} km`;

    const geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      }]
    };

    map.getSource('route').setData(geojson);
  }

  updateParkingData();
  setInterval(updateParkingData, 10000);
});

document.getElementById('search-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const query = document.getElementById('search-input').value;
  if (query) {
    const response = await fetch(`https://api.tomtom.com/search/2/search/${query}.json?key=apikey`);
    const data = await response.json();
    if (data.results.length > 0) {
      const location = data.results[0].position;
      const userLocation = [location.lon, location.lat];
      map.flyTo({ center: userLocation, zoom: 14 });
      updateParkingData(userLocation);
    } else {
      alert('Location not found');
    }
  }
});
