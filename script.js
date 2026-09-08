const body = document.body;

const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");
const menuBackdrop = document.getElementById("menuBackdrop");
const sideMenu = document.getElementById("sideMenu");
const accordionButtons = document.querySelectorAll(".accordion-toggle");

const bookingModal = document.getElementById("bookingModal");
const bookingOpen = document.getElementById("bookingOpen");
const bookingOpenSection = document.getElementById("bookingOpenSection");
const heroBookingOpen = document.getElementById("heroBookingOpen");
const serviceBookingOpen = document.getElementById("serviceBookingOpen");
const bookingClose = document.getElementById("bookingClose");
const bookingForm = document.getElementById("bookingForm");
const bookingSubmit = document.getElementById("bookingSubmit");
const bookingStatus = document.getElementById("bookingStatus");
const bookingDate = document.getElementById("bookingDate");

function openBooking() {
    if (!bookingModal) return;
    bookingModal.classList.add("open");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const service = document.getElementById("service");
    if (service) setTimeout(() => service.focus(), 100);
}

function closeBooking() {
    if (!bookingModal) return;
    bookingModal.classList.remove("open");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

[bookingOpen, bookingOpenSection, heroBookingOpen, serviceBookingOpen]
    .filter(Boolean)
    .forEach((el) => el.addEventListener("click", openBooking));

if (bookingClose) bookingClose.addEventListener("click", closeBooking);

if (bookingModal) {
    bookingModal.addEventListener("click", (event) => {
        if (event.target === bookingModal) closeBooking();
    });
}

if (bookingDate) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
    bookingDate.min = localToday;
}

if (bookingForm) {
    bookingForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (bookingSubmit) {
            bookingSubmit.disabled = true;
            bookingSubmit.textContent = "Wird gesendet …";
        }

        if (bookingStatus) {
            bookingStatus.classList.remove("show");
            bookingStatus.textContent = "";
        }

        const formData = new FormData(bookingForm);
        formData.append("_subject", "Neue Terminanfrage – Dany's Hairline");
        formData.append("_template", "table");

        try {
            const response = await fetch("https://formsubmit.co/ajax/info@danyshairline.de", {
                method: "POST",
                headers: { "Accept": "application/json" },
                body: formData
            });

            if (!response.ok) throw new Error("Senden fehlgeschlagen");

            if (bookingStatus) {
                bookingStatus.textContent =
                    "Vielen Dank! Deine Terminanfrage wurde gesendet. Wir melden uns schnellstmöglich bei dir.";
                bookingStatus.classList.add("show");
            }

            bookingForm.reset();
        } catch (error) {
            if (bookingStatus) {
                bookingStatus.textContent =
                    "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuche es erneut oder rufe uns unter 06421 1768777 an.";
                bookingStatus.classList.add("show");
            }
        } finally {
            if (bookingSubmit) {
                bookingSubmit.disabled = false;
                bookingSubmit.textContent = "Terminanfrage senden";
            }
        }
    });
}

function openMenu() {
    if (!menuOpen) return;
    body.classList.add("menu-open");
    menuOpen.setAttribute("aria-expanded", "true");
}

function closeMenu() {
    if (!menuOpen) return;
    body.classList.remove("menu-open");
    menuOpen.setAttribute("aria-expanded", "false");
}

if (menuOpen) menuOpen.addEventListener("click", openMenu);
if (menuClose) menuClose.addEventListener("click", closeMenu);
if (menuBackdrop) menuBackdrop.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        closeBooking();
    }
});

accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const submenu = button.nextElementSibling;
        const isOpen = button.getAttribute("aria-expanded") === "true";

        button.setAttribute("aria-expanded", String(!isOpen));
        if (submenu) {
            submenu.style.maxHeight = isOpen ? "0px" : submenu.scrollHeight + "px";
        }
    });
});

if (sideMenu) {
    sideMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });
}
