import paho.mqtt.client as mqtt


class MqttHelper(mqtt.Client):

    def __init__(self, hostname='localhost', port=1883, timeout=60, client_id=None):
        self.hostname = hostname
        self.port = port
        self.timeout = timeout
        self.subscriptions_handlers = {}
        super().__init__(client_id)

    def on_connect(self, mqttc, obj, flags, rc):
        for key, value in self.subscriptions_handlers.items():
            super().subscribe(key, value['qos'])

    def on_message(self, mqttc, obj, msg):
        # print(msg.topic + ' ' + str(msg.qos) + ' ' + str(msg.payload))
        self.subscriptions_handlers[msg.topic]['handler'].on_message(msg.payload)

    def on_subscribe(self, mqttc, obj, mid, granted_qos):
        print('Subscribed: '+str(mid)+' '+str(granted_qos))

    def open_connection(self):
        self.connect(self.hostname, self.port, self.timeout)

    def run(self):
        self.connect(self.hostname, self.port, self.timeout)

        rc = 0
        while rc == 0:
            rc = self.loop_start()
        return rc

    def subscribe(self, topic, subscription_handler, qos=0):
        if hasattr(subscription_handler, 'on_message'):
            self.subscriptions_handlers[topic] = {'qos': qos, 'handler': subscription_handler}
        else:
            raise AttributeError
