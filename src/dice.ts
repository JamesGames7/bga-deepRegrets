// Three equations for brightness of dice based on rotation
// Depends on angle: main side, top side, bottom side (45deg off each other)
const faceEq = (x: number): number => (1/4 * Math.cos(-19 * Math.PI / 180 * Math.cos(x + Math.PI / 4) + Math.PI / 2) + 9/10);
const topEq = (x: number): number => (1/4 * Math.cos(-19 * Math.PI / 180 * Math.cos(x + Math.PI / 4) + Math.PI / 4) + 9/10);
const bottomEq = (x: number): number => (1/4 * Math.cos(-19 * Math.PI / 180 * Math.cos(x + Math.PI / 4) + 3 * Math.PI / 4) + 9/10);

// Original setup of dice
function diceSetup(elementId: string) {
    // Element to apply to
    let el: HTMLElement = document.getElementById(elementId)!;
    
    // Finding the rotation on correct axis
    let style = window.getComputedStyle(el).transform;
    let rotateY: number;
    if (style.includes("matrix3d")) {
        let matrix = style.slice(9, -1).split(",").map(parseFloat);
        rotateY = -Math.atan2(matrix[2], matrix[0]);
    } else {
        rotateY = 0;
    }

    // For each side (90deg off each other)
    let add = 0;
    ["f1", "f2", "f3", "f4"].forEach(id => {
        document.getElementById(id)!.style.filter = `brightness(${faceEq(rotateY + add)})`;
        add += Math.PI / 2;
    });
    ["t1", "t2", "t3", "t4"].forEach(id => {
        document.getElementById(id)!.style.filter = `brightness(${topEq(rotateY + add)})`;
        add += Math.PI / 2;
    });
    ["t5", "t6", "t7", "t8"].forEach(id => {
        document.getElementById(id)!.style.filter = `brightness(${bottomEq(rotateY + add)})`;
        add += Math.PI / 2;
    });
}

// EventListener for when it rotates (for now click)
function diceRotation(elementId: string) {
    let el: HTMLElement = document.getElementById(elementId)!;
    let rot = 0;
    el.addEventListener("click", () => {
        // Set rotation / transformation
        rot += 810;
        el.style.transform = `rotateY(${rot}deg)`;

        // Start time
        let start = performance.now();
        function update(t: number) {
            // Find how long it's been
            let progress = Math.min((t-start) / 1000, 2);

            diceSetup(el.id);

            // Recursively repeat until done
            if (progress < 2) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    })

}

window.diceSetup = diceSetup as any;
window.diceRotation = diceRotation as any;