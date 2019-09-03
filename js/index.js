const bookList = document.getElementById("list")
const currentUser = {"id": 1, "username":"pouros"}
const showPanel = document.getElementById("show-panel")
const bookButton = document.querySelector("button")

function getBooks(){
    return fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(renderBooks)
}
function renderBooks(books){
    books.forEach(book =>{
        bookList.innerHTML +=  `<li data-id=${book.id}>${book.title}</li> `
    })
}

function getSingleBook(id){
    console.log(id, "this is the id passed to getSingleBook")
    return fetch(`http://localhost:3000/books/${id}`)
    .then(res => res.json())
    .then(showSingleBook)
}

function showSingleBook(obj){
    console.log(obj, "this is the obj being passed to single book (debug 25)")
    // debugger
    showPanel.innerHTML = ""
    showPanel.innerHTML += `
    <img src= ${obj.img_url}>
    <p>${obj.description}</p>
    <button data-likes>Like this Book</button>
    <h5>People Who Like This Book:</h5>`
    obj.users.forEach((user) =>{
        showPanel.innerHTML += `<h6 data-user=${user.id}>${user.username}</h6>`
    })
    document.querySelector("button").addEventListener("click", function (event) {
        event.preventDefault()
        if (event.target.tagName == "BUTTON") {
            
            //need to get the book obj somehow and add user to likes
            addUserToLikers(obj)
        }
    })

}

function addUserToLikers(bookObj){
    console.log(bookObj, "say hello to the bookObj (debug 52")
    const config = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
       
        body: JSON.stringify({ 'users': bookObj.users })
    }
    fetch(`http://localhost:3000/books/${bookObj.id}`, config)
    .then(res => res.json())
    .then(book => {
        pushToUsers(book)
        showSingleBook(book)})
}

function pushToUsers(obj){
    obj.users.push(currentUser)
}


document.addEventListener("DOMContentLoaded", getBooks)
document.querySelector("ul").addEventListener("click", (event) => {
    console.log(event.target.dataset.id, "this is the event target dataset id (debug 71)")
    if (event.target.dataset.id) {
        let bookId = event.target.dataset.id
        getSingleBook(bookId)
    } 
})
