document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // --- Scroll Progress Bar ---
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const myBar = document.getElementById("myBar");
        if (myBar) {
            myBar.style.width = scrolled + "%";
        }

        // --- Back to Top Button ---
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const navLinks = document.getElementById('nav-links');

    mobileMenuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuIcon.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuIcon.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --- Intersection Observer for Fade-in Animations ---
    const faders = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, .zoom-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Ensure hero elements are visible if they are already in viewport (or just trigger them)
    setTimeout(() => {
        document.querySelectorAll('.hero-content .fade-in-up, .hero-content .slide-in-left, .hero-content .slide-in-right, .hero-content .zoom-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // --- Modal Logic for Rija Babu Profile ---
    const modal = document.getElementById('expertModal');
    const openBtn1 = document.getElementById('openExpertModalBtn');
    const closeBtn = document.getElementById('closeExpertModalBtn');

    function openModal(e) {
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (openBtn1) openBtn1.addEventListener('click', openModal);

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close modal if clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
        if (typeof imageModal !== 'undefined' && e.target === imageModal) {
            imageModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // --- Image Modal Logic for Offers ---
    const imageModal = document.getElementById('imageModal');
    const expandedImg = document.getElementById('expandedImg');
    const closeImageModalBtn = document.getElementById('closeImageModalBtn');
    
    document.querySelectorAll('.offer-card img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            expandedImg.src = img.src;
            imageModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeImageModalBtn) {
        closeImageModalBtn.addEventListener('click', () => {
            imageModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // --- Particles.js Initialization ---
    if (document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 40,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": "#F7E7CE" },
                "shape": { "type": "circle" },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": { "enable": false }
                },
                "line_linked": { "enable": false },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "top",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "bubble" },
                    "onclick": { "enable": false },
                    "resize": true
                },
                "modes": {
                    "bubble": { "distance": 200, "size": 6, "duration": 2, "opacity": 1, "speed": 3 }
                }
            },
            "retina_detect": true
        });
    }
    // --- Appointment Form Submission ---
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitAppBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            const formStatus = document.getElementById('formStatus');

            // UI Loading state
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            submitBtn.disabled = true;
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            const formData = new FormData(appointmentForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Determine API endpoint appropriately
                const response = await fetch('/api/book-appointment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    formStatus.textContent = result.message || 'Appointment request sent successfully!';
                    formStatus.classList.add('success');
                    appointmentForm.reset();

                    // Restore UI immediately on success
                    btnText.style.display = 'inline-block';
                    btnLoader.style.display = 'none';
                    submitBtn.disabled = false;

                    setTimeout(() => {
                        formStatus.className = 'form-status';
                        formStatus.textContent = '';
                    }, 5000);
                } else {
                    throw new Error(result.error || 'Failed to send appointment request.');
                }
            } catch (error) {
                console.error('Email sending failed, falling back to WhatsApp:', error);

                // Fallback to WhatsApp if server fails or is not running
                formStatus.textContent = 'Server unavailable. Redirecting to WhatsApp...';
                formStatus.classList.add('error');

                const phoneNumber = "919745805122"; // RJ Beauty Salon Phone Number

                let message = `*New Appointment Request*%0A%0A`;
                message += `*Name:* ${data.name}%0A`;
                message += `*Phone:* ${data.phone}%0A`;
                message += `*Service:* ${data.service}%0A`;
                message += `*Date:* ${data.date}%0A`;
                message += `*Time Selection:* ${data.time}%0A`;

                if (data.notes && data.notes.trim() !== "") {
                    message += `*Notes:* ${data.notes}%0A`;
                }

                setTimeout(() => {
                    // Open WhatsApp
                    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');

                    // Restore UI state
                    btnText.style.display = 'inline-block';
                    btnLoader.style.display = 'none';
                    submitBtn.disabled = false;
                    appointmentForm.reset();

                    setTimeout(() => {
                        formStatus.className = 'form-status';
                        formStatus.textContent = '';
                    }, 3000);
                }, 1500);
            }
        });
    }

});
