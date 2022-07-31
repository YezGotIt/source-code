async function start() {
  const file = document.getElementById("formFile").files[0];
  const base64 = await getBase64(file);
  createImageBase(base64);
  // createImageOne(file, file.type);
  createImageTwo(base64.split("base64,").pop(), file.type);
}

function createImageBase(data) {
  document.getElementById("root").appendChild(div("Base64", data));
}

function createImageOne(data, type) {
  const blob = new Blob([data], { type: type });
  let url = URL.createObjectURL(blob);

  document.getElementById("root").appendChild(div("Object", url));
}

function createImageTwo(data, type) {
  const blob = b64toBlob(data, type);
  let url = URL.createObjectURL(blob);

  document.getElementById("root").appendChild(div("Base64 to Blob", url));
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  let byteCharacters = atob(b64Data);
  let byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);

    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new File(byteArrays, "pot", { type: contentType });
}

function div(message, image) {
  console.log("image:", image);
  const div = document.createElement("div");
  div.setAttribute("class", "image")
  div.innerHTML = `
  <h1>${message}</h1>
  <img src=${image} alt="no-image ${message}"/>
  `;
  return div;
}