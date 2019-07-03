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

rome.setStyle(new Style({
    image: new Icon(/** @type {module: ol/style/Icon~Options} */({
        color: [255, 0, 0],
        crossOrigin: 'anonymous',
        src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png'
    }))
}));


setInterval(changeIconStyle, 1000);

function changeIconStyle() {
    var vectoLayer = map.getLayers().getArray()[1];
    var allFeatures = vectoLayer.getSource().getFeatures();
    console.log(allFeatures);
    allFeatures.forEach((feature) => {
        var redColor = Math.random() * 255;
        var greenColor = Math.random() * 255;
        var blueColor = Math.random() * 255;
        feature.setStyle(new Style({
            image: new Icon(/** @type {module: ol/style/Icon~Options} */({

                color: [redColor, greenColor, blueColor],
                crossOrigin: 'anonymous',
                src: 'https://openlayers.org/en/v5.3.0/examples/data/icon.png'
            }))
        }))
    })
}


london.setStyle(new Style({
    image: new Icon(/** @type {module: ol/style/Icon~Options} */({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        color: '#4271AE',
        crossOrigin: 'anonymous',
        src: 'data/icon.png'
    }))
}));

madrid.setStyle(new Style({
    image: new Icon(/** @type {module:ol/style/Icon~Options} */({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'data/icon.png'
    }))
}));

var newIconFeature = new Feature({
    geometry: new Point([0, 0]),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
});

var newIconStyle = new Style({
    image: new Icon(/** @type {module:ol/style/Icon~Options} */({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: './resources/mario.png'
    }))
});

var vectorSource2 = new VectorSource({
    features: [rome, london, madrid, newIconFeature]
});

var vectorLayer2 = new VectorLayer({
    source: vectorSource2
});









var map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        //vectorLayer,
        vectorLayer2
    ],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2
    })
});