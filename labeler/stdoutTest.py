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

array = [0, 5, 10, 15, 20, 25, 30, 46, 23, 33, 434, 511]

print 'result'+'#'+courseID+'#'+lectureID+'#'+json.dumps(array)
sys.stdout.flush()
