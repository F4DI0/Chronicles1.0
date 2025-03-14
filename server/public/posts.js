
const container = document.getElementById("con");

//this fetch is for testing
//will be removed later
fetch("http://localhost:3000/posts/getall", {
    method: "GET"
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        for(let item of data){
            const title = document.createElement("h1");
            title.innerHTML = `${item.title} by ${item.author.username}`;
            const image = document.createElement("img");
            image.src = `http://localhost:3000/${item.fileurl}`
            container.appendChild(title)
            container.appendChild(image)
            const ul = document.createElement("ul");
            const likebutton = document.createElement("button");
            likebutton.innerHTML = "like";
            const form = document.createElement("form");
            const textbox = document.createElement('input');
            textbox.type = 'text';
            textbox.name = 'comment';
            const submitbutton = document.createElement("button");
            submitbutton.innerHTML = "send";
            submitbutton.type = 'submit';
            form.appendChild(textbox)
            form.appendChild(submitbutton);
            form.addEventListener('submit', (evt) =>{
                evt.preventDefault();
                //this is for commenting
                //important 
                fetch(`http://localhost:3000/posts/${item._id}/comment`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({comment: textbox.value}),
                }).then(response =>{
                    const li = document.createElement('li');
                    li.innerHTML = textbox.value;
                    ul.appendChild(li);
                    return response.json();
                }).then(data =>{
                    console.log(data);
                    console.log(data.error);
                });
            })
            for(let comment of item.comments){
                const commentli = document.createElement("li");
                commentli.innerHTML = `${comment.author.username}:${comment.comment}`;
                ul.appendChild(commentli);
            }
            likebutton.addEventListener("click", (evt)=>{
                fetch(`http://localhost:3000/posts/${item._id}/like`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response =>{
                    if(response.status === 200){
                        console.log('success');
                    }
                    else
                        console.log("fail");
                })
            })
            container.appendChild(ul);
            container.appendChild(likebutton);
            container.appendChild(form);
            container.appendChild(document.createElement("hr"));
        }
    })