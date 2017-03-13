let la = require('./js/lexicalAnalyzer.js'),
    pp = require('./js/phpParser.js'),
    fs = require('fs');


let readFilePath = process.argv[2];

let contents = fs.readFileSync(readFilePath).toString();

let filePaths = readFilePath.split("/");
let fileName = filePaths.pop();

let tokens = la.run(contents);
let codes = pp.run(tokens);

let distCode = "";
for (let i = 0;i < codes.length;i++) {
    distCode += codes[i].value;
}

let dir = "dist/";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}
for(let i = 0;i < filePaths.length;i++) {
    let path = filePaths[i];
    if(!path)continue;
    if(path.match(/^[A-Z]:$/))continue;
    dir += filePaths[i] + "/";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

fs.writeFileSync(dir + fileName, distCode);
console.log(dir + fileName);