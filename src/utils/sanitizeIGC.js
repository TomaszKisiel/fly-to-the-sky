import IGCParser from "igc-parser"

/**
 * Some of xcportal entries have indexes that don't conform to the standard,
 * eg. "COMPETITION CLASS" instead of "COMPETITIONCLASS" (without space) which
 * isn't understood by the parser. To display at least a minimum amount of
 * correct indexes, I remove the ones that causing exception.
 */
export default function ( rawIGC ) {
    let igc = null
    let tries = 10

    while ( !igc && tries > 0 ) {
        try {
            igc = IGCParser.parse( rawIGC, "utf-8" )
        } catch ( err ) {
            tries -= 1

            if ( err.message.includes( "Invalid data source at line" ) ) {
                const parts = err.message.replace( ":", "" ).split( " " )

                if ( parts.length >= 2 ) {
                    const lineNumber = parseInt( parts[ parts.length - 2 ] )

                    if ( !isNaN( lineNumber ) ) {
                        const lines = rawIGC.split("\n")
                        lines.splice(lineNumber - 1,1)

                        rawIGC = lines.join("\n");
                    }
                }
            }
        }
    }

    return igc
}
