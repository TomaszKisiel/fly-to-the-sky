const path = require( 'path' )
const CopyPlugin = require("copy-webpack-plugin");
const CssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    "mode": "none",
    "entry": "./src/index.js",
    "output": {
        "path": __dirname + '/dist',
        "filename": "js/app.js"
    },
    "devServer": {
        contentBase: path.join( __dirname, 'dist' )
    },
    "plugins": [
        new CopyPlugin({
            patterns: [
                { from: "node_modules/leaflet/dist/images", to: "css/images" },
            ],
        }),
        new CssExtractPlugin({
            filename: "css/style.css",
            chunkFilename: "styles/style.scss",
        })
    ],
    "module": {
        "rules": [
            {
                "test": /\.s[ac]ss$/i,
                "use": [
                    CssExtractPlugin.loader,
                    "css-loader?url=false",
                    "sass-loader",
                ],
            },
        ]
    }
}
