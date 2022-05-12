let examples = [
    {
        comment:
            "a minimalist creative coding playground, by @blinry. click the blue arrow!",
        code: "sin(x*10+t)*0.1+0.5",
    },
    {
        comment:
            "here's an intro on  how to make animations only using 64 sliders!",
        code: "sin(t)*0.5+0.5",
    },
    {
        comment:
            "write a function that returns a value between 0 and 1 (try changing it!)",
        code: "0.5",
    },
    {
        comment: "the function is evaluated for each slider individually",
        code: "random()",
    },
    {
        comment: "`t` is the time in seconds, reset it by editing the function",
        code: "t/10",
    },
    {
        comment:
            "`x` is the position of the slider, between 0 (left) and 1 (right)",
        code: "x",
    },
    {comment: "and `i` is the index of the slider (0..63)", code: "i < 32"},
    {comment: "you can use the time to make animations", code: "x+sin(t)"},
    {
        comment: "multiply the time to change the speed",
        code: "x+sin(t*4)",
    },
    {comment: "use modulo to make patterns", code: "i % 2"},
    {
        comment:
            "you can use math functions like `sin` or `sqrt` and constants like `PI`",
        code: "sqrt(x)+sin(i+t)/50",
    },
    {
        comment:
            "you can use any JavaScript! the `Math` namespace is included.",
        code: `{
  // try moving your browser window!
  let offset = window.screenX/100
  return sin(x*5 + offset)*0.2 + 0.5
}`,
    },
    {
        comment:
            "more examples: binary clock, using the bitwise and operator `&` ",
        code: "2**i & t*10",
    },
    {comment: "circle", code: "(i%2-0.5)*sin(acos(1-x*2))+0.5"},
    {comment: "escalator", code: "round(x*8 - t%1)/8 + t%1 / 8"},
    {comment: "endless pattern", code: "t*x % 1"},
    {comment: "rotating line", code: "(x-0.5)*tan(t)+0.5"},
    {
        comment: "this one is by @sequentialchaos",
        code: "abs(sin(i+t))",
    },
    {
        comment:
            "munching squares, by @daniel_bohrer, using the bitwise xor operator `^` ",
        code: "(i^(t*30)%64)/63",
    },
    {
        comment: "gradient, made with @lenaschimmel",
        code: "sign(x-random())",
    },
    {
        comment: "nice sine waves, try changing numbers and see what they do",
        code: "sin(i/10+t*2.8+(i%3/3)*PI)*0.1+sin(i/10-t*2.8)*0.02+0.5",
    },
    {
        comment: "now create your own! what you type is saved in the url.",
        code: "/* have fun! */",
    },
]

let sliders = []
let n = 64

let w = 2000 // size of the canvas
let b = 25 // top/bottom border width

let tStart = performance.now()
let currentFormula

let container = document.querySelector("#sliders")
let ctx = container.getContext("2d")

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2
    if (h < 2 * r) r = h / 2
    this.beginPath()
    this.moveTo(x + r, y)
    this.arcTo(x + w, y, x + w, y + h, r)
    this.arcTo(x + w, y + h, x, y + h, r)
    this.arcTo(x, y + h, x, y, r)
    this.arcTo(x, y, x + w, y, r)
    this.closePath()
    return this
}

function update() {
    let formulaText = formula.value

    ctx.clearRect(0, 0, w, w + 2 * b)

    if (formulaText.length === 0) {
        eval = () => 0
    }

    let t = (performance.now() - tStart) / 1000
    for (var i = 0; i < n; i++) {
        let x = i / 63
        let val = eval(t, i, x)
        if (isFinite(val)) {
            sliderColor = "#0075ff"
            val = Math.min(val, 1)
            val = Math.max(val, 0)
        } else {
            val = 0
            sliderColor = "#cbcbcb"
        }
        let sliderWidth = 0.43
        let handleDiameter = w / 64
        ctx.fillStyle = "#efefef"
        ctx.strokeStyle = "#b2b2b2"
        ctx.lineWidth = w / 1000
        let roundRect = ctx.roundRect(
            ((i + (1 - sliderWidth) / 2) * w) / 64,
            b,
            (w / 64) * sliderWidth,
            w,
            w / 64 / 2,
        )
        roundRect.fill()
        roundRect.stroke()
        ctx.fillStyle = sliderColor
        ctx.roundRect(
            ((i + (1 - sliderWidth) / 2) * w) / 64,
            (1 - val) * (w - handleDiameter) + handleDiameter / 2 + b,
            (w / 64) * sliderWidth,
            w - ((1 - val) * (w - handleDiameter) + handleDiameter / 2),
            w / 64 / 2,
        ).fill()
        ctx.beginPath()
        ctx.arc(
            ((i + 0.5) * w) / 64,
            (1 - val) * (w - handleDiameter) + handleDiameter / 2 + b,
            handleDiameter / 2,
            0,
            2 * Math.PI,
        )
        ctx.fill()
    }

    requestAnimationFrame(update)
}

let formula = document.getElementById("formula")
let comment = document.getElementById("comment")
let eval = () => 0
formula.oninput = () => {
    saveFormulaToHash()

    // Reset t
    tStart = performance.now()

    // Extract function
    updateFormula(formula.value)

    updateTextareaHeight()
}

function updateTextareaHeight() {
    let height = 0
    formula.value.split("\n").forEach((line) => {
        height += Math.ceil(0.00001 + line.length / 80)
    })
    height += 1
    formula.style.height = height + "rem"
}

// https://benborgers.com/posts/textarea-tab
formula.addEventListener("keydown", (e) => {
    if (e.keyCode === 9) {
        e.preventDefault()
        document.execCommand("insertText", false, " ".repeat(2))
    }
})

formula.onselect = (e) => {
    if (e.target.selectionStart == e.target.selectionEnd) {
        updateFormula(formula.value)
    } else {
        const selection = e.target.value.substring(
            e.target.selectionStart,
            e.target.selectionEnd,
        )
        updateFormula(selection)
    }
}

formula.onclick = formula.onselect
formula.onblur = formula.onselect
formula.onkeydown = formula.onselect
formula.onmousedown = formula.onselect

function saveFormulaToHash() {
    // URL-encode formula into hash
    let hash = encodeURIComponent(formula.value)
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
    window.location.hash = hash
    if (hash === "") {
        removeHash()
    }
}

function updateFormula(formulaText) {
    try {
        if (formulaText.length > 0) {
            currentFormula = formulaText
            eval = new Function(
                "t",
                "i",
                "x",
                `try {
                    with (Math) {
                        let fn = () => ${formulaText}
                        return fn()
                    }
                } catch (e) {
                    return undefined
                }`,
            )
        } else {
            for (var i = 0; i < sliders.length; i++) {
                sliders[i].value = 0
                sliders[i].disabled = false
            }
        }
        formula.classList.remove("error")
    } catch (e) {
        formula.classList.add("error")
    }
}

// URL-decode hash
function getFormulaFromHash() {
    let hash = decodeURIComponent(window.location.hash.substr(1))
    if (formula.value !== hash) {
        formula.value = hash
    }
    updateFormula(hash)
    tStart = performance.now()
}

let hash = decodeURIComponent(window.location.hash.substr(1))
if (hash == "") {
    loadExample(0)
    updateFormula(formula.value)
    formula.focus()
    tStart = performance.now()
} else {
    getFormulaFromHash()
    updateTextareaHeight()
    comment.innerText = "// " + examples[0].comment
}

function loadExample(n) {
    window.location.hash = ""
    removeHash()

    formula.value = ""
    comment.innerHTML = ""
    if (examples[n].comment !== undefined && examples[n].comment !== "") {
        comment.innerHTML = "// " + examples[n].comment + "\n"
    }
    formula.value += examples[n].code
    formula.selectionStart = formula.value.length
    formula.selectionEnd = formula.value.length
    updateTextareaHeight()
}

// From https://stackoverflow.com/a/5298684/248734
function removeHash() {
    var scrollV,
        scrollH,
        loc = window.location
    if ("pushState" in history)
        history.pushState("", document.title, loc.pathname + loc.search)
    else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop
        scrollH = document.body.scrollLeft

        loc.hash = ""

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV
        document.body.scrollLeft = scrollH
    }
}

let currentExample = 0
document.querySelector("#examples-right").onclick = () => {
    currentExample = (currentExample + 1) % examples.length
    loadExample(currentExample)
    updateFormula(formula.value)
    tStart = performance.now()
}
document.querySelector("#examples-left").onclick = () => {
    currentExample = (currentExample - 1 + examples.length) % examples.length
    loadExample(currentExample)
    updateFormula(formula.value)
    tStart = performance.now()
}

update()
