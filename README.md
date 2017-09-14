# Augcast
Augmented Podcasts for UC San Diego.

## Synopsis

Augcast is a website that augments the functionality of [podcast.ucsd.edu](podcast.ucsd.edu). We improve upon traditional podcasts by offering a instant search through a podcast’s textual content, and skipping to the exact lecture and timestamp where a certain phrase is discussed. This is done by Optical Character Recognition on a given podcast’s video frames. Augcast scrapes and OCR's newly added podcasts from podcast.ucsd.edu nightly. Then, users can search any term that appears in their lecture notes and will be taken to the exact time their professor was discussing it in class, eliminating the need to skim through several podcasts trying to find the exact time a topic was covered.

## Usage

Just visit [augcast.xyz](http://www.augcast.xyz). You will need a valid @ucsd.edu address to log in.

## Installation for Development

Clone the repository and run
```
npm install
npm run prod
```

You then need to create the project-specific credential files in the ```database``` folder. See the internal Slack for the file.

## Built With

 * Node + Express
 * React + Redux
 * Python
 * Tesseract OCR
 * OpenCV
 * Beautiful Soup
 * Firebase

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
