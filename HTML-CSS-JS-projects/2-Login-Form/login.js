const forms = document.querySelectorAll("form");
let progressBar = document.querySelector('.progressBar')

const nextToForm2 = ()=>{
    forms[0].style.left='-100%';
    forms[1].style.left='0';
    progressBar.style.width = '66%';
}
const prevToForm1 = ()=>{
    forms[0].style.left='0';
    forms[1].style.left='100%';
    progressBar.style.width = '33%';
}
const nextToForm3 = ()=>{
    forms[2].style.left='0';
    forms[1].style.left='-100%';
    progressBar.style.width = '100%';
}
const prevToForm2 = ()=>{
    forms[2].style.left='100%';
    forms[1].style.left='0';
    progressBar.style.width = '66%';
}