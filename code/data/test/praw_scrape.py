import praw
from praw.models import MoreComments
import configparser

config = configparser.ConfigParser()
config.read('config.ini')

cid = config['reddit']['cid']
csec = config['reddit']['csec']
uage = config['reddit']['uage']

reddit = praw.Reddit(client_id = cid, client_secret = csec, user_agent = uage)

open('wpdata.txt', 'w').close()

posts = list()
for submission in reddit.subreddit('nosleep').top(limit=1000):
    posts.append(submission)

mods = reddit.subreddit('nosleep').moderator()

i=0
for post in posts:
    i += 1
    print(i)
    if post.author not in mods:
        print(post.score)
        print(post.selftext, file=open('./wpdata.txt', 'a'))
