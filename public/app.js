const letters = ["a", "b", "c", "d" , "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
document.addEventListener("DOMContentLoaded", function(){
    async function getData(){
        try{
            const response = await fetch("https://jsonplaceholder.typicode.com/users")
            if(!response.ok){
                throw new Error("Network Response was not Ok ");
            }
    
            const data = await response.json();
            console.log(data);
            data.forEach(user =>{
                for(i = 0; i < letters.length; i++){
                    if(user.name[0] === letters[i].toUpperCase()){
                        console.log(user.name);
                        createUserInfo(user.name);
                    }
                }
    
            })
            
            attatchButtonListeners();
    
        } catch(error){
            console.error("Fetch Error", error);
        }
    }
    
    
    getData();
     
})

document.querySelector('input[type="search"]').addEventListener("change", function() {
    const searchValue = this.value.toLowerCase();
    const values = document.querySelectorAll("p");

    values.forEach(p => {
        const parentDiv = p.parentElement;  // Get the parent <div>
        const paragraphText = p.innerText.toLowerCase();

        if (paragraphText.startsWith(searchValue)) {
            parentDiv.style.display = "block"; // Show the parent <div>
        } else {
            parentDiv.style.display = "none"; // Hide the parent <div>
        }
    });
});


function createUserInfo(username){
    const container = document.getElementById("app");
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    gridItem.innerHTML += `<p>${username}</p>`
    gridItem.innerHTML += `<button class="username-btn" data-username="${username}">Click</button>`
    container.append(gridItem);
}

function attatchButtonListeners(){
    const buttons = document.querySelectorAll(".username-btn");
    buttons.forEach(button => {
        button.addEventListener("click", function(){
            const username = this.dataset.username;
            console.log("clicked on button with username", username);
            window.location.href = `http://localhost:3000/user-info?username=${username}`;
        })
    })
}


/*var i = 1;
var text = "";
incrementor = 0;

while(incrementor < 11){
    text += `The Incrementor has gone up ${incrementor} \n`;
    incrementor++;
}
console.log(text);
*/

