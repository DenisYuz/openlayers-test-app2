import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Icon, Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import Point from 'ol/geom/Point.js';
import { fromLonLat } from 'ol/proj.js';
import CircleSlider from "circle-slider";




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
            color: 'rgba(255,0,0,0.2)'
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

vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

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
    source: vectorSource2
});


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





window.map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        vectorLayer,
        vectorLayer2
    ],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2
    })
});

window.addMainAirplane = function () {
    var airPlaneFeature = new Feature({
        geometry: new Point(fromLonLat([35.5, 33]))
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
    airplaneCompassFeature.setStyle(new Style({
        image: new Icon(({
            // size: [600, 600],
            scale: 0.8,
            rotateWithView: true,
            color: 'rgba(0, 100, 0, 0.5)',
            crossOrigin: 'anonymous',
            //src: './resource/icon.png',
            // src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png'
            src: './resources/compass.svg'
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


    vectorSource.addFeature(airPlaneFeature);
    vectorSource.addFeature(airplaneCompassFeature);
    vectorSource.addFeature(flightDirectionFeature);

}

