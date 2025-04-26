let Inputval = document.querySelector(".input");
Inputval.value = "x"; // default value is x
let xValue;
let eq = document.querySelector(".eq");
let equation;
let finalArray = [];
let form1 = document.querySelector("#form1");
let form2 = document.querySelector("#form2");
let result;
let range = [];
let midResult;
const maxIterations = 50; // maximum iterations for bisection
const tolerance = 0.00001; // how close to zero we accept

// First form - set variable
form1.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Variable entered:", Inputval.value);
});

// Second form - handle equation
form2.addEventListener("submit", (e) => {
  e.preventDefault();
  equation = eq.value;
  finalArray = []; // reset final array if resubmitting
  console.log("Equation entered:", equation);

  // Split into terms
  let terms = equation.match(/([+-]?[^+-]+)/g);

  terms.forEach(term => {
    if (term.startsWith("+") || term.startsWith("-")) {
      finalArray.push(term.charAt(0));  // Push + or -
      finalArray.push(term.substring(1));  // Push rest
    } else {
      finalArray.push(term);
    }
  });

  console.log("Final array:", finalArray);

  // Find initial range where sign changes
  findInitialRange();
});

// Find initial [a,b] range where function changes sign
function findInitialRange() {
  let prevResult = null;
  let outputArea = document.getElementById("outputArea");
  outputArea.innerHTML = "";
  console.log("Finding initial range...");

  for (xValue = 0; xValue < 1000; xValue++) {
    let modifiedArray = [];
    let modifiedArray2 = [];

    for (let i = 0; i < finalArray.length; i++) {
      let term = finalArray[i];

      if (term.includes(Inputval.value)) {
        if (term[0] === Inputval.value) {
          modifiedArray2.push(`1*x${term.slice(1)}`);
          modifiedArray.push(`1*${xValue}${term.slice(1)}`);
        } else {
          modifiedArray2.push(term.replaceAll(Inputval.value, `*x`));
          modifiedArray.push(term.replaceAll(Inputval.value, `*${xValue}`));
        }
      } else {
        modifiedArray2.push(term);
        modifiedArray.push(term);
      }
    }

    let modifiedEquation2 = modifiedArray2.join('');
    let modifiedEquation = modifiedArray.join('');
    modifiedEquation2 = modifiedEquation2.replaceAll('^', '**');
    modifiedEquation = modifiedEquation.replaceAll('^', '**');

    let fx = modifiedEquation2;
    console.log("fx =", fx);

    result = eval(modifiedEquation);
    console.log(`Result for x=${xValue}:`, result);

    if (result > 0 && prevResult !== null && prevResult < 0) {
      console.log(`✅ Sign change between x=${xValue-1} and x=${xValue}`);
      range[0] = xValue - 1;
      range[1] = xValue;
      bisection(range[0], range[1]);
      return;
    }

    prevResult = result;
  }

  outputArea.innerHTML = `<p>❌ No root found in range 0 to 1000.</p>`;
}

// Evaluate function at a point
function rangeFind(xVal) {
  let modifiedArray = [];

  for (let i = 0; i < finalArray.length; i++) {
    let term = finalArray[i];

    if (term.includes(Inputval.value)) {
      if (term[0] === Inputval.value) {
        modifiedArray.push(`1*${xVal}${term.slice(1)}`);
      } else {
        modifiedArray.push(term.replaceAll(Inputval.value, `*${xVal}`));
      }
    } else {
      modifiedArray.push(term);
    }
  }

  let modifiedEquation = modifiedArray.join('');
  modifiedEquation = modifiedEquation.replaceAll('^', '**');

  return eval(modifiedEquation);
}

// Bisection Method
function bisection(a, b) {
  let mid;
  let iteration = 0;
  let outputArea = document.getElementById("outputArea");
  outputArea.innerHTML = "";

  while (iteration < maxIterations) {
    mid = (a + b) / 2;
    let fMid = rangeFind(mid);
    console.log(`Iteration ${iteration}: Mid = ${mid}, f(mid) = ${fMid}`);

    if (Math.abs(fMid) < tolerance) {
      console.log(`✅ Root approximately at x = ${mid}, f(x) ≈ ${fMid}`);
      outputArea.innerHTML = `
        <p>✅ Root found:</p>
        <p><strong>x ≈ ${mid.toFixed(6)}</strong></p>
        <p>f(x) ≈ ${fMid.toFixed(6)}</p>
        <p>Iterations: ${iteration}</p>
      `;
      return;
    }

    let fA = rangeFind(a);

    if (fA * fMid < 0) {
      b = mid;
    } else {
      a = mid;
    }

    iteration++;
  }

  outputArea.innerHTML = `<p>⚠️ Max iterations reached without exact root.</p>`;
}
