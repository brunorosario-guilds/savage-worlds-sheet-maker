import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def read_docx(filename):
    with zipfile.ZipFile(filename) as docx:
        tree = ET.XML(docx.read('word/document.xml'))
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        for paragraph in tree.iterfind('.//w:p', namespaces):
            para_text = ''.join(node.text for node in paragraph.iterfind('.//w:t', namespaces) if node.text)
            if para_text.strip():
                print(para_text)

if __name__ == '__main__':
    read_docx(sys.argv[1])
