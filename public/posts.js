document.addEventListener("DOMContentLoaded", async function(){
    const posts = document.querySelector(".post-section");
    const section = document.querySelector(".to-do");
    section.innerHTML = "";
    posts.innerHTML = "";
    const queryString = window.location.search;
    const UrlSearchParams = new URLSearchParams(queryString);
    const userId = UrlSearchParams.get("userid");
    
    async function getData(){
        try{
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
            
            if(!response.ok){
                throw new Error("Couldn't fetch the details");
            }
            
            const data = await response.json();
            
            // Use a for...of loop instead of forEach for proper async/await handling
            for (let i = 0; i < data.length; i++) {
                const p = data[i];
                createPost(p.title, p.body);
                await getComments(i + 1); // Wait for comments to finish before moving to next post
            }
                  
        } catch(error){
            console.error("There was an error", error);
        }
    }
    
    await getData();

    async function getTodos(){
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
        if(!response.ok){
            throw new Error("Couldn't fetch the data");
        }

        const data = await response.json();

        data.forEach(d =>{
            todos(d);

        })
    }

    await getTodos();
})

async function getComments(postId){
    try {
        const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if (!commentsResponse.ok) {
            throw new Error("Couldn't fetch the comments");
        }
        const comments = await commentsResponse.json();
        console.log(comments);
        const section = document.querySelector(".post-section");
        
        comments.forEach(c => {
            section.innerHTML += `
            <div class="comment">
              <strong>${c.email}</strong>
              <p>${c.body}</p>
            </div>
            `;
        });
        
    } catch (error) {
        console.error("There was an error fetching the comments", error);
    }
}

function createPost(title, body){
    const section = document.querySelector(".post-section");
    section.innerHTML += `
    <h2>${title}</h2>
    <p>${body}</p>
    <h3>Comments</h3>
    `;
    
}

function todos(d){
    const section = document.querySelector(".to-do");
    section.innerHTML+= `
    <div class="todo-item">
      <input type="checkbox" id="todo1" name="todo1">
      <label for="todo1">${d.title}</label>
    </div>`


}

/*
<section class="post-section">
        <h2>Post Title</h2>
        <p>This is the body of the post. The post content goes here. You can write a brief description of the post or the main content.</p>
    
        <h3>Comments</h3>
        <div class="comment">
          <strong>John Doe</strong>
          <p>This is a comment on the post.</p>
        </div>
        <div class="comment">
          <strong>Jane Doe</strong>
          <p>This is another comment on the post.</p>
        </div>
    </section>
*/

/*
<h2>Todos</h2>
    <section class="to-do">
    <div class="todo-item">
      <input type="checkbox" id="todo1" name="todo1">
      <label for="todo1">Complete the project</label>
    </div>
    <div class="todo-item">
      <input type="checkbox" id="todo2" name="todo2">
      <label for="todo2">Attend team meeting</label>
    </div>
    <div class="todo-item">
      <input type="checkbox" id="todo3" name="todo3">
      <label for="todo3">Buy groceries</label>
    </div>
    */