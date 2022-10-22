import React, {
  useState,
  useEffect
} from 'react';
import Image from 'next/image';

function app(props) {
  const data = null
  const f = 0
  const type = null
  const filename="",file=""
  const download=0

  const getImage = (ev) => {
      f = 1;
      file=ev.target.files[0];
      filename=document.getElementById('images').value.split(/[.]/)[0].split('\\');
      filename=filename[filename.length-1]
      data = new FormData();
      data.delete('file');
      data.append('file', file);
      data.append('filename',filename);
  }
  const handleUploadImage = (ev) => {
      ev.preventDefault();
      document.getElementById("img").setAttribute("src", 'loading.gif');
      if (f != 0) {
          var type=document.getElementById('type').value;
          if(type=='JPEG2'){
            type='j2k';
          }
          data.append('type', document.getElementById("type").value)
          fetch('/upload', {
              method: 'POST',
              mode: 'no-cors',
              body: data,
          }).then((response) => {
              response.text().then((body) => {});
              if(response.status == 200){
                document.getElementById("img").setAttribute("src", filename+"."+type);
                document.getElementById("img_title").innerHTML="CONVERTED IMAGE : "+filename+"."+type; 
                // document.getElementById('dld').removeAttribute('disabled');
                download=1
              }
          });
          f = 0   
      }
  }
  const getImg = (ev) => {
      ev.preventDefault();
      if(download==1){
        fetch('/getimage').then((response) => {
          response.json().then((body) => {
              var type=document.getElementById('type').value;
              if(type=='JPEG2'){
                type='j2k';
              }
              var link = document.createElement('a');
              link.href = document.getElementById("img").getAttribute("src");
              link.download = filename +'.' + type;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              // document.getElementById('dld').setAttribute('disabled');
          });
      });
      }
      download=0;
  }
  const meta = (ev) => {
      //call get api to get meta data
  }
  return(
    <>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"></script>
    <title>ImagePro</title>
    <div className='head1'>
        <p className='title'>ImagePro</p>
    </div>
    <div className='head2'>
        <p className='catch'>Convert on the Go!</p>
    </div>
    <div className='outer1'>
        <label htmlFor="images" className="drop-container">
            <span className="drop-title">Drop files here</span>
            or
            <input type="file" id="images" accept="image/*" onChange={getImage} />
        </label>
        <select id="type" className='dd'>
            <option value="">SELECT A TYPE TO CONVERT</option>
            <option value="WEBP">WEBP</option>
            <option value="JPEG2">JPEG2</option>
            <option value="JPEGXR">JPEGXR</option>
        </select><br /><br />
        <input type="submit" onClick={handleUploadImage} className="btn btn-primary" id='form_ele' value='CONVERT'/><br />
        <center>
            <button onClick={getImg} className="btn btn-primary" id='dld'>
                DOWNLOAD
            </button><br/>
        </center>

    </div>
    <div className='outer2'>
        <div id='img_title'>CONVERTED IMAGE :</div>
        <img id="img" className='img' /><br/><br/>
        <div className='meta'>Metadata
        <table>
          <tbody>
          <tr>
            <td>..</td>
            <td>..</td>
          </tr>
          <tr>
            <td>..</td>
            <td>..</td>
          </tr>
          <tr>
            <td>..</td>
            <td>..</td>
          </tr>
          <tr>
            <td>..</td>
            <td>..</td>
          </tr>
          <tr>
            <td>..</td>
            <td>..</td>
          </tr>
          </tbody>
          
      </table>
        </div>
    </div>

</>
  )
}
export default app;