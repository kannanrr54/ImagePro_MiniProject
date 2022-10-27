import os,glob
from tokenize import String
from flask import Flask, request
from PIL import Image
from PIL.ExifTags import TAGS

UPLOAD_FOLDER = '../'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
path='public'
type=""
exif=""
@app.route('/upload', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER,path)
    if not os.path.isdir(target):
        os.mkdir(target) 
    file = request.files['file']
    type = request.form['type']
    img = Image.open(file)
    exif = { TAGS[k]: v for k, v in img._getexif().items() if k in TAGS }
    print(exif)
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

@app.route('/getMetadata',methods=['POST','GET'])
def getMeta():
    meta="{"
    a=0
    z=0
    file = request.files['file']
    img = Image.open(file)
    exif = { TAGS[k]: v for k, v in img._getexif().items() if k in TAGS }
    for i in exif:
        a=a+1
    for i in exif:
        if(z<a-1):
            z=z+1
            meta=meta+'"'+str(i)+'":"'+str(exif.get(i))+'",'
        else:
            meta=meta+'"'+str(i)+'":"'+str(exif.get(i))+'"'
    meta=meta+"}"
    print(meta)
    meta=meta.replace("\\","")
    return {"meta":meta}