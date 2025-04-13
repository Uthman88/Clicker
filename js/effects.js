import $ from "jquery";

function showDiamondFlash(points) {
    const flash = $(`<div class="flash">+${points} éclats</div>`);
    $("body").append(flash);

    flash.animate(
        { top: "30%", opacity: 0 },
        800,
        "easeOutCubic",
        () => flash.remove()
    );
}