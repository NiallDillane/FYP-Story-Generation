import configparser

config = configparser.ConfigParser()
config.read('config.ini')
print(config['reddit']['csec'])