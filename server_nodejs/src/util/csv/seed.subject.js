const fs = require("fs");
const csv_parser = require('csv-parse');
const path = require("path");

const filePath = path.join(__dirname, "../../../public/seed_data/subject.csv");

module.exports.csv_parser = {
    parser: () => {
        let result = [];
        fs.createReadStream(filePath, { encoding: 'utf-8' })
            .pipe(csv_parser.parse({ delimiter: ',' }))
            .on('data', (data) => { data ? result.push(data) : '' })
            .on('end', () => { console.log(result); });
    }
}

