import Stack from "./stack.js";

export function myJSONParse(jsonString) {
    if (typeof jsonString !== 'string') {
        throw Error('Invalid input parameter');
    }
    const regex = /(\[)|(\])|(\{)|(\})|(\:)|(,)|(null)\b|(true)\b|(false)\b|(-?\d+(?:\.\d+)?)|(\"(?:\\\"|[^\"])*\")|([^\[\]{}:,\"\s]+)/g;
    let stack = new Stack();
    let elements = [];
    let currentObj = null;
    let key = null;
    let result = null;
    Array.from(jsonString.matchAll(regex)).forEach((element) => {
        let lastElement = elements[elements.length - 1];
        switch(element[0]) {
            case '{':
                if (lastElement !== undefined && appropriatePreviousElement(lastElement, element[0])) {
                    throw new SyntaxError(`Unexpected token { in JSON at position ${element.index}`);
                }
                if (lastElement !== undefined && lastElement[0] !== '[') {
                    elements.pop();
                }
                if (currentObj === null) {
                    currentObj = {};
                    break;
                } 
                const newObj = {};
                addField(currentObj, key, newObj);     
                key = null;
                stack.push(currentObj);
                currentObj = newObj;
                break;
            case '}':
                if (lastElement === undefined || appropriatePreviousElement(elements.pop(), element[0])) {
                    throw new SyntaxError(`Unexpected token } in JSON at position ${element.index}`);
                }
                let openBrackets = lastElement[0] === '{' || (elements.length !== 0 && elements.pop()[0] === '{');
                if (!openBrackets) {
                    throw new SyntaxError(`Unexpected token } in JSON at position ${element.index}`);
                }
                currentObj = stack.peek() !== undefined ? stack.pop() : currentObj;
                result = currentObj;
                break;
            case ':':
                if (key === null || convertJSONPrimitive(elements.pop()) !== key ) {
                    throw new SyntaxError(`Unexpected token : in JSON at position ${element.index}`);
                }
                break;
            case ',': 
                lastElement = elements.pop();
                if (lastElement === undefined || appropriatePreviousElement(lastElement, element[0])) {
                    throw new SyntaxError(`Unexpected token , in JSON at position ${element.index}`);
                } 
                break;
            case '[':
                if (lastElement === undefined || appropriatePreviousElement(lastElement, element[0])) {
                    throw new SyntaxError(`Unexpected token ${element[0]} in JSON at position ${element.index}`);
                }
                if (lastElement[0] !== '[') {
                    elements.pop();
                }
                const newArray = [];
                addField(currentObj, key, newArray);
                key = null;
                stack.push(currentObj);
                currentObj = newArray;
                break;
            case ']':
                if (lastElement === undefined || appropriatePreviousElement(elements.pop(), element[0])) {
                    throw new SyntaxError(`Unexpected token ${element[0]} in JSON at position ${element.index}`);
                }
                openBrackets = lastElement[0] === '[' ||  elements.pop()[0] === '[';
                if (!openBrackets) {
                    throw new SyntaxError(`Unexpected token ] in JSON at position ${element.index}`);
                }
                currentObj = stack.peek() !== undefined ? stack.pop() : currentObj;
                break;
            default:
                if (element[12] !== undefined) {
                    throw new SyntaxError(`Unexpected token ${element[12]} in JSON at position ${element.index}`);
                }
                if (Array.isArray(currentObj)) {
                    if (currentObj.length !== 0 && elements.pop()[0] !== ',') {
                        throw new SyntaxError(`Unexpected ${element[0]} in JSON at position ${element.index}`)
                    }
                    let value = convertJSONPrimitive(element);
                    currentObj.push(value);
                } else if (key === null) {
                    if (Object.getOwnPropertyNames(currentObj).length !== 0  && elements.pop()[0] !== ',') {
                        throw new SyntaxError(`Unexpected ${element[0]} in JSON at position ${element.index}`)
                    }
                    key = element[0].slice(1, element[0].length - 1);
                } else {
                    if (elements.pop()[0] !== ':') {
                        throw new SyntaxError(`Unexpected ${element[0]} in JSON at position ${element.index}`)
                    }
                    let value = convertJSONPrimitive(element);
                    currentObj[key] = value;
                    key = null;
                }
        }
        elements.push(element);
    });
    checkInputEnd(elements);
    return result;
}

function convertJSONPrimitive(element) {
    if (element[0] === 'true') {
        return true;
    } else if (element[0] === 'false') {
        return false;
    } else if (element[0] === 'null') {
        return null;
    } else if (!Number.isNaN(parseInt(element[0]))) {
        return parseFloat(element[0]);
    } else {
        return element[0].slice(1, element[0].length - 1);
    }
}

function addField(obj, key, value) {
    if (Array.isArray(obj)) {
        obj.push(value);
    } else {
        obj[key] = value;
    } 
}

function appropriatePreviousElement(previous, current) {
    switch (current) {
        case '{':
            return previous !== undefined 
            && previous[0] !== ':' 
            && previous[0] !== ','
            && previous[0] !== '[';
        case '}':
            return previous[2] === undefined 
                && previous[3] === undefined 
                && previous[4] === undefined
                && previous[7] === undefined
                && previous[8] === undefined
                && previous[9] === undefined
                && previous[10] === undefined
                && previous[11] === undefined;
        case ',': 
            return previous[2] === undefined 
                && previous[4] === undefined
                && previous[7] === undefined
                && previous[8] === undefined
                && previous[9] === undefined
                && previous[10] === undefined
                && previous[11] === undefined;
        case '[':
            return previous[0] !== ':' 
                && previous[0] !== '['
                && previous[0] !== ',';
        case ']':
            return previous[0] !== '[' 
                && previous[0] !== ']' 
                && previous[0] !== '}'
                && previous[7] === undefined
                && previous[8] === undefined
                && previous[9] === undefined
                && previous[10] === undefined
                && previous[11] === undefined;
        default:
            throw new Error(`Not such element: ${current}`);
    }
}

function checkInputEnd(elements) {
    if (elements.length !== 1 || elements.pop()[0] !== '}') {
        throw new SyntaxError('Unexpected end of JSON input');
    }
}

