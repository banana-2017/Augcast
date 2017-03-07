from video import generateTimestamp
import json

if __name__ == '__main__':
    filename = "test/test1.pdf"
    video = 'test/test1.mp4'

    timestamp = generateTimestamp(video, filename, "0", "0")
    print (timestamp)

    timemap = {}
    for i in range(len(timestamp)):
        timemap[i+1] = timestamp[i]

    # Output json
    json_string = json.dumps(timemap,sort_keys=True, indent=4)
    print (json_string)
