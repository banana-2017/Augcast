from video import generateTimestamp
import sys

if __name__ == '__main__':
    filename = '/Users/Tejas/OneDrive - UC San Diego/Augcast/labeler/test/test1.pdf'
    video = '/Users/Tejas/OneDrive - UC San Diego/Augcast/labeler/test/test1.mp4'

    print('Generating timestamps');
    timestamp = generateTimestamp(video, filename)
    print('Completed timestamps');
    print (timestamp)
