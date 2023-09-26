function buttonPurge() {
    board.step("purge");
}
function buttonMove() {
    board.step("move");
}
function buttonPopulate() {
    board.step("populate");
}
function buttonReset() {
    board.reset();
}
function buttonPi() {
    pi_display.value = "" + board.getPi();
}

document.querySelector("html").addEventListener("keydown", e => {
    if (e.key=="1") {
        buttonPurge();
    }
    if (e.key=="2") {
        buttonMove();
    }
    if (e.key=="3") {
        buttonPopulate();
    }
    if (e.key=="r") {
        buttonReset();
    }
    if (e.key=="p") {
        buttonPi();
    }
});