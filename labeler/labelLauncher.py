#!/usr/bin/python

import sys
print('Current path: ' + str(sys.path));
from video import generateTimestamp
from video import generateTimestampFromWeb
import json

media_url = sys.argv[1]
pdf_url  = sys.argv[2]
courseID = sys.argv[3]
lectureID = sys.argv[4]


#test_pdf_url = "https://firebasestorage.googleapis.com/v0/b/cse110project-a890c.appspot.com/o/test1.pdf?alt=media&token=0721c873-d188-4b59-9eec-2b93d9fddf2e"
#test_media_url = "https://podcast.ucsd.edu/Podcasts//cse100_1_wi17/cse100_1_wi17-01272017-1000.mp4"


if __name__ == '__main__':
    # Generate the timestamps
    timestamp = generateTimestampFromWeb(media_url, pdf_url, courseID, lectureID)

    # error handling
    if (timestamp[0] == -3):
        print ("audio")
        sys.stdout.flush();
        exit()

    if (timestamp[0] == -2):
        print ("mismatch")
        sys.stdout.flush();
        exit()

    # Output json
    json_string = json.dumps(timestamp)
    print ('result' + '#' + courseID + '#' + lectureID + '#' + json_string)
    sys.stdout.flush();
