#!/usr/bin/env python2

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
urlPodcast = 'https://podcast.ucsd.edu/'
htmlTextPodcast = urllib.urlopen(urlPodcast).read()

# convert to soup
soupPodcast = BeautifulSoup(htmlTextPodcast, 'html.parser', from_encoding='uft-8')

# find course
currentCourse = soupPodcast.find('div', id='courses_div')

for thisCourse in currentCourse.find_all('tr'):

    # skip the course which need authentication
    authentication = thisCourse.attrs
    if authentication:
        continue

    # get the course podcast url and course name
    courseInfo = thisCourse.find('a', {'class': 'PodcastLink'})
    # courseUrl = str('https://podcast.ucsd.edu' + courseInfo['href'])
    courseUrl = courseInfo['href']
    courseTitle = str(courseInfo.text)

    # get the course professor
    courseProf = thisCourse.find('td', {'class': 'prof'}).text

    # explode
    if len(courseTitle.split(' - ')) < 3:
        continue;
    number, subject, section = courseTitle.split(' - ')
    numberPattern = re.compile(r'([A-Z]+) ?(\d+[A-Z]?)+')
    sectionPattern = re.compile(r'([A-Z]+) \[([A-Z]\d+)\]')

    # in case of joint course number
    for num in re.sub(numberPattern, r'\1\2', number).split():
        # store the individual course information to the dictionary
        thisCourse = {}

        sectionType, sectionID = re.sub(sectionPattern, r'\1 \2', section).split()

        # no discussions -- just no
        if sectionType != 'LE':
            continue

        courseID = (num + '-' + (sectionID[0] if sectionType == 'LE' else sectionID)).lower()
        if (courseID.find("/") != -1):
            courseID = courseID.replace("/", "-")

        courseDept, courseNum = re.sub(numberPattern, r'\1 \2', num).split()

        thisCourse['id']        = courseID
        thisCourse['dept']      = courseDept
        thisCourse['num']       = courseNum
        thisCourse['subject']   = subject
        thisCourse['url']       = courseUrl
        thisCourse['professor'] = courseProf
        thisCourse['type']      = sectionType
        thisCourse['section']   = sectionID

        ###################################### Lecture Information ###################################################
        lectureDic[courseID] = {}
        lectureList = []

        # open the url and of each course's podcast page
        htmlTextCoursePodcast = urllib.urlopen(courseUrl).read()

        # convert to soup
        soupCoursePodcast = BeautifulSoup(htmlTextCoursePodcast, 'html.parser', from_encoding='uft-8')

        lectureNum = 0
        weeks = soupCoursePodcast.find_all('div', {'class': 'week'})
        for w in weeks:
            week = w.find('h3').text.split()[1]
            lectures = w.find_all('div', {'class': 'lecture'})

            # construct lecture object
            for lecture in lectures:
                thisLecture = {}
                lectureMedia = 'https://podcast.ucsd.edu/Podcasts//' + lecture.find('span')['forfile']
                lectureDate = lecture.find('a').text.strip()

                lectureID = (courseID + '-' + str(lectureNum)).lower()

                if '[' in lectureDate:
                    continue

                thisLecture['id'] = lectureID
                thisLecture['num'] = lectureNum
                thisLecture['video_url'] = lectureMedia
                thisLecture['day'], thisLecture['month'], thisLecture['date'] = re.sub(r'(\w+) (\d+)/(\d+).*', r'\1 \2 \3', lectureDate).split()
                thisLecture['week'] = week

                lectureList.append(lectureID);

                # store the lecture information to the lecture list
                # lectureList.append(lectureID)
                lectureNum = lectureNum + 1
                lectureNumber = lectureNumber + 1

                lectureDic[courseID][lectureID] = thisLecture


        # add lecture list into this course
        thisCourse['lectures'] = lectureList

        # store the course information to the course dictionary
        courseDic[courseID] = thisCourse
        courseNumber = courseNumber + 1

        # store the lecture information to the lecture dictionary
        #lectureDic[courseID][lectureID] = thisLecture

table['courses'] = courseDic
table['lectures'] = lectureDic

# write to json file
with open('table.json', 'w') as outfile:
    # for eachCourseList in courseList:
        # json.dump(table, outfile)
        json.dump(table, outfile, sort_keys=True, indent=4, separators=(',', ': '))
        outfile.write('\n')
with open('courses.json', 'w') as outfile:
    # for eachCourseList in courseList:
        # json.dump(table, outfile)
        json.dump(courseDic, outfile, sort_keys=True, indent=4, separators=(',', ': '))
        outfile.write('\n')
with open('lectures.json', 'w') as outfile:
    # for eachCourseList in courseList:
        # json.dump(table, outfile)
        json.dump(lectureDic, outfile, sort_keys=True, indent=4, separators=(',', ': '))
        outfile.write('\n')


# print 'unauthenticated course: '
# print courseNumber
# print '\n'
# print 'total lecture: '
# print lectureNumber
print 'Total lectures scraped: ', lectureNumber
