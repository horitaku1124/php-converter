let CodeVal = require('./code_val.js');


let phpParser = {};
phpParser.run = function(tokens){
    let inPhpCode = false;
    let phpCodeArray = [];
    let line = 1, chars = 0;
    const appendCode = (token) => {
        phpCodeArray.push(new CodeVal(token, line, chars));
    };
    const appendFunction = (token) => {
        let code = new CodeVal(token, line, chars);
        code.type = "FunctionCall";
        phpCodeArray.push(code);
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
                } else if(nextWord.match(/\$[a-zA-Z0-9\_]/)) {
                    i++;
                    appendCode(nextWord);
                } else {
                    appendCode(token);
                }
            } else if(token == "var") {
                appendCode("private");
            } else if(token == "@") {
                // Nothing to do
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
                if(next2Word && next2Word.match(/^[a-zA-Z\_0-9]+$/)) {
                    appendCode(next2Word);
                    i += 1;
                }
            } else if(token == "?" && tokens[i + 1] == ">") {
                inPhpCode = false;
                appendCode(token + tokens[i + 1]);
                i += 1;
            } else if(token.match(/^function$/i)) {
                appendCode(token);
                if(nextWord.match(/^ +$/) && next2Word.match(/^[a-zA-Z\_0-9]+$/)) {
                    appendCode(nextWord);
                    appendCode(next2Word);
                    i += 2;
                }
            } else {
                if(nextWord == "(" && token.match(/^[a-zA-Z\_0-9]+$/)) {
                    if(token.match(/split/i)) {
                        appendFunction("preg_split");
                        appendFunction(nextWord);
                        let code = next2Word.replace(/\//g, "\\/");                      
                        code = code.charAt(0) + "/" + code.substring(1, code.length - 1) + "/" + code.substring(code.length - 1);
                        appendFunction(code);
                        i += 2;
                        console.log(" Split(" + line + " , " + chars + ")");
                    } else {
                        appendFunction(token);
                    }
                } else {
                    appendCode(token);
                    if(token.length > 4) {
                        // console.log(token[0], token[1], token[token.length - 1], token[token.length - 2]);
                        if(
                            (token[0] == "/" && token[1] == "*" && token[token.length - 1] == "/" && token[token.length - 2] == "*")
                            ||
                            (token[0] == "\"" && token[token.length - 1] == "\"")
                            ||
                            (token[0] == "'" && token[token.length - 1] == "'")
                            ) {
                            let count = 0;
                            for(let charIndex = 0;charIndex < token.length;charIndex++) {
                                if(token[charIndex] == "\n") {
                                    count++;
                                }
                            }
                            line += count;
                        }
                    }
                }
            }
        } else {
            if(token == "<" && nextWord == "?" && (next2Word == "php" || next2Word == "PHP")) {
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
