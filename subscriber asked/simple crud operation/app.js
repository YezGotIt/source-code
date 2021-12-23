// url
const url = "https://617a699fcb1efe001700fe3a.mockapi.io/users/"

// Get all info
function getAll(){
  axios.get(url)
  .then(res => displayInfo(res.data))
  .catch(err =>console.error(err))
}

function oneInput(wrapper, name){
  wrapper.innerHTML = `
  <div class="input-group flex-nowrap">
              <span class="input-group-text">Id</span>
              <input type="text" class="form-control" id="getId">
            </div>
            <button class="btn btn-primary mt-4" onclick="${name}()">Send it</button>
  `
  return wrapper
}

// call to action
function showIt(action){
const content = document.getElementById("content")
  if(action === "getOne"){
    oneInput(content, "getOne")
  }

  if(action === "deletes"){
    oneInput(content, "deletes")
  }

  if(action === "post"){
    let randomName = faker.name.findName(); 
let randomEmail = faker.internet.email(); 
content.innerHTML = `
<div class="input-group flex-nowrap">
        <span class="input-group-text">name</span>
        <input type="text" class="form-control" id="getName" value="${randomName}">
    </div>

    <div class="input-group flex-nowrap mt-2">
        <span class="input-group-text">email</span>
        <input type="text" class="form-control" id="getMail" value="${randomEmail}" >
    </div>

    <button class="btn btn-primary mt-4" onclick="post()">Send it</button>
`
  }


  if(action === "put"){
    let randomName = faker.name.findName(); 
    let randomEmail = faker.internet.email(); 
    content.innerHTML = `
    <div class="input-group flex-nowrap">
              <span class="input-group-text">Id</span>
              <input type="text" class="form-control" id="getId">
            </div>
<div class="input-group flex-nowrap mt-2">
        <span class="input-group-text">name</span>
        <input type="text" class="form-control" id="getName" value="${randomName}">
    </div>

    <div class="input-group flex-nowrap mt-2">
        <span class="input-group-text">email</span>
        <input type="text" class="form-control" id="getMail" value="${randomEmail}" >
    </div>

    <button class="btn btn-primary mt-4" onclick="put()">Send it</button>
`
  }
}

// Get one info
function getOne(){
  const id = document.getElementById("getId").value
  
  axios.get(`${url}${id}`)
  .then(res => displayInfo([res.data]))
  .catch(err =>console.error(err))
}

// Post new info
function post(){
const name = document.getElementById("getName").value
const mail = document.getElementById("getMail").value

axios.post(url, {name, mail})
.then(res => {if(res.status === 201) return alert("successful created"),getAll()})
.catch(err => console.error(err))


}

// Update new info
function put(){
  const id = document.getElementById("getId").value
  const name = document.getElementById("getName").value
const mail = document.getElementById("getMail").value

axios.put(`${url}${id}`, {name,mail})
.then(res => {if(res.status === 200) return alert("successful updated"),getAll()})
.catch(err => console.error(err))
}

// Delete the info
function deletes(){
  const id = document.getElementById("getId").value
  
  axios.delete(`${url}${id}`)
  .then(res =>{
    if(res.status === 200) return alert("successful deleted"),getAll()
  })
  .catch(err =>console.error(err))
}

// For display the data
function displayInfo(data){
  console.log('data:', data)
  const root = document.getElementById("data")
  root.innerHTML = ""
  return createTable(data,root)
}

// To create the table
function createTable(payload, wrapper) {
const div = document.createElement("div");
div.setAttribute("class", " mt-3 py-3");
let createTable = document.createElement("table");
createTable.setAttribute("class", "table  table-hover mt-2 mb-5 table-sm");
let tHead = createTable.createTHead();
let tBody = createTable.createTBody();
let hRow = document.createElement("tr");
let th = document.createElement("th");
th.setAttribute("scope", "col");
th.innerHTML = "ID No";
hRow.appendChild(th);
th = document.createElement("th");
th.setAttribute("scope", "col");
th.innerHTML = "Name";
hRow.appendChild(th);
th = document.createElement("th");
th.setAttribute("scope", "col");
th.innerHTML = "Mail";
hRow.appendChild(th);
th = document.createElement("th");
th.setAttribute("scope", "col");
th.innerHTML = "CreatedAt";
hRow.appendChild(th);
tHead.appendChild(hRow);

payload.forEach((element) => {
let row = document.createElement("tr");

let td = document.createElement("td");
td.innerHTML = element.id;
row.appendChild(td);

td = document.createElement("td");
td.innerHTML = element.name;
row.appendChild(td);

td = document.createElement("td");
td.innerHTML = element.mail;
row.appendChild(td);

td = document.createElement("td");
td.innerHTML = moment(element.createdAt).format("ll");
row.appendChild(td);


tBody.append(row);
});

createTable.append(tHead, tBody);
div.append(createTable);

wrapper.append(div);
}