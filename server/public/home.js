
let isfetching = false;

document.getElementById('btnrefresh').addEventListener('click', (evt) => {
    if (!isfetching) {
        isfetching = true;
        //this is suppose to be testing, not tested yet
        fetch('http://localhost:3000/posts/feed', {
            method: "GET"
        }).then(response => response.json())
            .then(data => {
                console.log(data);
            }).catch(err => {
                isfetching = false;
            })
            
    }
});