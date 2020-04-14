import time
import math
import subprocess
import random

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
    print('\n\nPARAMS[0]:\n', params[0])
    prompt = params[0].replace('</b> &#8203; <b>', ' ').rstrip()
    prompt = prompt.replace('</b>', '')
    print('\n\nPROMPT:\n', prompt)
    # Total length of new text, based on tokens
    length = math.floor((params[0].count(' ') * 1.5) + ((params[1][2] / 2) * 30))
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
    print('\n\nOUTPUT:\n', output)
    newText = output[:-1].replace(prompt, '')
    print('\n\nNEWTEXT:\n',newText)
    newText = newText.replace(' ', '</b> &#8203; <b>')
    
    result = params[0] + newText + '</b> '
    print('\n\nRESULT:\n', result)

    return {'text':result}