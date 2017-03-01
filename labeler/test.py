from video import generateTimestamp
from pdf2img import pdf2img
from img2txt import img2txt

if __name__ == '__main__':
    filename = "test/test2.pdf"
    video = 'test/test2.mp4'

    timestamp = generateTimestamp(video, filename)
    print (timestamp)
