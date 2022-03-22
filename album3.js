(function(){
    let saveAlbum=document.querySelector("#saveAlbum");
    let addAlbum=document.querySelector("#addAlbum");
    let deleteAlbum=document.querySelector("#deleteAlbum");
    let importAlbum=document.querySelector("#importAlbum");
    let exportAlbum=document.querySelector("#exportAlbum");
    let playAlbum=document.querySelector("#selectPlay");
    let selectAlbum=document.querySelector("#selectAlbum");
    let allTemplates=document.querySelector("#allTemplates");
    let overlay=document.querySelector("#overlay");
    let playOverlay=document.querySelector("#play-overlay");
    let contentDetailsoverlay=document.querySelector("#content-details-overlay")
    let newSlide=document.querySelector("#new-slide");
    let createSlide=document.querySelector("#create-slide");
    let showSlide=document.querySelector("#show-slide");
    let btnSaveSlide=document.querySelector("#btnSaveslide");
    let txtSlideImage=document.querySelector("#txtSlideImage");
    let txtSlideTitle=document.querySelector("#txtSlideTitle");
    let txtSlideDesc=document.querySelector("#txtSlideDesc");
    let slideList=document.querySelector("#slide-list")
    let uploadFile=document.querySelector('#uploadFile');
    


   let albums=[{
        name:"test",
        slides:[]
    }];
    newSlide.addEventListener('click',handleNewSlideClick);
    addAlbum.addEventListener("click",handleAddAlbum);
    selectAlbum.addEventListener("change",handleSelectAlbum);
    btnSaveSlide.addEventListener('click',handleSaveSlide);
    saveAlbum.addEventListener('click',saveToLocalStorage);
   deleteAlbum.addEventListener('click',handleDeleteAlbum);
   exportAlbum.addEventListener('click',handleExportAlbum);
   importAlbum.addEventListener('click',function(){
        uploadFile.click();
   });
uploadFile.addEventListener("change",handleImportAlbum);
playAlbum.addEventListener("click",handlePlayAlbum);
function handlePlayAlbum(){
    if(selectAlbum.value == '-1'){
        alert(' Select an album to play')
    return;
    }
   
    playOverlay.style.display='block';
    playOverlay.querySelector('#text').innerHTML='Playing Album...'; 

    let album=albums.find(a=>a.name==selectAlbum.value);
    let counter=album.slides.length;
    let i=0;
    let id=setInterval(function(){
        if(i<counter){

            slideList.children[i].click(); 
            playOverlay.querySelector('#text').innerHTML='showing slide '+ ( i + 1); 
            i++;
        }
        else if(i==counter){
            clearInterval(id);
            playOverlay.style.display='none';
        }
        
    },1000)
}
function handleSelectAlbum(){
        if(this.value=='-1'){
            overlay.style.display='block';
            contentDetailsoverlay.style.display="none";
            createSlide.style.display='none';
            showSlide.style.display='none';
            slideList.innerHTML='';
        }else{
            overlay.style.display='none';
            contentDetailsoverlay.style.display="block";
            createSlide.style.display='none';
            showSlide.style.display='none';
      
            let album=albums.find(a => a.name == selectAlbum.value);
            slideList.innerHTML='';
         
            for(let i=0;i<album.slides.length;i++){
                let slideTemplate=allTemplates.content.querySelector(".slide");
                let slide=document.importNode(slideTemplate,true);
 
                slide.querySelector(".title").innerHTML=album.slides[i].title;
                slide.querySelector(".desc").innerHTML=album.slides[i].desc;
                slide.querySelector("img").setAttribute('src',album.slides[i].url);
                slide.addEventListener('click',handleSlideClick);
                slideList.append(slide);
            }            
        }
}  
function handleAddAlbum(){
        let albumName=prompt("Enter album name for the new album");
        if(albumName==null){
            return;
        }
        albumName=albumName.trim();
        if(!albumName){
            alert("empty name not allowed");
            return;
        }
        let exists=albums.some(a=>a.name==albumName);
        if(exists){
            alert(albumName+" already exists. Please use a unique name");
            return;
        }
       alert(albumName+" is created")
let album={
    name:albumName,
    selected:false, 
    slides:[]
}
albums.push(album);

let optionTemplate=allTemplates.content.querySelector("[purpose=new-album]")
let newAlbumOption=document.importNode(optionTemplate,true);
newAlbumOption.setAttribute('value',albumName);
newAlbumOption.innerHTML=albumName;
selectAlbum.appendChild(newAlbumOption);

selectAlbum.value=albumName;  
selectAlbum.dispatchEvent(new Event("change"));
}
function handleNewSlideClick(){
    overlay.style.display='none';
    contentDetailsoverlay.style.display="none";
    createSlide.style.display='block';
    showSlide.style.display='none';

    txtSlideImage.value='';
    txtSlideTitle.value='';
    txtSlideDesc.value='';

    btnSaveSlide.setAttribute("purpose",'create');
    

}
function handleSaveSlide(){
    let url=txtSlideImage.value;
    let title=txtSlideTitle.value;
    let desc=txtSlideDesc.value;

    if(this.getAttribute("purpose")=='create'){

let slideTemplate=allTemplates.content.querySelector(".slide");
let slide=document.importNode(slideTemplate, true);
 
slide.querySelector(".title").innerHTML=title;
slide.querySelector(".desc").innerHTML=desc;
slide.querySelector("img").setAttribute('src',url);
slide.addEventListener('click',handleSlideClick);

slideList.append(slide);

let album=albums.find(a => a.name == selectAlbum.value);
album.slides.push({
    title:title,
    url:url,
    desc:desc
})
slide.dispatchEvent(new Event('click'));
    }else{
let album=albums.find(a => a.name == selectAlbum.value);
let slideToUpdate=album.slides.find(s =>s.selected == true);

let slideDivToUpdate;
for(let i=0;i<slideList.children.length;i++){
let divToUpdate=slideList.children[i];
if(divToUpdate.querySelector('.title').innerHTML == slideToUpdate.title){
    slideDivToUpdate=divToUpdate;
    break;
}
}
slideDivToUpdate.querySelector('.title').innerHTML=title;
slideDivToUpdate.querySelector('.desc').innerHTML=desc;
slideDivToUpdate.querySelector('img').setAttribute("src",url);

slideToUpdate.title=title;
slideToUpdate.desc=desc;
slideToUpdate.url=url;

slide.dispatchEvent(new Event("click"));
    }
}
function handleSlideClick(){

    overlay.style.display = "none";
    contentDetailsoverlay.style.display = "none";
    createSlide.style.display = "none";
    showSlide.style.display='block';

    showSlide.innerHTML='';

let slideInViewTemplate=allTemplates.content.querySelector(".slide-in-view");
let slideInView=document.importNode(slideInViewTemplate,true);

slideInView.querySelector('.title').innerHTML=this.querySelector('.title').innerHTML;
slideInView.querySelector('.desc').innerHTML=this.querySelector('.desc').innerHTML;
slideInView.querySelector('img').setAttribute('src', this.querySelector('img').getAttribute('src'));
slideInView.querySelector('[purpose=edit]').addEventListener("click",handleEditSideClick);
slideInView.querySelector('[purpose=delete]').addEventListener("click",handleDeleteSideClick);


showSlide.append(slideInView);
let album=albums.find(a=>a.name == selectAlbum.value);
for(let i=0;i<album.slides.length;i++){
    if(album.slides[i].title==this.querySelector(".title").innerHTML){
        album.slides[i].selected=true;
    }else{
        album.slides[i].selected=false;
    }
}

}
function handleDeleteSideClick(){
    let album=albums.find(a=>a.name == selectAlbum.value);
    let sidx=album.slides.findIndex(s=>s.selected==true);
let slideDivTBD;
for(let i=0;i<slideList.children.length;i++){
    let slideDiv=slideList.children[i];
    if(slideDiv.querySelector(".title").innerHTML== album.slides[sidx].title){
        slideDivTBD= slideDiv;
        break;
    }
}
slideList.removeChild(slideDivTBD);
album.slides.splice(sidx,1);

overlay.style.display = "none";
contentDetailsoverlay.style.display = "block";
createSlide.style.display = "none";
showSlide.style.display='none';
}
function handleEditSideClick(){
    
    overlay.style.display = "none";
    contentDetailsoverlay.style.display = "none";
    createSlide.style.display = "block";
    showSlide.style.display='none';

    let album=albums.find(a => a.name == selectAlbum.value);
    let slide=album.slides.find(s => s.selected == true);

   txtSlideImage.value=slide.url;
   txtSlideTitle.value=slide.title;
   txtSlideDesc.value=slide.desc;

   btnSaveSlide.setAttribute("purpose",'update');


}

function handleDeleteAlbum(){
    if(selectAlbum.value =='-1'){
        alert(' Select an album to delete')
    return;
    }
let aidx=albums.findIndex(a => a.name == selectAlbum.value)
albums.splice(aidx,1);

selectAlbum.remove(selectAlbum.selectedIndex);

selectAlbum.value='-1';
selectAlbum.dispatchEvent(new Event("change"));
}
function handleExportAlbum(){
    if(selectAlbum.value == '-1'){
        alert('Select an album to exprt');
    return;
    }

let album=albums.find(a=>a.name==selectAlbum.value);
let ajson=JSON.stringify(album);
let encodedJson=encodeURIComponent(ajson);

let a=document.createElement('a');
a.setAttribute("download",album.name+".json");
a.setAttribute("href",'data:text/json; charset=utf-8,' + encodedJson);
a.click();

}
function handleImportAlbum(){
    if(selectAlbum.value == '-1'){
        alert('Select an album to import');
    return;
    }
    let file=window.event.target.files[0];
    let reader=new FileReader();
    reader.addEventListener("load",function(){
        let data=window.event.target.result;
        let importedAlbum=JSON.parse(data);

        let album=albums.find(a=>a.name == selectAlbum.value);
        album.slides=album.slides.concat(importedAlbum.slides);
        slideList.innerHTML="";

        for(let i=0;i<album.slides.length;i++){
            let slideTemplate=allTemplates.content.querySelector(".slide");
            let slide=document.importNode(slideTemplate,true);
            
            slide.querySelector(".title").innerHTML=album.slides[i].title;
            slide.querySelector(".desc").innerHTML=album.slides[i].desc;
            slide.querySelector("img").setAttribute("src",album.slides[i].url);
            slide.addEventListener("click",handleSlideClick);

            album.slides[i].selected=false;

            slideList.append(slide);
        }
    })
    reader.readAsText(file);
}

function saveToLocalStorage(){
let json=JSON.stringify(albums);
localStorage.setItem("data",json);
}
function loadFromLocalStorage(){
let json=localStorage.getItem("data");
if(!json){
    return;
}
albums=JSON.parse(json);

for(let i=0;i<albums.length;i++){
let optionTemplate=allTemplates.content.querySelector("[purpose=new-album]")
let newAlbumOption=document.importNode(optionTemplate,true);

newAlbumOption.setAttribute('value',albums[i].name);
newAlbumOption.innerHTML=albums[i].name;
selectAlbum.appendChild(newAlbumOption);
}
}
loadFromLocalStorage();
})();