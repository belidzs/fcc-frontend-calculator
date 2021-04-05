import { Component } from 'react';
import './Calculator.css'

export default class Calculator extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            nextNumberAsText: "0",
            nextOperation: "",
            operations: []
        }

        this.clickNumber = this.clickNumber.bind(this);
        this.clickOperation = this.clickOperation.bind(this);
        this.clickEquals = this.clickEquals.bind(this);
        this.clickClear = this.clickClear.bind(this);
    }

    clickNumber(number) {
        this.setState((state) => {
            if (number === "." && state.nextNumberAsText.indexOf(".") > -1) {
                return state;
            }

            let current = state.nextNumberAsText;
            if (state.nextNumberAsText === "0") {
                current = "";
            }

            return Object.assign({}, state, { nextNumberAsText: current + number })
        });
    }

    finalizeBuffer(state) {
        // ha a pufferben 0 van, akkor csak meggondoltuk magunkat a műveletet illetően, úgyhogy visszalépés (ha - módban voltunk, visszaállás 0-ra)
        if (state.nextNumberAsText === "0" || state.nextNumberAsText === "-") {
            return Object.assign({}, state, { nextNumberAsText: "0" });
        }
        const operationItem = {
            operation: state.nextOperation,
            number: Number(state.nextNumberAsText)
        };

        // egyébként az új művelet rögzítése és állapot nullázása
        return Object.assign({}, state, { operations: [...state.operations, operationItem], nextNumberAsText: "0", nextOperation: "" });
    }

    clickOperation(operation) {
        this.setState((state) => {
            if (state.nextNumberAsText === "0" && operation === "subtract") {
                // ha nincs a pufferben semmi, és a minusz gombot nyomták, akkor negatív előjelű számot akar a user
                return Object.assign({}, state, { nextNumberAsText: "-" });
            }
            
            // egyébként pufferben lévő változások végrehajtása
            const finalizedState = this.finalizeBuffer(state)
            return Object.assign({}, finalizedState, { nextOperation: operation });
        });
    }

    clickEquals() {
        this.setState((state) => {
            // pufferben lévő változások végrehajtása
            const finalizedState = this.finalizeBuffer(state);
            // végeredmény kiszámítása
            const result = finalizedState.operations.reduce((acc, current) => {
                switch(current.operation) {
                    case "add": return acc + current.number;
                    case "subtract": return acc - current.number;
                    case "multiply": return acc * current.number;
                    case "divide": return acc / current.number;
                    default: return acc + current.number;
                }
            }, 0);
            return Object.assign({}, finalizedState, { nextNumberAsText: result.toString(), operations: [] });
        });
    }

    clickClear() {
        this.setState({
            nextNumberAsText: "0",
            nextOperation: "",
            operations: []
        });
    }

    render() {
        return (
            <div id="calculator" className="container">
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="display">Display</label>
                            <div className="input-group">
                                <input type="text" id="display" className="form-control" readOnly={true} value={this.state.nextNumberAsText} />
                                <div className="input-group-append">
                                    <button id="clear" className="btn btn-danger" onClick={() => this.clickClear()}>C</button>
                                    <button id="equals" className="btn btn-primary" onClick={() => this.clickEquals()}>=</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col"><button id="seven" className="btn btn-primary btn-block" onClick={() => this.clickNumber("7")}>7</button></div>
                    <div className="col"><button id="eight" className="btn btn-primary btn-block" onClick={() => this.clickNumber("8")}>8</button></div>
                    <div className="col"><button id="nine" className="btn btn-primary btn-block" onClick={() => this.clickNumber("9")}>9</button></div>
                    <div className="col"><button id="divide" className="btn btn-primary btn-block" onClick={() => this.clickOperation("divide")}>/</button></div>
                </div>
                <div className="row mb-2">
                    <div className="col"><button id="four" className="btn btn-primary btn-block" onClick={() => this.clickNumber("4")}>4</button></div>
                    <div className="col"><button id="five" className="btn btn-primary btn-block" onClick={() => this.clickNumber("5")}>5</button></div>
                    <div className="col"><button id="six" className="btn btn-primary btn-block" onClick={() => this.clickNumber("6")}>6</button></div>
                    <div className="col"><button id="multiply" className="btn btn-primary btn-block" onClick={() => this.clickOperation("multiply")}>*</button></div>
                </div>
                <div className="row mb-2">
                    <div className="col"><button id="one" className="btn btn-primary btn-block" onClick={() => this.clickNumber("1")}>1</button></div>
                    <div className="col"><button id="two" className="btn btn-primary btn-block" onClick={() => this.clickNumber("2")}>2</button></div>
                    <div className="col"><button id="three" className="btn btn-primary btn-block" onClick={() => this.clickNumber("3")}>3</button></div>
                    <div className="col"><button id="subtract" className="btn btn-primary btn-block" onClick={() => this.clickOperation("subtract")}>-</button></div>
                </div>
                <div className="row mb-2">
                    <div className="col-6"><button id="zero" className="btn btn-primary btn-block" onClick={() => this.clickNumber("0")}>0</button></div>
                    <div className="col"><button id="decimal" className="btn btn-primary btn-block" onClick={() => this.clickNumber(".")}>.</button></div>
                    <div className="col"><button id="add" className="btn btn-primary btn-block" onClick={() => this.clickOperation("add")}>+</button></div>
                </div>
            </div>
            );
    }
}