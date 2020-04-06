import time
import subprocess
import random

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
    params = request.json
    length = (params[0].count(' ') * 2) + (params[2] * 30)
    seed = str(params[3]) if params[3] != 0 else str(random.randint(0, 2000000000))
    
    result = subprocess.run(['python', 'run_generation.py', 
        '--model_type=gpt2',
        '--length=' + str(length), 
        '--temperature=' + str(params[1]),
        '--model_name_or_path=output', 
        '--padding_text=" "',
        '--seed=' + seed,
        '--prompt=' + params[0]], 
        stdout=subprocess.PIPE, cwd='./../../transformers/examples')
    result = result.stdout.decode('utf-8')
    print(result)
    return {'text':result}