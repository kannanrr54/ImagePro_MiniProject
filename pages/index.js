import React, {	useState,useEffect} from 'react';
import Script from 'next/script';

/*to-do
check url is valid*/

function app(props) {
	let filename = "",file = "",url = "",download = 0,link = 0,type = null,f = 0,data = null

	const getImageLink = (ev) => {
		link = 1
		document.getElementById("images").value = "";
		data = new FormData();
		f=1;
	}

	const getImage = (ev) => {
		f = 1;
		document.getElementById("link").value = "";
		data = new FormData();
		file = ev.target.files[0];
		data.delete('file');
		data.append('file', file);
	}

	const handleUploadImage = (ev) => {
		ev.preventDefault();
		var img=document.getElementById("images").value;
		var link=document.getElementById("link").value;
		if(img || link){
			document.getElementById("img").setAttribute("src", 'loading.gif');
			if (link) {
				url = document.getElementById('link').value;
				filename = url.split("/")[url.split("/").length - 1].split('.')[0	];
				// data.delete('url',url);
				data.append('url',url);
			} else if(f){
				filename = document.getElementById('images').value.split(/[.]/)[0].split('\\');
				filename = filename[filename.length - 1]
					// data.delete('url',url);
					data.append('url',"");	
			}
			data.delete('filename', filename);
			data.append('filename', filename);
			console.log("------------"+document.getElementById('images').value)
			if (f != 0 || document.getElementById('images').value) {
				var type = document.getElementById('type').value;
				if (type == 'JPEG2') {
					type = 'j2k';
				} else if (type == 'JPEGXR') {
					type = 'wdp';
				}
				console.log(data)
				data.append('type', type)
				fetch('/upload', {
					method: 'POST',
					mode: 'no-cors',
					body: data,
				}).then((response) => {
					
					response.json().then((body) => {});
					if (response.status == 200) {
						fetch('/getMetadata', {
							method: 'POST',
							mode: 'no-cors',
							body: data,
						}).then((response) => {
							response.json().then((body) => {
								var mData = JSON.parse(body.meta);
								const title = ["Make", "Model", "DateTimeOriginal", "FocalLength", "ISOSpeedRatings"];
								var table = document.getElementById("metaData");
								var metaDataRows = ""
								title.forEach(element => {
									metaDataRows = metaDataRows + "<tr><td>" + element + "</td><td>" + mData[element] + "</td></tr>"
								});
								table.innerHTML = metaDataRows;
								console.log(metaDataRows);
							});
						});
						// if(type=="j2k" || type=="wdp"){
						// 	document.getElementById("img").setAttribute("src", "img-def.png");	
						// }
						// else{
							document.getElementById("img").setAttribute("src", filename + "." + type);
						// }
						document.getElementById("img_title").innerHTML = "CONVERTED IMAGE : " + filename + "." + type;
						download = 1
					}
				});
				f = 0
			}
		}
		
	}
	const getImg = (ev) => {
		ev.preventDefault();
		if (download == 1) {
			fetch('/getimage').then((response) => {
				response.json().then((body) => {
					var type = document.getElementById('type').value;
					if (type == 'JPEG2') {
						type = 'j2k';
					} else if (type == 'JPEGXR') {
						type = 'wdp';
					}
					var link = document.createElement('a');
					link.href = document.getElementById("img").getAttribute("src");
					link.download = filename + '.' + type;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				});
			});
		}
		download = 0;
	}
  return(
    <>
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" defer />
 <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js" defer ></script>
 <Script src="https://third-party-script.js" defer  />
 <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" defer ></script>
 <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js" defer ></script>
 <title>ImagePro</title>
 <div className='head1'>
   <p className='title'>ImagePro</p>
 </div>
 <div className='head2'>
   <p className='catch'>Convert on the Go!</p>
 </div>
 <div className='outer1'>
   <label htmlFor="images" className="drop-container">
     <span className="drop-title">
 		<input type="text" className="link" id="link" onChange={getImageLink} placeholder="Enter the URL" />       
     	</span> or <input type="file" id="images" accept="image/*" onChange={getImage} />
   </label>
   <select id="type" className='dd'>
     <option value="">SELECT A TYPE TO CONVERT</option>
     <option value="WEBP">WEBP</option>
     <option value="JPEG2">JPEG2</option>
     <option value="JPEGXR">JPEGXR</option>
   </select>
   <br />
   <br />
   <input type="submit" onClick={handleUploadImage} className="btn btn-primary" id='form_ele' value='CONVERT' />
   <br />
   <center>
     <button onClick={getImg} className="btn btn-primary" id='dld'> DOWNLOAD </button>
     <br />
   </center>
 </div>
 <div className='outer2'>
   <div id='img_title'>CONVERTED IMAGE :</div>
   <picture>
   		<img id="img" className='img' src="img-def.png"/>
   </picture>
   
   <br />
   <br />
   <div className='meta' id="a">Metadata <table>
       <tbody id="metaData">
	   	<tr>
			<td>Make</td>
			<td>   -   </td>
		</tr>
		<tr>
			<td>Model</td>
			<td>   -   </td>
		</tr>
		<tr>
			<td>DateTimeOriginal</td>
			<td>   -   </td>
		</tr>
		<tr>
			<td>FocalLength</td>
			<td>   -   </td>
		</tr>
		<tr>
			<td>ISOSpeedRatings</td>
			<td>   -   </td>
		</tr>
	   </tbody>
     </table>
   </div>
 </div>
</>
  )
}
export default app;