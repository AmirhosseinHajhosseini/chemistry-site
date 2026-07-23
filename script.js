// script.js
document.addEventListener("DOMContentLoaded", () => {
    
    // --- ۱. مدیریت تم تاریک/روشن ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyElement = document.body;

    // چک کردن تم ذخیره شده
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        bodyElement.classList.add('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            bodyElement.classList.toggle('dark-theme');
            
            let theme = 'light';
            if (bodyElement.classList.contains('dark-theme')) {
                theme = 'dark';
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // --- ۲. اسکرول نرم برای لینک‌های داخلی ---
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId === "#") return;
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

    // --- ۳. منوی موبایل ---
    const nav = document.querySelector("nav ul");
    const header = document.querySelector("header");

    if (nav && window.innerWidth <= 768 && header) {
        const menuToggle = document.createElement("button");
        menuToggle.className = "menu-toggle";
        menuToggle.style.padding = "10px";
        menuToggle.innerHTML = "☰";

        header.insertBefore(menuToggle, nav);

        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("open");
        });
    }

    // --- ۴. فعال‌سازی لینک صفحه فعلی ---
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });

    // --- ۵. فیلتر و جستجوی مقالات (مخصوص articles.html) ---
    const filterButtons = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("searchInput");
    const articles = document.querySelectorAll(".article-card");

    function filterArticles() {
        if (!articles.length) return;

        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
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

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                filterArticles();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterArticles);
    }
});
