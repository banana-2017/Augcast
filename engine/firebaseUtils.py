import json
import subprocess
from pprint import pprint
import pyrebase
from os import listdir

def slidesUpload (slidesPath, lectureName, courseName):
    uploadArgs = 'slidesUpload.py ' + slidesPath + ' ' + lectureName + ' ' + courseName
    uploadCode = subprocess.call('python ' + uploadArgs, shell=True);
    print ('Slides upload ended with exit code ' + str(uploadCode))

# upload timestamps and contents for a lecture
def contentUpload (lectureName, courseName, contentsArray, timestampArray):

    firebase = configureFirebase()
    db = firebase.database()

    updateObj = {'timestamps': timestampArray, 'contents': contentsArray}
    db.child("lectures").child(courseName).child(lectureName).update(updateObj)

    print ('Uploaded data to firebase for '+ lectureName)


def configureFirebase ():
    config = {}

    with open('../database/credentials.json') as data_file:
        config = json.load(data_file)
        config['serviceAccount'] = "../database/serviceAccountKey.json"

    firebase = pyrebase.initialize_app(config);

    return firebase
