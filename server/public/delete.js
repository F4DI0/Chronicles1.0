
const form = document.getElementById('myform');


form.addEventListener("submit", (evt) => {

    evt.preventDefault(); 
    const status = document.getElementById('status');

    // to delete account
    fetch('http://localhost:3000/account/deleteaccount', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async response => {
            await response.json();
            if(response.status === 200){
                status.innerHTML = 'success';
            }
            else
                status.innerHTML = 'fail';
        })
        .catch(error => {
            console.error('Error:', error);
        })
});