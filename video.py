import numpy as np
from pytesseract import image_to_string
from PIL import Image
import cv2
from Tesseract import Tesseract

# constant
'''
length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
time  = int(cap.get(cv2.CAP_PROP_POS_MSEC))
frameindex = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
fps    = int(cap.get(cv2.CAP_PROP_FPS))
print ("length", length)
print ("time" , time)
print ("frameindex" , frameindex)
print ("fps" , fps)
'''



if __name__ == '__main__':
    # timestamp corresponding to the slides
    timestamp = []
    # capture the video
    cap = cv2.VideoCapture('cse100_hash.mp4')
    cap.set(cv2.CAP_PROP_FPS, 10000)
    tess = Tesseract()

    while(cap.isOpened()):

        # read from video
        ret, image = cap.read()
        height, width, depth = image.shape

        # optical character recognition
        tess.set_image(image.ctypes, width, height, depth)
        text = tess.get_text()

        if text == None:
            continue
        else
            text = text.strip()

        # comparison with slide text
        #
        #

        print text

        if cv2.waitKey(10) == 27:                     # exit if Escape is hit
            break
#       if cv2.waitKey(1) & 0xFF == ord('q'):
#           break

    # closure
    cap.release()
    cv2.destroyAllWindows()
