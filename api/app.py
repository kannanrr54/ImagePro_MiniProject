import os
from tokenize import String
from flask import Flask, request
from PIL import Image
import base64

UPLOAD_FOLDER = '/'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
path='img_pro/new/public'
type=""
@app.route('/upload', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER,path)
    if not os.path.isdir(target):
        os.mkdir(target)
    print("============================")
    file = request.files['file']
    type = request.form['type']
    print(type)
    img=Image.open(file)
    filename = file.filename
    destination="/".join([target, "test."+type])
    img.save(destination)
    return  {}

@app.route('/getimage')
def getimage():
    return {"image":str({type})}