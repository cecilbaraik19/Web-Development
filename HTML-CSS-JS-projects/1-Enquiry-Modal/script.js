let btn = document.querySelector(".showBtn");
let modalDivElement = document.querySelector(".modalDiv");
let closeBtn = document.querySelector(".modalDiv span");

btn.addEventListener("click", () => {
    modalDivElement.style.top = "50%";
});

closeBtn.addEventListener("click", () => {
    modalDivElement.style.top = "-1000px";
});
