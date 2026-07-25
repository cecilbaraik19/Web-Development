let isDOBOpen = false;
let dateOfBirth;
const settingCoEl = document.getElementById("settingIcone");
const settingContentEl = document.getElementById("settingContent");
const initialTextEl = document.getElementById("initialText");
const afterDOBBtnTxtEl = document.getElementById("afterDOBBtnTxt");
const dobButtonEl = document.getElementById("dobButton")

const toggleDateofBirthSelector = () => {
    if(isDOBOpen){
        settingContentEl.classList.add("hide");
    }else{
        settingContentEl.classList.remove("hide");
    }
    isDOBOpen = !isDOBOpen;
};
settingCoEl.addEventListener("click",toggleDateofBirthSelector);
dobButtonEl.addEventListener("click",toggleDateofBirthSelector);