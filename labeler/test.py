from video import generateTimestamp
from video import generateTimestampFromWeb
import json
import sys

media_url = sys.argv[1]
pdf_url  = sys.argv[2]
courseID = sys.argv[3]
lectureID = sys.argv[4]

test_media_url = "https://podcast.ucsd.edu/Podcasts//cse20_1_wi17/cse20_1_wi17-03142017-0930.mp4"
test_pdf_url = "https://firebasestorage.googleapis.com/v0/b/augcast-465ef.appspot.com/o/cse100-a-7%2Ftest1.pdf?alt=media&token=7207cbfe-8bbf-49c6-a1c3-d4a5d1db799a"
#http://podcast.ucsd.edu/podcasts/Download.aspx?fileId=122106

cse_100 = "https://podcast.ucsd.edu/Podcasts//cse100_wi17/cse100_wi17-01272017-0900.mp4"
audio= "https://podcast.ucsd.edu/Podcasts//anar164sio164_wi17/anar164sio164_wi17-03132017-1300.mp3"
if __name__ == '__main__':
    # Generate the timestamps
    timestamp = generateTimestampFromWeb(test_media_url, test_pdf_url, courseID, lectureID)

    if (timestamp[0] == -3):
        print ("audio")
        exit()

    if (timestamp[0] == -2):
        print ("mismatch")
        exit()

    # Output json
    json_string = json.dumps(timestamp)
    print ('result' + '#' + courseID + '#' + lectureID + '#' + json_string)
    sys.stdout.flush();
