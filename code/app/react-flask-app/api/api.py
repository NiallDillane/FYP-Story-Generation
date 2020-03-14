import time
import subprocess
from contextlib import contextmanager
from flask import Flask

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time':time.time()}

@app.route('/getText')
def get_text():
    result = subprocess.run(['python', 'run_generation.py', 
        '--model_type=gpt2',
        '--length=30', 
        '--model_name_or_path=output', 
        '--prompt="One stormy night in Kansas"'], 
        stdout=subprocess.PIPE, cwd='./../../transformers/examples')
    result = result.stdout.decode('utf-8')
    print(result)
    return {'text':result}