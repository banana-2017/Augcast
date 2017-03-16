from Tesseract import Tesseract
from pytesseract import image_to_string
from PIL import Image
from difflib import SequenceMatcher
from pdfparser import convert
import json
import cv2
import re
import sys
import urllib
import os



# fuzzy text comparison
def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

# generate timestamp of slides in the video
def generateTimestamp(video, filename, courseID, lectureID):
    # timestamp corresponding to the slides
    timestamp = [-1]

    # convert pdf to list of strings
    pdftext = convert(filename)
    '''
    # print pdftext to stdout
    pdfdict = {}
    for i in range(len(pdftext)):
        pdfdict[i+1] = pdftext[i]
    # Output json
    '''
    pdftext = [-1] + pdftext
    json_string = json.dumps(pdftext, sort_keys=True)

    print ('content' + '#' + courseID + '#' + lectureID + '#' + json_string)
    sys.stdout.flush();

    # capture the video
    cap = cv2.VideoCapture(video)
    length = int(cap.get(cv2.cv.CV_CAP_PROP_FRAME_COUNT))

    tess = Tesseract()

    # local variables to perform search
    debug = True
    index = 0
    slideIndex = 1
    slideLength = len(pdftext)
    probeIndex = index
    defaultProbeRate = 2**4
    currentProbeRate = defaultProbeRate
    currentText = ""
    nextText = ""
    newSlide = True
    quitAppending = False
    full_of_image = False
    slides = []

    # while(cap.isOpened()):
    # iterate through video to generate time stamp based on text comparison
    # of slides and video frames
    while (index < length):
        # read from video
        cap.set(cv2.cv.CV_CAP_PROP_POS_MSEC, probeIndex * 1000)

        ret, image = cap.read()
        if image is None:
            break
        height, width, depth = image.shape


        # optical character recognition
        tess.set_image(image.ctypes, width, height, depth)
        nextText = tess.get_text()
        if nextText is None:
            nextText = "."
        else:
            nextText = nextText.strip()

        # first time entrance
        if currentText == "":
            currentText = nextText
            probeIndex += currentProbeRate
            continue

        #print( "page", probeIndex)

        # comparison with slide
        if newSlide:
            newSlide = False
            if (similar(re.sub("[^0-9a-zA-Z]", " ", currentText), pdftext[slideIndex]) > 0.26 or
                    similar(re.sub("r\W", " ", currentText), pdftext[slideIndex]) > 0.3):
                # duplicate slide
                #print ("length of slides", len(slides))
                '''
                if (len(slides) == 8):
                    print (currentText)
                    print (pdftext[slideIndex])
                    print ("slides below")
                    for string in slides:
                        print (string)

                for string in slides:
                    if similar(string, currentText) > 0.8:
                        quitAppending = True
                        break
                '''
                if quitAppending == False:
                    #print ("appending")
                    slides.append(currentText)
                    timestamp.append(index)
                    slideIndex += 1
                    newSlide = False
                    #json_string = json.dumps(timestamp)
                    #print ('result' + '#' + courseID + '#' + lectureID + '#' + json_string)
                    #sys.stdout.flush()
                else:
                    quitAppending = False
                # done

                if slideIndex == slideLength:
                    break

            elif similar(re.sub("[^0-9a-zA-Z]", " ", currentText), pdftext[slideIndex+1]) > 0.4 or similar(re.sub("r\W", " ", currentText), pdftext[slideIndex+1]) > 0.3:
                '''
                for string in slides:
                    print ("enter outer")
                    if similar(string, currentText) > 0.8:
                        print ("enter inner")
                        quitAppending = True
                        break
                '''
                if quitAppending == False:
                    #print ("appending")
                    slides.append("")
                    slides.append(currentText)
                    timestamp.append(-1)
                    timestamp.append(index)
                    slideIndex += 2
                    newSlide = False
                else:
                    quitAppending = False

                # done
                if slideIndex == slideLength:
                    break




        '''
        if full_of_image:
            if similar(re.sub("[^0-9a-zA-Z]", " ", nextText), pdftext[slideIndex]) > 0.4 or similar(re.sub("r\W", " ", nextText), pdftext[slideIndex]) > 0.3:
                full_of_image = False
        '''

        #print(nextText)
        # jump through video frames if nextText is similar to currentText
        if full_of_image or similar(currentText, nextText) > 0.7:# or similar(currentText[:20], nextText[:20]) > 0.8 or len(re.sub(r'\W+', '', nextText)) < 10 : ##very very similar

            index = probeIndex
            probeIndex += defaultProbeRate
            #print("probeIndex", probeIndex)
            currentProbeRate = defaultProbeRate
            currentText = nextText

        # decrease probeRate to search for similar video frames
        else:

            # locate a video frame different from before
            # set newSlide to true to compare with slides
            if currentProbeRate == 1:
                '''
                if len(pdftext[slideIndex+1]) < 5:
                    timestamp.append(-1)
                    slideIndex += 1
                '''
                '''
                if len(pdftext[slideIndex]) < 5:
                    slides.append(currentText)
                    timestamp.append(index)
                    slideIndex += 1
                    full_of_image = True
                '''
                newSlide = True;
                index += 1
                currentText = nextText
                currentProbeRate = defaultProbeRate
                probeIndex += currentProbeRate
                continue

            currentProbeRate /=2
            probeIndex -= currentProbeRate
            #print("probeIndex", probeIndex)
            continue

        int_progress = int((index*100/length))
        # current progress
        print ('progress'+'#'+courseID+'#'+lectureID+'#'+str(int_progress))
        sys.stdout.flush();

        # error handling for wrong slide
        if (int_progress > 20 and len(timestamp) <= 1):
            timestamp[0] = -2
            return timestamp

        if debug == True:
            print ("#################", index ,"##################")
            print ("current Timestamp")
            print (timestamp)
            sys.stdout.flush();

    # closure
    cap.release()
    cv2.destroyAllWindows()
    return timestamp

def generateTimestampFromWeb(videoURL, pdfURL, courseID, lectureID):
    media_name = lectureID + ".mp4"
    pdf_name = lectureID + ".pdf"

    #print("at " + str(os.getcwd()));

    # error handling for audio
    if (videoURL[-3:] == 'mp3'):
        return [-3]

    opener = urllib.URLopener()
    opener.retrieve(videoURL, media_name)
    opener.retrieve(pdfURL, pdf_name)


    timestamp = generateTimestamp(media_name, pdf_name, courseID, lectureID)

    try:
        os.remove(media_name)
        os.remove(pdf_name)
    except:
        pass

    return timestamp
