const btn = document.getElementById("btn");
const box1 = document.getElementById("box1");
const box2 = document.getElementById("box2");
let isClick = false;

btn.addEventListener("click", function () {
    console.log('isClick:', isClick)
  if (isClick) {
    box1.style.display = "block";
    box2.style.display = "none";
    btn.innerText = "pause";
    isClick=false;
  } else {
    box1.style.display = "none";
    box2.style.display = "block";
    btn.innerText = "play";
    isClick = true;
  }
});
