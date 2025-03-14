
const form = document.getElementById('myform');


form.addEventListener("submit", (evt) => {

    evt.preventDefault(); 
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value;
    const status = document.getElementById('status');
    // the login request
    // important
    fetch('http://localhost:3000/account/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(async response => {
            await response.json();
            if(response.status === 200){
                status.innerHTML = 'success';
                // window.location.href = "http://localhost:3000/upload";
            }
            else
                status.innerHTML = 'fail';
        })
        .catch(error => {
            console.error('Error:', error);
        })
});