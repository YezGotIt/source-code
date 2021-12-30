let qrCodeStyle;

async function qrCode() {
  try {
    const canvas = document.getElementById("canvas");
    const row = document.getElementsByClassName("row")[1];

    let addUrl = $("#addUrl").val() || "";
    let addFile = $("#addFile");
    let addImage = "";
    let base64Str = "";
    let info = $("#info").val();
    let dotColor = $("#dotColor").val();
    let dotbgColor =$("#dotbgColor").val();
    let selectDot = $("#selectDot").val();
    let radioValue = $("input[name='inlineRadioOptions']:checked").val();

    if (radioValue === "url") {
      if (row.children.length > 5 && !addUrl) row.removeChild(row.lastElementChild);

      if (!addUrl) {
        const div = document.createElement("div");
        div.setAttribute("class", "col-md-6 mt-2 mb-2");
        div.innerHTML = `
          <div class="mb-3">
              <label for="data" class="form-label">Url</label>
              <input type="text" class="form-control" id="addUrl" onchange="qrCode()">
          </div>
          `;
        row.appendChild(div);
      }
    }

    if (radioValue === "file") {
      if (row.children.length > 5 && addFile) row.removeChild(row.lastElementChild);

      if (addFile.length === 0 && row.children.length <= 5) {
        const div = document.createElement("div");
        div.setAttribute("class", "col-md-6 mt-2 mb-2");
        div.innerHTML = `
            <div class="mb-3">
                <label for="data" class="form-label">File</label>
                <input type="file" class="form-control" id="addFile" onchange="qrCode()" accept="image/*">
            </div>
            `;
        row.appendChild(div);
        addFile = $("#addFile");
      }
    }

    if (radioValue === "file" && addFile[0].files[0]) base64Str = await getBase64(addFile[0].files[0]);
    

    if (radioValue === "no" && row.children.length > 5) row.removeChild(row.lastElementChild);

    if (radioValue === "url" && validator.isURL(addUrl)) addImage = addUrl;

    if (radioValue === "file" && addFile[0].files[0]) addImage = base64Str;

    qrCodeStyle = new QRCodeStyling({
      width: 350,
      height: 350,
      type: "canvas",
      data: info,
      margin: 5,
      image: addImage,
      dotsOptions: {
        color: dotColor,
        type: selectDot,
      },
      backgroundOptions: {
        color: dotbgColor,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
      },
    });

    canvas.innerHTML = "";
    qrCodeStyle.append(canvas);
    if (!info) return;
    const div = document.createElement("div");
    div.setAttribute("class", "text-center p-2 fs-5 text");
    div.innerText = info;
    canvas.append(div);
  } catch (error) {
    console.log(error);
  }
}

function download() {
  if (qrCodeStyle !== undefined)
    qrCodeStyle.download({ name: "qr", extension: "png" });
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
