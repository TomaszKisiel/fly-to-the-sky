import L from "leaflet"

export default () => {
    const map = L.map( 'map' ).setView( [ 0, 0 ], 10 )
    const drawer = L.layerGroup()

    L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    } ).addTo( map )

    drawer.addTo( map )

    return { map, drawer }
}
