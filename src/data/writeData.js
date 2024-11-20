const fs = require('fs');

const writeFile = (path, data) => {
    try {
        const jsonData = JSON.stringify(data); 
        fs.writeFileSync(path, jsonData, 'utf-8');
    } catch (error) {
        console.error(`Error writing to file ${path}:`, error.message);
    }
};

module.exports = writeFile;
