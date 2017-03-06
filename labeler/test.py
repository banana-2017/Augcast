from video import generateTimestamp
import os
import sys
import urllib
import json

if __name__ == '__main__':
    filename = '/Users/Tejas/OneDrive - UC San Diego/Augcast/labeler/test/test1.pdf'
    video = '/Users/Tejas/OneDrive - UC San Diego/Augcast/labeler/test/test1.mp4'

    # Download files to disk (argv[1]: slides url, argv[2]: podcast media url)
    testfile = urllib.URLopener()
    testfile.retrieve(sys.argv[1], "slides.pdf")
    testfile.retrieve(sys.argv[2], "media.mp4")

    # Generate the timestamps
    timestamp = generateTimestamp("slides.pdf", "media.mp4")

    # Convert list to dict for json output
    timemap = {}
    for i in range(len(timestamp)):
        timemap[i+1] = timestamp[i]

    # Output json
    json_string = json.dumps(timemap,sort_keys=True, indent=4)
    print ('result' + '#' + courseID + '#' + lectureID + json_string)


    # Remove downloaded files from disk
    os.remove("slides.pdf")
    os.remove("media.mp4")
