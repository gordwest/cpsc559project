// This file contains the logger class which is used to log messages to a file
const fs = require('fs');
const path = require('path');

// return the name of the log file for a given server id
const logFileName = (id) => `logs_${id}.txt`;

// write a log message to the log file
const writeLog = (id, method, fileName) => {
    const entry = `${new Date().toISOString()} - ${method} - ${fileName}\n`;
    fs.appendFile(path.join(__dirname, logFileName(id)), entry, (err) => {
        if (err) {
            console.log(`Error writing to log file:`, err);
        }
    });
};

// read the log file and return the contents as an array of strings
const readLog = (id) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, logFileName(id)), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.split('\n').filter((line) => line.length > 0));
            return 
        });
    });
};

module.exports = {
    writeLog,
    readLog,
};