import urllib
import re
import json
import multiprocessing

from bs4 import BeautifulSoup

lectureNumber = 0
courseNumber = 0

courseList = []
lectureList = []


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
    courseUrl = "https://podcast.ucsd.edu" + courseInfo['href']
    courseTitle = courseInfo.text

    # get the course professor
    courseProf = eachCourse.find('td', {"class": "prof"}).text

    # store the individual course information to the dictionary
    eachCourseDic = {}
    eachCourseDic['title'] = courseTitle
    eachCourseDic['url'] = courseUrl
    eachCourseDic['professor'] = courseProf

    # store the course information to the course list
    courseList.append(eachCourseDic)


    ###################################### Lecture Information ###################################################

    # open the url and of each course's podcast page
    htmlTextCoursePodcast = urllib.urlopen(courseUrl).read()

    # convert to soup
    soupCoursePodcast = BeautifulSoup(htmlTextCoursePodcast, "html.parser", from_encoding='uft-8')

    lectureInfo = soupCoursePodcast.find_all('div', {"class": "lecture"})

    for eachLecutureInfo in lectureInfo:
        eachLectureDic = {}
        lectureMedia = "https://podcast.ucsd.edu/Podcasts//" + eachLecutureInfo.find('span')['forfile']
        lectureDate = eachLecutureInfo.find('a').text.strip()

        # store the lecture information to the dictionary
        eachLectureDic['video_url'] = lectureMedia
        eachLectureDic['date'] = lectureDate
        eachLectureDic['course'] = courseTitle

        # store the lecture information to the lecture list
        lectureList.append(eachLectureDic)
        lectureNumber = lectureNumber + 1

    courseNumber = courseNumber + 1



with open('course.json', 'w') as outfile:
    # for eachCourseList in courseList:
        json.dump(courseList, outfile)
        outfile.write('\n')


with open('lecuture.json', 'w') as outfile:
    # for eachLecutureList in lectureList:
        json.dump(lectureList, outfile)
        outfile.write('\n')

with open('eachlecuture.json', 'w') as outfile:
    for eachLecutureList in lectureList:
        json.dump(eachLecutureList, outfile)
        outfile.write('\n')

print "unauthenticated course: "
print courseNumber
print '\n'
print "total lecuture: "
print lectureNumber
