// Article page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Get article ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));
    
    // Get article from sessionStorage or find by ID
    let currentPost = JSON.parse(sessionStorage.getItem('currentPost'));
    
    if (!currentPost || currentPost.id !== articleId) {
        currentPost = blogPosts.find(post => post.id === articleId);
    }
    
    if (currentPost) {
        displayArticle(currentPost);
        displayRelatedArticles(currentPost);
    } else {
        // Redirect to home if article not found
        window.location.href = 'index.html';
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
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
});

// Display article content
function displayArticle(post) {
    // Set page title
    document.title = `${post.title} - Vivahorizon`;
    
    // Format date
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Format category
    const formattedCategory = post.category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // Update article elements
    document.querySelector('.article-category').textContent = formattedCategory;
    document.querySelector('.article-date').textContent = formattedDate;
    document.querySelector('.article-title').textContent = post.title;
    document.querySelector('.author-name').textContent = post.author;
    
    const articleImage = document.querySelector('.article-image');
    articleImage.src = post.image;
    articleImage.alt = post.title;
    
    // Format content with proper paragraphs and support markdown-style formatting
    const contentElement = document.querySelector('.article-content');
    const paragraphs = post.content.split('\n').filter(p => p.trim());
    
    contentElement.innerHTML = paragraphs.map(paragraph => {
        paragraph = paragraph.trim();
        
        // Handle headers (** text **)
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
            const headerText = paragraph.slice(2, -2);
            return `<h3>${headerText}</h3>`;
        }
        // Handle numbered lists
        else if (paragraph.match(/^\d+\./)) {
            return `<p>${paragraph}</p>`;
        }
        // Handle bullet points
        else if (paragraph.startsWith('-')) {
            return `<ul><li>${paragraph.substring(1).trim()}</li></ul>`;
        }
        // Regular paragraphs with bold text support
        else {
            // Convert **text** to <strong>text</strong>
            paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return `<p>${paragraph}</p>`;
        }
    }).join('');
}

// Display related articles
function displayRelatedArticles(currentPost) {
    const relatedGrid = document.getElementById('relatedGrid');
    
    // Filter related articles (same category or random)
    const relatedPosts = blogPosts
        .filter(post => post.id !== currentPost.id)
        .filter(post => post.category === currentPost.category || Math.random() > 0.7)
        .slice(0, 3);
    
    relatedGrid.innerHTML = relatedPosts.map(post => `
        <div class="related-card" onclick="goToArticle(${post.id})">
            <img src="${post.image}" alt="${post.title}" class="related-image">
            <div class="related-content">
                <h3 class="related-title">${post.title}</h3>
                <p class="related-excerpt">${post.excerpt.substring(0, 100)}...</p>
            </div>
        </div>
    `).join('');
}

// Navigate to another article
function goToArticle(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
        sessionStorage.setItem('currentPost', JSON.stringify(post));
        window.location.href = `article.html?id=${postId}`;
    }
}

// Share functions
function shareOnFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function shareOnTwitter() {
    const url = window.location.href;
    const title = document.querySelector('.article-title').textContent;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
}

function shareOnLinkedIn() {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
}

function shareByEmail() {
    const url = window.location.href;
    const title = document.querySelector('.article-title').textContent;
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + url)}`;
}

// Add mobile menu toggle styles
const style = document.createElement('style');
style.textContent = `
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);