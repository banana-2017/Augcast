import time
import json
import sys
import processor
import concurrent.futures

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


    pool = concurrent.futures.ProcessPoolExecutor(2);
    newQueue = {'inProgress': 'true'}
    with open(QUEUE_FILE, 'w') as outfile:
        json.dump(newQueue, outfile)


    # iterating thru lectures
    courses = queue['lectures']
    for courseName in courses:
        print ('Processing course ' + courseName)

        course = courses[courseName]
        for lectureName in course:

            video_url = course[lectureName]['video_url']
            fileName = VIDEO_DIR + '/' + lectureName + '.mp4'

            if video_url.endswith('.mp4'):
                print ('Adding lecture to pool ' + lectureName)
                pool.submit(processor.downloadAndProcessVideo, courseName, lectureName, fileName, video_url);


            else:
                print ('Skipping ', video_url, ', not a video')

    print ("Awaiting pool completion");
    pool.shutdown(wait=True);

    newQueue = {'inProgress': 'false'}
    with open(QUEUE_FILE, 'w') as outfile:
        json.dump(newQueue, outfile)

if __name__ == '__main__':
    main()
