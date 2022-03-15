let buttons = document.querySelectorAll(".button-grid button");
let screen = document.querySelector(".screen");
let currentNumber = "0";
let secondaryNumber = "0";
let special = false;
let METHOD = "";
let editingSecondary = false;
let decimalPlaces = /^\d+(\.\d{1,2})?$/;

buttons.forEach((btn) => {
  if (btn.value == "") return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (special) {
      editingSecondary = true;
      secondaryNumber = `${secondaryNumber}${e.target.value}`;
      screen.textContent = checkDecimalPlaces(Number(secondaryNumber));
    } else {
      currentNumber = `${currentNumber}${e.target.value}`;
      screen.textContent = checkDecimalPlaces(Number(currentNumber));
    }
  });
});

function add() {
  if (METHOD !== "") {
    Switch();
    secondaryNumber = "";
  }
  METHOD = "ADD";
  special = true;
}

function subtract() {
  if (METHOD !== "") {
    Switch();
    secondaryNumber = "";
  }
  METHOD = "SUBTRACT";
  special = true;
}

function divide() {
  if (METHOD !== "") {
    Switch();
    secondaryNumber = "";
  }
  METHOD = "DIVIDE";
  special = true;
}

function multiply() {
  if (METHOD !== "") {
    Switch();
    secondaryNumber = "";
  }
  METHOD = "MULTIPLY";
  special = true;
}

function reset() {
  special = false;
  METHOD = "";
  currentNumber = "0";
  secondaryNumber = "0";
  editingSecondary = false;
  screen.textContent = checkDecimalPlaces(Number(currentNumber));
}

function del() {
  if (editingSecondary) {
    if (secondaryNumber.toString().length === 2 && secondaryNumber.toString().startsWith("-")) {
      secondaryNumber = 0;
      screen.textContent = 0;
      return;
    }
    if (secondaryNumber.toString().startsWith("-")) {
      secondaryNumber = `-${checkDecimalPlaces(secondaryNumber.toString().slice(1)).toString().slice(0, -1)}`;
      screen.textContent = Number(secondaryNumber);
    } else {
      secondaryNumber = checkDecimalPlaces(secondaryNumber).toString().slice(0, -1);
      screen.textContent = Number(secondaryNumber);
    }
  } else {
    if (currentNumber.toString().length === 2 && currentNumber.toString().startsWith("-")) {
      currentNumber = 0;
      screen.textContent = 0;
      return;
    }
    if (currentNumber.toString().startsWith("-")) {
      currentNumber = `-${checkDecimalPlaces(currentNumber.toString().slice(1)).toString().slice(0, -1)}`;
      screen.textContent = Number(currentNumber);
    } else {
      currentNumber = checkDecimalPlaces(currentNumber).toString().slice(0, -1);
      screen.textContent = Number(currentNumber);
    }
  }
}

function equals() {
  Switch();
  special = false;
  METHOD = "";
  special = false;
  METHOD = "";
  secondaryNumber = "0";
  editingSecondary = false;
}

function Switch() {
  switch (METHOD) {
    case "ADD":
      currentNumber = Number(currentNumber) + Number(secondaryNumber);
      break;
    case "SUBTRACT":
      currentNumber = Number(currentNumber) - Number(secondaryNumber);
      break;
    case "MULTIPLY":
      currentNumber = Number(currentNumber) * Number(secondaryNumber);
      break;
    case "DIVIDE":
      console.log(currentNumber);
      currentNumber = Number(currentNumber) / Number(secondaryNumber);
      break;
  }
  screen.textContent = checkDecimalPlaces(Number(currentNumber));
}

function decimal() {
  if (editingSecondary) {
    if (secondaryNumber.toString().includes(".")) return;
    secondaryNumber = `${Number(secondaryNumber)}.`;
    screen.textContent = secondaryNumber;
  } else {
    if (currentNumber.toString().includes(".")) return;
    currentNumber = `${Number(currentNumber)}.`;
    screen.textContent = currentNumber;
  }
}

function checkDecimalPlaces(number) {
  if (!number.toString().includes(".")) return number;
  let indexOfDot = number.toString().indexOf(".") + 1;
  let decimals = number.toString().substring(number.toString().indexOf(".") + 1).length;
  if (decimals > 6) {
    if (editingSecondary) {
      secondaryNumber = Number(number.toString().substring(0, indexOfDot + 6));
    } else {
      currentNumber = Number(number.toString().substring(0, indexOfDot + 6));
    }
    return Number(number.toString().substring(0, indexOfDot + 6));
  } else {
    if (editingSecondary) {
      secondaryNumber = Number(number.toString().substring(0, indexOfDot + decimals));
    } else {
      currentNumber = Number(number.toString().substring(0, indexOfDot + decimals));
    }
    return Number(number.toString().substring(0, indexOfDot + decimals));
  }
}

// Theme Switch
const elements = {
  switchWrapper: document.querySelector("[data-switch-wrapper]"),
  inputs: Array.from(document.querySelectorAll("[data-switch-input]")),
  pill: document.querySelector("[data-switch-pill]"),
};

const updatePillPosition = ({ target }, animate = true) => {
  const inputIndex = elements.inputs.findIndex((input) => input === target);
  const inputState = target.getAttribute("data-state");

  changeTheme(inputIndex);

  elements.switchWrapper.dataset.animate = animate;
  let right = 0;
  if (inputIndex === 1) right = target.parentElement.offsetWidth / 2 - elements.pill.offsetWidth / 2;
  if (inputIndex === 2) right = target.parentElement.offsetWidth - elements.pill.offsetWidth;
  elements.pill.style.transform = `translate(${right}px, -50%)`;
  elements.switchWrapper.dataset.state = inputState || "default";
};

elements.inputs.forEach((input) => input.addEventListener("input", updatePillPosition));

// Check Prefers Color Scheme
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
  const colorScheme = e.matches ? "dark" : "light";
  console.log(colorScheme);

  if (colorScheme === "dark") {
    document.body.setAttribute("data-theme", 1);
  } else {
    document.body.setAttribute("data-theme", 2);
  }
});

window.addEventListener("load", () => {
  // Check LocalStorage for Theme Preference
  if (localStorage.getItem("CALC-data-theme") !== null) {
    document.body.setAttribute("data-theme", localStorage.getItem("CALC-data-theme"));
    const defaultActiveInput = elements.inputs[localStorage.getItem("CALC-data-theme") - 1];
    defaultActiveInput.setAttribute("checked", true);
    if (defaultActiveInput) {
      updatePillPosition({ target: defaultActiveInput }, false);
    }
  } else {
    const defaultActiveInput = elements.inputs.find((input) => input.checked);
    if (defaultActiveInput) {
      updatePillPosition({ target: defaultActiveInput }, false);
    }
  }
});

function changeTheme(index) {
  const theme = index + 1;
  localStorage.setItem("CALC-data-theme", theme);
  document.body.setAttribute("data-theme", theme);
}
