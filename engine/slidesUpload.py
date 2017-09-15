import json
from pprint import pprint
import sys
import pyrebase
from os import listdir
from os.path import isfile, join

config = {}
with open('../database/credentials.json') as data_file:
    config = json.load(data_file)
    config['serviceAccount'] = "../database/serviceAccountKey.json"
firebase = pyrebase.initialize_app(config);
storage = firebase.storage()
db = firebase.database()

SLIDES_PATH = sys.argv[1]
LEC_NAME = sys.argv[2]
COURSE_NAME = sys.argv[3]

# Get all files in given slides directory
for file in listdir(SLIDES_PATH):
    # Get relative filepath to slide to upload
    filepath = SLIDES_PATH + file

    # Upload the slide and get the URL
    storage.child(LEC_NAME + "/" + file).put(filepath, "token")
    url = storage.child(LEC_NAME + "/" + file).get_url("token")

    # Upload the url to database
    nameNoExtension = str(int(file[:-4]) - 1) #Strip extension
    db.child('/lectures/' + COURSE_NAME + '/' + LEC_NAME + '/slides').child(nameNoExtension).set(url);
    print("Uploaded " + nameNoExtension);
