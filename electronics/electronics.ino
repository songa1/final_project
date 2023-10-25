#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <Grandeur.h>
#include <LiquidCrystal_I2C.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <ACS712.h>

// #define rxPin D3
// #define txPin D4
// SoftwareSerial sim800L(rxPin,txPin); 

const int cSensorIn = A0;
LiquidCrystal_I2C lcd(0x27, 16, 2);
DynamicJsonDocument doc(384);
HTTPClient http;
const char* ssid = "techinika";
const char* pass = "12345678@tech";
#define API_HOST "http://192.168.43.165:3456"
#define METER_NUM "250791377447"
WiFiClient client;
const int httpTimeout = 15000;
int mVperAmp = 185; 
double Voltage = 0;
double VRMS = 0;
double AmpsRMS = 0;

void setup() {
  Serial.begin(115200);
  pinMode(D5, OUTPUT);
  http.setTimeout(httpTimeout);
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

  digitalWrite(D5, LOW);

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
  
  // csensor.calibrate();
}

void loop() {
  String serverPath = String(API_HOST) + "/get-power?meter="+String(METER_NUM);
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
    lcd.print(String(powerValue) + " Kwh");
    if(powerValue == 0){
      digitalWrite(D5, HIGH);
    }else {
      digitalWrite(D5, LOW);
    }
  }else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  int adc = analogRead(cSensorIn);
  float voltage = adc*5/1023.0;
  float current = (voltage-2.5)/0.185;

  float power = (current * voltage)*0.001;

  if(current < 0.1){
    current = 0;
  }
  Serial.print("Current: ");
  Serial.println(current);

  Serial.print("Voltage: ");
  Serial.println(voltage);

  Serial.print("Power: ");
  Serial.println(power*0.001);

  lcd.setCursor(0, 1);
  lcd.print("I = " + String(current) + ", V = " + String(voltage));

  if(power>0){
    String serverPathreduce = String(API_HOST) + "/reduce?meterNumber="+String(METER_NUM)+"&powerUsed="+String(power);
    http.begin(client, serverPathreduce.c_str());
    int httpResCode = http.GET();

    if (httpResCode) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResCode);
      String data = http.getString();
      Serial.println(data);
    }else {
      Serial.print("Error code: ");
      Serial.println(httpResCode);
    }
  }

  delay(5000);
}

void rechargePower(int amount) {
  String serverPath = "https://meter-w04c.onrender.com/new-transaction?meter=250791377447&amount="+amount;
  http.begin(client, serverPath.c_str());
  int httpResponseCode = http.GET();
      
  if (httpResponseCode) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
    // if(httpResponseCode === 201){
    //   getPower();
    // }
  }else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

float getVPP()
{
  float result;
  
  int readValue;             //value read from the sensor
  int maxValue = 0;          // store max value here
  int minValue = 1024;          // store min value here
  
   uint32_t start_time = millis();

   while((millis()-start_time) < 1000) //sample for 1 Sec
   {
       readValue = analogRead(cSensorIn);
       // see if you have a new maxValue
       if (readValue > maxValue) 
       {
           /*record the maximum sensor value*/
           maxValue = readValue;
       }
       if (readValue < minValue) 
       {
           /*record the maximum sensor value*/
           minValue = readValue;
       }
/*       Serial.print(readValue);
       Serial.println(" readValue ");
       Serial.print(maxValue);
       Serial.println(" maxValue ");
       Serial.print(minValue);
       Serial.println(" minValue ");
       delay(1000); */
    }
   
   // Subtract min from max
   result = ((maxValue - minValue) * 5)/1024.0;
      
   return result;
 }
