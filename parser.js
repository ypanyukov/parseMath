/**
 * Created by ypanyukov on 08.09.14.
 * A simpler solution it's:
 * 1. prepare string - remove special symbols etc.
 * 2. remove brackets (solving into first)
 * 3. calculate without minus. Use minus as piece of numbers
 */

if (typeof String.prototype.parseMath == 'undefined') {
    String.prototype.parseMath = function (fractionDigits) {
        var string = this,
            regExpNumber = /\-?[0-9]+(\.[0-9])?/g,
            regExpOperation = /\+|\/|\*|\%/g,
            regExpBracket = /\((.+)\)/,
            regExpNotUsedSymbols = /[a_Z]|\s|\_/g,
            result;

        fractionDigits = parseInt(fractionDigits)

        /**
        Preparing string
        */
        string = string.replace(regExpNotUsedSymbols, "");
        string = string.replace(/\-\-|\+\+/g, "+");
        string = string.replace(/\+\-|\-\+/g, "-");
        string = string.replace(/\-/g, "+-");
        /**
         Preparing string
         */

        var operation = function (number1, number2, operation, replaceIn) {
            var returnValue;

            if (arguments.length > 3) {
                switch (operation) {
                    case "*":
                        returnValue = number1 * number2;
                        break;
                    case "/":
                        returnValue = number1 / number2;
                        if (number2 == 0)
                            throw "Can not to divide by zero";
                        break;
                    case "%":
                        returnValue = number1 % number2;
                        break;
                    case "-":
                        returnValue = number1 - number2;
                        break;
                    default:
                        returnValue = number1 + number2;
                }
            }

            if (replaceIn)
                returnValue = replaceIn.replace(number1.toString().concat(operation, number2), returnValue);

            return returnValue;
        };

        var calculate = function (string) {
            /**
            * Function calculating string and turn to float
            */

            var operations = string.match(regExpOperation),
                numbers = string.match(regExpNumber).map(function (item) {
                    return parseFloat(item)
                }),
                index = -1;

            if (operations) {
                if (operations.indexOf("*") != -1) {
                    index = operations.indexOf("*");
                    string = operation(numbers[index], numbers[index + 1], "*", string);
                }
                else if (operations.indexOf("/") != -1) {
                    index = operations.indexOf("/");
                    string = operation(numbers[index], numbers[index + 1], "/", string);
                }
                else if (operations.indexOf("%") != -1) {
                    index = operations.indexOf("%");
                    string = operation(numbers[index], numbers[index + 1], "%", string);
                }
                else if (operations.indexOf("+") != -1) {
                    index = operations.indexOf("+");
                    string = operation(numbers[index], numbers[index + 1], "+", string);
                }

                if (string != parseFloat(string))
                    return calculate(string);
            }
            return string;
        };

        var removeBracket = function (string) {
            /**
            * Function turn string to string without bracket
            */
            if (regExpBracket.test(string)) {
                var expressions = string.match(regExpBracket),
                    newExpression = removeBracket(expressions[1]);

                string = string.replace(expressions[0], newExpression);
            }

            string = calculate(string);

            return parseFloat(string);
        };

        result = removeBracket(string);

        if (fractionDigits)
            result = result.toFixed(fractionDigits);

        return result;
    };
}

console.log("3+-2-+3++5--6".parseMath());
console.log("(6-5+10*8)/3".parseMath());
console.log("5%2/3".parseMath(5));