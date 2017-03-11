from video import generateTimestamp
from video import generateTimestampFromWeb
import json
import sys

media_url = sys.argv[1]
pdf_url  = sys.argv[2]
courseID = sys.argv[3]
lectureID = sys.argv[4]

test_pdf_url = "https://firebasestorage.googleapis.com/v0/b/cse110project-a890c.appspot.com/o/test1.pdf?alt=media&token=0721c873-d188-4b59-9eec-2b93d9fddf2e"
test_media_url = "https://podcast.ucsd.edu/Podcasts//cse100_1_wi17/cse100_1_wi17-01272017-1000.mp4"

print (media_url);
print (pdf_url);
print (courseID);
print (lectureID);


if __name__ == '__main__':
    # Generate the timestamps
    timestamp = generateTimestampFromWeb(media_url, pdf_url, courseID, lectureID)

    # Convert list to dict for json output
    timemap = {}
    for i in range(len(timestamp)):
        timemap[i+1] = timestamp[i]

    # Output json
    json_string = json.dumps(timemap,sort_keys=True, indent=4)
    print ('result' + '#' + courseID + '#' + lectureID + json_string)
    sys.stdout.flush();
