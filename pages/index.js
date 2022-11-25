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
			if (link) {
				url = document.getElementById('link').value;
				filename = url.split("/")[url.split("/").length - 1].split('.')[0];
				data.append('url',url);
			} else if(f){
				filename = document.getElementById('images').value.split(/[.]/)[0].split('\\');
				filename = filename[filename.length - 1]
				data.append('url',"");	
			}
			data.delete('filename', filename);
			data.append('filename', filename);
			if (document.getElementById('type1').checked) {
				type = document.getElementById('type1').value;
			  }
			  else if(document.getElementById('type2').checked){
				type = document.getElementById('type2').value;
			  }
			  else if(document.getElementById('type3').checked){
				type = document.getElementById('type3').value;
			}
			
			if (f != 0 || document.getElementById('images').value && type!=null) {
				document.getElementById("overlay").style.display = "block";
				document.getElementById("img").setAttribute("src", 'load.gif');
				data.append('type', type)
				fetch('/upload', {
					method: 'POST',
					mode: 'no-cors',
					body: data,
				}).then((response) => {
					console.log("----------------------------------")
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
							});
						});
						if(filename.includes('*') || filename.includes('/') || filename.includes('\\') || filename.includes('?')){
							filename='trial';
							console.log(filename)
						}
						document.getElementById("overlay").style.display = "none";
						if(type=='wdp' || type == 'j2k'){
							document.getElementById("img").style.display='none';
							document.getElementById("img2").style.display='block';
						}
						else{
							document.getElementById("img").style.display='block';
							document.getElementById("img2").style.display='none';
						}
						document.getElementById("img").setAttribute("src", filename + "." + type);
						document.getElementById("img_title").innerHTML = "CONVERTED IMAGE : " + filename + "." + type;
						document.getElementById("bottom2").style.display='block';
						download = 1
						var element=document.getElementById('fileupload1');
						element.scrollIntoView({
							behavior: 'smooth',
							block: 'start',
							inline: 'nearest',
						  });
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
					if (document.getElementById('type1').checked) {
						type = document.getElementById('type1').value;
					  }
					  else if(document.getElementById('type2').checked){
						type = document.getElementById('type2').value;
					  }
					  else if(document.getElementById('type3').checked){
						type = document.getElementById('type3').value;
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
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" />
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<div id="overlay"></div>
	<div className='top'>
		<h1 className="title">ImagePro</h1>
		<h3 className="subtitle">Convert on the go from JPG ,PNG or TIFF to JPEG XR ,JPEG 2000 or WEBP</h3> </div>
	<div className='bottom'>
		<center>
			<div className="row justify-content-md-center" id="fileupload">
				<div className="col-7" id="pt1">
					<div className="url">
						<input type="text" placeholder="Paste the image URL" id="link" onChange={getImageLink}/> </div>
					<h3 className="or">OR</h3>
					<div className="file">
						<input type="file" id="images" accept="image/*" onChange={getImage}/> </div>
				</div>
				<div className="col-5" id="pt2">
					<h3 className="or">Select a File Type to convert</h3>
					<div className="type">
						<div className='iconcontainer'>
							<input type="radio" name="ctype" id="type1" value="webp" /> <img src="webp.png" className="icon" /> </div>
						<div className='iconcontainer'>
							<input type="radio" name="ctype" id="type2" value="j2k" /> <img src="j2p.png" className="icon" /> </div>
						<div className='iconcontainer'>
							<input type="radio" name="ctype" id="type3" value="wdp" /> <img src="jxr.png" className="icon" /> </div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center" id='button'>
				<div className="col-5">
					<button className="convert1" onClick={handleUploadImage} id="form_ele">CONVERT</button>
				</div>
			</div>
		</center>
	</div>
	<div className='bottom2' id="bottom2">
		<div className='img-meta'>
		<center>
			<div className='row justify-content-md-center' id="fileupload1">
			<div className='col-4' id="pt11">
				<div id='img_title'>QUICK VIEW : </div>
				<picture><img id="img" className='img' src="img-def.png"/></picture>
				<picture><img id="img2" className='img2' src="img-def.png"/></picture>
			</div>
			<div className='col-6' id="a">
				<h2>METADATA</h2>
				<table>
					<tbody id="metaData">
						<tr>
							<td>Make</td>
							<td> XXXXX </td>
						</tr>
						<tr>
							<td>Model</td>
							<td>XXXXX</td>
						</tr>
						<tr>
							<td>DateTimeOriginal</td>
							<td>XXXXX</td>
						</tr>
						<tr>
							<td>FocalLength</td>
							<td>XXXXX</td>
						</tr>
						<tr>
							<td>ISOSpeedRatings</td>
							<td>XXXXX</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className='col-2' id="download">
				<button onClick={getImg} className="btn" id='dld'></button>
				</div>
			</div>
			</center>
		</div>
	</div>
	</>
  )
}
export default app;