let overlay=document.querySelector(".galleryOverlay")
let imageBox=document.querySelector(".imgBox");
var img=document.querySelector(".imgBox img");
let close=document.querySelector(".imgBox span");

let gallery=document.querySelector("#gallery");
gallery.addEventListener("click",(event)=>{
    let currentImagePath=event.target.src;  //ImagePath

    if(currentImagePath!==undefined){
        overlay.classList.add('galleryOverlayShow');
        imageBox.classList.add('imgBoxShow');
        img.src=currentImagePath;
    }
});

close.addEventListener("click",()=>{
    overlay.classList.remove('galleryOverlayShow');
        imageBox.classList.remove('imgBoxShow');
});