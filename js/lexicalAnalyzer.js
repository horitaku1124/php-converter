let lexicalAnalyzer = {};

lexicalAnalyzer.run = function(source){
    const spaces = " \t", cr_lf = "\r\n";
    const singleOperator = "()+-.*/=;,><?&!|[]@";
    const allClears = singleOperator + spaces + cr_lf;
    let quote = null, verse = "", tokens = [], inLineComment = false, inMultiLineComment = false;
    for(let i = 0;i < source.length;i++) {
        const char = source[i];

        if(inLineComment) {
            if(char == "\n") {
                inLineComment = false;
                tokens.push(verse);
                tokens.push("\n");
                verse = "";
            } else {
                verse += char;
            }
            continue;
        } else if(inMultiLineComment) {
            verse += char;
            if(char == "*" && source[i + 1] == "/") {
                verse += "/";
                inMultiLineComment = false;
                if(verse.length > 0) {
                    tokens.push(verse);
                }
                verse = "";
                i++;
            }
            continue;
        } else if(quote != null) {
            if(char == quote) {
                verse += quote;
                if(verse.length > 0) {
                    tokens.push(verse);
                }
                quote = null;
                verse = "";
            } else if(char == "\\") {
                let escapeTarget = source[i + 1];
                verse += char;
                if(escapeTarget == quote) {
                    verse += quote;
                    i++;
                } else if("nt\\".includes(escapeTarget)) {
                    verse += escapeTarget;
                    i++;
                }
            } else {
                verse += char;
            }
            continue;
        }
        if(char === '\'' || char === '"' || char === '`') {
            if(verse.length > 0) {
                tokens.push(verse);
            }
            verse = char;
            quote = char;
        } else if(char == '/') {
            let nextChar = source[++i];
            if(nextChar == '/'){
                inLineComment = true;
            } else if(nextChar == '*'){
                inMultiLineComment = true;
            } else {
                // Divide operator
                if(verse.length > 0) {
                    tokens.push(verse);
                }
                tokens.push(char);
                verse = "";
                i--;
            }

            if(verse.length > 0) {
                tokens.push(verse);
            }
            if(inLineComment || inMultiLineComment) {
                verse = char + nextChar;                    
            }
        } else if(allClears.includes(char)) {
            if(verse.length > 0) {
                tokens.push(verse);
            }
            if(cr_lf.includes(char) || singleOperator.includes(char)) {
                // tokens.push(new CodeVal(char));
            }
            tokens.push(char);
            verse = "";
        } else {
            verse += char;
        }
    }
    if(verse.length > 0) {
        tokens.push(verse);
    }
    return tokens;
};
module.exports = lexicalAnalyzer;
