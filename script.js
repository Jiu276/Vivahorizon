// DOM Elements
const blogGrid = document.getElementById('blogGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const pagination = document.getElementById('pagination');
const backToTopBtn = document.getElementById('backToTop');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Pagination settings
const postsPerPage = 6;
let currentPage = 1;
let filteredPosts = [...blogPosts];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    sortPostsByDate();
    renderBlogPosts();
    setupEventListeners();
});

// Sort posts by date (newest first)
function sortPostsByDate() {
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredPosts = [...blogPosts];
}

// Render blog posts
function renderBlogPosts() {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    // Show loading skeleton
    showLoadingSkeleton();

    setTimeout(() => {
        blogGrid.innerHTML = '';

        if (postsToShow.length === 0) {
            blogGrid.innerHTML = '<div class="no-results">No articles found matching your criteria.</div>';
            pagination.innerHTML = '';
            return;
        }

        postsToShow.forEach(post => {
            const card = createBlogCard(post);
            blogGrid.appendChild(card);
        });

        renderPagination();
        animateCards();
    }, 300);
}

// Show loading skeleton
function showLoadingSkeleton() {
    blogGrid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'blog-card skeleton-card';
        skeleton.innerHTML = `
            <div class="skeleton skeleton-image"></div>
            <div class="blog-content">
                <div class="skeleton skeleton-category"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-meta"></div>
            </div>
        `;
        blogGrid.appendChild(skeleton);
    }
}

// Create blog card element
function createBlogCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.onclick = () => openArticle(post.id);

    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    card.innerHTML = `
        <div class="blog-image-wrapper">
            <img src="${post.image}" alt="${post.title}" class="blog-image" loading="lazy">
            <div class="blog-image-overlay">
                <span class="view-article">View Article</span>
            </div>
        </div>
        <div class="blog-content">
            <span class="blog-category">${formatCategory(post.category)}</span>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            <div class="blog-meta">
                <span class="blog-date">
                    <i class="far fa-calendar"></i>
                    ${formattedDate}
                </span>
                <a href="#" class="read-more" onclick="event.stopPropagation(); openArticle(${post.id})">
                    Read More
                </a>
            </div>
        </div>
    `;

    // Add hover sound effect (optional)
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });

    return card;
}

// Format category name
function formatCategory(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    pagination.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === currentPage ? 'active' : '';
            pageBtn.onclick = () => changePage(i);
            pagination.appendChild(pageBtn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 10px';
            pagination.appendChild(dots);
        }
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    pagination.appendChild(nextBtn);
}

// Change page
function changePage(page) {
    currentPage = page;
    renderBlogPosts();
    scrollToSection('blog');
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                             post.excerpt.toLowerCase().includes(searchTerm) ||
                             post.content.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || post.category === category;
        
        return matchesSearch && matchesCategory;
    });

    currentPage = 1;
    renderBlogPosts();
}

// Open article (in real app, this would navigate to article page)
function openArticle(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
        // Store the post in sessionStorage
        sessionStorage.setItem('currentPost', JSON.stringify(post));
        // Navigate to article page
        window.location.href = `article.html?id=${postId}`;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search and filter
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    categoryFilter.addEventListener('change', handleSearch);

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Back to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Animate cards on load
function animateCards() {
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Add no-results and skeleton styling
const style = document.createElement('style');
style.textContent = `
    .no-results {
        text-align: center;
        padding: 3rem;
        font-size: 1.2rem;
        color: var(--text-light);
        grid-column: 1 / -1;
        animation: fadeIn 0.5s ease;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    /* Skeleton Loading Styles */
    .skeleton-card {
        pointer-events: none;
    }
    
    .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 8px;
    }
    
    .skeleton-image {
        height: 220px;
        width: 100%;
        border-radius: 0;
    }
    
    .skeleton-category {
        width: 100px;
        height: 25px;
        margin-bottom: 0.8rem;
    }
    
    .skeleton-title {
        width: 80%;
        height: 30px;
        margin-bottom: 1rem;
    }
    
    .skeleton-text {
        width: 100%;
        height: 16px;
        margin-bottom: 0.5rem;
    }
    
    .skeleton-text:last-of-type {
        width: 70%;
    }
    
    .skeleton-meta {
        width: 60%;
        height: 20px;
        margin-top: 1rem;
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);