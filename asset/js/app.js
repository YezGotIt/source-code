(() => {
  "use strict";

  let id = (id) => document.getElementById(id);

  let data = [
    {
      isShow: true,
      name: "channel logo",
      file: "html & css/channel logo",
      medium: "youtube",
      link: "https://youtu.be/W9puxi5Shpc",
      source: "https://github.com/YezGotIt/source-code/tree/main/",
    },
    {
      isShow: true,
      name: "simple CRUD Operation",
      file: "subscriber asked/simple crud operation",
      medium: "youtube",
      link: "https://youtu.be/rF7LCQG08w0",
      source: "https://github.com/YezGotIt/source-code/tree/main/",
    },
    {
      isShow: true,
      name: "send mail using js",
      file: "instagram/send mail using js",
      medium: "instagram",
      link: "https://www.instagram.com/p/CWchOaTPZLO/",
      source: "https://github.com/YezGotIt/source-code/tree/main/",
    },
    {
      isShow: true,
        name: "get ip address",
        file: "instagram/get ip address",
        medium: "instagram",
        link: "https://www.instagram.com/p/CXIDOK6vAg_/",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "qr code generator",
        file: "html & js/qr code generator",
        medium: "instagram",
        link: "https://www.instagram.com/reel/CYJfBkoKZoa",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "countdown timer",
        file: "html & js/counter timer",
        medium: "youtube",
        link: "https://youtu.be/nDcJLwKFomU",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "coding a paper bill",
        file: "html & css/coding a paper bill",
        medium: "youtube",
        link: "https://youtu.be/3-idSv3Dn10",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "blue heart animation",
        file: "html & css/blue heart animation",
        medium: "youtube",
        link: "https://youtu.be/r35x9tKmB4w",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
      name: "wave animation",
      file: "html & css/wave affect",
      medium: "youtube",
      link: "https://youtu.be/Ws-W32_PRt0",
      source: "https://github.com/YezGotIt/source-code/tree/main/",
    },
    {
      isShow: true,
        name: "wished card",
        file: "html & js/wished card",
        medium: "youtube",
        link: "https://youtube.com/shorts/G0oJOav99JY",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "red heartbeat animation",
        file: "html & css/red heartbeat animation",
        medium: "instagram",
        link: "https://www.instagram.com/reel/Cc746t4MjVf/",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "adBlocker Detect",
        file: "html & js/adblocker detect",
        medium: "instagram",
        link: "https://www.instagram.com/tv/CdN7l4UrSPq",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
     {
      isShow: true,
        name: "paste yt link",
        file: "html & js/paste yt link",
        medium: "instagram",
        link: "https://www.instagram.com/reel/Cd5oeuuPo6I",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "fadeout animation",
        file: "html & css/fadeout animation",
        medium: "instagram",
        link: "https://www.instagram.com/reel/CeWLP4yPxmA",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "local storage",
        file: "html & js/local storage",
        medium: "youtube",
        link: "https://youtube.com/shorts/HG6AVqSy61c",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "blob",
        file: "html & js/blob",
        medium: "youtube",
        link: "https://youtu.be/822qRTmFyto",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "css svg loader",
        file: "html & css/css-svg-loader",
        medium: "youtube",
        link: "https://youtube.com/shorts/Yh8ep-1zhrA",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "async & defer",
        file: "html & js/async & defer",
        medium: "youtube",
        link: "https://youtu.be/MA5zCcUOS1g",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
    {
      isShow: true,
        name: "mamory game",
        file: "html & js/memory game",
        medium: "instagram",
        link: "",
        source: "https://github.com/YezGotIt/source-code/tree/main/",
      },
  ];

  let createProjectList = (projectList) => {
    console.log("projectList:", projectList);
    const root = id("root");
    root.innerHTML = "";
    projectList.filter(i => i.isShow).forEach((project) => {
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
