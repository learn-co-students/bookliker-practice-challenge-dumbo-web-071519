document.addEventListener("DOMContentLoaded", function() {
    const currentUser = { "id": 1, "username": "pouros" }
    //const currentUser = { id: 2, username: "auer" }
    const bookList = document.querySelector('#list')
    const showBookPanel = document.querySelector('#show-panel')

    fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(renderBooks)

    function renderBooks(arr) {
        arr.forEach((book) => {
            bookList.innerHTML += `<li data-id="${book.id}">${book.title}</li>`
        })
    }

    function getBookInfo(bookId) {
        fetch(`http://localhost:3000/books/${bookId}`)
        .then(resp => resp.json())
        .then(showBookInfo)
    }

    function showBookInfo(book) {
        showBookPanel.innerHTML = ""
        showBookPanel.innerHTML += `
            <h1>${book.title}</h1>
            <img src=${book.img_url} />
            <p>${book.description}</p>
            <button data-book-id=${book.id}>Read Book</button>
            <h4>People who have already read this book: </h4>
            <hr>`

        book.users.forEach((user) => {
            showBookPanel.innerHTML += `<h4 data-user=${user.id}>${user.username}</h4>`
        })
        const bookButton = showBookPanel.querySelector('button')
        bookButton.addEventListener('click', (e) => {
            e.preventDefault()
            addReaderToBook(book)
        })
    }

    function addReaderToBook(book){
        for (const k in book.users) {
            let el = book.users[k]
            if(el.id === currentUser.id){
                alert('You already read this book')
                return
            }
        }
        book.users.push(currentUser)
        const config = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'users': book.users })
        }
        fetch(`http://localhost:3000/books/${book.id}`, config)
        .then(resp => resp.json())
        .then(book => { getBookInfo(book.id) })
    }

    bookList.addEventListener('click', (e) => {
        if(e.target.dataset.id){
            let bookId = e.target.dataset.id
            getBookInfo(bookId)
        }
    })
})
