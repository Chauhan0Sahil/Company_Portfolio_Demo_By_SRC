document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinksMobile = document.querySelectorAll('#mobileMenu a');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when a link is clicked
    navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Testimonial Slider
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDotsContainer = document.getElementById('testimonialDots');
    let currentTestimonialSlide = 0;
    let testimonialAutoSlideInterval;

    function createTestimonialDots() {
        if (!testimonialDotsContainer || testimonialSlides.length === 0) return;
        testimonialDotsContainer.innerHTML = '';
        // Only create dots for original slides, not the duplicate (assuming last is duplicate for infinite loop)
        const numOriginalSlides = testimonialSlides.length > 1 ? testimonialSlides.length - 1 : testimonialSlides.length; // Corrected to handle cases where there might be only 1 or no slides
        for (let i = 0; i < numOriginalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToTestimonialSlide(i));
            testimonialDotsContainer.appendChild(dot);
        }
    }

    function updateTestimonialDots() {
        if (!testimonialDotsContainer || testimonialSlides.length === 0) return;
        const numOriginalSlides = testimonialSlides.length > 1 ? testimonialSlides.length - 1 : testimonialSlides.length;
        document.querySelectorAll('#testimonialDots .slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === (currentTestimonialSlide % numOriginalSlides));
        });
    }

    function goToTestimonialSlide(index, smooth = true) {
        if (!testimonialTrack || testimonialSlides.length === 0) return;

        // Ensure index wraps correctly for the infinite loop logic
        const numOriginalSlides = testimonialSlides.length > 1 ? testimonialSlides.length - 1 : testimonialSlides.length;
        if (index >= numOriginalSlides) { // If trying to go to or past the duplicate slide
            currentTestimonialSlide = index; // Set current slide to the index of the duplicate
        } else {
            currentTestimonialSlide = index;
        }

        const slideWidth = testimonialSlides[0].offsetWidth + (parseFloat(getComputedStyle(testimonialSlides[0]).marginRight) || 0) * 2; // Account for margin
        const offset = -currentTestimonialSlide * slideWidth;

        testimonialTrack.style.transition = smooth ? 'transform 0.8s ease-in-out' : 'none';
        testimonialTrack.style.transform = `translateX(${offset}px)`;
        updateTestimonialDots();

        // If we've transitioned to the duplicated first slide, jump back to the real first slide instantly
        if (currentTestimonialSlide === testimonialSlides.length -1 && testimonialSlides.length > 1) {
            setTimeout(() => {
                testimonialTrack.style.transition = 'none';
                currentTestimonialSlide = 0;
                testimonialTrack.style.transform = `translateX(0px)`;
                updateTestimonialDots();
            }, 800); // Matches transition duration
        }
        resetTestimonialAutoSlide();
    }

    function nextTestimonialSlide() {
        if (testimonialSlides.length === 0) return;
        currentTestimonialSlide = (currentTestimonialSlide + 1);
        goToTestimonialSlide(currentTestimonialSlide);
    }

    function startTestimonialAutoSlide() {
        testimonialAutoSlideInterval = setInterval(nextTestimonialSlide, 6000); // Change slide every 6 seconds
    }

    function resetTestimonialAutoSlide() {
        clearInterval(testimonialAutoSlideInterval);
        startTestimonialAutoSlide();
    }

    // Ensure slides have correct width on load and resize
    function setTestimonialSlideWidths() {
        if (testimonialTrack && testimonialTrack.parentElement && testimonialSlides.length > 0) {
            // Use the direct parent's width for the slider viewport
            const sliderViewportWidth = testimonialTrack.parentElement.offsetWidth;
            testimonialSlides.forEach(slide => {
                // Set min-width of each slide to be the viewport width minus its horizontal margins
                // Example: if slide has 1rem (16px) margin on each side, subtract 32px
                const slideMargin = parseFloat(getComputedStyle(slide).marginLeft) + parseFloat(getComputedStyle(slide).marginRight);
                slide.style.minWidth = `${sliderViewportWidth - slideMargin}px`;
            });
            goToTestimonialSlide(currentTestimonialSlide, false); // Recalculate position instantly
        }
    }

    window.addEventListener('resize', setTestimonialSlideWidths);
    if (testimonialSlides.length > 0) {
        createTestimonialDots();
        setTestimonialSlideWidths();
        startTestimonialAutoSlide();
    }


    // Product Modal functionality
    const productModal = document.getElementById('productModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const viewDetailBtns = document.querySelectorAll('.view-product-detail');

    // Example product data (expanded for more variety for demonstration)
    const allProductsData = [
        {
            title: 'Quantum End Mill Pro',
            image: 'https://images.unsplash.com/photo-1618210457618-b2a6a0904128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTIyMjd8MHwxfHNlYXJjaHwyMHx8Y3V0dGluZyUyMHRvb2wlMjBhdHRhY2htZW50fGVufDB8fHx8MTcxMTExMjcwN3ww&ixlib=rb-4.0.3&q=80&w=600',
            description: 'The Quantum End Mill Pro delivers unparalleled precision and efficiency for high-speed milling operations. Its advanced geometry ensures superior chip evacuation and extended tool life, even in the toughest materials. Ideal for aerospace, automotive, and mold & die industries.',
            specs: [
                { label: 'Material Grade', value: 'Micro-Grain Carbide' },
                { label: 'Coating Type', value: 'AlCrN (Aluminum Chromium Nitride)' },
                { label: 'Applications', value: 'High-Speed Milling, Roughing, Finishing' },
                { label: 'Compatible Materials', value: 'Steel, Stainless Steel, Titanium Alloys' },
                { label: 'Diameter Range', value: 'Ø6mm - Ø25mm' },
                { label: 'Flutes', value: '4/6/8' }
            ]
        },
        {
            title: 'Aura Drill Master Series',
            image: 'https://images.unsplash.com/photo-1589998135896-1877662862a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTIyMjd8MHwxfHNlYXJjaHwxOXx8ZHJpbGwlMjBiaXQlMjBjbG9zZXVwfGVufDB8fHx8MTcxMTExMjcwN3ww&ixlib=rb-4.0.3&q=80&w=600',
            description: 'The Aura Drill Master Series is engineered for exceptional accuracy and hole quality across a wide range of materials. Featuring a unique flute design, it ensures excellent chip control and reduced thrust force, enhancing productivity and machine longevity. Perfect for deep hole drilling and high-volume production.',
            specs: [
                { label: 'Material Grade', value: 'Solid Carbide' },
                { label: 'Coating Type', value: 'TiAlN (Titanium Aluminum Nitride)' },
                { label: 'Applications', value: 'General Drilling, Deep Hole Drilling' },
                { label: 'Compatible Materials', value: 'Cast Iron, Non-Ferrous Metals, Composites' },
                { label: 'Diameter Range', value: 'Ø3mm - Ø20mm' },
                { label: 'Coolant Through', value: 'Yes' }
            ]
        },
        {
            title: 'Fusion Turning Insert',
            image: 'https://images.unsplash.com/photo-1621243886427-935f8e6c40a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTIyMjd8MHwxfHNlYXJjaHwyMXx8dHVybmluZyUyMGluc2VydHxlbnwwfHx8fDE3MTExMTI3MDd8MA&ixlib=rb-4.0.3&q=80&w=600',
            description: 'The Fusion Turning Insert is optimized for high-feed turning of stainless steel and superalloys, delivering unmatched performance and extended tool life. Its innovative chipbreaker geometry ensures excellent chip control and reduced cutting forces, making it ideal for continuous and interrupted cuts.',
            specs: [
                { label: 'Material Grade', value: 'Ceramic/Cermet' },
                { label: 'Coating Type', value: ' CVD (Chemical Vapor Deposition)' },
                { label: 'Applications', value: 'External Turning, Face Turning' },
                { label: 'Compatible Materials', value: 'Stainless Steel, Heat Resistant Alloys' },
                { label: 'Insert Shape', value: 'CNMG, DNMG, WNMG' },
                { label: 'Chipbreaker', value: 'M, F, R type' }
            ]
        },
        {
            title: 'Helix ThreadMill Pro',
            image: 'https://images.unsplash.com/photo-1601007996362-e64906f2c7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTIyMjd8MHwxfHNlYXJjaHwyNHx8dGhyZWFkaW5nJTIwdG9vbHxlbnwwfHx8fDE3MTExMTI3MDd8MA&ixlib=rb-4.0.3&q=80&w=600',
            description: 'The Helix ThreadMill Pro series offers efficient and precise threading solutions for both internal and external applications. Its multi-tooth design ensures fast material removal and superior thread quality, significantly reducing cycle times and improving productivity. Perfect for small batch or complex thread profiles.',
            specs: [
                { label: 'Material Grade', value: 'Solid Carbide' },
                { label: 'Coating Type', value: 'PVD (Physical Vapor Deposition)' },
                { label: 'Applications', value: 'Internal/External Threading' },
                { label: 'Compatible Materials', value: 'Steel, Aluminum, Plastics' },
                { label: 'Thread Profile', value: 'Metric, UNF, NPT' },
                { label: 'Coolant Through', value: 'Optional' }
            ]
        },
        {
            title: 'Dyna-Grip Tool Holder',
            image: 'https://images.unsplash.com/photo-1610484732103-a212e52e4b3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTIyMjd8MHwxfHNlYXJjaHwyNnx8dG9vbCUyMGhvbGRlcnxlbnwwfHx8fDE3MTExMTI3MDd8MA&ixlib=rb-4.0.3&q=80&w=600',
            description: 'The Dyna-Grip Tool Holder is designed to minimize chatter and improve surface finish with its advanced vibration dampening technology. It provides exceptional stability and rigidity, extending tool life and enabling higher cutting parameters for superior machining results.',
            specs: [
                { label: 'Material', value: 'High-Strength Steel Alloy' },
                { label: 'Dampening System', value: 'Internal Harmonic Dampener' },
                { label: 'Applications', value: 'Deep Hole Machining, High-Precision Milling' },
                { label: 'Tool Interface', value: 'HSK, BT, SK' },
                { label: 'Length Range', value: '100mm - 300mm' },
                { label: 'Compatibility', value: 'All Major Machine Brands' }
            ]
        },
        {
            title: 'Bio-Coolant Fluid',
            image: 'https://images.unsplash.com/photo-1612089552140-5a3b9340c210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTIyMjd8MHwxfHNlYXJjaHw3OXx8Y29vbGFudCUyMGZsdWlkfGVufDB8fHx8MTcxODc0Njg3M3ww&ixlib=rb-4.0.3&q=80&w=600',
            description: 'Our Eco-Cutting Fluid is an environmentally friendly solution for extended tool life and superior cooling in various machining operations. Formulated with biodegradable components, it ensures excellent lubricity and chip evacuation while minimizing environmental impact and operator exposure.',
            specs: [
                { label: 'Type', value: 'Semi-Synthetic Emulsion' },
                { label: 'Biodegradability', value: '>90%' },
                { label: 'Applications', value: 'Milling, Turning, Grinding, Drilling' },
                { label: 'Benefits', value: 'Extended Tool Life, Superior Cooling, Operator Safety' },
                { label: 'Compliance', value: 'REACH, RoHS, OSHA' },
                { label: 'Volume', value: '20L, 200L, 1000L IBC' }
            ]
        }
    ];

    function openModal(productData) {
        if (!productModal) return;
        document.getElementById('modalProductImage').src = productData.image;
        document.getElementById('modalProductTitle').textContent = productData.title;
        document.getElementById('modalProductDescription').textContent = productData.description;

        const specsList = document.getElementById('modalProductSpecs');
        if (specsList) {
            specsList.innerHTML = '';
            productData.specs.forEach(spec => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${spec.label}:</span> <span>${spec.value}</span>`;
                specsList.appendChild(li);
            });
        }

        productModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        if (!productModal) return;
        productModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    viewDetailBtns.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productIndex = parseInt(e.target.dataset.productIndex);
            if (!isNaN(productIndex) && allProductsData[productIndex]) { // Ensure index is valid
                openModal(allProductsData[productIndex]);
            } else {
                console.error("Invalid product index for modal:", e.target.dataset.productIndex);
            }
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeProductModal);
    }

    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                closeProductModal();
            }
        });
    }

    // Smooth scrolling for navigation links within the same page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const headerOffset = document.querySelector('header').offsetHeight;
            const targetId = this.getAttribute('href');
            const element = document.querySelector(targetId);

            if (element) {
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Update active nav link on scroll
    // Select all sections that correspond to navigation links
    const sections = document.querySelectorAll('section:not(.product-showcase-strip), footer'); // Exclude the scrolling product strip
    const navLi = document.querySelectorAll('.nav-links li');
    const mobileNavLi = document.querySelectorAll('.mobile-menu ul li');
    const headerHeight = document.querySelector('header').offsetHeight;

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 1; // Adjust for header height
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Special handling for the very top of the page (hero section)
        if (window.pageYOffset < document.querySelector('#about').offsetTop - headerHeight) { // Adjust threshold as needed
            currentSectionId = 'home';
        }


        const updateActiveLinks = (linkList) => {
            linkList.forEach(li => {
                li.classList.remove('active');
                const linkHref = li.querySelector('a').getAttribute('href'); // e.g., "#home"
                const linkTargetId = linkHref.substring(linkHref.indexOf('#') + 1); // "home"

                if (linkTargetId === currentSectionId) {
                    li.classList.add('active');
                }
            });
        };

        updateActiveLinks(navLi);
        updateActiveLinks(mobileNavLi);
    });


    // --- Search Bar Functionality (Placeholder for site-wide search) ---
    const desktopSearchInput = document.querySelector('.search-bar-desktop input[type="text"]');
    const desktopSearchButton = document.querySelector('.search-bar-desktop button');
    const mobileSearchInput = document.querySelector('.search-bar-mobile input[type="text"]');
    const mobileSearchButton = document.querySelector('.search-bar-mobile button');

    function handleSearch(query) {
        const lowerCaseQuery = query.toLowerCase().trim();
        if (lowerCaseQuery) {
            console.log('Site-wide search initiated for:', lowerCaseQuery);
            alert(`Searching for: "${lowerCaseQuery}". This is a static site. A real search would involve a backend or client-side indexing library.`);
            // In a real static site, you'd usually use a client-side search library (e.g., Fuse.js, Lunr.js) that
            // pre-indexes your content. For now, it logs and gives an alert.
        } else {
            console.log('Search input is empty.');
        }
    }

    if (desktopSearchButton) {
        desktopSearchButton.addEventListener('click', () => handleSearch(desktopSearchInput.value));
        desktopSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission if input is in a form
                handleSearch(desktopSearchInput.value);
            }
        });
    }

    if (mobileSearchButton && mobileSearchInput) {
        mobileSearchButton.addEventListener('click', () => handleSearch(mobileSearchInput.value));
        mobileSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                handleSearch(mobileSearchInput.value);
            }
        });
    }

});