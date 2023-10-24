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
int amountToRecharge = 100;

String apiUrl = "http://localhost:3456";

const int httpPort = 80;

WiFiClient client;

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

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
  
  if(!client.connect(apiUrl, httpPort)) {
    Serial.println("Connection to Api failed!");
    return;
  }

  client.println("GET /get-power HTTP/1.1");
  client.println("Host: "+apiUrl);
  client.println("Connection: close");
  client.println();

  while(client.available()) {
    char terminator = '}';
    String line = client.readStringUntil(terminator);
    Serial.print(line);
  }
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
