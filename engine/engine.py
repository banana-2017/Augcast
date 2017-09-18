import json
import sys

import processor

QUEUE_FILE = 'queue.json'
VIDEO_DIR = 'video_files'
OCR_DIR = 'ocr_output'


def main(): 

    # read queue
    with open (QUEUE_FILE) as queue_file:
        queue = json.load(queue_file)

    print queue 

    # exit if queue is in progress
    if queue['inProgress']:
        print ('Processing already in progress. Exiting..')
        sys.exit()


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
