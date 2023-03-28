// This file contains the logger class which is used to log messages to a file
const fs = require('fs');
const logFile = 'server.log';

// write a log message to the log file
const writeLog = (action, fileName) => {
    const logDate = `${new Date().toISOString()} -$ {action} - ${fileName}\n`;
    fs.appendFile(logFile, logDate, (err) => {
        if (err) {
            console.log(`Error writing to log file: ${err}`);
        }
    });
};

// read the log file and return the contents as an array of strings
const readLog = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(logFile, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.split('\n').filter((line) => line.length > 0));
        });
    });
};

module.exports = {
    writeLog,
    readLog,
};