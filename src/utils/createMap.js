import L from "leaflet"

export default function () {
    const map = L.map( 'map' ).setView( [ 0, 0 ], 3 )
    const drawingLayer = L.layerGroup()

    L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    } ).addTo( map )

    drawingLayer.addTo( map )

    return { mapContainer: map, drawingLayer }
}
