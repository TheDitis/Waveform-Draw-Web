export default class LogScale {
    min: number;
    max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    get range(): number {
        return this.max - this.min;
    }

    linToLog(linVal: number): number {
        let value =  Math.round(Math.pow(this.range + 1, linVal) + this.min - 1);
        if (value < this.min) {
            value = this.min;
        } else if (value > this.max) {
            value = this.max;
        }
        return value;
    }

    logToLin(logVal: number): number {
        const normalizedValue = logVal - this.min + 1;
        return Math.log(normalizedValue) / Math.log(this.range + 1);
    }
}