require('dotenv').load({ silent: true });

var express = require('express');
var request = require('request');

var HUE_IP       = process.env.HUE_IP;
var HUE_USERNAME = process.env.HUE_USERNAME;
var HUE_LIGHT_ID = process.env.HUE_LIGHT_ID;

var app = express();

var r = 0, g = 0, b = 0;

app.get('/', function(req, res) {
  res.send(pad(parseInt(r), 3) + '' + pad(parseInt(g), 3) + '' + pad(parseInt(b), 3));
});

(function loop() {
  request('http://' + HUE_IP + '/api/' + HUE_USERNAME + '/lights/' + HUE_LIGHT_ID, function (error, response, body) {
    if (error) {
      console.log('ERROR:');
      console.log(error);
    }

    try {
      console.log(body);

      var data = JSON.parse(body);

      if (data.state.on == false) {
        r = 0;
        g = 0;
        b = 0;
      } else {
        var colors = xyBriToRgb(data.state.xy[0], data.state.xy[1], data.state.bri);
        r = colors.r;
        g = colors.g;
        b = colors.b;
      }
    } catch (ex) {

    }

    setTimeout(loop, 20);
  });
})();

app.listen("9621", function() {

});

function xyBriToRgb(x, y, bri) {
  z = 1.0 - x - y;
  Y = bri / 255.0; // Brightness of lamp
  X = (Y / y) * x;
  Z = (Y / y) * z;
  r = X * 1.612 - Y * 0.203 - Z * 0.302;
  g = -X * 0.509 + Y * 1.412 + Z * 0.066;
  b = X * 0.026 - Y * 0.072 + Z * 0.962;
  r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
  g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
  b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
  maxValue = Math.max(r,g,b);
  r /= maxValue;
  g /= maxValue;
  b /= maxValue;
  r = r * 255;   if (r < 0) { r = 255 };
  g = g * 255;   if (g < 0) { g = 255 };
  b = b * 255;   if (b < 0) { b = 255 };
  return {
    r :r,
    g :g,
    b :b
  };
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
