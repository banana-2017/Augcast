# Augcast

## Synopsis

Augcast is a website that augments the functionality of <podcast.ucsd.edu>. Augcast improves upon traditional podcasts by offering a instant search through a podcast’s content, and skipping to the exact lecture and timestamp where a certain phrase is discussed. This is done by Optical Character Recognition on a given podcast’s PDF slides. Once the slides have been uploaded to our website, the contents will be indexed and mapped to the exact times where the words appear on the video podcast. Thus, users can search any term that appears in their lecture notes and will be taken to the exact time their professor was discussing it in class, eliminating the need to skim through several podcasts trying to find the exact time a topic was covered.

## Usage

Just visit <augcast.ucsd.edu> (still in construction). You will need a valid @ucsd.edu address to log in.

## Installation for Development

Clone the repository and run 
```
npm install
npm run prod
```

You then need to create the project-specific ```credentials.json``` file in the ```database``` folder. See the internal Slack for the file.

## Built With

 * Node.js
 * Express
 * React
 * Many APIs! Check our package.json to view them all.

## Contributors
Made at UCSD with ❤️

Contributors alphabetically:

* Tejas Badadare 
* Zhuojun Chen 
* Zeyuan Gu 
* Haiyu Huang 
* Xiaoqi Jiang 
* Alan Kuo 
* Litao Qiao 
* Zhizhen Qin 
* Ajeya Rengarajan 
* Zhicheng Yang