// script.js
document.addEventListener("DOMContentLoaded", () => {
    // اسکرول نرم برای لینک‌های داخلی
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // منوی موبایل ساده
    const nav = document.querySelector("nav ul");
    const header = document.querySelector("header");

    if (nav && window.innerWidth <= 768) {
        const menuToggle = document.createElement("button");
        menuToggle.className = "menu-toggle";
        menuToggle.setAttribute("aria-label", "باز کردن منو");
        menuToggle.innerHTML = "☰";

        header.insertBefore(menuToggle, nav);

        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("open");
        });
    }

    // فعال‌سازی لینک صفحه فعلی در ناوبری
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });

    // فیلتر مقالات در articles.html
    const filterButtons = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("searchInput");
    const articles = document.querySelectorAll(".article-card");

    function filterArticles() {
        if (!searchInput || articles.length === 0 || filterButtons.length === 0) return;

        const query = searchInput.value.toLowerCase().trim();
        const activeButton = document.querySelector(".filter-btn.active");
        const activeCategory = activeButton ? activeButton.getAttribute("data-category") : "all";

        articles.forEach(article => {
            const title = article.querySelector("h3")?.textContent.toLowerCase() || "";
            const text = article.querySelector("p")?.textContent.toLowerCase() || "";
            const category = article.getAttribute("data-category") || "";

            const matchesSearch = title.includes(query) || text.includes(query);
            const matchesCategory = activeCategory === "all" || category === activeCategory;

            article.style.display = (matchesSearch && matchesCategory) ? "flex" : "none";
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            filterArticles();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", filterArticles);
    }
});
