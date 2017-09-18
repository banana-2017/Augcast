import json
from pprint import pprint
import pyrebase
from os import listdir

def slidesUpload (slidesPath, lectureName, courseName):

    firebase = configureFirebase()
    storage = firebase.storage()
    db = firebase.database()

    # Get all files in given slides directory
    for file in listdir(slidesPath):

        # Get relative filepath to slide to upload
        filepath = slidesPath + file
        location = lectureName + "/" + file

        # Upload the slide and get the URL
        print('Storing ', filepath, 'at ', location);
        storage.child(location).put(filepath, "token")
        url = storage.child(lectureName + "/" + file).get_url("token")

        # Upload the url to database
        nameNoExtension = str(int(file[:-4]) - 1) #Strip extension
        db.child('/lectures/' + courseName + '/' + lectureName + '/slides').child(nameNoExtension).set(url);
        print("Uploaded slides for " + nameNoExtension);


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
