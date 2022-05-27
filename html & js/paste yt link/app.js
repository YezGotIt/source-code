//  main function
function start() {
  const ytlink = $("#ytLink").val();

  if(ytlink.length === 0) return false

//   validate the link
  if (!validator.isURL(ytlink, { protocols: ["http", "https"],})) return alert("Invalid URL", "danger");

    // find word in which has be youtu.be or youtube.com in a text
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
    if(!regex.test(ytlink) ) return alert("It must be YouTube video link", "danger");
    
    
    const videoId = ytlink.match(regex)[1];
    $("#root").empty()
    createCard({title: "Thumbnail", image: thumbnailImage(videoId)});
    createCard({title: "Watch Here", frame: videoId});
    createCard({title: "Download from third party site", site: videoId});
   
}

// getting thumbnail image
function thumbnailImage(id){
    return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

// create the alert in js
function alert(message, type) {
  $("#alert")
    .html(`<div class="alert alert-${type} alert-dismissible fade show position-fixed" role="alert">
    <div class="text-center"><strong >${message}</strong></div>
    </div>`);
  setTimeout(() => $("#alert").empty(), 4000);
}

// create the card in js
function createCard({title, image,frame, site}){
    let message = ""
    if(image){
        message = `
        <img src="${image}" alt="error-image" class="img-fluid" />
        <a class="text-center btn btn-primary mt-3" target="_blank" href="${image}" download> 
            Open <i class="fa-solid fa-up-right-from-square"></i>
        </a>
        `
    }

    if(frame){
        message = `
        <div class="ratio ratio-16x9">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${frame}"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
        </div>
        `
    }

    if(site){
        message = `
        <a class="text-center btn btn-primary mt-3" target="_blank"
        href="https://www.ssyoutube.com/watch?v=${site}">Visit 
        <i class="fa-solid fa-up-right-from-square"></i>
        </a> || 
        <a class="text-center btn btn-primary mt-3" target="_blank"
        href="https://www.youtube5s.com/watch?v=${site}">Visit 
        <i class="fa-solid fa-up-right-from-square"></i>
        </a>
        `
    }
    

    const div = document.createElement("div");
    div.setAttribute("class", "col-md-8 mx-auto mb-5")
    div.innerHTML = `
    <div class="row">
        <div class="col-md-8 mx-auto">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">${title}</div>
                    ${message}
                </div>
            </div>
        </div>
    </div>`;
    
    $("#root").append(div);
}
