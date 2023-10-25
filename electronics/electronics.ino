#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <Grandeur.h>
#include <LiquidCrystal_I2C.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

// #define rxPin D3
// #define txPin D4
// SoftwareSerial sim800L(rxPin,txPin); 
LiquidCrystal_I2C lcd(0x27, 16, 2);

DynamicJsonDocument doc(384);
HTTPClient http;

const char* ssid = "techinika";
const char* pass = "12345678@tech";

String buff;
int amountToRecharge = 100;

#define API_HOST "http://192.168.43.165:3456"
#define METER_NUM "250791377446"

WiFiClient client;

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // LCD Init
  lcd.begin(16, 2);
  lcd.init();
  lcd.backlight();

  // GSM Module Init
  // sim800L.begin(115200);

  // Serial.println("Initializing...");

  // sim800L.println("AT");
  // delay(1000);
  // if (sim800L.find("OK")) {
  //   Serial.println("GSM module is ready");
  // } else {
  //   Serial.println("Error initializing GSM module");
  //   while (1);
  // }
  getPower();
}

void loop() {

  // if (sim800L.available() > 0) {
  //   String sms = sim800L.readStringUntil('\n');

  //   // Check if the SMS begins with "+CMT" to identify an incoming message
  //   if (sms.startsWith("+R")) {

  //     String smsContent = sim800L.readStringUntil('\n');

  //     Serial.print("SMS Content: ");
  // rechargePower(smsContent);
  //   }
  // }
}

void getPower() {
  String serverPath = "http://192.168.43.165:3456/get-power?meter=250791377446";
  http.begin(client, serverPath.c_str());
  int httpResponseCode = http.GET();
      
  if (httpResponseCode) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);

    deserializeJson(doc, payload);
    float powerValue = doc["data"]["power"];
    Serial.print(F("Power Value: "));
    Serial.println(powerValue);
    lcd.setCursor(0,0);
    lcd.print(String(powerValue));

    lcd.setCursor(0, 1);
    lcd.print("Kwh");
    delay(800);
  }else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

void rechargePower(int amount) {
  String serverPath = "http://192.168.43.165:3456/new-transaction?meter=250791377446&amount="+amount;
  http.begin(client, serverPath.c_str());
  int httpResponseCode = http.GET();
      
  if (httpResponseCode) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
    if(httpResponseCode === 201){
      getPower();
    }
  }else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}
