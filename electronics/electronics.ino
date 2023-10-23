#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <Grandeur.h>
#include <LiquidCrystal_I2C.h>
#include <SoftwareSerial.h>

#define rxPin 2
#define txPin 3
SoftwareSerial sim800L(rxPin,txPin); 
LiquidCrystal_I2C lcd(0x27, 16, 2);

const char* ssid = "ICT_INNO_CENTER";
const char* pass = "ictinnocenter@2021";

String buff;

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  connectToWiFi(ssid, pass);

  // LCD Init
  lcd.begin(16, 2);
  lcd.init();
  lcd.backlight();

  // GSM Module Init
  sim800L.begin(115200);

  Serial.println("Initializing...");

  sim800L.println("AT");
  waitForResponse();

  sim800L.println("ATE1");
  waitForResponse();

  sim800L.println("AT+CMGF=1");
  waitForResponse();

  sim800L.println("AT+CNMI=1,2,0,0,0");
  waitForResponse();
}

void loop() {
  lcd.setCursor(0,0);
  lcd.print("Hi, Achille!");
  delay(1000);

  lcd.setCursor(0, 1);
  lcd.print("It's working!");
  delay(800);

  lcd.clear();

  while(sim800L.available()){
    buff = sim800L.readString();
    Serial.println(buff);
  }
  while(Serial.available())  {
    buff = Serial.readString();
    buff.trim();
    if(buff == "s")
      send_sms();
    else if(buff== "c")
      make_call();
    else
      sim800L.println(buff);
  }
}

void connectToWiFi(const char* ssid, const char* passphrase) {
  Serial.println("STARTING CONNECTION TO WIFI");
  WiFi.disconnect();
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, passphrase);
  Serial.printf("\nDevice is connecting to WiFi using SSID %s and Passphrase %s.\n", ssid, passphrase);
}

void send_sms(){
  sim800L.print("AT+CMGS=\"+250780630465\"\r");
  waitForResponse();
  
  sim800L.print("Hello from SIM800L");
  sim800L.write(0x1A);
  waitForResponse();
}

void make_call(){
  sim800L.println("ATD+250780630465;");
  waitForResponse();
}

void waitForResponse(){
  delay(1000);
  while(sim800L.available()){
    Serial.println(sim800L.readString());
  }
  sim800L.read();
}
