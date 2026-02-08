// Get the display element
const display = document.getElementById('display');

// Calculator state
let expression = '';

// Function to update the display
function updateDisplay() {
    display.textContent = expression || '0';
}

// Function to append number to expression
function appendNumber(number) {
    expression += number;
    updateDisplay();
}

// Function to append decimal point
function appendDecimal() {
    // Check if the current number part already has a decimal
    const parts = expression.split(/[\+\-\*\/]/);
    const currentPart = parts[parts.length - 1];
    if (!currentPart.includes('.')) {
        expression += '.';
    }
    updateDisplay();
}

// Function to set operator
function setOperator(op) {
    // Only add operator if the last character is a number
    if (expression && !isNaN(expression.slice(-1))) {
        expression += op;
    }
    updateDisplay();
}

// Function to evaluate expression with order of operations
function evaluateExpression(expr) {
    // Split into tokens: numbers and operators
    const tokens = expr.split(/([\+\-\*\/])/).filter(t => t.trim() !== '');

    // First, handle multiplication and division
    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === '*' || tokens[i] === '/') {
            const left = parseFloat(tokens[i - 1]);
            const right = parseFloat(tokens[i + 1]);
            let res;
            if (tokens[i] === '*') {
                res = left * right;
            } else {
                if (right === 0) throw new Error('Division by zero');
                res = left / right;
            }
            // Replace the three tokens with the result
            tokens.splice(i - 1, 3, res.toString());
            i -= 2; // Adjust index
        }
    }

    // Then, handle addition and subtraction
    let result = parseFloat(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        const num = parseFloat(tokens[i + 1]);
        if (op === '+') {
            result += num;
        } else if (op === '-') {
            result -= num;
        }
    }

    return result;
}

// Function to calculate the result
function calculate() {
    try {
        const result = evaluateExpression(expression);
        expression = result.toString();
        updateDisplay();
    } catch (e) {
        expression = 'Error';
        updateDisplay();
    }
}

// Function to clear the calculator
function clearCalculator() {
    expression = '';
    updateDisplay();
}

// Event listeners for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.id;
        if (button.classList.contains('number')) {
            appendNumber(id);
        } else if (id === 'decimal') {
            appendDecimal();
        } else if (button.classList.contains('operator')) {
            const op = id === 'add' ? '+' : id === 'subtract' ? '-' : id === 'multiply' ? '*' : '/';
            setOperator(op);
        } else if (id === 'equals') {
            calculate();
        } else if (id === 'clear') {
            clearCalculator();
        }
    });
});

// Keyboard input handling
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        setOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearCalculator();
    }
});

// Initialize display
updateDisplay();
