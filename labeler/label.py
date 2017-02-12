import subprocess

page = 2
filename = "hashing.pdf"

pageContent = (subprocess.check_output(["pdf2txt.py", "-p", str(page), filename]))

print (pageContent);
