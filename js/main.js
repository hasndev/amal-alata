// ===== jQuery Document Ready =====
$(document).ready(function() {
    
    // ===== Theme Toggle =====
    const themeToggle = $('#themeToggle');
    const themeIcon = $('#themeIcon');
    const body = $('body');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.addClass('dark-mode');
        themeIcon.removeClass('bx-moon').addClass('bx-sun');
    }
    
    // Toggle theme
    themeToggle.on('click', function() {
        body.toggleClass('dark-mode');
        
        if (body.hasClass('dark-mode')) {
            themeIcon.removeClass('bx-moon').addClass('bx-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.removeClass('bx-sun').addClass('bx-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // ===== Navbar Scroll Effect =====
    const navbar = $('#mainNav');
    
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 50) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
    });
    
    // ===== Active Navigation Link =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $('.nav-link').each(function() {
        const href = $(this).attr('href');
        if (href === currentPage) {
            $('.nav-link').removeClass('active');
            $(this).addClass('active');
        }
    });
    
    // ===== Back to Top Button =====
    const backToTop = $('#backToTop');
    
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 300) {
            backToTop.addClass('show');
        } else {
            backToTop.removeClass('show');
        }
    });
    
    backToTop.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });
    
    // ===== Smooth Scroll for Anchor Links =====
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.hash);
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 600);
        }
    });
    
    // ===== Counter Animation =====
    function animateCounter(element) {
        const target = parseInt($(element).data('target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(function() {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            $(element).text(Math.floor(current).toLocaleString('en-US'));
        }, 16);
    }
    
    // Trigger counter animation on scroll
    let counterAnimated = false;
    $(window).on('scroll', function() {
        if (!counterAnimated && $('.stat-number').length) {
            const statsSection = $('.stats-section');
            if (statsSection.length) {
                const sectionTop = statsSection.offset().top;
                const windowBottom = $(window).scrollTop() + $(window).height();
                
                if (windowBottom > sectionTop) {
                    $('.stat-number').each(function() {
                        animateCounter(this);
                    });
                    counterAnimated = true;
                }
            }
        }
    });
    
    // ===== Donation Modal - Multi-Step Form =====
    let currentStep = 1;
    const totalSteps = 3;
    
    const step1 = $('#step1');
    const step2 = $('#step2');
    const step3 = $('#step3');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const submitBtn = $('#submitBtn');
    const modalTitle = $('#modalTitle');
    
    // Gift for someone checkbox
    $('#giftFor').on('change', function() {
        if ($(this).is(':checked')) {
            $('#giftName').removeClass('d-none');
        } else {
            $('#giftName').addClass('d-none').val('');
        }
    });
    
    // Custom amount input
    $('#customAmount').on('input', function() {
        if ($(this).val()) {
            $('input[name="amount"]').prop('checked', false);
        }
    });
    
    $('input[name="amount"]').on('change', function() {
        if ($(this).is(':checked')) {
            $('#customAmount').val('');
        }
    });
    
    // Next button
    nextBtn.on('click', function() {
        if (validateStep(currentStep)) {
            currentStep++;
            updateStepDisplay();
        }
    });
    
    // Previous button
    prevBtn.on('click', function() {
        currentStep--;
        updateStepDisplay();
    });
    
    // Submit button
    submitBtn.on('click', function() {
        // Show success message
        alert('تم استلام طلبك بنجاح! سنتواصل معك قريباً لإتمام العملية.');
        
        // Reset form and close modal
        resetDonationForm();
        $('#donationModal').modal('hide');
    });
    
    // Reset modal when closed
    $('#donationModal').on('hidden.bs.modal', function() {
        resetDonationForm();
    });
    
    function validateStep(step) {
        if (step === 1) {
            const program = $('#programSelect').val();
            const amount = $('input[name="amount"]:checked').val();
            const customAmount = $('#customAmount').val();
            
            if (!program) {
                alert('الرجاء اختيار البرنامج');
                return false;
            }
            
            if (!amount && !customAmount) {
                alert('الرجاء اختيار أو إدخال المبلغ');
                return false;
            }
            
            return true;
        } else if (step === 2) {
            const name = $('#fullName').val().trim();
            const phone = $('#phone').val().trim();
            
            if (!name) {
                alert('الرجاء إدخال الاسم الكامل');
                return false;
            }
            
            if (!phone) {
                alert('الرجاء إدخال رقم الهاتف');
                return false;
            }
            
            if (phone.length < 10) {
                alert('الرجاء إدخال رقم هاتف صحيح');
                return false;
            }
            
            // Update review section
            updateReviewSection();
            return true;
        }
        
        return true;
    }
    
    function updateStepDisplay() {
        // Hide all steps
        $('.donation-step').removeClass('active');
        
        // Show current step
        $('#step' + currentStep).addClass('active');
        
        // Update step indicators
        $('.step-dot').removeClass('active');
        for (let i = 1; i <= currentStep; i++) {
            $('.step-dot[data-step="' + i + '"]').addClass('active');
        }
        
        // Update buttons
        if (currentStep === 1) {
            prevBtn.hide();
            nextBtn.show();
            submitBtn.hide();
            modalTitle.text('اختر نيتك والمبلغ');
        } else if (currentStep === 2) {
            prevBtn.show();
            nextBtn.show();
            submitBtn.hide();
            modalTitle.text('معلوماتك الشخصية');
        } else if (currentStep === 3) {
            prevBtn.show();
            nextBtn.hide();
            submitBtn.show();
            modalTitle.text('مراجعة وتأكيد');
        }
    }
    
    function updateReviewSection() {
        // Program
        const programText = $('#programSelect option:selected').text();
        $('#reviewProgram').text(programText);
        
        // Amount
        let amount = $('input[name="amount"]:checked').val();
        if (!amount) {
            amount = $('#customAmount').val();
        }
        $('#reviewAmount').text(parseInt(amount).toLocaleString('en-US') + ' دينار');
        
        // Gift
        if ($('#giftFor').is(':checked')) {
            $('#reviewGiftSection').show();
            $('#reviewGift').text($('#giftName').val());
        } else {
            $('#reviewGiftSection').hide();
        }
        
        // Notes
        const notes = $('#notes').val().trim();
        if (notes) {
            $('#reviewNotesSection').show();
            $('#reviewNotes').text(notes);
        } else {
            $('#reviewNotesSection').hide();
        }
        
        // Personal info
        $('#reviewName').text($('#fullName').val());
        $('#reviewPhone').text($('#phone').val());
        
        const email = $('#email').val().trim();
        if (email) {
            $('#reviewEmailSection').show();
            $('#reviewEmail').text(email);
        } else {
            $('#reviewEmailSection').hide();
        }
    }
    
    function resetDonationForm() {
        currentStep = 1;
        updateStepDisplay();
        
        // Clear all inputs
        $('#programSelect').val('');
        $('input[name="amount"]').prop('checked', false);
        $('#customAmount').val('');
        $('#giftFor').prop('checked', false);
        $('#giftName').addClass('d-none').val('');
        $('#notes').val('');
        $('#fullName').val('');
        $('#phone').val('');
        $('#email').val('');
    }
    
    // ===== Prayer Time (Mock) =====
    function updatePrayerTime() {
        const now = new Date();
        const hours = now.getHours();
        
        let nextPrayer = '';
        let nextTime = '';
        
        if (hours < 5) {
            nextPrayer = 'الفجر';
            nextTime = '5:30';
        } else if (hours < 12) {
            nextPrayer = 'الظهر';
            nextTime = '12:30';
        } else if (hours < 15) {
            nextPrayer = 'العصر';
            nextTime = '15:45';
        } else if (hours < 18) {
            nextPrayer = 'المغرب';
            nextTime = '18:15';
        } else if (hours < 20) {
            nextPrayer = 'العشاء';
            nextTime = '19:45';
        } else {
            nextPrayer = 'الفجر';
            nextTime = '5:30';
        }
        
        $('#prayerTime').text('وقت ' + nextPrayer + ': ' + nextTime);
    }
    
    updatePrayerTime();
    setInterval(updatePrayerTime, 60000); // Update every minute
    
    // ===== Fade In Animation on Scroll =====
    function fadeInOnScroll() {
        $('.value-card, .program-card, .pricing-card, .benefit-card').each(function() {
            const elementTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (windowBottom > elementTop + 100) {
                $(this).addClass('fade-in-up');
            }
        });
    }
    
    $(window).on('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Initial check
    
    // ===== Close mobile menu when clicking outside =====
    $(document).on('click', function(e) {
        const navbar = $('.navbar-collapse');
        if (navbar.hasClass('show') && !$(e.target).closest('.navbar').length) {
            navbar.collapse('hide');
        }
    });
    
    // ===== Form Validation Helper =====
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^07[0-9]{9}$/;
        return re.test(phone.replace(/\s/g, ''));
    }
    
    // ===== Contact Form (if exists) =====
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#contactName').val().trim();
        const phone = $('#contactPhone').val().trim();
        const email = $('#contactEmail').val().trim();
        const message = $('#contactMessage').val().trim();
        
        if (!name || !phone || !message) {
            alert('الرجاء ملء جميع الحقول المطلوبة');
            return;
        }
        
        if (!validatePhone(phone)) {
            alert('الرجاء إدخال رقم هاتف صحيح');
            return;
        }
        
        if (email && !validateEmail(email)) {
            alert('الرجاء إدخال بريد إلكتروني صحيح');
            return;
        }
        
        alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
        $(this)[0].reset();
    });
    
    // ===== Accordion Animation (if exists) =====
    $('.accordion-button').on('click', function() {
        $(this).find('i').toggleClass('bx-chevron-down bx-chevron-up');
    });
    
    // ===== Lazy Loading Images =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img.lazy').forEach(function(img) {
            imageObserver.observe(img);
        });
    }
    
    // ===== Prevent Form Resubmission =====
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
    
    // ===== Console Welcome Message =====
    console.log('%c أمل العطاء - مؤسسة خيرية طبية ', 'background: #0E7A57; color: white; font-size: 20px; padding: 10px;');
    console.log('%c تم بناء الموقع بواسطة Manus ', 'background: #C9A227; color: white; font-size: 14px; padding: 5px;');
    
});

// ===== Page Load Animation =====
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// ===== Prevent Right Click on Images (Optional) =====
// Uncomment if you want to protect images
// document.addEventListener('contextmenu', function(e) {
//     if (e.target.tagName === 'IMG') {
//         e.preventDefault();
//     }
// });
