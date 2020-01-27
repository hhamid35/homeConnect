#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define wifi_ssid "Haris_2.4GHz"
#define wifi_password "2803haris"

#define mqtt_server "address"
#define mqtt_port 1883
#define mqtt_user "light"
#define mqtt_password "12345"

#define discovery_topic "homeConnect/rpi/discovery"
#define listen_topic "homeConnect/device/esp8266_CA"
#define reply_topic "homeConnect/rpi/deviceReply"
#define device_type "switch"
#define pin 16
const int BUFFER_SIZE = JSON_OBJECT_SIZE(10);

const IPAddress serverIPAddress(192, 168, 0, 103);
WiFiClient espClient;
PubSubClient client;

void setup() {
  Serial.println(MQTT_MAX_PACKET_SIZE);
  Serial.begin(9600);
  setup_wifi();
  client.setClient(espClient);
  client.setServer(serverIPAddress, mqtt_port);
  client.setCallback(callback);
  
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(pin, OUTPUT);
}

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(wifi_ssid);

  WiFi.begin(wifi_ssid, wifi_password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    // If you do not want to use a username and password, change next line to
    //if (client.connect("ESP8266Client", mqtt_user, mqtt_password)) {
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
    } 
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void change_state(int state) {
  if (state) {
    digitalWrite(pin, HIGH);
  }
  else {
    digitalWrite(pin, LOW);
  }
}

void publish_current_state() {
  DynamicJsonDocument doc(256);
  doc["ip_address"] = WiFi.localIP().toString();
  doc["current_state"] = digitalRead(pin);
  char buffer[512];
  size_t n = serializeJson(doc, buffer);
  
  String json = "{\"ip_address\": \"" + WiFi.localIP().toString() + "\", \"current_state\": " + digitalRead(pin)+ "}";
    
  client.publish(reply_topic, buffer, n);
}

void publish_discovery() {
  DynamicJsonDocument doc(256);
  doc["ip_address"] = WiFi.localIP().toString();
  doc["curren_state"] = digitalRead(pin);
  doc["mac_address"] = WiFi.macAddress();
  doc["topic"] = listen_topic;
  doc["device_type"] = device_type;
  doc["pin"] = pin;
  char buffer[512];
  size_t n = serializeJson(doc, buffer);
  
  client.publish(reply_topic, buffer, n);
  
  String json = "{\"ip_address\": \"" + WiFi.localIP().toString() + "\", \"current_state\": " + digitalRead(pin)+ ", \"mac_address\": \"" + WiFi.macAddress() + "\", \"topic\": \"" + listen_topic + "\", \"device_type\": \"" + device_type + "\", \"pin\": " + pin + "}";
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
 
  if (error) {
    return;
  }
  if ((strcmp(doc["action"].as<char*>(), "change_state")) == 0) {
      change_state(doc["change_to"].as<int>());
      publish_current_state();
  }
  else if ((strcmp(doc["action"].as<char*>(), "get_current_state")) == 0) {
    publish_current_state();
  }
  else {
    return;
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  publish_discovery();
  client.subscribe(listen_topic);
}
