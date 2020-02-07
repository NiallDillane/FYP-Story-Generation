import praw
from praw.models import MoreComments

cid = '-EcLqkpdcPyCgg'
csec = 'jR55DdfZK5c7_ZxF_z4f89i5fD4'
uage = 'macOS:TestWebScrape (by /u/Mus7ache)'

reddit = praw.Reddit(client_id = cid, client_secret = csec, user_agent = uage)

open('wpdata.txt', 'w').close()

posts = list()
for submission in reddit.subreddit('writingprompts').top(limit=1000):
    posts.append(submission)

for post in posts:
    splitTitle = post.title.split(']', 1)
    if splitTitle[0] == '[WP':
        print(splitTitle[1].lstrip())
        for top_level_comment in post.comments:
            if isinstance(top_level_comment, MoreComments):
                continue
            if (top_level_comment.score >= 10) & (top_level_comment.author != 'AutoModerator') & (top_level_comment.author != 'WritingPromptsRobot'):
                print(top_level_comment.score)
                print('<<start>>' + top_level_comment.body + '<<end>>',  file=open('./wpdata.txt', 'a'))