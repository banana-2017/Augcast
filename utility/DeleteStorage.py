import json
import pyrebase

config = {}
with open('../database/credentials.json') as data_file:
    config = json.load(data_file)
    config['serviceAccount'] = "../database/serviceAccountKey.json"
firebase = pyrebase.initialize_app(config);
storage = firebase.storage()
files = storage.list_files()

# Delete all files
for f in files:
    print("Removing " + f.name)
    try:
        storage.delete(f.name)
    except Exception as e:
        print(e)
