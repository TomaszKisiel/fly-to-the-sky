export default async function ( flightId ) {
    const proxy = "https://cors-proxy.tkisiel.pl?url="
    const url = proxy + "http://xcportal.pl/" + flightId.replace( "http://xcportal.pl/", "" ).replace( "https://xcportal.pl/", "" )

    const response = await fetch( url, {
        mode: "cors",
        referrerPolicy: 'origin',
        headers: {
            'Content-Type': 'application/text',
        },
    } )

    return await response.text()
}
