const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({message: "Required Username and Password"});
    }
    if (users.some(u => u.username === username)) {
        return res.status(400).json({message: "Username already exists"});
    } else {
        users.push({ username, password });
        console.log(users);
        return res.status(201).json({message: "Registration Complete"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
new Promise((resolve, reject) => {
        resolve(JSON.stringify(books));
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json({message: "Internal server error"});
    });
});

//task 10
public_users.get('/books', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/');
      res.status(200).json(response.data)
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (!book) {
            reject(`No match for isbn: ${isbn}`);
        } else {
            resolve(book);
        }
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(404).json({message: error});
    });
});

//task 11
public_users.get('/getisbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
        res.status(200).json(response.data)
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    new Promise((resolve, reject) => {
        const author = req.params.author;
        const booksByAuthor = Object.values(books).filter(b => b.author === author);
        if (booksByAuthor.length === 0) {
            reject(`No matches for author: ${author}`);
        } else {
            resolve(booksByAuthor);
        }
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(404).json({ message: error });
    });
});

//task 12
public_users.get('/getauthor/:author', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
        res.status(200).json(response.data)
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    new Promise((resolve, reject) => {
        const title = req.params.title;
        const booksByTitle = Object.values(books).filter(b => b.title.includes(title));
        if (booksByTitle.length === 0) {
            reject(`No matches for title: ${title}`);
        } else {
            resolve(booksByTitle);
        }
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(404).json({ message: error });
    });
});

//task 13
public_users.get('/gettitle/:title', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
        res.status(200).json(response.data)
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book || !book.reviews) {
        return res.status(404).json({message: `No reviews for isbn: ${isbn}`});
    }
    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
