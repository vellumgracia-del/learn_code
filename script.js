// Menambahkan efek animasi saat card muncul pertama kali
const card = document.querySelector(".card");
card.style.opacity = "0";
card.style.transform = "translateY(30px)";

window.addEventListener("load", function() {
    setTimeout(function() {
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
    }, 200);
});
