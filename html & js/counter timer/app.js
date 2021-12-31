const timer = "Jan 01, 2022 00:00:00";

let countDownDate = new Date(timer).getTime();

function counter() {
  let now = new Date().getTime();
  let distance = countDownDate - now;
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (distance < 0)
    return (
      clearInterval(x),
      (document.getElementById("countdown").innerHTML = "<h1>Over</h1>")
    );

  showIt({ days, hours, minutes, seconds });
}

function showIt({ days, hours, minutes, seconds }) {
  return (document.getElementById("countdown").innerHTML = `
<div class="days">
    <div class="c-number">
        ${days}
    </div>
    days
</div>
<div class="hours">
    <div class="c-number">
        ${hours}
    </div>
    hours
</div>
<div class="minutes">
    <div class="c-number">
        ${minutes}
    </div>
    minutes
</div>
<div class="seconds">
    <div class="c-number">
        ${seconds}
    </div>
    seconds
</div>
<div class="left">left</div>
`);
}

let x = setInterval(counter, 1000);
