from Tesseract import Tesseract
from pytesseract import image_to_string
from PIL import Image
from difflib import SequenceMatcher
from pdfparser import convert
import cv2
import re


# fuzzy text comparison
def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()


# constants
'''
time  = int(cap.get(cv2.CV_CAP_PROP_POS_MSEC))
frameindex = int(cap.get(cv2.CV_CAP_PROP_POS_FRAMES))
fps    = int(cap.get(cv2.CV_CAP_PROP_FPS))
print ("length", length)
print ("time" , time)
print ("frameindex" , frameindex)
print ("fps" , fps)
'''

# generate timestamp of slides in the video
def generateTimestamp(video, filename):
    # timestamp corresponding to the slides
    timestamp = []

    # convert pdf to list of strings
    pdftext = convert(filename)

    # capture the video
    cap = cv2.VideoCapture(video)
    length = int(cap.get(cv2.cv.CV_CAP_PROP_FRAME_COUNT))

    tess = Tesseract()

    # local variables to perform search
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

    print('starting')

    # while(cap.isOpened()):
    # iterate through video to generate time stamp based on text comparison
    # of slides and video frames
    while (index < length):
        # read from video
        cap.set(cv2.cv.CV_CAP_PROP_POS_FRAMES, probeIndex)
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

        print( "page", probeIndex)

        # comparison with slide
        if newSlide:
            if (similar(re.sub("[^0-9a-zA-Z]", " ", currentText), pdftext[slideIndex]) > 0.26 or
                    similar(re.sub("r\W", " ", currentText), pdftext[slideIndex]) > 0.3):
                # duplicate slide
                print ("length of slides", len(slides))
                '''
                if (len(slides) == 8):
                    print (currentText)
                    print (pdftext[slideIndex])
                    print ("slides below")
                    for string in slides:
                        print (string)
                '''
                for string in slides:
                    print ("enter outer")
                    if similar(string, currentText) > 0.8:
                        print ("enter inner")
                        quitAppending = True
                        break
                if quitAppending == False:
                    print ("appending")
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
                for string in slides:
                    print ("enter outer")
                    if similar(string, currentText) > 0.8:
                        print ("enter inner")
                        quitAppending = True
                        break
                if quitAppending == False:
                    print ("appending")
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
        if (similar(currentText, nextText) > 0.7): ##very very similar
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

        print ("#################", index ,"##################")
        print ("current Timestamp")
        print (timestamp)
#       if cv2.waitKey(1) & 0xFF == ord('q'):
#           break

    # closure
    cap.release()
    cv2.destroyAllWindows()
    return timestamp
