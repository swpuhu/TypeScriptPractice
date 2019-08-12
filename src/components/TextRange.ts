import util from '../util';
import './TextRange.css';

const dom: any = util.dom;
export default class TextRange {
    constructor(name: string, min:number, max:number, step:number, defaultValue?:number, onchange?: Function) {
        this.min = min;
        this.max = max;
        this.step = step;
        this.name = name;
        this.value = defaultValue !== undefined ? defaultValue : min;
        this.defaultValue = defaultValue;
        this.ref = this.render();
        if (onchange) {
            this.onchange = onchange.bind(this);
        }
    }
    private min: number;
    private max: number;
    private step: number;
    private name: string;
    private defaultValue: number | undefined;
    public ref: HTMLElement;
    public onchange: Function | undefined;
    public value:number;

    render(): HTMLElement {
        let that = this;
        let doc:HTMLElement = dom.div({
            "class": "text-range"
        });
        let label:HTMLElement = dom.div({
            "class": "text-label",
        });
        label.textContent = this.name;

        let range:HTMLInputElement = dom.input({
            "min": this.min,
            "max": this.max,
            "step": this.step,
            "type": "range"
        });
        range.value = this.value.toString();
        let displayNumber:HTMLElement = dom.div({
            "class": "text-display"
        })
        displayNumber.textContent = range.value;

        range.oninput = function () {
            displayNumber.textContent = range.value;
            that.value = +range.value;
            that.onchange && that.onchange(range.value);
        }

        doc.appendChild(label);
        doc.appendChild(range);
        doc.appendChild(displayNumber);
        return doc;
    }


}