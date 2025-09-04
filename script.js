class FastChatBot {
    constructor() {
        this.messageQueue = [];
        this.isProcessing = false;
        this.responses = this.initializeResponses();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const sendBtn = document.getElementById('send-message-btn');
        const chatInput = document.getElementById('chat-input');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleSend());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend();
                }
            });
        }

        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                this.sendMessage(message);
            });
        });
    }

    handleSend() {
        const input = document.getElementById('chat-input');
        if (!input || !input.value.trim()) return;

        this.sendMessage(input.value.trim());
        input.value = '';
    }

    sendMessage(message) {
        this.messageQueue.push(message);
        this.processQueue();
    }

    async processQueue() {
        if (this.isProcessing || this.messageQueue.length === 0) return;

        this.isProcessing = true;
        const message = this.messageQueue.shift();

        this.displayUserMessage(message);
        await this.showTypingIndicator();
        this.displayBotResponse(this.generateResponse(message));

        this.isProcessing = false;
        this.processQueue();
    }

    displayUserMessage(message) {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">${this.escapeHtml(message)}</div>
        `;

        container.appendChild(messageDiv);
        this.scrollToBottom(container);
    }

    async showTypingIndicator() {
        return new Promise(resolve => {
            const container = document.getElementById('chat-messages');
            if (!container) {
                resolve();
                return;
            }

            const typingDiv = document.createElement('div');
            typingDiv.className = 'message typing-message';
            typingDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;

            container.appendChild(typingDiv);
            this.scrollToBottom(container);

            setTimeout(() => {
                typingDiv.remove();
                resolve();
            }, 600);
        });
    }

    displayBotResponse(response) {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">${response}</div>
        `;

        container.appendChild(messageDiv);
        this.scrollToBottom(container);
    }

    generateResponse(message) {
        const lowerMsg = message.toLowerCase();
        let category = 'default';

        if (lowerMsg.includes('book') || lowerMsg.includes('room') || lowerMsg.includes('reservation')) {
            category = 'booking';
        } else if (lowerMsg.includes('amenities') || lowerMsg.includes('facilities') || lowerMsg.includes('spa')) {
            category = 'amenities';
        } else if (lowerMsg.includes('location') || lowerMsg.includes('address') || lowerMsg.includes('where')) {
            category = 'location';
        } else if (lowerMsg.includes('price') || lowerMsg.includes('rate') || lowerMsg.includes('cost')) {
            category = 'rates';
        } else if (lowerMsg.includes('contact') || lowerMsg.includes('phone') || lowerMsg.includes('call')) {
            category = 'contact';
        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
            category = 'greetings';
        }

        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    initializeResponses() {
        return {
            greetings: [
                "Welcome to King Sukh Guest House! I'm your Royal Assistant. How may I help you today?",
                "Hello! I'm here to assist with your royal stay. What can I help you with?",
                "Greetings! How can I make your King Sukh experience exceptional?"
            ],
            booking: [
                "I'd be happy to help with bookings! We have Royal Chambers (₹4,999), Family Suites (₹7,499), Emperor Suites (₹12,999), and Honeymoon Haven (₹8,999). Which interests you?",
                "Great choice! Click the 'Book Now' button and I'll guide you through our secure booking process.",
                "For reservations, please provide your preferred dates. Our rooms offer the finest luxury experience!"
            ],
            amenities: [
                "Our royal amenities include: 🍽️ Multi-cuisine dining, 🧘‍♀️ Golden Spa & Wellness, 🎮 Recreation facilities, 🌺 Beautiful gardens, 💼 Business center, and 🛡️ 24/7 security.",
                "We offer world-class facilities: Royal dining, luxury spa treatments, fitness center, landscaped gardens, and premium business facilities.",
                "Guests enjoy: Ayurvedic spa, multi-cuisine restaurant, recreational activities, yoga sessions, and personalized concierge services."
            ],
            location: [
                "We're located in West Bengal's golden hills: Beside Barshal Water Tank, Manpur, Barhanti, WB 723156. Just 2.5h from Kolkata!",
                "Our location offers stunning views near Biharinath, Baranti, and Susunia hills. Perfect for nature lovers!",
                "Find us in beautiful West Bengal hills, easily accessible by road with ample parking."
            ],
            rates: [
                "Our rates: 🏰 Royal Chambers ₹4,999/night, 👨‍👩‍👧‍👦 Family Suites ₹7,499/night, 👑 Emperor Suites ₹12,999/night, 💕 Honeymoon Haven ₹8,999/night. All include breakfast!",
                "Room rates include breakfast, WiFi, and facility access. Special packages available for extended stays!",
                "Our pricing reflects the royal experience we provide. Each room includes luxury amenities and personalized service."
            ],
            contact: [
                "Contact us: 📞 +91 7502724515 (24/7), 📧 reservations@kingsukh.com, 💬 WhatsApp +91 7502724515. We're here to serve!",
                "Reach us anytime! Our team responds within 2 hours to emails and provides instant WhatsApp assistance.",
                "For immediate help, call +91 7502724515. Our royal staff is available 24/7!"
            ],
            default: [
                "I'm here to help with rooms, amenities, location, or bookings. What would you like to know?",
                "How can I assist with your King Sukh Guest House experience today?",
                "I can help with bookings, facilities, rates, or any other questions. What interests you?"
            ]
        };
    }

    scrollToBottom(container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

class KingSukhGuestHouse {
    constructor() {
        this.loadingProgress = 0;
        this.loadingMessages = [
            'Initializing Royal Experience...',
            'Loading Luxury Amenities...',
            'Setting Up Royal Chambers...',
            'Preparing Golden Services...',
            'Activating AI Assistant...',
            'Finalizing Booking System...',
            'Welcome to King Sukh Guest House!'
        ];
        this.currentTheme = 'light';
        this.chatbot = new FastChatBot();
        this.init();
    }

    init() {
        this.setupProfessionalLoader();
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupAssistant();
        this.setupGallery();
        this.setupVirtualTour();
        this.setMinDate();
    }

    setupProfessionalLoader() {
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');
        const loadingMessage = document.getElementById('loading-message');
        const loader = document.getElementById('loader');
        const mainContent = document.getElementById('main-content');

        if (!progressFill || !progressPercentage || !loadingMessage || !loader || !mainContent) {
            console.warn('Loading elements not found');
            return;
        }

        let messageIndex = 0;
        const loadingInterval = setInterval(() => {
            this.loadingProgress += Math.random() * 3 + 2;

            if (this.loadingProgress >= 100) {
                this.loadingProgress = 100;
                clearInterval(loadingInterval);

                setTimeout(() => {
                    loader.classList.add('fade-out');
                    setTimeout(() => {
                        loader.style.display = 'none';
                        mainContent.classList.remove('hidden');
                        this.startAnimations();
                    }, 1500);
                }, 800);
            }

            progressFill.style.width = `${this.loadingProgress}%`;
            progressPercentage.textContent = Math.round(this.loadingProgress);

            const newMessageIndex = Math.floor((this.loadingProgress / 100) * this.loadingMessages.length);
            if (newMessageIndex !== messageIndex && newMessageIndex < this.loadingMessages.length) {
                messageIndex = newMessageIndex;
                loadingMessage.textContent = this.loadingMessages[messageIndex];
            }
        }, 100);
    }

    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    if (navMenu && navMenu.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                }
            });
        });

        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.style.background = this.currentTheme === 'dark' ? 
                        'rgba(26, 26, 26, 0.98)' : 
                        'rgba(255, 248, 220, 0.98)';
                } else {
                    navbar.style.background = this.currentTheme === 'dark' ? 
                        'rgba(26, 26, 26, 0.95)' : 
                        'rgba(255, 248, 220, 0.95)';
                }
            }
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        this.showNotification(`🎨 Switched to ${this.currentTheme} theme`, 'success');
    }

    setupEventListeners() {
        const navbarBookBtn = document.getElementById('navbar-book-btn');
        const heroBookBtn = document.getElementById('hero-book-btn');

        if (navbarBookBtn) navbarBookBtn.addEventListener('click', () => this.openBookingModal());
        if (heroBookBtn) heroBookBtn.addEventListener('click', () => this.openBookingModal());

        const virtualTourBtn = document.getElementById('virtual-tour-btn');
        if (virtualTourBtn) {
            virtualTourBtn.addEventListener('click', () => this.openVirtualTour());
        }

        const bookingStatusBtn = document.getElementById('previous-status-btn');
        if (bookingStatusBtn) {
            bookingStatusBtn.addEventListener('click', () => this.openBookingStatus());
        }

        document.querySelectorAll('.book-room-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const roomType = e.target.closest('.book-room-btn').dataset.room;
                this.openBookingModalWithRoom(roomType);
            });
        });

        const closeBookingModal = document.getElementById('close-booking-modal');
        const closeVirtualTour = document.getElementById('close-virtual-tour');
        const closeBookingStatus = document.getElementById('close-booking-status');

        if (closeBookingModal) {
            closeBookingModal.addEventListener('click', () => {
                document.getElementById('booking-modal').classList.remove('active');
            });
        }

        if (closeVirtualTour) {
            closeVirtualTour.addEventListener('click', () => {
                document.getElementById('virtual-tour-modal').classList.remove('active');
                this.pauseAllVideos();
            });
        }

        if (closeBookingStatus) {
            closeBookingStatus.addEventListener('click', () => {
                document.getElementById('booking-status-modal').classList.remove('active');
            });
        }

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    const modal = overlay.closest('.booking-modal, .virtual-tour-modal, .booking-status-modal');
                    if (modal) {
                        modal.classList.remove('active');
                        if (modal.id === 'virtual-tour-modal') {
                            this.pauseAllVideos();
                        }
                    }
                }
            });
        });

        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
        }

        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        const searchBtn = document.getElementById('search-booking-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performBookingSearch());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const animatableElements = document.querySelectorAll(
            '.room-card, .advanced-amenity-card, .gallery-item, .contact-method'
        );

        animatableElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupAssistant() {
        const assistantFloat = document.getElementById('assistant-float');
        const assistantContainer = document.getElementById('assistant-container');
        const minimizeBtn = document.getElementById('minimize-assistant');
        const closeBtn = document.getElementById('close-assistant');

        if (assistantFloat) {
            assistantFloat.addEventListener('click', () => {
                if (assistantContainer) {
                    assistantContainer.style.display = 'flex';
                    assistantFloat.style.display = 'none';
                }
            });
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                if (assistantContainer) {
                    assistantContainer.style.display = 'none';
                    assistantFloat.style.display = 'flex';
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (assistantContainer) {
                    assistantContainer.style.display = 'none';
                    assistantFloat.style.display = 'flex';
                }
            });
        }
    }

    setupGallery() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const imageUrl = item.dataset.image;
                if (imageUrl) {
                    this.openLightbox(imageUrl);
                }
            });
        });
    }

    setupVirtualTour() {
        document.querySelectorAll('.tour-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.switchTourSection(section);
            });
        });
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        const checkinInput = document.getElementById('checkin-date');
        const checkoutInput = document.getElementById('checkout-date');

        if (checkinInput) checkinInput.min = today;
        if (checkoutInput) checkoutInput.min = today;

        if (checkinInput) {
            checkinInput.addEventListener('change', () => {
                if (checkoutInput) {
                    const checkinDate = new Date(checkinInput.value);
                    checkinDate.setDate(checkinDate.getDate() + 1);
                    checkoutInput.min = checkinDate.toISOString().split('T')[0];
                }
                this.calculateTotal();
            });
        }

        if (checkoutInput) {
            checkoutInput.addEventListener('change', () => {
                this.calculateTotal();
            });
        }

        const roomTypeSelect = document.getElementById('room-type');
        if (roomTypeSelect) {
            roomTypeSelect.addEventListener('change', () => {
                this.calculateTotal();
            });
        }
    }

    calculateTotal() {
        const checkinInput = document.getElementById('checkin-date');
        const checkoutInput = document.getElementById('checkout-date');
        const roomTypeSelect = document.getElementById('room-type');
        const totalDisplay = document.getElementById('total-amount');

        if (!checkinInput || !checkoutInput || !roomTypeSelect || !totalDisplay) return;

        const checkin = new Date(checkinInput.value);
        const checkout = new Date(checkoutInput.value);
        const roomType = roomTypeSelect.value;

        if (checkin && checkout && checkout > checkin && roomType) {
            const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
            const roomPrices = {
                'royal-chambers': 4999,
                'family-suite': 7499,
                'emperor-suite': 12999,
                'honeymoon-haven': 8999
            };

            const basePrice = roomPrices[roomType] || 0;
            const total = basePrice * nights;
            totalDisplay.textContent = `₹${total.toLocaleString()}`;
        } else {
            totalDisplay.textContent = '₹0';
        }
    }

    openBookingModal() {
        const modal = document.getElementById('booking-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    openBookingModalWithRoom(roomType) {
        this.openBookingModal();
        const roomSelect = document.getElementById('room-type');
        if (roomSelect) {
            roomSelect.value = roomType;
            this.calculateTotal();
        }
    }

    handleBookingSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const bookingData = Object.fromEntries(formData.entries());

        if (this.validateBookingData(bookingData)) {
            this.processBooking(bookingData);
        }
    }

    validateBookingData(data) {
        const required = ['guest-name', 'guest-email', 'guest-phone', 'room-type', 'checkin', 'checkout'];

        for (let field of required) {
            if (!data[field] || data[field].trim() === '') {
                this.showNotification(`⚠️ Please fill in ${field.replace('-', ' ')}`, 'error');
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data['guest-email'])) {
            this.showNotification('⚠️ Please enter a valid email address', 'error');
            return false;
        }

        const checkin = new Date(data.checkin);
        const checkout = new Date(data.checkout);
        const today = new Date();

        if (checkin < today) {
            this.showNotification('⚠️ Check-in date cannot be in the past', 'error');
            return false;
        }

        if (checkout <= checkin) {
            this.showNotification('⚠️ Check-out date must be after check-in date', 'error');
            return false;
        }

        return true;
    }

    processBooking(data) {
        this.showNotification('💳 Processing your royal booking...', 'info');

        const bookingId = this.generateBookingId();

        setTimeout(() => {
            const bookingDetails = {
                ...data,
                bookingId,
                timestamp: new Date().toISOString(),
                status: 'confirmed'
            };

            this.showBookingConfirmation(bookingDetails);
            this.closeAllModals();
            this.showNotification('✅ Booking confirmed successfully!', 'success');
        }, 2000);
    }

    generateBookingId() {
        const prefix = 'KSH2025';
        const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        return prefix + random;
    }

    showBookingConfirmation(details) {
        const roomNames = {
            'royal-chambers': 'Royal Chambers',
            'family-suite': 'Family Palace Suites',
            'emperor-suite': 'Emperor Suites',
            'honeymoon-haven': 'Honeymoon Haven'
        };

        const roomName = roomNames[details['room-type']] || 'Selected Room';
        const checkin = new Date(details.checkin).toDateString();
        const checkout = new Date(details.checkout).toDateString();

        alert(`🎉 BOOKING CONFIRMED! 🎉

Booking ID: ${details.bookingId}
Guest: ${details['guest-name']}
Room: ${roomName}
Check-in: ${checkin}
Check-out: ${checkout}
Total: ${document.getElementById('total-amount').textContent}

Thank you for choosing King Sukh Guest House!

📧 Confirmation sent to ${details['guest-email']}
📱 SMS sent to ${details['guest-phone']}

Contact us: +91 7502724515`);
    }

    openVirtualTour() {
        const modal = document.getElementById('virtual-tour-modal');
        if (modal) {
            modal.classList.add('active');
            this.startVideoTour();
        }
    }

    startVideoTour() {
        const activeVideo = document.querySelector('.tour-section.active video');
        if (activeVideo) {
            activeVideo.currentTime = 0;
        }
    }

    switchTourSection(sectionName) {
        this.pauseAllVideos();

        document.querySelectorAll('.tour-nav-btn').forEach(btn => {
            if (btn.dataset.section === sectionName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        document.querySelectorAll('.tour-section').forEach(section => {
            if (section.dataset.section === sectionName) {
                section.classList.add('active');
                const video = section.querySelector('video');
                if (video) {
                    video.currentTime = 0;
                }
            } else {
                section.classList.remove('active');
            }
        });
    }

    pauseAllVideos() {
        document.querySelectorAll('.tour-section video').forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }

    openBookingStatus() {
        const modal = document.getElementById('booking-status-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    performBookingSearch() {
        const searchInput = document.getElementById('booking-search-input');
        if (!searchInput) return;

        const searchValue = searchInput.value.trim();
        if (!searchValue) {
            this.showNotification('⚠️ Please enter booking ID or email', 'error');
            return;
        }

        this.showNotification('🔍 Searching for your booking...', 'info');

        setTimeout(() => {
            const isBookingId = searchValue.toUpperCase().startsWith('KSH');
            const isEmail = searchValue.includes('@');

            if (isBookingId || isEmail) {
                this.showBookingSearchResult(searchValue);
            } else {
                this.showNotification('❌ No booking found with this information', 'error');
            }
        }, 1500);
    }

    showBookingSearchResult(searchValue) {
        const result = `🔍 BOOKING FOUND!

Search: ${searchValue}
Booking ID: KSH2025123456
Guest: Sample Guest
Room: Royal Chambers
Status: ✅ CONFIRMED
Check-in: Dec 15, 2025
Check-out: Dec 18, 2025
Total: ₹16,497

📞 Need help? Call +91 7502724515`;

        alert(result);
        this.showNotification('✅ Booking found successfully!', 'success');
    }

    handleContactSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const contactData = Object.fromEntries(formData.entries());

        if (this.validateContactData(contactData)) {
            this.processContactForm(contactData);
        }
    }

    validateContactData(data) {
        const required = ['name', 'email', 'phone', 'subject', 'message'];

        for (let field of required) {
            if (!data[field] || data[field].trim() === '') {
                this.showNotification(`⚠️ Please fill in ${field}`, 'error');
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('⚠️ Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    processContactForm(data) {
        this.showNotification('📧 Sending your royal message...', 'info');

        setTimeout(() => {
            this.showNotification('✅ Message sent successfully! We\'ll respond within 2 hours.', 'success');
            document.getElementById('contact-form').reset();
        }, 1500);
    }

    openLightbox(imageUrl) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-modal';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${imageUrl}" alt="Gallery Image" class="lightbox-image">
                <button class="lightbox-close">&times;</button>
            </div>
        `;

        document.body.appendChild(lightbox);

        const closeBtn = lightbox.querySelector('.lightbox-close');
        const handleClose = () => {
            document.body.removeChild(lightbox);
        };

        closeBtn.addEventListener('click', handleClose);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                handleClose();
            }
        });
    }

    closeAllModals() {
        document.querySelectorAll('.booking-modal, .virtual-tour-modal, .booking-status-modal').forEach(modal => {
            modal.classList.remove('active');
        });

        this.pauseAllVideos();

        const lightboxes = document.querySelectorAll('.lightbox-modal');
        lightboxes.forEach(lightbox => {
            if (lightbox.parentNode) {
                lightbox.parentNode.removeChild(lightbox);
            }
        });
    }

    startAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const animatableElements = document.querySelectorAll(
            '.room-card, .advanced-amenity-card, .gallery-item, .contact-method'
        );

        animatableElements.forEach(el => {
            observer.observe(el);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        const closeBtn = notification.querySelector('.notification-close');
        const autoClose = () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        };

        closeBtn.addEventListener('click', autoClose);
        setTimeout(autoClose, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-circle'
        };
        return icons[type] || 'fa-info-circle';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KingSukhGuestHouse();
});

// Handle image loading errors
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'error-fallback';
        fallback.textContent = 'Image not available';
        e.target.parentNode.appendChild(fallback);
    }
}, true);
