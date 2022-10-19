import React, { useState, useEffect } from 'react';
import Image from 'next/image';

function app(props){
  const data =null
  const f=0
  const type=null
  const getImage=(ev)=> {
    f=1;
    data = new FormData();
    data.delete('file');
    data.append('file', ev.target.files[0]);
  }
  const handleUploadImage=(ev)=> {
    ev.preventDefault();
    if(f != 0){
      type=document.getElementById("type").value
      data.append('type',document.getElementById("type").value)
      fetch('/upload', {
        method: 'POST',
        mode:'no-cors',
        body: data,
      }).then((response) => {
        response.text().then((body) => {
        });
      });
      f=0
    }
  }
  const getImg=(ev)=> {
    ev.preventDefault();
      console.log(data)
      fetch('/getimage').then((response) => {
        response.json().then((body) => {
          console.log(type)
          document.getElementById("img").setAttribute("src","test.webp");
          var link = document.createElement('a');
          link.href = document.getElementById("img").getAttribute("src");
          link.download = 'test.'+type;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      });  
  }
  return(
    <>
    <div>
        <form>
        <div>
          <input type="file" onChange={getImage} required=""/><br/><br/>
          <select id="type" required="">
            <option value="WEBP">WEBP</option>
            <option value="JPEG2">JPEG2</option>
            <option value="JPEGXR">JPEGXR</option>
          </select><br/><br/>
          <input type="submit" onClick={handleUploadImage}/>
        </div>
      </form>
      <button onClick={getImg}>Download</button>
      </div>
      <img id="img" width={100} height={100}  />
      </>
  )
}
export default app;