(() => {
  // dom elements
  const id = (element) => document.getElementById(`${element}`);
  const startGame = id("startGame");
  const mainGame = id("mainGame");

  // variables
  let MemoryGameList = [];
  let cardContainer = null,
    containerRoot = null,
    controlRoot = null,
    MGScore = null,
    gameTime = null,
    shareBtn = null;
  viewTwiceBtn = null;
  let viewTwiceCount = 2,
    totalMGCount = 0;
  let MGList = [];
  const TOTAL_CARD = window.screen.width > 512 ? 12 : 6;
  let TOTAL_TURN = TOTAL_CARD;
  const VIEW_TIME_INTERVAL = 15;

  // user event
  startGame.addEventListener("click", () => {
    console.log("started");
    mainGame.style.display = "block";
    startGame.style.display = "none";
    mainGame.innerHTML = `
  <div class="control add-margin-bottom" id="controlRoot">
  <div><button class="viewTwice" id="viewTwiceBtn">View Twice (2)</button></div>
    <div id="gameTime" class="gameTime"></div>
      <div>
        <h2 class="totalScore">Score: <span id="MGScore">0</span></h2>
      </div>
    </div>
  <div class="container" id="containerRoot"></div>
  `;
    // init function
    containerRoot = id("containerRoot");
    controlRoot = id("controlRoot");
    MGScore = id("MGScore");
    viewTwiceBtn = id("viewTwiceBtn");
    gameTime = id("gameTime");
    console.log("viewTwiceBtn:", viewTwiceBtn);
    viewTwiceBtn.addEventListener("click", viewTwiceHandler);
    getRandomCharacter();
  });

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
    console.log("MemoryGameList:", MemoryGameList);
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
    // console.log('viewTwiceBtn:', viewTwiceBtn)

    viewTwiceHandler();
    cardContainer.forEach((element) => {
      element.addEventListener("click", () => {
        if (element.classList.contains("clicked")) {
          element.classList.remove("clicked");
          return;
        }

        element.classList.add("clicked");
        element.style.pointerEvents = "none";
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
    TOTAL_TURN--;
    gameTime.textContent = `No of turn: ${TOTAL_TURN}`;
    if (TOTAL_TURN === 0) createImage();

    if (first.content !== second.content) {
      setTimeout(() => {
        cardContainer[first.id].style.pointerEvents = "auto";
        cardContainer[second.id].style.pointerEvents = "auto";
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
        cardContainer[first.id].classList.remove("clicked");
        cardContainer[second.id].classList.remove("clicked");
        cardContainer[first.id].children[0].children[0].textContent =
          first.content;
        cardContainer[second.id].children[0].children[0].textContent =
          second.content;
        cardContainer[first.id].children[0].children[0].classList.add(
          "success"
        );
        cardContainer[second.id].children[0].children[0].classList.add(
          "success"
        );
        cardContainer[first.id].children[0].children[1].classList.add(
          "success"
        );
        cardContainer[second.id].children[0].children[1].classList.add(
          "success"
        );
        containerRoot.style.pointerEvents = "auto";
        // check if all card is matched
        //if (totalMGCount === TOTAL_CARD) createImage();
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
    console.log("okay call");
    if (viewTwiceCount <= 0) return;
    let countdown = VIEW_TIME_INTERVAL;
    let timerId;
    viewTwiceBtn.disabled = true;
    viewTwiceBtn.textContent = countdown;

    timerId = setInterval(() => {
      viewTwiceBtn.textContent = --countdown;
      if (countdown === 0) {
        clearInterval(timerId);
        viewTwiceBtn.disabled = false;
        viewTwiceBtn.textContent = `View Count ${
          --viewTwiceCount === 0 ? "Is None" : viewTwiceCount
        }`;
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

  // create the image
  function createImage() {
    setTimeout(() => {
      // html to canvas & download
      html2canvas(document.body).then(function (canvas) {
        const base64String = canvas.toDataURL("image/png");
        const sendFile = makeFile(base64String.split("base64,").pop());
        const divContainer = document.createElement("div");
        divContainer.id = "divContainer";
        document.body.appendChild(divContainer);
        const text = document.createElement("p");
        text.setAttribute("class", "texts");
        text.innerHTML = `<button class="viewTwice"><a id="downloadLink" href="${base64String}" download="memory-game.png">Download</a></button> || <button class="viewTwice" id="shareBtn">Share</button><h3><a href="/">Play again</a></h3>`;
        id("divContainer").appendChild(text);
        // share button
        id("shareBtn").addEventListener("click", () => {
          if (navigator.canShare && navigator.canShare({ files: [sendFile] })) {
            navigator
              .share({
                url: window.location.href,
                files: [sendFile],
                title: "Your Memory Game Score",
                text: `Photos from Memory Game. Here is the link to play the game: ${window.location.href}`,
              })
              .then(() => console.log("share success"))
              .catch((err) => console.log(`errro : ${err}`));
          } else {
            navigator
              .share({
                url: window.location.href,
                title: "Your Memory Game Score",
                text: `Here is the link to play the game: ${window.location.href}`,
              })
              .then(() => console.log("share success"))
              .catch((err) => console.log(`errro : ${err}`));
          }
        });
        const imageDiv = document.createElement("img");
        imageDiv.id = "imageDiv";
        imageDiv.width = window.screen.width;
        imageDiv.height = window.screen.height;
        imageDiv.alt = "memory-game";
        imageDiv.src = canvas.toDataURL("image/png");
        id("divContainer").appendChild(imageDiv);
      });
      containerRoot.innerHTML = "";
      controlRoot.innerHTML = "";
      document.querySelector("footer").style.display = "none";
      document.querySelector("footer").innerHTML = ``;
      mainGame.innerHTML = "";
    }, 3000);
  }

  // convert base64 to file
  function makeFile(base64String) {
    const contentType = "image/png"; // content type of the file
    const filename = "myimage.png"; // name of the file

    // convert base64 string to ArrayBuffer
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const buffer = bytes.buffer;

    // create a new File object from the ArrayBuffer
    return new File([buffer], filename, { type: contentType });
  }

  // convert base64 to blob
  function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  // create the footer
  (() => {
    document.querySelector("footer").innerHTML = `
    Made with <span class="heart">❤</span> by <a href="https://ygi.li">@yezgotit</a>
    `;
  })();
})();
