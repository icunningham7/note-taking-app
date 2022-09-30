const fs = require('fs');
const util = require('util');
const uuid = require('./uuid');

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

/**
 *  Function to read data from a given a file and remove a json object with a provided id
 *  @param {object} content The content you want to remove from the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndRemove = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      const noteIndex = parsedData.findIndex((element) => element.id === content);
      parsedData.splice(noteIndex, 1);
      writeToFile(file, parsedData);
    }
  });
};

/**
 *  Function to generate a unique id that isn't being used in the database 
 *  @param {string} file The path to the file you want to save to.
 *  @returns {id} A unique id
 */
const getUniqueUuid = (file) => {
  let newId;
  const data = fs.readFileSync(file, 'utf8');
  const parsedData = JSON.parse(data);
  let idExists = true;

  while (idExists) {
    newId = uuid();
    idExists = parsedData.findIndex((element) => element.id === newId) !== -1;
  }

  return newId;
};

module.exports = { readFromFile, writeToFile, readAndAppend, readAndRemove, getUniqueUuid };
