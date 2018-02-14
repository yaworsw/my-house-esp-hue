#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#include <Adafruit_NeoPixel.h>
#include <NeoPixelPainter.h>

#include "wifi-config.h"

#define PIXEL_PIN  14
#define GROUND_PIN 12

#define NUM_PIXELS 60
#define BRIGHTNESS 255


Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_PIXELS, PIXEL_PIN, NEO_GRB + NEO_KHZ800);
HTTPClient http;

void setup() {
  Serial.begin(115200);

  Serial.println(WIFI_SSID);
  Serial.println(WIFI_PASS);

  pinMode(GROUND_PIN, OUTPUT);

  digitalWrite(GROUND_PIN, LOW);

  strip.begin();
  strip.show();
}

void loop() {
  ensureConnected();

  String url = String("http://") + SERVER_IP;

  http.begin(url);
  int httpCode = http.GET();
  String payload = http.getString();

  Serial.println(payload);

  int r = payload.substring(0, 3).toInt();
  int g = payload.substring(3, 6).toInt();
  int b = payload.substring(6).toInt();

  for (int i = 0; i < NUM_PIXELS; i++) {
    strip.setPixelColor(i, r, g, b);
  }
  strip.show();

  delay(1000);
}

void ensureConnected() {
  if (!connected()) {
    connect();
    int itters = 0;
    while (!connected()) {
      Serial.print(".");
      // connect();
      delay(200);
    }
  }
}

void connect() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
}

boolean connected() {
  return WiFi.status() == WL_CONNECTED;
}
