import os
import urllib
import subprocess

import parseUtils
import firebaseUtils

OCR_DIR = 'ocr_output'
DETECTION_SCRIPT = '../ocr/detector.py';
SORTING_SCRIPT = '../ocr/sorter.py';
CONTENT_SCRIPT = '../ocr/extractor.py';

def downloadAndProcessVideo(courseName, lectureName, fileName, video_url):
    downloadVideo (video_url, fileName)
    uniqueSlidesDir, timestampArray, contentsArray = processVideo (lectureName, fileName)

    firebaseUtils.slidesUpload (uniqueSlidesDir, lectureName, courseName)
    firebaseUtils.contentUpload (lectureName, courseName, contentsArray, timestampArray)
    

# Downloads the file
def downloadVideo (url, name):
    print ('Downloading ' + name)
    urllib.urlretrieve (url, name)
    


# Handles video processing by starting python subprocesses
def processVideo (lectureName, fileName):
    outputDir = OCR_DIR + '/' + lectureName

    slidesDir = outputDir + '/' + 'slides/';
    uniqueSlidesDir = outputDir + '/' + 'unique/';
    contentsDir = outputDir + '/' + 'contents/';
    timetableFile = outputDir + '/' + 'timetable.txt';

    detectionArgs = DETECTION_SCRIPT + ' -d ' + fileName + ' -o ' + slidesDir
    sortingArgs = SORTING_SCRIPT + ' -d ' + slidesDir + ' -o ' + uniqueSlidesDir + ' -t ' + timetableFile
    extractionArgs = CONTENT_SCRIPT + ' -d ' + uniqueSlidesDir + ' -o ' + contentsDir

    if not os.path.exists (outputDir):
        os.mkdir (outputDir)

    print ('Processing ' + lectureName)

    detectionCode = subprocess.call('python ' + detectionArgs, shell=True)
    print ('Detection ended with exit code ' + str(detectionCode))

    sortingCode = subprocess.call('python ' + sortingArgs, shell=True)
    print ('Sorting ended with exit code ' + str(sortingCode))

    extractionCode = subprocess.call('python ' + extractionArgs, shell=True)
    print ('Content extraction ended with exit code ' + str(extractionCode))

    timestampArray = parseUtils.parseTimetable (timetableFile)
    contentsArray = parseUtils.parseContents (contentsDir, len(timestampArray))

    return (uniqueSlidesDir, timestampArray, contentsArray)

