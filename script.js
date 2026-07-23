document.addEventListener("DOMContentLoaded", () => {
    
    // --- ۱. مدیریت تم تاریک و روشن ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // اعمال تم ذخیره شده از قبل
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            let theme = 'light';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // --- ۲. منوی همبرگری موبایل ---
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navLinksContainer = document.querySelector(".nav-links");

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle("active");
            
            // تغییر آیکون همبرگری به ضربدر و برعکس
            const icon = mobileMenuBtn.querySelector("i");
            if (navLinksContainer.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });

        // بستن منو در صورت کلیک روی فضای خارج از منو
        document.addEventListener("click", (e) => {
            if (!navLinksContainer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinksContainer.classList.remove("active");
                const icon = mobileMenuBtn.querySelector("i");
                if (icon) icon.className = "fa-solid fa-bars";
            }
        });
    }

    // --- ۳. فعال‌سازی لینک صفحه فعلی در هدر ---
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // --- ۴. اسکرول نرم برای لینک‌های داخلی ---
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // بستن منوی موبایل قبل از اسکرول
                if (navLinksContainer) {
                    navLinksContainer.classList.remove("active");
                    const icon = mobileMenuBtn.querySelector("i");
                    if (icon) icon.className = "fa-solid fa-bars";
                }

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // --- ۵. فیلتر و جستجوی مقالات در articles.html ---
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

            if (matchesSearch && matchesCategory) {
                article.style.display = "flex";
                article.style.opacity = "1";
            } else {
                article.style.display = "none";
                article.style.opacity = "0";
            }
        });
    }

    if (filterButtons.length) {
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

    // --- ۶. انیمیشن کارت‌ها هنگام اسکرول (Fade-in Observer) ---
    const animatedElements = document.querySelectorAll('.feature-card, .article-card, .hero-content, .hero-visual');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target); // فقط یک‌بار انیمیشن اجرا شود
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
            observer.observe(el);
        });
    }
});
