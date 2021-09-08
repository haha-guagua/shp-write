module.exports.point = justType('Point', 'POINT');
module.exports.line = justType('LineString', 'POLYLINE');
module.exports.polygon = justType('Polygon', 'POLYGON');

function justType(type, TYPE) {
  return function(gj) {
    var oftype = gj.features.filter(isType(type));

    var geometries;
    if (TYPE === 'POLYLINE') {
      // Wrap LineString & MultiLineString coordinate pairs.
      // https://github.com/mapbox/shp-write/issues/44
      geometries = oftype.map(function (t) {
        return [justCoords(t)];
      });
    } else {
      geometries = oftype.map(justCoords);
    }

    return {
      geometries: geometries,
      properties: oftype.map(justProps),
      type: TYPE,
    };
  };
}

function justCoords(t) {
  return t.geometry.coordinates;
}

function justProps(t) {
  return t.properties;
}

function isType(t) {
  return function(f) { return f.geometry.type.replace('Multi', '') === t; };
}
