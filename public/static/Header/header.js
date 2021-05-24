let navOpener = document.getElementById("Nav-Open");
let navCloser = document.getElementById("Nav-Close");
let navContent = document.querySelector("#Nav");

function isDescendant(parent, child) {
    var node = child;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}
let Close = function(){
    // de inlocuit replace-ul pentru IE8
    if(navContent.classList.contains("visible"))    navContent.classList.replace("visible","hidden");
}
let Open = function(){
    if(navContent.classList.contains("hidden"))     navContent.classList.replace("hidden","visible");
}
navOpener.addEventListener("click",()=>{Open();});
navCloser.addEventListener("click",()=>{Close();});
window.addEventListener("click",(e)=>{
    if(!isDescendant(navContent,e.target) && !isDescendant(navOpener,e.target)) {
        Close();
    } 

});


let themeToggle = document.getElementById('Toggle');
themeToggle.addEventListener("click",()=>{
    if(localStorage.getItem("theme") == "light"){
        localStorage.setItem("theme", 'dark');
        themeToggle.setAttribute("checked",true);
    }
    else{
        localStorage.setItem("theme", 'light');
        themeToggle.removeAttribute("checked");
    }
})
window.onload = ()=>{
    if(localStorage.getItem("theme") == "dark") {
        console.log("setting to true");
        themeToggle.setAttribute("checked",true); 
    } 
    else{
        console.log("setting to false");
        themeToggle.removeAttribute("checked");
    }  
}