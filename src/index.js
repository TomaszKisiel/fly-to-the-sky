import IGCParser from "igc-parser"

import createMap from "./utils/createMap"
import fetchFlight from "./utils/fetchFlight"
import decodeIGC from "./utils/decodeIGC"
import fillFlight from "./utils/fillFlight"
import sanitizeIGC from "./utils/sanitizeIGC"

import "./styles/style.scss"
import "bootstrap"

window.onload = function () {
    const { mapContainer, drawingLayer } = createMap()

    const clearFlight = () => fillFlight()

    const handleFlightChange = ( flightURI, scrollToState = true ) => {
        flightForm.classList.remove( "is-invalid" )
        flightId.classList.remove( "is-invalid" )
        errorContainer.innerText = ""

        flightState.classList.add( "animate-pulse" )
        loader.classList.remove( "d-none" )

        drawingLayer.eachLayer( ( layer ) => {
            drawingLayer.removeLayer( layer )
        } )

        clearFlight()
        fetchFlight( flightURI ).then( res => {
            const igc = sanitizeIGC( res )
            const flightData = decodeIGC( igc )

            fillFlight( flightData, {
                mapContainer,
                drawingLayer
            } )

            setTimeout( () => {
                flightState.classList.remove( "animate-pulse" )
                loader.classList.add( "d-none" )
            }, 500 )

            if ( scrollToState ) {
                flightState.scrollIntoView()
            }
        } ).catch( err => {
            setTimeout( () => {
                flightState.classList.remove( "animate-pulse" )
                loader.classList.add( "d-none" )
            }, 500 )

            flightForm.classList.add( "is-invalid" )
            flightId.classList.add( "is-invalid" )
            errorContainer.innerText = "Ops.. something went wrong. Make sure that the provided URL is correct!"
        } )
    }

    handleFlightChange( "sites/default/files/tracks/2021-03-28/13sb67611819384449.igc", false )
    flightForm.addEventListener( "submit", function ( e ) {
        e.preventDefault()
        handleFlightChange( flightId.value )
    } )

    const flightExamples = document.querySelectorAll( ".exampleFlight" )
    if ( flightExamples ) {
        flightExamples.forEach( element =>
            element.addEventListener( "click", ( e ) => {
                flightId.value = e.target.innerHTML
                handleFlightChange( e.target.innerHTML )
            } )
        )
    }
}
