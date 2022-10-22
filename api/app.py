import os,glob
from tokenize import String
from flask import Flask, request
from PIL import Image
import base64

UPLOAD_FOLDER = '../'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
path='public'
type=""
@app.route('/upload', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER,path)
    if not os.path.isdir(target):
        os.mkdir(target) 
    file = request.files['file']
    type = request.form['type']
    if(type=='JPEG2'):
        type='j2k'
    fname=request.form['filename']
    img=Image.open(file)
    destination="/".join([target, fname+"."+type])
    # if os.path.isfile(destination):
    #     os.remove(destination)
    img.save(destination)
    return  {}

@app.route('/getimage')
def getimage():
    return {"image":str({type})}

# @app.route('/getMetadata')
# def getimage():
#write logic to get meta data
#     return {}