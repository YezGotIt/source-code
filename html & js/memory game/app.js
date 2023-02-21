(() => {
  // dom elements
  const containerRoot = document.getElementById("container");
  const controlRoot = document.getElementById("control");
  const viewTwiceBtn = document.getElementById("viewTwiceBtn");
  const MGScore = document.getElementById("MGScore");

  // variables
  let MemoryGameList = [];
  let cardContainer = null;
  let viewTwiceCount = 2,
    totalMGCount = 0;
  let MGList = [];
  const TOTAL_CARD = window.screen.width > 512 ? 12 : 6;

  // get random character
  function getRandomCharacter() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const uniqueCharacters = new Set();
    while (uniqueCharacters.size < TOTAL_CARD) {
      const randomCharacter = characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      uniqueCharacters.add(randomCharacter);
    }
    MemoryGameList = [...uniqueCharacters, ...uniqueCharacters];
    shuffleArray(MemoryGameList);
    createCard();
  }

  // create card
  function createCard() {
    cardContainer = MemoryGameList.map((element, index) => {
      const card = document.createElement("div");
      card.classList.add("card-container");
      card.id = index;
      card.innerHTML = `
          <div class="card">
            <div class="front">
              <h2>Memory Game</h1>
            </div>
            <div class="back">
              <h2>${element}</h1>
            </div>
          </div>
        `;
      containerRoot.appendChild(card);
      return card;
    });
    cardContainer.forEach((element) => {
      element.addEventListener("click", () => {
        if (element.classList.contains("clicked")) {
          element.classList.remove("clicked");
          return;
        }

        element.classList.add("clicked");
        let id = element.id;
        let content = element.children[0].children[1].innerText;
        MGList.push({ id, content });
        if (MGList.length === 2) checkedContent();
      });
    });
  }

  // check content & add the score
  function checkedContent() {
    if (MGList.length === 2) {
      containerRoot.style.pointerEvents = "none";
    }
    const [first, second] = MGList;

    if (first.content !== second.content) {
      setTimeout(() => {
        cardContainer[first.id].classList.add("wrong");
        cardContainer[second.id].classList.add("wrong");
      }, 800);
      setTimeout(() => {
        cardContainer[first.id].classList.remove("clicked");
        cardContainer[second.id].classList.remove("clicked");
        cardContainer[first.id].classList.remove("wrong");
        cardContainer[second.id].classList.remove("wrong");
        containerRoot.style.pointerEvents = "auto";
      }, 2000);
    }
    if (first.content === second.content && first.id !== second.id) {
      totalMGCount++;
      MGScore.textContent = totalMGCount;

      cardContainer[first.id].style.pointerEvents = "none";
      cardContainer[second.id].style.pointerEvents = "none";
      setTimeout(() => {
        cardContainer[first.id].children[0].children[1].classList.add(
          "success"
        );
        cardContainer[second.id].children[0].children[1].classList.add(
          "success"
        );
        containerRoot.style.pointerEvents = "auto";
        if (totalMGCount === TOTAL_CARD) {
          controlRoot.innerHTML = ``;
          containerRoot.innerHTML = `
            <h1>Game Over&nbsp; &nbsp; &nbsp; &nbsp; </h1>
            <h2><a href="/">Refresh to play again</a></h2>
            `;
        }
      }, 800);
    }
    MGList = [];
  }

  // shuffle array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // view button
  function viewTwiceHandler() {
    if (viewTwiceCount <= 0) return;
    let countdown = 10;
    let timerId;
    viewTwiceBtn.disabled = true;
    viewTwiceBtn.textContent = countdown;

    timerId = setInterval(() => {
      viewTwiceBtn.textContent = --countdown;
      if (countdown === 0) {
        clearInterval(timerId);
        viewTwiceBtn.disabled = false;
        viewTwiceBtn.textContent = `View Twice (${--viewTwiceCount})`;
      }
    }, 1000);

    cardContainer.forEach((element) => {
      element.classList.toggle("clicked");
      element.style.pointerEvents = "none";
    });

    setTimeout(() => {
      cardContainer.forEach((element) => {
        element.classList.toggle("clicked");
        element.style.removeProperty("pointer-events");
      });
    }, countdown * 1000);
  }

  // init function
  getRandomCharacter();

  // create the footer
  (() => {
    const footer = document.createElement("footer");
    footer.innerHTML = `
          <div class="footer-container">
          Made with <span class="heart">❤</span> by <a href="https://ygi.li">@yezgotit</a>
            </div>`;
    document.body.appendChild(footer);
  })();

  viewTwiceBtn.addEventListener("click", viewTwiceHandler);
})();
