#!/bin/bash
#cd /root/Augcast/engine/
#make start &> ocrOut
#make clean
echo "[OCR] Test nightly cron" > ocrOut
mailx -r "augcast@augcast.xyz" -s "OCR completed!" nightlycronjobs@110banana.mailclark.ai < ocrOut
