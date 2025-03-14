
const myform = document.getElementById('myform');
const stat = document.getElementById('status');
const res = document.getElementById('res');


myform.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rpassword = document.getElementById("rpassword").value;

    console.log('reached');

    // to create account here request
    fetch('http://localhost:3000/account/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, firstname, lastname, username, password, rpassword})
    }).then(response => response.json()).then(data => {
        if (data.error) {
            stat.innerHTML = 'fail';
        }
        else {
            stat.innerHTML = 'success';
        }
        res.innerHTML = data;

    }).catch(err => {
        stat.innerHTML = "error";
    })
})