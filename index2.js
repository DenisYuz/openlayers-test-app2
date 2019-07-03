import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { fromLonLat } from 'ol/proj.js';
import TileJSON from 'ol/source/TileJSON.js';
import VectorSource from 'ol/source/Vector.js';
import { Icon, Style } from 'ol/style.js';


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
        color: '#8959A8',
        crossOrigin: 'anonymous',
        src: 'data/dot.png'
    }))
}));

london.setStyle(new Style({
    image: new Icon(/** @type {module: ol/style/Icon~Options} */({
        color: '#4271AE',
        crossOrigin: 'anonymous',
        src: 'data/dot.png'
    }))
}));

madrid.setStyle(new Style({
    image: new Icon(/** @type {module: ol/style/Icon~Options} */({
        color: [113, 140, 0],
        crossOrigin: 'anonymous',
        src: 'data/dot.png'
    }))
}));


var vectorSource = new VectorSource({
    features: [rome, london, madrid]
});

var vectorLayer = new VectorLayer({
    source: vectorSource
});

var rasterLayer = new TileLayer({
    source: new TileJSON({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
        crossOrigin: ''
    })
});



var map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        vectorLayer
    ],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2
    })
});