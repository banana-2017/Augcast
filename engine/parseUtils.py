SECONDS_IN_HOURS = 3600;
SECONDS_IN_MINUTES = 60;

def parseTimetable (timetablePath): 

    timeArray = []

    with open(timetablePath) as timetable:
            for line in timetable:
                tokens = line.split(':')

                hours = int(tokens[1])
                minutes = int(tokens[2])
                seconds = int(tokens[3].split('.')[0])

                timeInSeconds = hours * SECONDS_IN_HOURS + \
                                minutes * SECONDS_IN_MINUTES + \
                                seconds

                timeArray.append (timeInSeconds)

    return timeArray

def parseContents (contentsDir, length):

    contentsArray = []
    
    for i in range(1, length+1):
        filename = contentsDir + str(i) + '.txt'

        with open(filename, 'r') as contentsFile:
            data=contentsFile.read().replace('\n', '')
            contentsArray.append (data.strip())

    return contentsArray
