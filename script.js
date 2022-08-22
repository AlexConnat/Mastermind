
///////////////////////////// CONSTANTS /////////////////////////////

DICO_COLORS = {
    1: "darkred",
    2: "green",
    3: "orange",
    4: "salmon",
    5: "purple",
    6: "navy",
}

ORIGINAL_LEFT_OFFSET = 30;

// TODO: Put the height and width of SVG viewbox in a CONSTANT variable

SVGNS = "http://www.w3.org/2000/svg";

SECRET_CODE = getRandomCode(4); // e.g [4, 6, 6, 1]

// Compute the number of occurences of each color in the secret code, e.g in the example above : {1:1, 4:1, 6:2}
COUNTS_SECRET_CODE = {};
for (const num of SECRET_CODE) {
    COUNTS_SECRET_CODE[num] = COUNTS_SECRET_CODE[num] ? COUNTS_SECRET_CODE[num] + 1 : 1;
}

/////////////////////////////////////////////////////////////////////

// Global variable holding the current attempt the user is at (incremented upon each trial)
attempt = 1;

// Global variable holding the left offset for drawing SVG circles (incremented when color circles are added to the response div)
leftOffset = ORIGINAL_LEFT_OFFSET;

// Global variable holding the current guess of the user, as a string (e.g "466")
guessString = "";

/////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////
///////////////////////////// FUNCTIONS /////////////////////////////
/////////////////////////////////////////////////////////////////////

/*
* Returns a nianiania... convention? 
*/
function getRandomCode(size) {
    let code = [];
    for (let i = 0; i < size; i++) {
        code.push(Math.floor(Math.random() * 6 + 1));
    }
    return code;
}

function addColor(numColor) {

    // Don't allow to proceed if the guess already has 4 colors
    if (guessString.length >= 4) {
        return;
    }

    guessString += numColor;

    leftPercent = leftOffset + "%";
    leftOffset += 10;

    let responseSVG = document.getElementById("responses" + attempt);
    let circle = document.createElementNS(SVGNS, 'circle');
    circle.setAttributeNS(null, 'cx', leftPercent);
    circle.setAttributeNS(null, 'cy', '50%');
    circle.setAttributeNS(null, 'r', 2);
    circle.setAttributeNS(null, 'style', 'fill: ' + DICO_COLORS[numColor] + ';');
    responseSVG.appendChild(circle);
}

function removeColors() {

    // Empty the selected colors from the SVG response div
    container = document.getElementById('responses' + attempt);
    while (container.lastChild.tagName != "text") {
        container.removeChild(container.lastChild);
    }

    // Reset the guess to "empty string"
    guessString = "";

    // Reset the leftOffset to its original position
    leftOffset = ORIGINAL_LEFT_OFFSET;
}


function checkCode() {

    // Check if user correctly entered 4 colors and not less
    if (guessString.length < 4) {
        return;
    }

    // Transforms e.g 3441 into [3, 4, 4, 1]
    let guessArr = Array.from(guessString, Number);

    // Black counts the number of perfect matches, and White counts the number of correct colors, but at wrong positions
    let black = 0;
    let white = 0;

    // Compute the number of perfect matches (=black)
    for (let i = 0; i < 4; i++) {
        if (guessArr[i] === SECRET_CODE[i]) {
            black += 1;
        }
    }

    // Compute the number of occurences of each color in the guess, e.g in the example above : {1:1, 3:1, 4:2}
    counts_guess = {};
    for (const num of guessArr) {
        counts_guess[num] = counts_guess[num] ? counts_guess[num] + 1 : 1;
    }

    // Compute the number of correct colors (well positioned or not)
    // --> For all the (non-zero) fields of COUNTS_SECRET_CODE (e.g above {1:1, 4:1, 6:2}), compare with the
    // just computed counts_guess (e.g above {1:1, 3:1, 4:2}) and take the min count between 2 common colors
    totalCorrectColors = 0;
    for (const [color, count] of Object.entries(COUNTS_SECRET_CODE)) {
        if (counts_guess[color]) { // If there is at least one
            totalCorrectColors += Math.min(count, counts_guess[color]);
        }
    }

    // White are correct colors minus perfect matches (= we don't want to count already well positioned colors twice)
    white = totalCorrectColors - black;

    // return (white, black);

    drawBlackWhiteCircles(black, white);

    if (black == 4) {
        alert(`Bravo!! You cracked the secret code in ${attempt} attempts!`);
        // window.location = ""; // reload page
        // isGameOver = true;
        return; // END OF THE GAME
    }

    attempt += 1;

    // Create an empty SVG that will hold the next attempt responses
    createNewSVGResponseContainer();

    // Clean up and reset parameters
    guessString = "";
    leftOffset = ORIGINAL_LEFT_OFFSET;
}

function drawBlackWhiteCircles(black, white) {

    let responseSVG = document.getElementById("responses" + attempt);
    let blackOffset = 70;
    for (let i = 0; i < black; i++) {
        var circle = document.createElementNS(SVGNS, 'circle');
        circle.setAttributeNS(null, 'cx', `${blackOffset + i * 7}%`);
        circle.setAttributeNS(null, 'cy', '50%');
        circle.setAttributeNS(null, 'r', 1);
        circle.setAttributeNS(null, 'style', 'fill: black;');
        responseSVG.appendChild(circle);
    }
    let whiteOffset = blackOffset + 7 * black;
    for (let i = 0; i < white; i++) {
        var circle = document.createElementNS(SVGNS, 'circle');
        circle.setAttributeNS(null, 'cx', `${whiteOffset + i * 7}%`);
        circle.setAttributeNS(null, 'cy', '50%');
        circle.setAttributeNS(null, 'r', 0.8);
        circle.setAttributeNS(null, 'style', 'fill: white; stroke: black; stroke-width:0.5; paint-order: stroke;');
        responseSVG.appendChild(circle);
    }
}

function createNewSVGResponseContainer() {
    // Make sure they're the same numbers as in the "response1" div in the HTML file //
    let boxWidth = 50;
    let boxHeight = 8;
    let width = 1000;
    let height = 80;

    let svgElem = document.createElementNS(SVGNS, "svg");
    svgElem.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
    svgElem.setAttributeNS(null, "width", width);
    svgElem.setAttributeNS(null, "height", height);
    let newText = document.createElementNS(SVGNS, "text");
    newText.setAttributeNS(null, "x", "20%");
    newText.setAttributeNS(null, "y", "59%");
    newText.setAttributeNS(null, "font-size", "1");
    newText.setAttributeNS(null, "font-family", "Futura");
    newText.setAttributeNS(null, "fill", "black");
    let textNode = document.createTextNode(attempt + ".");
    newText.appendChild(textNode);
    svgElem.appendChild(newText);
    svgElem.id = "responses" + attempt;
    svgElem.classList.add("coloredGuesses");
    let responseDiv = document.getElementById("responseDiv");
    responseDiv.appendChild(svgElem);

    // If not in view, scroll to this new empty container
    svgElem.scrollIntoView({behavior: "smooth"});
}

// Press enter or space to validate guess // TODO: OR the center mouse wheel button
document.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === 'Enter' || event.key === ' ') { // if (event.keyCode === 13 || event.keyCode === 32) // .keyCode was DEPRECATED
        checkCode();
    }
    if (event.key === 'Escape') { // if (event.keyCode === 27)
        window.location.href = "#"; // Close the popup
    }
});