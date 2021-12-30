(() => {
  "use strict";

  let id = (id) => document.getElementById(id);

  let data = [
    {
      name: "channel logo",
      file: "html & css/channel logo",
      medium: "youtube",
      link: "https://youtu.be/W9puxi5Shpc",
      source: "https://github.com/YezGotIt/source-code/tree/main/",
    },
    {
      name: "wave affect",
      file: "html & css/wave affect",
      medium: "youtube",
      link: "https://youtu.be/Ds9pCBXIDVo",
      source: "https://github.com/YezGotIt/source-code/tree/main/",
    },
    {
      name: "simple CRUD Operation",
      file: "subscriber asked/simple crud operation",
      medium: "youtube",
      link: "https://youtu.be/rF7LCQG08w0",
      source: "https://github.com/YezGotIt/source-code/tree/main/",
    },
    {
      name: "send mail using js",
      file: "instagram/send mail using js",
      medium: "instagram",
      link: "https://www.instagram.com/p/CWchOaTPZLO/",
      source: "https://github.com/YezGotIt/source-code/tree/main/",
    },
    {
        name: "get ip address",
        file: "instagram/get ip address",
        medium: "instagram",
        link: "https://www.instagram.com/p/CXIDOK6vAg_/",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
        name: "qr code generator",
        file: "html & js/qr code generator",
        medium: "instagram",
        link: "",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    
  ];

  let createProjectList = (projectList) => {
    console.log("projectList:", projectList);
    const root = id("root");
    root.innerHTML = "";
    projectList.forEach((project) => {
      console.log("project:", project);
      const div = document.createElement("div");
      div.setAttribute("class", "col-md-4 mb-4");
      div.innerHTML = `
            <div class="card " style="width: 18rem">
            <div class="card-body d-flex justify-content-between">
                <div>
                    <a href="./${project.file}/index.html" class="card-link">${project.name}</a>
                </div>
                <div>
                    <a class="text-secondary" href="${project.source}${project.file}"><i class="fas fa-code"></i></a>
                </div>
                <div>
                    <a href="${project.link}"><i class="fab fa-${project.medium} ${project.medium}"></i></a>
                    
                </div>
            </div>
            </div>
            `;
      root.appendChild(div);
    });
  };

  createProjectList(data);
})();
