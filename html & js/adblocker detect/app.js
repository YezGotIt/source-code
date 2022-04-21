(() => {
    "use strict";
  //   value declaration
    let hashValue = "";
    const hash = -1722915916;
  
  //   to create a modal
    function createModal(message = "Please trunOff the AdBlock",title = "AdBlock Detected!") {
      const div = document.createElement("div");
      div.setAttribute("id", "adDetect");
      div.innerHTML = `
    <div class="modal" style="display: grid; place-items: center; position: absolute; z-index: 1; left: 0; top: 0; right: 0; bottom: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 1);">
  <div class="modal-content" style="background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 60%; border-radius: 10px;">
      <h1>${title}</h1>
      <p>
        <strong>
          <span class="adblock-detected">${message}</span>
        </strong>
      </p>
    </div>
  </div>
    `;
  
      return document.body.appendChild(div);
    }
  
  //  to check hash value
    function stringToHash(string) {
      let hash = 0;
      if (string.length == 0) return hash;
      for (let i = 0; i < string.length; i++) {
        let char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return hash;
    }
  
  //  check weather modal is there or not
    function checkWeatherModal() {
      const IsCreateModel = document.getElementById("adDetect");
      if (!IsCreateModel) return createModal();
      if (IsCreateModel) {
        IsCreateModel.style.display = "block"
        hashValue = stringToHash(IsCreateModel.innerHTML);
        if (hashValue !== hash) {
            document.body.removeChild(IsCreateModel);
            return createModal();
        }
      }
    }
  
  //  adblock is on or off 
    async function detectAdBlock() {
      let adBlockEnabled = false;
      const googleAdUrl =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      try {
        await fetch(new Request(googleAdUrl)).catch(
          (_) => (adBlockEnabled = true)
        );
      } catch (e) {
        adBlockEnabled = true;
      } finally {
        if (adBlockEnabled) return checkWeatherModal();
        return null;
      }
    }
  
  //   interval to check weather modal is there or not
    setInterval(() => detectAdBlock(), 10000);
  
  })();
  