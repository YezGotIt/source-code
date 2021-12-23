    const btn = document.querySelector('button')
    btn.addEventListener('click',sendEmail)

function sendEmail(){

    const from = document.getElementById("getMail").value

    if(!validator.isEmail(from)) 
    return (alert("Please enter a valid email address"), from = "")

    const subject = document.getElementById("getSubject").value

    if(validator.isEmpty(subject)) 
    return alert("Please enter a subject")

    const body = document.getElementById("getBody").value

    if(validator.isEmpty(body)) 
    return alert("Please enter a body")

    Email.send({
        Host: "smtp.gmail.com",
        Username : "<sender’s email address>",
        Password : "<email password>",
        To : '<recipient’s email address>',
        From : from,
        Subject : subject,
        Body : body,
    }).then(
    message => alert(message)
    );

        }