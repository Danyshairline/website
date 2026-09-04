const body = document.body;
        const menuOpen = document.getElementById("menuOpen");
        const menuClose = document.getElementById("menuClose");
        const menuBackdrop = document.getElementById("menuBackdrop");
        const sideMenu = document.getElementById("sideMenu");
        const accordionButtons = document.querySelectorAll(".accordion-toggle");

        const bookingModal = document.getElementById("bookingModal");
        const bookingOpen = document.getElementById("bookingOpen");
        const bookingOpenSection = document.getElementById("bookingOpenSection");
        const bookingClose = document.getElementById("bookingClose");
        const bookingForm = document.getElementById("bookingForm");
        const bookingSubmit = document.getElementById("bookingSubmit");
        const bookingStatus = document.getElementById("bookingStatus");
        const bookingDate = document.getElementById("bookingDate");

        function openBooking() {
            bookingModal.classList.add("open");
            bookingModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            setTimeout(() => document.getElementById("service").focus(), 100);
        }

        function closeBooking() {
            bookingModal.classList.remove("open");
            bookingModal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }

        bookingOpen.addEventListener("click", openBooking);
        bookingOpenSection.addEventListener("click", openBooking);
        bookingClose.addEventListener("click", closeBooking);

        bookingModal.addEventListener("click", (event) => {
            if (event.target === bookingModal) closeBooking();
        });

        const today = new Date();
        const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0];
        bookingDate.min = localToday;

        bookingForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            bookingSubmit.disabled = true;
            bookingSubmit.textContent = "Wird gesendet …";
            bookingStatus.classList.remove("show");
            bookingStatus.textContent = "";

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

                bookingStatus.textContent =
                    "Vielen Dank! Deine Terminanfrage wurde gesendet. Wir melden uns schnellstmöglich bei dir.";
                bookingStatus.classList.add("show");
                bookingForm.reset();
                bookingDate.min = localToday;
            } catch (error) {
                bookingStatus.textContent =
                    "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuche es erneut oder rufe uns unter 06421 1768777 an.";
                bookingStatus.classList.add("show");
            } finally {
                bookingSubmit.disabled = false;
                bookingSubmit.textContent = "Terminanfrage senden";
            }
        });

        function openMenu() {
            body.classList.add("menu-open");
            menuOpen.setAttribute("aria-expanded", "true");
        }

        function closeMenu() {
            body.classList.remove("menu-open");
            menuOpen.setAttribute("aria-expanded", "false");
        }

        menuOpen.addEventListener("click", openMenu);
        menuClose.addEventListener("click", closeMenu);
        menuBackdrop.addEventListener("click", closeMenu);

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
                submenu.style.maxHeight = isOpen ? "0px" : submenu.scrollHeight + "px";
            });
        });

        sideMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (link.getAttribute("href")?.startsWith("#")) {
                    closeMenu();
                }
            });
        });
