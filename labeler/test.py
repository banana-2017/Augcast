from video import generateTimestamp
import os
import sys
import urllib

if __name__ == '__main__':
    filename = '/Users/Tejas/OneDrive - UC San Diego/Augcast/labeler/test/test1.pdf'
    video = '/Users/Tejas/OneDrive - UC San Diego/Augcast/labeler/test/test1.mp4'

    # Download files to disk (argv[1]: slides url, argv[2]: podcast media url)
    testfile = urllib.URLopener()
    testfile.retrieve(sys.argv[1], "slides.pdf")
    testfile.retrieve(sys.argv[2], "media.mp4")

    # Generate the timestamps
    timestamp = generateTimestamp("slides.pdf", "media.mp4")
    print (timestamp)

    # Remove downloaded files from disk
    os.remove("slides.pdf")
    os.remove("media.mp4")
