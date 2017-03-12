from video import generateTimestamp
from video import generateTimestampFromWeb
import json
import sys

media_url = sys.argv[1]
pdf_url  = sys.argv[2]
courseID = sys.argv[3]
lectureID = sys.argv[4]

test_media_url = "https://podcast.ucsd.edu/Podcasts//cse101_1_wi17/cse101_1_wi17-01202017-0900.mp4"
test_pdf_url = "https://firebasestorage.googleapis.com/v0/b/augcast-465ef.appspot.com/o/cse101-b-2%2F101w17day5b00.pdf?alt=media&token=6955c975-fd81-4577-b43e-b6713aec1391"
#http://podcast.ucsd.edu/podcasts/Download.aspx?fileId=122106

if __name__ == '__main__':
    # Generate the timestamps
    timestamp = generateTimestampFromWeb(test_media_url, test_pdf_url, courseID, lectureID)

    # Convert list to dict for json output
    timemap = {}
    for i in range(len(timestamp)):
        timemap[i+1] = timestamp[i]

    # Output json
    json_string = json.dumps(timemap,sort_keys=True)
    print ('result' + '#' + courseID + '#' + lectureID + '#' + json_string)
