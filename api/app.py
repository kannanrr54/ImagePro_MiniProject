import os,cloudinary,cloudinary.uploader,urllib,urllib.request
from tokenize import String
from flask import Flask, request
from PIL import Image
from PIL.ExifTags import TAGS
from PIL import Image
import requests
from io import BytesIO

UPLOAD_FOLDER = '../'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
path='public'
type=""
exif=""
c=""
destination=""

@app.route('/upload', methods=['POST'])
def fileUpload():
    
    target=os.path.join(UPLOAD_FOLDER,path)
    if not os.path.isdir(target):
        os.mkdir(target)
    fname=request.form['filename']
    if('?' in  fname or '*' in  fname or '/' in  fname):
        fname='trial'
    type = request.form['type']
    if(request.form['url']!=""):
        url = request.form['url']
        response = requests.get(url)
        img = Image.open(BytesIO(response.content))
    else:
        file = request.files['file']
        img = Image.open(file)
    
    #---------- JPEG-2000 & WEBP Conversion -------------------------
    if(type!='wdp'):
        destination="/".join([target, fname+"."+type])
        img.save(destination) 
    else:
        destination="/".join([target, fname+".webp"])
        img.save(destination)

    #---------- JPEG-XR Conversion using Cloudinary ----------
    if(type=='wdp'):
        cloudinary.config(
        cloud_name = "dwdym3doh",
        api_key = "724199248487985",
        api_secret = "1jEFu1JeEXI0uR6X1drb7zyyENA"
        )
        cloudinary.uploader.upload(destination,public_id=fname, unique_filename = True, overwrite=True)
        srcURL = cloudinary.CloudinaryImage(fname).image( format = "jxr")
        r = urllib.request.urlopen(srcURL.split('"')[1])
        save_path = '../public/'
        completeName = os.path.join(save_path, fname+".wdp")   
        file1 = open(completeName, "wb")
        file1.write(r.read())
        file1.close()
        # delete Image cloudinary
        # cloudinary.uploader.destroy('zombie', function(result) { console.log(result) });
    return  {}

@app.route('/getimage')
def getimage():
    return {"image":str({type})}

@app.route('/getMetadata',methods=['POST','GET'])
def getMeta():
    file = request.files['file']
    target=os.path.join(UPLOAD_FOLDER,path)
    fname=request.form['filename']
    type = request.form['type']
    img = Image.open(file)
    meta="{"    
    a=0
    z=0
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
    meta=meta.replace("\\","")
    return {"meta":meta}