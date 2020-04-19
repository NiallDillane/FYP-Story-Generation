import time
import math
import subprocess
import random
import re

from contextlib import contextmanager
from flask import Flask, request
from flask_cors import CORS

# Flask app
app = Flask(__name__, static_folder='../frontend/build')

# To enable request/response
CORS(app)

@app.route('/time')
def get_current_time():
    """
    Simple time getter function.
    Initially for testing purposes,
    perhaps also for timing generation
    """
    return {'time':time.time()}


@app.route('/getText', methods = ['POST'])
def get_text():
    """
    Calls run_generation.py script to generate text with parameters
    """
    params = request.json
    params[0] = params[0].rstrip()
    prompt = params[0].replace('<b>', '')
    prompt = prompt.replace('</b>', '')
    prompt = prompt.replace('<br><br>', '')
    prompt = prompt.replace(' \u200b', '')
    # Total length of new text, based on tokens
    length = math.floor((prompt.count(' ') * 1.5) + ((params[1][2] / 2) * 20))
    # If seed isn't set, use a random number
    seed = str(params[1][3]) if params[1][3] != 0 else str(random.randint(0, 2000000000))
    
    output = subprocess.run(['python', 'run_generation.py', 
        '--model_type=gpt2',
        '--length=' + str(length), 
        '--temperature=' + str(params[1][1]),
        '--model_name_or_path=output', 
        '--padding_text=" "',
        '--seed=' + seed,
        '--prompt=' + prompt], 
        stdout=subprocess.PIPE, cwd='./../../transformers/examples')
    
    output = output.stdout.decode('utf-8')
    newText = output[:-1].replace(prompt, '')
    newText = newText.replace(' ', '</b> \u200b <b>')
    
    result = params[0] + newText + '</b> \u200b'
    result = re.sub('\n+', '</b> \u200b<br><br><b>', result)

    return {'text':result}