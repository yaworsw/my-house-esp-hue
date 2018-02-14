# ESP HUE

Using [ESP8266](https://www.adafruit.com/product/2471?gclid=CjwKCAiAy4bTBRAvEiwAFtatHJ9jrCLhvhMf-z1iNWRF2AI4eN0l3zX5Ab-6qp3gBYM8zeb3CuWvxhoCny0QAvD_BwE) & a raspberry pi to seamlessly add [Adafruit NeoPixels](https://www.adafruit.com/category/168) to my smart home lighting.

## Configuring

Create a `esp-hue/wifi-config.h` file containing something like:

```
#define WIFI_SSID "home-network"
#define WIFI_PASS "secret-password"

#define SERVER_IP "10.0.0.22:9621" // Ip address and port of the raspberry pi server
```

Create a `.env` file containing something like:

```
HUE_USERNAME=X4P88YHdEkZd2ALaTDJMjj44f2gaI1HV9Rub2A21
HUE_IP=10.0.0.23
HUE_LIGHT_ID=7
```

## Deploying

Run `./scripts/deploy` and add `node /home/pi/esp-hue/server/server.js` to your startup scripts.
