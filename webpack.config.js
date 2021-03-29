const path = require( 'path' )
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    "mode": "none",
    "entry": "./src/index.js",
    "output": {
        "path": __dirname + '/dist/js',
        "filename": "app.js"
    },
    "devServer": {
        contentBase: path.join( __dirname, 'dist' )
    },
    "plugins": [
        new CopyPlugin({
            patterns: [
                { from: "node_modules/leaflet/dist/images", to: "../images" },
            ],
        }),
    ],
    "module": {
        "rules": [
            {
                "test": /\.s[ac]ss$/i,
                "use": [
                    "style-loader",
                    "css-loader?url=false",
                    "sass-loader",
                ],
            },
        ]
    }
}
