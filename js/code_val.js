class CodeVal {
    constructor(value) {
        this.value = value;
        if(value == "\r" || value == "\n" || value == "\t") {
            this.type = "System";
        } else if(value == " ") {
            this.type = "Space";
        } else {
            this.type = "Text";
        }
    }
    toString() {
        if(this.type == "System") {
            return this.type + ":" + this.value.replace(/\n/, "\\n").replace(/\r/, "\\r").replace(/\t/, "\\t") + "\n";
        }
        if(this.type == "Space") {
            return "Space:";
        }
        return this.type + ":" + this.value + "\n";
    }
    valueOf() {
        return "A:" + this.value + "\n";
    }
}