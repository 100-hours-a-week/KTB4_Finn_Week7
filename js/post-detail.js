const params = new URLSearchParams(window.location.search);
const postId = params.get("postId");
console.log("postId:", postId);

document.getElementById("post-edit-button").addEventListener("click", async (event) => {
    console.log("edit Post, postId:", postId);
});
document.getElementById("post-delete-button").addEventListener("click", async (event) => {
    console.log("delete Post, postId:", postId);
});

document.getElementById("comment-submit-button").addEventListener("click", async (event) => {
    console.log("submit comment, postId:", postId);
});
