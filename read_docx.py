import zipfile
import xml.etree.ElementTree as ET
import sys
import io

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
        
        tree = ET.fromstring(xml_content)
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        paragraphs = []
        for paragraph in tree.iterfind('.//w:p', namespaces):
            texts = [node.text for node in paragraph.iterfind('.//w:t', namespaces) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error: {e}"

with open("docs_content.txt", "w", encoding="utf-8") as f:
    f.write("=== SRS ===\n")
    f.write(extract_text_from_docx(r"E:\DevOpsProject\ServiceDesk-CICD\docs\Week3_Software_Requirements_Specification.docx"))
    f.write("\n\n=== Design ===\n")
    f.write(extract_text_from_docx(r"E:\DevOpsProject\ServiceDesk-CICD\docs\Week3_System_Design_and_Technical_Architecture.docx"))
