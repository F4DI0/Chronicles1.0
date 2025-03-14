
// this fetch is endpoint will be removed, its for only testing
// no need to try "allusers" 
fetch('http://localhost:3000/users/allusers', {
    method: 'GET'
})
    .then(response => response.json())
    .then(data => {
        const div = document.querySelector(".container");
        for (let user of data) {
            const username = user.username;
            const h1 = document.createElement('h1');
            h1.innerHTML = username;
            const button = document.createElement("button");
            const unfollowbtn = document.createElement("button");
            button.innerHTML = 'follow';
            const stats = document.createElement("h1");
            stats.innerHTML = 'pending';
            button.addEventListener("click", (evt) => {

                //to follow user based on their id
                //important
                fetch(`http://localhost:3000/users/follow/${user._id}`).then(response => response.json())
                    .then(data => {
                        stats.innerHTML = (data.message) ? "success" : `error: ${data.error}`;
                    })
                    .catch(err => {
                        stats.innerHTML = 'error';
                    })
            })
            unfollowbtn.addEventListener('click', (evt) => {
                //to remove a user from their following list
                //important
                fetch(`http://localhost:3000/users/follow/${user._id}`, {
                    method: "DELETE"
                }).then(response => response.json())
                    .then(data => {
                        stats.innerHTML = (data.message) ? "success (unfollowed)" : `error: ${data.error}`;
                    })
                    .catch(err => {
                        stats.innerHTML = 'error';
                    })
            });
            unfollowbtn.innerHTML = "unfollow";
            div.appendChild(h1);
            div.appendChild(button);
            div.appendChild(unfollowbtn);
            div.appendChild(stats);
            div.appendChild(document.createElement('hr'))
        }
    })