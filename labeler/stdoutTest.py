#!/usr/local/bin/python
import sys
from time import sleep

for i in range(0, 100):
    print i+1
    sys.stdout.flush()
    sleep(0.05)


print '{"1": 50}'
