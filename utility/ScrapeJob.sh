#!/bin/bash
cd /root/Augcast/engine
node /root/Augcast/engine/UpdateScrapedPodcasts.js &> /root/scrapeOut
mailx -r "augcast@augcast.xyz" -s "Scrape completed!" a4o3u4q7a6t5z4h9@110banana.slack.com < /root/scrapeOut
