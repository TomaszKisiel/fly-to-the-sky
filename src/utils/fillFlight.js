import decodeIGC from "./decodeIGC"

export default function ( flightData = decodeIGC( {} ), map = {} ) {
    const { mapContainer, drawingLayer } = map

    flightPilot.innerText = flightData.pilot || "Brak danych"
    flightGliderType.innerText = flightData.gliderType || "Brak danych"
    flightDate.innerText = flightData.date || "Brak danych"

    flightStartLevel.innerText = flightData.startPoint.altitude
        ? flightData.startPoint.altitude + " m"
        : "Brak danych"

    flightFinishLevel.innerText = flightData.finishPoint.altitude
        ? flightData.finishPoint.altitude + " m"
        : "Brak danych"


    flightStartTime.innerText = flightData.startPoint.time
        ? flightData.startPoint.time
        : "Brak danych"


    flightFinishTime.innerText = flightData.finishPoint.time
        ? flightData.finishPoint.time
        : "Brak danych"

    flightDuration.innerText = flightData.duration || "Brak danych"

    flightDistance.innerText = flightData.distance
        ? flightData.distance + " km"
        : "Brak danych"

    flightVelocity.innerText = flightData.avgVelocity
        ? flightData.avgVelocity + " km/h"
        : "Brak danych"

    if ( drawingLayer ) {
        if (  flightData.startPoint.latitude !== null && flightData.startPoint.longitude !== null ) {
            const start = L.marker( [
                flightData.startPoint.latitude,
                flightData.startPoint.longitude
            ] ).addTo( drawingLayer )

            start.bindTooltip("Start");
        }

        if (  flightData.finishPoint.latitude !== null && flightData.finishPoint.longitude !== null ) {
            const finish = L.marker( [
                flightData.finishPoint.latitude,
                flightData.finishPoint.longitude
            ] ).addTo( drawingLayer )

            finish.bindTooltip("Finish");
        }

        if ( flightData.path ) {
            flightData.path.addTo( drawingLayer )
        }
    }

    if ( mapContainer && flightData.path ) {
        mapContainer.fitBounds( flightData.path.getBounds() )
    }
}
