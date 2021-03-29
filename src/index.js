import IGCParser from "igc-parser"
import L from "leaflet"

import createMap from "./createMap"

import "./style.scss"
import "bootstrap"

function fetchFlight( flightId, map, container ) {
    const proxy = "http://cors-anywhere.herokuapp.com/"
    const url = proxy + "https://xcportal.pl/" + flightId

    flightState.classList.add( "animate-pulse" )
    loader.classList.remove( "d-none" )
    container.eachLayer( ( layer ) => {
        container.removeLayer(layer)
    } )

    fetch( url, {
        method: 'GET',
        mode: "cors",
        headers: {
            'Content-Type': 'application/text',
        },
    } ).then( res => res.text() ).then( raw => {
        const igc = IGCParser.parse( raw )

        flightPilot.innerText = igc.pilot
        flightGliderType.innerText = igc.gliderType || "Brak danych"
        flightDate.innerText = igc.date

        let duration = igc.fixes[ igc.fixes.length - 1 ].timestamp - igc.fixes[ 0 ].timestamp

        if ( igc.fixes.length ) {
            flightStartLevel.innerText = igc.fixes[ 0 ].gpsAltitude + " m"
            flightFinishLevel.innerText = igc.fixes[ igc.fixes.length - 1 ].gpsAltitude + " m"
            flightStartTime.innerText = igc.fixes[ 0 ].time
            flightFinishTime.innerText = igc.fixes[ igc.fixes.length - 1 ].time

            L.marker( [
                igc.fixes[ 0 ].latitude,
                igc.fixes[ 0 ].longitude
            ] ).addTo( container )
            L.marker( [
                igc.fixes[ igc.fixes.length - 1 ].latitude,
                igc.fixes[ igc.fixes.length - 1 ].longitude
            ] ).addTo( container )
        }

        const points = igc.fixes.map( fix => [ fix.latitude, fix.longitude ] )
        const path = L.polyline( points, { color: 'blue' } ).addTo( container )
        map.fitBounds( path.getBounds() )

        let distance = 0

        let prevPoint = null
        path.getLatLngs().forEach( point => {
            if ( prevPoint ) {
                distance += prevPoint.distanceTo( point )
            }
            prevPoint = point
        } )

        const velocity = Math.round( ( distance / 100 ) / ( duration / 1000 / 60 / 60 ) ) / 10

        flightDistance.innerText = Math.round( distance / 1000 ) + " km"
        flightDuration.innerText = new Date( duration ).toISOString().substr( 11, 8 )
        flightVelocity.innerText = velocity + " km/h"

        flightState.classList.remove( "animate-pulse" )
        loader.classList.add( "d-none" )

    } ).catch( err => {
        console.error( err )
        flightState.classList.remove( "animate-pulse" )
        loader.classList.add( "d-none" )
    } )
}

window.onload = function () {
    const { map, drawer } = createMap()

    fetchFlight( "sites/default/files/tracks/2021-03-28/13sb67611819384449.igc", map, drawer )

    flightForm.addEventListener( "submit", function ( e ) {
        e.preventDefault()
        fetchFlight( flightId.value, map, drawer )
    } )
}
