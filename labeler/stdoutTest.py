#!/usr/local/bin/python
import sys
import json
from time import sleep

pdf_url = sys.argv[1]
media_url = sys.argv[2]
courseID = sys.argv[3]
lectureID = sys.argv[4]

for i in range(0, 101):
    print 'progress'+'#'+courseID+'#'+lectureID+'#'+str(i)
    sys.stdout.flush()
    sleep(0.5)

timestamps = [30, 46, 63, 99, 434, 511]
contents = ['Page 1 contents', 'Page 2 contents', 'Page 3 contents', 'Page 4 contents', 'Page 5 contents', 'Page 6 contents']


print 'result'+'#'+courseID+'#'+lectureID+'#'+json.dumps(timestamps)
print 'content'+'#'+courseID+'#'+lectureID+'#'+json.dumps(contents)
sys.stdout.flush()
