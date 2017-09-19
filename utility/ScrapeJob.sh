#!/bin/bash
#node /root/Augcast/engine/UpdateScrapedPodcasts.js &> scrapeOut
echo "[SCRAPE] Test nightly cron" > scrapeOut
mailx -r "augcast@augcast.xyz" -s "Scrape completed!" nightlycronjobs@110banana.mailclark.ai < scrapeOut
