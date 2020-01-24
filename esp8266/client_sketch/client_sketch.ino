#include <ESP8266WiFi.h> 
#include <PubSubClient.h>

// use onboard LED for convenience 
#define LED (2)
// maximum received message length 
#define MAX_MSG_LEN (128)

// Wifi configuration
const char* ssid = "Haris_5Ghz";
const char* password = "156haris";

// MQTT Configuration
// if you have a hostname set for the MQTT server, you can use it here
//const char *serverHostname = "your MQTT server hostname";
// otherwise you can use an IP address like this
const IPAddress serverIPAddress(192, 168, 0, 103);
// the topic we want to use
const char *topic = "test/message";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // LED pin as output
  pinMode(LED, OUTPUT);      
  digitalWrite(LED, HIGH);
  // Configure serial port for debugging
  Serial.begin(115200);
  // Initialise wifi connection - this will wait until connected
  connectWifi();
  // connect to MQTT server  
  client.setServer(serverIPAddress, 1883);
  client.setCallback(callback);
}

void loop() {
    if (!client.connected()) {
      connectMQTT();
    }
    // this is ESSENTIAL!
    client.loop();
    // idle
    delay(500);
}

// connect to wifi
void connectWifi() {
  delay(10);
  // Connecting to a WiFi network
  Serial.printf("\nConnecting to %s\n", ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected on IP address ");
  Serial.println(WiFi.localIP());
}

// connect to MQTT server
void connectMQTT() {
  // Wait until we're connected
  while (!client.connected()) {
    // Create a random client ID
    String clientId = "ESP8266-";
    clientId += String(random(0xffff), HEX);
    Serial.printf("MQTT connecting as client %s...\n", clientId.c_str());
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("MQTT connected");
      // Once connected, publish an announcement...
      client.publish(topic, "hello from ESP8266");
      // ... and resubscribe
      client.subscribe(topic);
    } else {
      Serial.printf("MQTT failed, state %s, retrying...\n", client.state());
      // Wait before retrying
      delay(2500);
    }
  }
}

void callback(char *msgTopic, byte *msgPayload, unsigned int msgLength) {
  // copy payload to a static string
  static char message[MAX_MSG_LEN+1];
  if (length > MAX_MSG_LEN) {
    length = MAX_MSG_LEN;
  }
  strncpy(message, (char *)payload, length);
  message[length] = '\0';
  
  Serial.printf("topic %s, message received: %s\n", topic, message);

  // decode message
  if (strcmp(message, "off") == 0) {
    setLedState(false);
  } else if (strcmp(message, "on") == 0) {
    setLedState(true);
  }
}

void setLedState(boolean state) {
  // LED logic is inverted, low means on
  digitalWrite(LED, !state);
}
