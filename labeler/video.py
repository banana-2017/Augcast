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
    timestamp = []

    # convert pdf to list of strings
    pdftext = convert(filename)

    # print pdftext to stdout
    pdfdict = {}
    for i in range(len(pdftext)):
        pdfdict[i+1] = pdftext[i]

    # Output json
    json_string = json.dumps(pdfdict, sort_keys=True, indent=4)
    print ('content' + '#' + courseID + '#' + lectureID + '#' + json_string)
    sys.stdout.flush();

    # capture the video
    cap = cv2.VideoCapture(video)
    length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    tess = Tesseract()

    # local variables to perform search
    debug = False
    index = 0
    slideIndex = 0
    slideLength = len(pdftext)
    probeIndex = index
    defaultProbeRate = 2**4
    currentProbeRate = defaultProbeRate
    currentText = ""
    nextText = ""
    newSlide = True
    quitAppending = False
    slides = []

    # while(cap.isOpened()):
    # iterate through video to generate time stamp based on text comparison
    # of slides and video frames
    while (index < length):
        # read from video
        cap.set(cv2.CAP_PROP_POS_MSEC, probeIndex * 1000)
        ret, image = cap.read()
        if image == None:
            break
        height, width, depth = image.shape


        # optical character recognition
        tess.set_image(image.ctypes, width, height, depth)
        nextText = tess.get_text()
        if nextText == None:
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
                '''
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
                    slides.append(currentText)
                    timestamp.append(index)
                    slideIndex += 1
                    newSlide = False
                else:
                    quitAppending = False
                # done

                if slideIndex == slideLength:
                    break
                    #currentText = nextText
            elif (similar(re.sub("[^0-9a-zA-Z]", " ", currentText), pdftext[slideIndex+1]) > 0.4 or
                similar(re.sub("r\W", " ", currentText), pdftext[slideIndex+1]) > 0.3):
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

            newSlide = False



        # jump through video frames if nextText is similar to currentText
        if (similar(currentText, nextText) > 0.8): ##very very similar
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
                newSlide = True;
                index += 1
                currentText = nextText
                currentProbeRate = defaultProbeRate
                probeIndex += currentProbeRate
                continue

            #print("ever entered?")
            #print( "currentProbe", currentProbeRate)
            currentProbeRate /=2
            #print( "currentProbe", currentProbeRate)
            probeIndex -= currentProbeRate
            #print("probeIndex", probeIndex)
            continue

        # current progress
        print ('progress'+'#'+courseID+'#'+lectureID+'#'+str(round((index*100/length))))
        sys.stdout.flush();

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
