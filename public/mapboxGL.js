async function startMapBox(){
    mapboxgl.accessToken = 'pk.eyJ1IjoicmFkZXpvcmFjayIsImEiOiJja3luNDQ5dXcwMGE2MnBucjVqbmYzcHpyIn0.10ZlkSmfZ9nTbSP-ka1ZfQ';
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-79.387054, 43.642567], // starting position [lng, lat]
    zoom: 15 // starting zoom
    });
}
