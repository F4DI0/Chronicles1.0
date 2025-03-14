
const myform = document.getElementById('myform');
const stat = document.getElementById('stat');



myform.addEventListener("submit", (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('file');
    const title = document.getElementById('title').value;
    if (fileInput.files.length === 0) {
        console.log('can not send empty file');
        return;
    }


    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    // to upload posts
    // important
    fetch('http://localhost:3000/posts/upload', {
        method: 'POST',
        body: formData
    }).then(response => response.json()).then(data => {
        if (data.error) {
            stat.innerHTML = 'fail';
        }
        else {
            stat.innerHTML = 'success';
        }

    }).catch(err => {
        stat.innerHTML = "error";
    })
})