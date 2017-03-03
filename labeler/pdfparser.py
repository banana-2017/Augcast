from cStringIO import StringIO
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from difflib import SequenceMatcher
import re

# fuzzy text comparison
def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

# the main function to convert pdf to a list of strings containing textlist
# on each page
def convert(fname, pages=None):
    textlist = []
    if not pages:
        pagenums = set()
    else:
        pagenums = set(pages)

    # high-level object
    output = StringIO()
    manager = PDFResourceManager()
    converter = TextConverter(manager, output, laparams=LAParams())
    interpreter = PDFPageInterpreter(manager, converter)

    # iterate through the pdf
    infile = file(fname, 'rb')
    for page in PDFPage.get_pages(infile, pagenums):
        interpreter.process_page(page)
        textlist.append(output.getvalue().strip())
        output.truncate(0)
        output.seek(0)


    # closure
    infile.close()
    converter.close()
    output.close()

    return textlist


# sample code
if __name__ == '__main__':
    filename = "before.pdf"
    textlist = convert(filename)
    #f = open('tx.txt', 'r')
    #image = f.read()
    #f1 = open('tx1.txt', 'r')
    #image1 = f1.read()
    print (textlist[5])
    # Converting first page into JPG
    with Image(filename="/test1.pdf[0]") as img:
         img.save(filename="/temp1.jpg")

    #[^0-9a-zA-Z]
    #text = re.sub("r\W", " ", image)
    #text1 = re.sub("r\W", " ", image1)
    #print (text)
    #print (similar(text,text1))
    #print (similar(image, image1))
    #print (similar(text, textlist[7]))
