import requests

i = 0
last = ''
ids = []
url = 'https://api.pushshift.io/reddit/search/submission/?subreddit=nosleep&fields=id,created_utc,title,selftext,score'

open('ns_over_1k.txt', 'w').close()

while i < 100000:
    request = requests.get('{}&before={}'.format(url,last))
    json = request.json()
    for post in json['data']:
        if post['score'] < 1000:
            continue
        print(str(i) + ' - ' + post['title'] + ' - ' + str(post['created_utc']))
        ids.append(post['id'])
        try:
            print(post['selftext'], file=open('./ns_over_1k.txt', 'a'))
        except:
            continue
        i += 1
    last = int(post['created_utc'])