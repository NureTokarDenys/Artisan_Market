const fs = require('fs');

const readFile = (path) => {
    try {
        const jsonData = JSON.parse(fs.readFileSync(path, 'utf-8'));
        return jsonData;
    } catch (error) {
        console.error("Error reading JSON file:", error.message);
        return null;
    }
}

module.exports = readFile;