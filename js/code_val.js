class CodeVal {
    constructor(value, line, chars) {
        this.value = value;
        if(value == "\r" || value == "\n" || value == "\t") {
            this.type = "System";
        } else if(value.match(/^ +$/)) {
            this.type = "Space";
        } else if(value.match(/\$[a-zA-Z0-9\_]/)) {
            this.type = "Variable";
        } else {
            this.type = "Text";
        }
        this.line = line;
        this.chars = chars;
    }
    get to_s() {
        if(this.type == "System") {
            return this.type + ":" + this.value.replace(/\n/, "\\n").replace(/\r/, "\\r").replace(/\t/, "\\t") + "\n";
        }
        if(this.type == "Space") {
            return "Space:" + "(" + this.line + "," + this.chars + ") * " + this.value.length;
        }
        return this.type + "(" + this.line + "," + this.chars + ")" + ":" + this.value  + "\n";
    }
    valueOf() {
        return "A:" + this.value + "\n";
    }
}