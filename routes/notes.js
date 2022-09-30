const notes = require('express').Router();
const { readFromFile, readAndAppend, readAndRemove } = require('../public/assets/js/fsUtils');
const uuid = require('../public/assets/js/uuid');


notes.route('/')
    .get((req, res) => {
        readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    })
    .post((req, res) => {
        if (req.body) {
            const { title, text } = req.body;
            const newNote = {
                title,
                text,
                id: uuid()
            };
            readAndAppend(newNote, './db/db.json');
            res.json(`note added`);
        }
    });
notes.route('/:id')
    .delete((req, res) => {
        readAndRemove(req.params.id, './db/db.json');
    })

module.exports = notes;