let currentUser = localStorage.getItem("user");

if (currentUser) showApp();

function login() {
    let username = document.getElementById("usernameInput").value;
    if (username) {
        localStorage.setItem("user", username);
        currentUser = username;
        showApp();
    }
}

function showApp() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("userDisplay").innerText = "@" + currentUser;
    loadPosts();
}

function uploadPost() {
    let file = document.getElementById("fileInput").files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        let posts = JSON.parse(localStorage.getItem("posts") || "[]");

        posts.unshift({
            img: e.target.result,
            likes: 0,
            comments: []
        });

        localStorage.setItem("posts", JSON.stringify(posts));
        loadPosts();
    };
    reader.readAsDataURL(file);
}

function loadPosts() {
    let feed = document.getElementById("feed");
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");

    feed.innerHTML = "";

    posts.forEach((post, i) => {
        let div = document.createElement("div");
        div.className = "post";

        div.innerHTML = `
            <div class="post-header">
        <img src="https://i.pravatar.cc/100?u=${post.img}">
        <div class="info">
            <b>${currentUser}</b><br>
            <span>Indonesia</span>
        </div>
    </div>

    <div class="img-container" ondblclick="doubleLike(${i})">
        <img src="${post.img}">
    </div>

    <div class="actions">
        <div>
            <i class="fa-regular fa-heart" onclick="likePost(${i})"></i>
            <i class="fa-regular fa-comment"></i>
            <i class="fa-regular fa-paper-plane"></i>
        </div>
        <i class="fa-regular fa-bookmark"></i>
    </div>

    <div class="likes">${post.likes} likes</div>

    <div class="caption">
        <b>${currentUser}</b> <span>Menikmati momen terbaik 🔥</span>
    </div>

    <div class="comment-box">
        <input placeholder="Tambahkan komentar..." onkeypress="addComment(event, ${i}, this)">
        <div class="comment-list">
            ${post.comments.map(c => `<p><b>${c.user}</b> ${c.text}</p>`).join("")}
        </div>
    </div>
        `;

        feed.appendChild(div);
    });
}

function likePost(i) {
    let posts = JSON.parse(localStorage.getItem("posts"));
    posts[i].likes++;
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
}

function doubleLike(i) {
    likePost(i);
}

function addComment(e, i, input) {
    if (e.key === "Enter" && input.value.trim() !== "") {
        let posts = JSON.parse(localStorage.getItem("posts"));

        posts[i].comments.push({
            user: currentUser,
            text: input.value
        });

        localStorage.setItem("posts", JSON.stringify(posts));
        loadPosts();
    }
}