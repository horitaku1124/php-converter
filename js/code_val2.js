class CodeVal {
    constructor(value, line, chars) {
        this.value = value;
        if(value == "\r" || value == "\n" || value == "\t") {
            this._type = "System";
        } else if(value.match(/^ +$/)) {
            this._type = "Space";
        } else if(value.match(/\$[a-zA-Z0-9\_]/)) {
            this._type = "Variable";
        } else {
            this._type = "Text";
        }
        this.line = line;
        this.chars = chars;
    }
    get to_s() {
        if(this._type == "System") {
            return this._type + ":" + this.value.replace(/\n/, "\\n").replace(/\r/, "\\r").replace(/\t/, "\\t") + "\n";
        }
        if(this._type == "Space") {
            return "Space:" + "(" + this.line + "," + this.chars + ") * " + this.value.length;
        }
        return this._type + "(" + this.line + "," + this.chars + ")" + ":" + this.value  + "\n";
    }
    set type(val) {
        this._type = val;
    }
    get type() {
        return this._type;
    }
    valueOf() {
        return "A:" + this.value + "\n";
    }
};
