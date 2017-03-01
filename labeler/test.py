from video import generateTimestamp


if __name__ == '__main__':
    filename = "test/test1.pdf"
    video = 'test/test1.mp4'

    print('Generating timestamps');
    timestamp = generateTimestamp(video, filename)
    print('Completed timestamps');
    print (timestamp)
