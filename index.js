import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Icon, Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import Point from 'ol/geom/Point.js';
import { fromLonLat, toLonLat } from 'ol/proj.js';
import CircleSlider from "circle-slider";
import { Overlay } from 'ol';
import MousePosition from 'ol/control/MousePosition';
import { Control, defaults as defaultControls } from 'ol/control';
import Polygon from 'ol/geom/Polygon';
import * as olPixel from 'ol/pixel';
import { lineString, lineIntersect } from '@turf/turf';

window.Control = Control;

window.MousePosition = MousePosition;

window.pixel = olPixel;

window.fromLonLat = fromLonLat;

window.toLonLat = toLonLat;



var image = new CircleStyle({
    radius: 5,
    fill: null,
    stroke: new Stroke({ color: 'red', width: 1 })
});

var styles = {
    'Point': new Style({
        image: image
    }),
    'LineString': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 1
        })
    }),
    'MultiLineString': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 1
        })
    }),
    'MultiPoint': new Style({
        image: image
    }),
    'MultiPolygon': new Style({
        stroke: new Stroke({
            color: 'yellow',
            width: 1
        }),
        fill: new Fill({
            color: 'rgba(255, 255, 0, 0.1)'
        })
    }),
    'Polygon': new Style({
        stroke: new Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
        }),
        fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)'
        })
    }),
    'GeometryCollection': new Style({
        stroke: new Stroke({
            color: 'magenta',
            width: 2
        }),
        fill: new Fill({
            color: 'magenta'
        }),
        image: new CircleStyle({
            radius: 10,
            fill: null,
            stroke: new Stroke({
                color: 'magenta'
            })
        })
    }),
    'Circle': new Style({
        stroke: new Stroke({
            color: 'red',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(255,255,0,0.2)'
        })
    })
};

var styleFunction = function (feature) {
    return styles[feature.getGeometry().getType()];
};

var geojsonObject = {
    'type': 'FeatureCollection',
    'crs': {
        'type': 'name',
        'properties': {
            'name': 'EPSG:3857'
        }
    },
    'features': [{
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [0, 0]
        }
    }, {
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': [[4e6, -2e6], [8e6, 2e6]]
        }
    }, {
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': [[4e6, 2e6], [8e6, -2e6]]
        }
    }, {
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
        }
    }, {
        'type': 'Feature',
        'geometry': {
            'type': 'MultiLineString',
            'coordinates': [
                [[-1e6, -7.5e5], [-1e6, 7.5e5]],
                [[1e6, -7.5e5], [1e6, 7.5e5]],
                [[-7.5e5, -1e6], [7.5e5, -1e6]],
                [[-7.5e5, 1e6], [7.5e5, 1e6]]
            ]
        }
    }, {
        'type': 'Feature',
        'geometry': {
            'type': 'MultiPolygon',
            'coordinates': [
                [[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6], [-3e6, 6e6]]],
                [[[-2e6, 6e6], [-2e6, 8e6], [0, 8e6], [0, 6e6]]],
                [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6], [3e6, 6e6]]]
            ]
        }
    }, {
        'type': 'Feature',
        'geometry': {
            'type': 'GeometryCollection',
            'geometries': [{
                'type': 'LineString',
                'coordinates': [[-5e6, -5e6], [0, -5e6]]
            }, {
                'type': 'Point',
                'coordinates': [4e6, -5e6]
            }, {
                'type': 'Polygon',
                'coordinates': [[[1e6, -6e6], [2e6, -4e6], [3e6, -6e6], [-2e6, 2e6]]]
            }]
        }
    }]
};

var vectorSource = new VectorSource({
    features: (new GeoJSON()).readFeatures(geojsonObject)
});

vectorSource.addFeature(new Feature(new Circle([32, 35], 0.5)));

var vectorLayer = new VectorLayer({

    source: vectorSource,
    style: styleFunction
});







///////////////////////////

var rome = new Feature({
    geometry: new Point(fromLonLat([12.5, 41.9]))
});

var london = new Feature({
    geometry: new Point(fromLonLat([-0.12755, 51.507222]))
});

var madrid = new Feature({
    geometry: new Point(fromLonLat([-3.683333, 40.4]))
});


var vectorSource2 = new VectorSource({
    features: [rome, london, madrid]
});

var vectorLayer2 = new VectorLayer({
    geometryProjection: 'EPSG:4326',
    source: vectorSource2
});

window.vectorLayer2 = vectorLayer2;


//setInterval(changeIconStyle, 1000);

function changeIconStyle() {
    var vectoLayer2 = map.getLayers().getArray()[1];
    var allFeatures = vectoLayer2.getSource().getFeatures();
    allFeatures.forEach((feature) => {
        var redColor = Math.random() * 255;
        var greenColor = Math.random() * 255;
        var blueColor = Math.random() * 255;
        var mapZoom = map.getView().getZoom();
        feature.setStyle(new Style({
            image: new Icon(/** @type {module: ol/style/Icon~Options} */({
                // size: [600, 600],
                scale: mapZoom * 0.02,
                rotation: Math.random() * 360,
                rotateWithView: true,
                color: [redColor, greenColor, blueColor],
                crossOrigin: 'anonymous',
                // src: 'https://192.168.56.1:8080/icon.png'
                // src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png'
                src: 'resources/airplane2.png'
            }))
        }))
    })
}


window.View = View;
var mousePositionControl = new MousePosition({
    projection: 'EPSG:4326',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
});

window.map = new Map({
    controls: defaultControls().extend([
        mousePositionControl
    ]),
    layers: [
        new TileLayer({
            projection: 'EPSG:4326',
            source: new OSM()
        }),
        vectorLayer,
        vectorLayer2
    ],
    target: 'map',
    view: new View({
        projection: 'EPSG:4326',
        center: [34.76135112248274, 32.278446848732656],
        zoom: 10
    }),
});

window.map.on('click', function (event) {
    console.log(event.coordinate);
    console.log(event.coordinate)
    console.log(event.pixel);
    console.log(window.map.getCoordinateFromPixel(event.pixel))
})

window.drawExtent = function () {
    const extent = window.map.getView().calculateExtent();
    const extentRectangleCoordinates = [[[extent[0], extent[1]], [extent[0], extent[3]], [extent[2], extent[3]],
    [extent[2], extent[1]],
    [extent[0], extent[1]]]];

    const mapSize = window.map.getSize();

    const leftUpPixel = [0, 0];
    const leftBottomPixel = [0, mapSize[1]];
    const rightUpPixel = [mapSize[0], 0];
    const rightBottom = [mapSize[0], mapSize[1]];

    const extentRectangleCoordinates2 = [[window.map.getCoordinateFromPixel(leftUpPixel), window.map.getCoordinateFromPixel(leftBottomPixel),
    window.map.getCoordinateFromPixel(rightBottom), window.map.getCoordinateFromPixel(rightUpPixel),
    window.map.getCoordinateFromPixel(leftUpPixel)]];

    const polygonFeature = new Feature({
        geometry: new Polygon(extentRectangleCoordinates2),
    });

    polygonFeature.setStyle(new Style({
        stroke: new Stroke({
            color: 'red',
            width: 3
        }),
        fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)'
        })
    }));
    vectorSource2.addFeature(polygonFeature);

    console.log(extent);
    console.log(extentRectangleCoordinates);
    console.log(polygonFeature);
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addWeatherReport = function () {
    const weatherFeature = new Feature({
        geometry: new Point([35, 32])
    })
    const angleStart = -2, angleEnd = 2,
        startRadius = 50, endRadius = 350,
        stepRadius = 3,
        margin = 0,
        c = { x: 350, y: 350 };
    const weatherColors = ['rgba(255,242,0,0.9)', 'rgba(0,255,0,0.9)', 'rgba(255,0,0,0.9)', 'rgba(255,0,255, 0.9)'];

    let inlineSvgWeather = `<svg version="1.1" id="compass" xmlns="http://www.w3.org/2000/svg" viewBox = "0 0 700 700" width = "700" height = "700" >`;
    inlineSvgWeather += `<g>`;
    for (let sectorAngle = -29; sectorAngle < 29; sectorAngle += 2) {
        for (let r = startRadius; r <= endRadius - stepRadius; r += (stepRadius + margin)) {
            const r2 = r + stepRadius;
            const s1 = polarToCartesian(c.x, c.y, r, angleStart);
            const s2 = polarToCartesian(c.x, c.y, r, angleEnd);
            const s3 = polarToCartesian(c.x, c.y, r + stepRadius, angleEnd);
            const s4 = polarToCartesian(c.x, c.y, r + stepRadius, angleStart);
            const d = ["M", s1.x, s1.y, "A", r, r, 0, 0, 1, s2.x, s2.y,
                "L", s3.x, s3.y, "A", r2, r2, 0, 0, 0, s4.x, s4.y,
                "L", s1.x, s1.y, "Z"].join(" ");
            let color = weatherColors[getRandomInt(0, 3)];
            inlineSvgWeather += `<path transform="rotate(${sectorAngle} ${c.x} ${c.y})" fill="${color}" strokewidth="0.1" d="${d}"/>`;
        }
    }
    inlineSvgWeather += `</g> </svg > `;

    weatherFeature.setStyle(new Style({

        image: new Icon(({
            // size: [600, 600],
            scale: 1,
            rotateWithView: false,
            crossOrigin: 'anonymous',
            src: 'data:image/svg+xml;utf8,' + inlineSvgWeather,
            imageSize: '[100, 100]'
        }))
    }));
    vectorSource2.addFeature(weatherFeature);
}

window.addMainAirplane = function () {
    var airPlaneFeature = new Feature({
        geometry: new Point([35.5, 33])
    });
    airPlaneFeature.setStyle(new Style({
        image: new Icon(/** @type {module: ol/style/Icon~Options} */({
            // size: [600, 600],
            scale: 0.5,
            rotateWithView: true,
            color: [255, 255, 0],
            crossOrigin: 'anonymous',
            //src: './resource/icon.png',
            // src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png'
            src: './resources/airplane2.svg'
        }))
    }))
    /* var airplaneCompasFeature = new Feature({
        geometry: new Circle(fromLonLat([34, 33]), 10000000),
    }
    );
    airplaneCompasFeature.setStyle(
        new Style({
            stroke: new Stroke({
                color: 'white',
                width: 20
            }),
            fill: new Fill({
                color: 'rgba(255,255,255,0.2)'
            })
        })
    ) */
    var airplaneCompassFeature = new Feature({
        geometry: new Point(fromLonLat([35.5, 33]))
    });
    var rotationAngleDegrees = 30;
    var inlineSvgIcon = `<svg version="1.1" id="compass" xmlns="http://www.w3.org/2000/svg"
    viewBox = "0 0 100 100" width = "2000" height = "2000" >

        <circle id="face" cx="50" cy="50" r="45" stroke="white"
            stroke-opacity="0.8" opacity="0.7"
            stroke-width="1" fill="white" fill-opacity="0.0" />


        <g id="ticks" stroke="white" stroke-opacity="0.7" opacity="0.8"
            stroke-width="0.5" fill="white">

            <line x1='50' y1='5.000' x2='50.00' y2='7.00' />
            <line x1='72.50' y1='11.03' x2='70.00' y2='15.36' />
            <line x1='88.97' y1='27.50' x2='84.64' y2='30.00' />
            <line x1='95.00' y1='50.00' x2='90.00' y2='50.00' />
            <line x1='88.97' y1='72.50' x2='84.64' y2='70.00' />
            <line x1='72.50' y1='88.97' x2='70.00' y2='84.64' />
            <line x1='50.00' y1='95.00' x2='50.00' y2='92.00' />
            <line x1='27.50' y1='88.97' x2='30.00' y2='84.64' />
            <line x1='11.03' y1='72.50' x2='15.36' y2='70.00' />
            <line x1='5.000' y1='50.00' x2='10.00' y2='50.00' />
            <line x1='11.03' y1='27.50' x2='15.36' y2='30.00' />
            <line x1='27.50' y1='11.03' x2='30.00' y2='15.36' />
        </g>

        <g id="poles" stroke="white" stroke-width="0.2" stroke-opacity="0.6" opacity="0.6"
            fill="rgba(255,255,255, 0.5)" font-size="6px" font-family="Adobe Clean Light">

            <text x="48" y="12">N</text><text x="85" y="50" transform="rotate(${rotationAngleDegrees} 85,50)">E</text>
            <text x="48" y="91">S</text><text x="11" y="53">W</text>
        </g>
   </svg > `
    airplaneCompassFeature.setStyle(new Style({

        image: new Icon(({
            // size: [600, 600],
            scale: 0.3,
            rotateWithView: true,
            color: 'rgba(255, 0, 100, 0.5)',
            crossOrigin: 'anonymous',
            //src: './resource/icon.png',
            // src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png'
            //src: './resources/compass.svg',
            src: 'data:image/svg+xml;utf8,' + inlineSvgIcon,
            imageSize: '[100, 100]'
        }))
    }));

    var flightDirectionFeature = new Feature({
        geometry: new Point(fromLonLat([35.5, 33]))
    });
    flightDirectionFeature.setStyle(new Style({
        image: new Icon(({
            // size: [600, 600],
            scale: 0.8,
            rotateWithView: false,
            color: [255, 0, 0, 0.5],
            crossOrigin: 'anonymous',
            //src: './resource/icon.png',
            // src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png'
            src: './resources/flightDirection.svg'
        }))
    }));

    window.changeIconStyle2 = () => {
        airplaneCompassFeature.setStyle(new Style({

            image: new Icon(({
                // size: [600, 600],
                scale: 0.1,
                rotateWithView: true,
                color: 'rgba(255, 0, 100, 0.5)',
                crossOrigin: 'anonymous',
                //src: './resource/icon.png',
                // src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png'
                //src: './resources/compass.svg',
                src: 'data:image/svg+xml;utf8,' + inlineSvgIcon,
                imageSize: '[100, 100]'
            }))
        }))
    }

    vectorSource2.addFeature(airPlaneFeature);
    //   vectorSource2.addFeature(airplaneCompassFeature);
    //   vectorSource2.addFeature(flightDirectionFeature);
}

window.findVectorsIntersect = function () {
    const vector1 = lineString([[32, 35], [33, 35]]);
    const vector2 = lineString([[32.5, 33], [32.5, 36]]);
    const vectorsIntersect = lineIntersect(vector1, vector2).features[0].geometry.coordinates;
    console.log(vectorsIntersect);
}


window.addIconWithText = function () {
    var airPlaneFeature = new Feature({
        geometry: new Point([34.76135112248274, 32.278446848732656]),
    });
    airPlaneFeature.setStyle(new Style({
        image: new Icon(/** @type {module: ol/style/Icon~Options} */({
            // size: [600, 600],
            scale: 0.05,
            rotateWithView: true,
            color: [255, 255, 0],
            crossOrigin: 'anonymous',
            //src: './resource/icon.png',
            // src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png'
            src: './resources/airplane2.png'
        })),
    }));
    airPlaneFeature.getStyle().setText(
        new Text({
            text: 'label1',
            textAlign: 'center',
            font: ' 18px Arial',
            offsetY: 20,
            placement: 'point',
            fill: new Fill({
                color: '#205'
            }),
            stroke: new Stroke({ color: 'white', width: 3 }),
        }));

    vectorSource2.addFeature(airPlaneFeature);
}

