"use strict";

const result = document.getElementById("result");
const step = document.getElementById("step");
const btns = document.querySelectorAll(".app--numbers p");
const clear = document.getElementById("clear");
const equals = document.getElementById("equals");
const sign = document.getElementById("sign");
const plus = document.getElementById("plus");
const signs = ["+", "-", "÷", "×"];
const percentage = document.getElementById("percentage");
const calcBtns = document.querySelectorAll(".highlight--col>p");
const deleteOne = document.getElementById("deleteOne");
// FUNCTIONS

const replaceSigns = (resultChanged) => {
  if (result.innerHTML.includes("×"))
    resultChanged = result.innerHTML.replace("×", "*");
  if (result.innerHTML.includes("÷"))
    resultChanged = result.innerHTML.replace("÷", "/");

  return resultChanged;
};

function hasSign(signs) {
  let hasSign = false;
  signs.forEach((sign) => {
    if (result.innerHTML.startsWith("-")) {
      if (result.innerHTML.slice(1).includes(sign)) {
        hasSign = true;
      }
    } else {
      if (result.innerHTML.includes(sign)) {
        hasSign = true;
      }
    }
  });
  return hasSign;
}

const duplicateSigns = (signs) => {
  let bool = false;
  signs.forEach((sign) => {
    if (result.innerHTML.startsWith("-")) {
      if (result.innerHTML.slice(1).includes(sign)) {
        bool = true;
      }
    } else if (result.innerHTML.includes(sign)) {
      bool = true;
    }
  });

  return bool;
};

function formatNumber(number) {
  if (
    (number > 999 && !number.toString().startsWith("-")) ||
    (number < -999 && number.toString().startsWith("-"))
  ) {
    return number.toLocaleString();
  } else {
    return number.toString();
  }
}

function unformatNumber(formattedNumber) {
  return formattedNumber.replace(/,/g, "");
}

function hasNumber(str) {
  const pattern = /[0-9]/; // regular expression to match any digit from 1 to 9
  return pattern.test(str);
}

const calculate = () => {
  let resultChanged = result.innerHTML;

  signs.forEach((sign) => {
    if (result.innerHTML.startsWith("-")) {
      if (
        result.innerHTML.slice(1).split(sign).length === 2 &&
        hasNumber(result.innerHTML.slice(1).split(sign)[0]) &&
        hasNumber(result.innerHTML.slice(1).split(sign)[1])
      ) {
        step.innerHTML = resultChanged;
        resultChanged = replaceSigns(resultChanged);
        result.innerHTML = formatNumber(eval(unformatNumber(resultChanged)));
        const html = `<div class="history__container--content__item">
        ${resultChanged}<br />
        =${result.innerHTML}
      </div>`;
        document
          .querySelector(".history__container--content")
          .insertAdjacentHTML("afterbegin", html);
      }
    } else {
      if (
        result.innerHTML.split(sign).length === 2 &&
        hasNumber(result.innerHTML.split(sign)[0]) &&
        hasNumber(result.innerHTML.split(sign)[1])
      ) {
        step.innerHTML = resultChanged;
        resultChanged = replaceSigns(resultChanged);
        result.innerHTML = formatNumber(eval(unformatNumber(resultChanged)));
        const html = `<div class="history__container--content__item">
        ${resultChanged}<br />
        =${result.innerHTML}
      </div>`;
        document
          .querySelector(".history__container--content")
          .insertAdjacentHTML("afterbegin", html);
      }
    }
  });
};

const restrictBtns = (btns, id) => {
  let bool = false;
  btns.forEach((btn) => {
    if (id === btn) {
      bool = true;
      return bool;
    }
  });
  return bool;
};

// GLOBAL

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (
      restrictBtns(
        [
          "equals",
          "sign",
          "plus",
          "minus",
          "divide",
          "multiply",
          "percentage",
          "deleteOne",
          "dot",
          "clear",
        ],
        btn.id
      )
    )
      return;
    if (result.innerHTML.startsWith("0")) {
      if (result.innerHTML.includes(".") || hasSign(signs)) {
        result.innerHTML = result.innerHTML + btn.innerHTML;
      } else {
        result.innerHTML = result.innerHTML.replace("0", btn.innerHTML);
      }
      return;
    }
    if (
      result.innerHTML === "" ||
      hasSign(signs) ||
      result.innerHTML.includes(".")
    )
      result.innerHTML = result.innerHTML + btn.innerHTML;
    else {
      result.innerHTML = result.innerHTML + btn.innerHTML;
      result.innerHTML = formatNumber(+unformatNumber(result.innerHTML));
    }
  });
});

dot.addEventListener("click", () => {
  if (result.innerHTML === "") return;
  if (duplicateSigns(["."])) return;
  if (hasSign(signs)) return;
  result.innerHTML = result.innerHTML + dot.innerHTML;
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

let prev;

calcBtns.forEach((calc) => {
  calc.addEventListener("click", (e) => {
    if (restrictBtns(["equals"], calc.id)) return; // PASS

    signs.forEach((sign) => {
      if (result.innerHTML.startsWith("-")) {
        if (
          result.innerHTML.slice(1).split(sign).length === 2 &&
          hasNumber(result.innerHTML.slice(1).split(sign)[0]) &&
          !hasNumber(result.innerHTML.slice(1).split(sign)[1])
        ) {
          result.innerHTML =
            result.innerHTML.slice(0, 1) +
            result.innerHTML.slice(1).replace(prev, e.target.innerHTML);
          prev = e.target.innerHTML;
        }
      } else {
        if (
          prev != e.target.innerHTML &&
          result.innerHTML.slice(1).includes(sign)
        ) {
          if (
            result.innerHTML.split(sign).length === 2 &&
            hasNumber(result.innerHTML.split(sign)[0]) &&
            !hasNumber(result.innerHTML.split(sign)[1])
          ) {
            result.innerHTML =
              result.innerHTML.slice(0, 1) +
              result.innerHTML.slice(1).replace(prev, e.target.innerHTML);
            prev = e.target.innerHTML;
          }
        }
      }
    });
    calculate(result.innerHTML); // PASS

    if (duplicateSigns(signs) || result.innerHTML === "") return; //

    result.innerHTML = result.innerHTML + calc.innerHTML;
    prev = result.innerHTML.slice(-1);
  });
});
// //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

// SIGN

sign.addEventListener("click", () => {
  if (result.innerHTML === "") return;

  if (result.innerHTML === "0") return;

  if (!result.innerHTML.slice(0, 1).includes("-") && !hasSign(signs)) {
    result.innerHTML = "-" + result.innerHTML;
    return;
  }

  if (result.innerHTML.slice(0, 1).includes("-") && !hasSign(signs))
    result.innerHTML = result.innerHTML.replace("-", "");
});

// percentage

percentage.addEventListener("click", () => {
  if (result.innerHTML === "") return;

  if (result.innerHTML.startsWith("-")) {
    result.innerHTML = "-" + +result.innerHTML.slice(1) * 0.01;
    return;
  }

  if (!hasSign(signs)) {
    result.innerHTML = formatNumber(+unformatNumber(result.innerHTML) / 100);
  }
});

// deleteOne
deleteOne.addEventListener("click", function (e) {
  e.preventDefault();
  if (result.innerHTML === "") return;
  result.innerHTML = result.innerHTML.slice(0, result.innerHTML.length - 1);
});

// EQUALS

equals.addEventListener("click", calculate);

// CLEAR

clear.addEventListener("click", () => {
  if (result.innerHTML === "") return;

  result.innerHTML = "";
  step.innerHTML = "";
});
