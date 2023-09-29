import { myJSONParse } from '../app/parser/json-parser.js';

test('Parse {}', () => {
    const obj = {};
    expect(myJSONParse('{}')).toStrictEqual(obj);
});

test('Parse {"a": 1}', () => {
    const obj = {
        a: 1
    };
    expect(myJSONParse('{"a": 1}')).toStrictEqual(obj);
});

test('Parse {"a": null}', () => {
    const obj = {
        a: null
    };
    expect(myJSONParse('{"a": null}')).toStrictEqual(obj);
});

test('Parse {"a": true}', () => {
    const obj = {
        a: true
    };
    expect(myJSONParse('{"a": true}')).toStrictEqual(obj);
});

test('Parse {"a": false}', () => {
    const obj = {
        a: false
    };
    expect(myJSONParse('{"a": false}')).toStrictEqual(obj);
});

test('Parse {"a": 1.0}', () => {
    const obj = {
        a: 1.0
    };
    expect(myJSONParse('{"a": 1.0}')).toStrictEqual(obj);
});

test('Parse {"a": "a"}', () => {
    const obj = {
        a: 'a'
    };
    expect(myJSONParse('{"a": "a"}')).toStrictEqual(obj);
});

test('Parse {"a": 1, "b": 2.0, "c": true, "d": false, "e": null, "f": "f"}', () => {
    const obj = {
        a: 1,
        b: 2.0,
        c: true,
        d: false,
        e: null,
        f: 'f'
    };
    expect(myJSONParse('{"a": 1, "b": 2.0, "c": true, "d": false, "e": null, "f": "f"}')).toStrictEqual(obj);
});

test('Parse {"a": 1, "b": { "c": 2.1}}', () => {
    const obj = {
        a: 1,
        b: {
            c: 2.1
        }
    };
    expect(myJSONParse('{"a": 1, "b": { "c": 2.1}}')).toStrictEqual(obj);
});

test('Parse {"a": 1, "b": [ "c", 2.1, 5, null, true, false]}', () => {
    const obj = {
        a: 1,
        b: [ "c", 2.1, 5, null, true, false]
    };
    expect(myJSONParse('{"a": 1, "b": [ "c", 2.1, 5, null, true, false]}')).toStrictEqual(obj);
});

test('Parse {"a": 1, "b": [ {"c": [1, 2]}, 2.1, 5, null, true, false]}', () => {
    const obj = {
        a: 1,
        b: [ {"c": [1, 2]}, 2.1, 5, null, true, false]
    };
    expect(myJSONParse('{"a": 1, "b": [ {"c": [1, 2]}, 2.1, 5, null, true, false]}')).toStrictEqual(obj);
});

test('Parse {"c": {"a": 1}', () => {
    expect(() => myJSONParse('{"c": {"a": 1}')).toThrow('Unexpected end of JSON input');
});

test('Parse {', () => {
    expect(() => myJSONParse('{')).toThrow('Unexpected end of JSON input');
});

test('Parse {}}', () => {
    expect(() => myJSONParse('{}}')).toThrow('Unexpected token } in JSON at position 2');
});

test('Parse {a": 1}', () => {
    expect(() => myJSONParse('{a": 1}')).toThrow('Unexpected token a in JSON at position 1');
});

test('Parse {"a": 1 "b": 2}', () => {
    expect(() => myJSONParse('{"a": 1 "b": 2}')).toThrow('Unexpected \"b\" in JSON at position 8');
});

test('Parse {"a": 1, : "b": 2}', () => {
    expect(() => myJSONParse('{"a": 1, : "b": 2}')).toThrow('Unexpected token : in JSON at position 9');
});

test('Parse {"a":: 1, "b": 2}', () => {
    expect(() => myJSONParse('{"a":: 1, "b": 2}')).toThrow('Unexpected token : in JSON at position 5');
});

test('Parse {"a": 1, "b": ,2}', () => {
    expect(() => myJSONParse('{"a": 1, "b": ,2}')).toThrow('Unexpected token , in JSON at position 14');
});

test('Parse :{"a": 1, "b": 2}', () => {
    expect(() => myJSONParse(':{"a": 1, "b": 2}')).toThrow('Unexpected token : in JSON at position 0');
});

test('Parse {:"a": 1, "b": 2}', () => {
    expect(() => myJSONParse('{:"a": 1, "b": 2}')).toThrow('Unexpected token : in JSON at position 1');
});

test('Parse {"a": 1:, "b": 2}', () => {
    expect(() => myJSONParse('{"a": 1:, "b": 2}')).toThrow('Unexpected token : in JSON at position 7');
});

test('Parse {"a": 1, "b": 2}:', () => {
    expect(() => myJSONParse('{"a": 1, "b": 2}:')).toThrow('Unexpected token : in JSON at position 16');
});

test('Parse {"a": [[1,2]]}', () => {
    const obj = {
        a: [[1,2]]
    }
    expect(myJSONParse('{"a": [[1,2]]}')).toStrictEqual(obj);
});

test('Parse {"a": [1,2]]}', () => {
    expect(() => myJSONParse('{"a": [1,2]]}')).toThrow('Unexpected token ] in JSON at position 11');
});

test('Parse {"a": [[[1,2]]}', () => {
    expect(() => myJSONParse('{"a": [[[1,2]]}')).toThrow('Unexpected token } in JSON at position 14');
});

test('Parse {"a": [1,2}', () => {
    expect(() => myJSONParse('{"a": [1,2}')).toThrow('Unexpected token } in JSON at position 10');
});

test('Parse {"a": 1,2]}', () => {
    expect(() => myJSONParse('{"a": 1,2]}')).toThrow('Unexpected token ] in JSON at position 9');
});

test('Parse ]', () => {
    expect(() => myJSONParse(']')).toThrow('Unexpected token ] in JSON at position 0');
});

test('Parse {"a": []}', () => {
    let obj = {
        a: []
    }
    expect(myJSONParse('{"a": []}')).toStrictEqual(obj);
});
