export default function ( igc ) {
    let duration = null
    let distance = null
    let avgVelocity = null
    let path = null

    let startPoint = {
        latitude: null,
        longitude: null,
        altitude: null,
        time: null
    }
    let finishPoint = {
        latitude: null,
        longitude: null,
        altitude: null,
        time: null
    }

    if ( igc.fixes && igc.fixes.length > 0 ) {
        startPoint = {
            latitude: igc.fixes[ 0 ].latitude,
            longitude: igc.fixes[ 0 ].longitude,
            altitude: igc.fixes[ 0 ].gpsAltitude,
            time: igc.fixes[ 0 ].time
        }

        finishPoint = {
            latitude: igc.fixes[ igc.fixes.length - 1 ].latitude,
            longitude: igc.fixes[ igc.fixes.length - 1 ].longitude,
            altitude: igc.fixes[ igc.fixes.length - 1 ].gpsAltitude,
            time: igc.fixes[ igc.fixes.length - 1 ].time
        }

        /** ms */
        const timestamp = igc.fixes[ igc.fixes.length - 1 ].timestamp - igc.fixes[ 0 ].timestamp
        duration = new Date( timestamp ).toISOString().substr( 11, 8 )

        let prevFix = null
        const points = igc.fixes.filter( fix => {
            let flag = true
            if ( prevFix ) {
                if ( Math.sqrt(
                    Math.pow( fix.latitude - prevFix.latitude, 2 ) +
                    Math.pow( fix.longitude - prevFix.longitude, 2 )
                ) > 1 ) {
                    flag = false
                }
            }
            prevFix = fix
            return flag
        }).map( fix => [ fix.latitude, fix.longitude ] )

        path = L.polyline( points, { color: 'blue' } )

        let prevPoint = null
        path.getLatLngs().forEach( point => {
            if ( prevPoint ) {
                distance += prevPoint.distanceTo( point )
            }
            prevPoint = point
        } )

        /** km */
        distance = Math.round( distance / 1000 )

        /** km/h */
        avgVelocity = Math.round( ( distance * 10 ) / ( timestamp / 1000 / 60 / 60 ) ) / 10
    }

    return {
        pilot: igc.pilot || null,
        gliderType: igc.gliderType || null,
        date: igc.date || null,
        points: igc.fixes || [],
        path,
        duration,
        distance,
        avgVelocity,
        startPoint,
        finishPoint,
    }
}
