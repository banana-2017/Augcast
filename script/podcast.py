import urllib
import re
import json
import multiprocessing

from bs4 import BeautifulSoup

lectureNumber = 0
courseNumber = 0

courseDic = {}
lectureDic = {}
table = {}

# url and the HTML text of podcast
urlPodcast = "https://podcast.ucsd.edu/"
htmlTextPodcast = urllib.urlopen(urlPodcast).read()

# convert to soup
soupPodcast = BeautifulSoup(htmlTextPodcast, "html.parser", from_encoding='uft-8')

# find course
currentCourse = soupPodcast.find('div', id="courses_div")

for eachCourse in currentCourse.find_all('tr'):

    # skip the course which need authentication
    authentication = eachCourse.attrs
    if authentication:
        continue

    # get the course podcast url and course name
    courseInfo = eachCourse.find('a', {"class": "PodcastLink"})
    courseUrl = str("https://podcast.ucsd.edu" + courseInfo['href'])
    courseTitle = str(courseInfo.text)

    # get the course professor
    courseProf = eachCourse.find('td', {"class": "prof"}).text

    # refine the keyword
    courseNum = courseTitle.split('-')[0]
    courseSection = courseTitle.split('-')[-1]
    courseID = courseNum + courseSection.replace('[', '').replace(']', '')
    courseName = "".join(courseTitle.split('-')[1:-1])

    # store the individual course information to the dictionary
    eachCourseDic = {}
    lectureList = []
    eachCourseDic['name'] = courseName
    eachCourseDic['url'] = courseUrl
    eachCourseDic['professor'] = courseProf

    ###################################### Lecture Information ###################################################

    # open the url and of each course's podcast page
    htmlTextCoursePodcast = urllib.urlopen(courseUrl).read()

    # convert to soup
    soupCoursePodcast = BeautifulSoup(htmlTextCoursePodcast, "html.parser", from_encoding='uft-8')

    lectureInfo = soupCoursePodcast.find_all('div', {"class": "lecture"})

    lectureNum = 0
    for eachLecutureInfo in lectureInfo:
        eachLectureDic = {}

        lectureMedia = "https://podcast.ucsd.edu/Podcasts//" + eachLecutureInfo.find('span')['forfile']
        lectureDate = eachLecutureInfo.find('a').text.strip()

        # store the lecture information to the dictionary
        eachLectureDic['video_url'] = lectureMedia
        eachLectureDic['date'] = lectureDate

        if "[" not in lectureDate:
            lectureNum = lectureNum + 1


        lectureID = courseID + " LE" + str(lectureNum)

        lectureDic[lectureID] = eachLectureDic

        # store the lecture information to the lecture list
        lectureList.append(lectureID)
        lectureNumber = lectureNumber + 1

    # add lecture list into eachCourseDic
    eachCourseDic["lecture"] = lectureList
    # store the course information to the course dictionary
    courseDic[courseID] = eachCourseDic
    courseNumber = courseNumber + 1

    table["courses"] = courseDic
    table["lecture"] = lectureDic

# write to json file
with open('table.json', 'w') as outfile:
    # for eachCourseList in courseList:
        json.dump(table, outfile)
        outfile.write('\n')


print "unauthenticated course: "
print courseNumber
print '\n'
print "total lecuture: "
print lectureNumber
