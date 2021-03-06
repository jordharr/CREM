from time import sleep
from umqtt.simple import MQTTClient
from machine import Pin
from dht import DHT22
import network
import ubinascii

wlan = network.WLAN(network.STA_IF)

def do_connect():
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect('network-ssid', 'network-password')
        while not wlan.isconnected():
            pass
    print('network config:', wlan.ifconfig())

def get_readings():
    CLIENT_ID = ubinascii.hexlify(wlan.config('mac'), ':')
    SERVER = 'raspberrypi.local'
    TOPIC = b'MDF1'
    client = MQTTClient(CLIENT_ID, SERVER)
    client.connect()
    sensor = DHT22(Pin(4, Pin.IN, Pin.PULL_UP))
    while True:
        try:
            sensor.measure()
            temp = sensor.temperature()
            humidity = sensor.humidity()
            reading = (b'{0:3.1f},{1:3.1f}'.format(temp, humidity))
            print(reading)
            client.publish(TOPIC, reading)
            print('Published Successfully')
        except OSError:
            print('Sensor reading failed')
        sleep(60)

do_connect()
get_readings()
