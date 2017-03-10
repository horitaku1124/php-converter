let CodeVal = require('./code_val.js');


let phpParser = {};
phpParser.run = function(tokens){
    let inPhpCode = false;
    let phpCodeArray = [];
    let line = 1, chars = 0;
    const appendCode = (token) => {
        phpCodeArray.push(new CodeVal(token, line, chars));
    };
    for(let i = 0;i < tokens.length;i++) {
        let token = tokens[i], nextWord = tokens[i + 1], next2Word = tokens[i + 2];
        if(inPhpCode) {
            if(token == "&") {
                let lastToken = phpCodeArray[phpCodeArray.length - 1];
                let last2Token = phpCodeArray[phpCodeArray.length - 2];
                if(lastToken.type == "Space" &&
                    last2Token.value == "function") {
                    continue;
                } else if(nextWord == "&") {
                    i++;
                    appendCode("&&");
                } else {
                    appendCode(token);
                }
            } else if(token == "var") {
                appendCode("private");
            } else if(token == " ") {
                for(let j = i + 1;j < tokens.length;j++) {
                    let word2 = tokens[j];
                    if(word2 == " ") {
                        token += word2;
                        i += 1;
                    } else {
                        appendCode(token);
                        break;
                    }
                }
            } else if(token == "=" && nextWord == "&") {
                appendCode("=");
                i += 1;
            } else if(token == "-" && nextWord == ">") {
                appendCode("->");
                i += 1;
            } else if(token == "?" && tokens[i + 1] == ">") {
                inPhpCode = false;
                appendCode(token + tokens[i + 1]);
                i += 1;
            } else {
                appendCode(token);
            }
        } else {
            if(token == "<" && nextWord == "?" && next2Word == "php") {
                inPhpCode = true;
                appendCode("<?php");
                i += 2;
            } else if(token == "<" && nextWord == "?" && next2Word != "php") {
                inPhpCode = true;
                appendCode("<?php");
                i += 1;
            } else {
                appendCode(token);
            }
        }

        if(token == "\n") {
            line += 1;
            chars = 0;
        } else {
            chars += token.length;
        }
    }
    return phpCodeArray;
}
module.exports = phpParser;
