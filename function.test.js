const functions = require('./function');

test("Adds two numbers together", () => {
    expect(functions.add(2, 2)).toBe(4);
})

test("Adds two numbers together NOT equal to 5", () => {
    expect(functions.add(2, 2)).not.toBe(5);
})


test("Should be null", () => {
    expect(functions.isNull).toBeNull();
})

test("Should be not be falsy", () => {
    expect(functions.checkValue(null)).toBeFalsy();
})


test("Should be truthy", () => {
    expect(functions.checkValue(3)).toBeTruthy();
})


test("Create user Bello Gbadebo", () => {
    expect(functions.createUser()).toEqual({
        "lastName": "Bello",
        "firstName": "Gbadebo"
    })
});