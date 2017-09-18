import json
import sys

import processor

QUEUE_FILE = 'queue.json'
VIDEO_DIR = 'video_files'


def main(): 

    # read queue
    with open (QUEUE_FILE) as queue_file:
        queue = json.load(queue_file)

    # exit if queue is in progress
    if queue['inProgress']:
        print ('Processing already in progress. Exiting..')
        sys.exit()

    newQueue = {'inProgress': 'true'}
    with open(QUEUE_FILE, 'w') as outfile:
            json.dump(newQueue, outfile)

    # iterating thru lectures
    courses = queue['lectures']
    for courseName in courses:
        print ('Processing course ' + courseName)
        
        course = courses[courseName]
        for lectureName in course:

            print ('Processing lecture ' + lectureName)
            video_url = course[lectureName]['video_url']
            fileName = VIDEO_DIR + '/' + lectureName + '.mp4'

            if video_url.endswith('.mp4'):
                processor.downloadAndProcessVideo (courseName, lectureName, fileName, video_url)

            else:
                print ('Skipping ', video_url, ', not a video')




if __name__ == '__main__':
    main()
