import time
import subprocess
from contextlib import contextmanager
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/build')

CORS(app)

@app.route('/time')
def get_current_time():
    return {'time':time.time()}

@app.route('/getText', methods = ['POST'])
def get_text():
    promptText = request.json
    length = promptText.count(' ') + 20
    result = subprocess.run(['python', 'run_generation.py', 
        '--model_type=gpt2',
        '--length=' + str(length), 
        '--model_name_or_path=output', 
        '--prompt=' + promptText], 
        stdout=subprocess.PIPE, cwd='./../../transformers/examples')
    result = result.stdout.decode('utf-8')
    print(result)
    return {'text':result}