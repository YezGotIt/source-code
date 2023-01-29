(() => {
  const footer = document.createElement("footer");
  footer.style.margin = `10px`;
  footer.innerHTML = `Copyright (c) ${new Date().getFullYear()} <span style="font-size:18px; font-weight: 500"><b>@yezgotit</b></span>`;
  document.body.appendChild(footer);
})();
