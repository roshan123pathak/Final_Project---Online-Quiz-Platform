document.addEventListener('DOMContentLoaded', function() {
    // Function to get random emoji for username
    function getRandomEmoji() {
        const emojis = ['👩‍💻', '👨‍💻', '🧙‍♂️', '🧠', '🚀', '🔍', '🎮', '🎯', '🧪', '🔬', '💡', '⚡', '🌟', '🦉', '🦊', '🐼'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    // Check if we're on the login page
    const isLoginPage = document.querySelector('.login-page') !== null;
    
    if (isLoginPage) {
        // Login page functionality
        const loginForm = document.getElementById('login-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                // Basic validation
                if (!username || !password) {
                    alert('Please enter both username and password');
                    return;
                }
                
                // Assign a random emoji to the user
                const userEmoji = getRandomEmoji();
                
                // Store the username in localStorage (in a real app, you'd use tokens)
                localStorage.setItem('quizMasterUser', username);
                localStorage.setItem('quizMasterUserEmoji', userEmoji);
                localStorage.setItem('quizMasterLoggedIn', 'true');
                localStorage.setItem('quizMasterIsGuest', 'false');
                
                // Redirect to the home page
                window.location.href = 'index.html';
            });
        }
        
        // Guest login functionality
        const guestLoginBtn = document.getElementById('guest-login');
        if (guestLoginBtn) {
            guestLoginBtn.addEventListener('click', function() {
                // Set guest status in localStorage with emoji
                const guestEmoji = getRandomEmoji();
                localStorage.setItem('quizMasterUser', 'Guest');
                localStorage.setItem('quizMasterUserEmoji', guestEmoji);
                localStorage.setItem('quizMasterLoggedIn', 'true');
                localStorage.setItem('quizMasterIsGuest', 'true');
                
                // Redirect to the home page
                window.location.href = 'index.html';
            });
        }

        // Google login
        const googleLoginBtn = document.getElementById('google-login');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', function() {
                console.log('Google login clicked');
                // Implement Google OAuth login
                alert('Google login will be implemented soon!');
                // You would typically redirect to Google's OAuth endpoint
                // window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?...'; // Add your OAuth parameters
            });
        }

        // Facebook login
        const facebookLoginBtn = document.getElementById('facebook-login');
        if (facebookLoginBtn) {
            facebookLoginBtn.addEventListener('click', function() {
                console.log('Facebook login clicked');
                // Implement Facebook OAuth login
                alert('Facebook login will be implemented soon!');
                // You would typically redirect to Facebook's OAuth endpoint
                // window.location.href = 'https://www.facebook.com/v13.0/dialog/oauth?...'; // Add your OAuth parameters
            });
        }

        // Signup link
        const signupLink = document.getElementById('signup-link');
        if (signupLink) {
            signupLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Signup clicked');
                // Redirect to signup page
                alert('Redirecting to signup page!');
                // window.location.href = 'signup.html'; // Uncomment when the signup page is ready
            });
        }
    } else {
        // Home page functionality
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('quizMasterLoggedIn') === 'true';
        
        if (!isLoggedIn) {
            // Redirect to login page if not logged in
            window.location.href = 'login.html';
        }
        
        // Display username with emoji
        const username = localStorage.getItem('quizMasterUser') || 'User';
        const userEmoji = localStorage.getItem('quizMasterUserEmoji') || '👤';
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.innerHTML = `<span class="user-emoji">${userEmoji}</span> ${username}`;
        }
        
        // Update profile avatar with the same emoji
        const profileAvatar = document.querySelector('.profile-avatar .emoji-avatar');
        if (profileAvatar) {
            profileAvatar.textContent = userEmoji;
        }
        
        // Check if user is guest and update UI accordingly
        const isGuest = localStorage.getItem('quizMasterIsGuest') === 'true';
        if (isGuest) {
            // You could customize UI elements for guests here
            // For example, hide certain features or show a guest badge
            const userNameElement = document.querySelector('.user-name');
            if (userNameElement) {
                userNameElement.innerHTML = `Welcome, <span id="username-display"><span class="user-emoji">${userEmoji}</span> Guest</span>! <span class="guest-badge">Guest Mode</span>`;
            }
        }
        
        // Logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Clear user data from localStorage
                localStorage.removeItem('quizMasterUser');
                localStorage.removeItem('quizMasterLoggedIn');
                localStorage.removeItem('quizMasterIsGuest');
                
                // Redirect to login page
                window.location.href = 'login.html';
            });
        }
        
        // Navigation Tab Selection
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');
        
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all tabs
                navItems.forEach(tab => tab.classList.remove('active'));
                
                // Hide all content sections
                contentSections.forEach(section => section.classList.add('hidden'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show the corresponding content section
                const tabTarget = this.querySelector('a').getAttribute('data-target');
                document.getElementById(tabTarget).classList.remove('hidden');
                
                // Load recent activity data if that tab is clicked
                if (tabTarget === 'recent-activity') {
                    loadRecentActivity();
                }
                
                // Handle testimonials visibility
                const testimonialsSection = document.querySelector('.testimonials-section');
                if (testimonialsSection) {
                    // Only show testimonials on the Available Quizzes tab (assuming it has 'quizzes' as data-target)
                    if (tabTarget === 'quizzes') {
                        testimonialsSection.style.display = 'block';
                    } else {
                        testimonialsSection.style.display = 'none';
                    }
                }
            });
        });

        // Initially hide testimonials if not on quizzes tab
        const testimonialsSection = document.querySelector('.testimonials-section');
        if (testimonialsSection) {
            const activeTab = document.querySelector('.nav-item.active a');
            if (activeTab && activeTab.getAttribute('data-target') !== 'quizzes') {
                testimonialsSection.style.display = 'none';
            }
        }
        
        // Function to load recent activity from localStorage
        function loadRecentActivity() {
            const recentActivityContainer = document.getElementById('activity-list');
            if (!recentActivityContainer) return;
            
            const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
            
            if (quizHistory.length === 0) {
                recentActivityContainer.innerHTML = '<div class="empty-state">No quiz attempts yet. Start a quiz to see your history here!</div>';
                return;
            }
            
            // Sort history by date (newest first)
            quizHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Clear the container
            recentActivityContainer.innerHTML = '';
            
            // Add each quiz attempt to the container
            quizHistory.forEach(quiz => {
                const date = new Date(quiz.date);
                const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
                const timeAgo = daysAgo === 0 ? 'Today' : 
                                daysAgo === 1 ? '1 day ago' : 
                                daysAgo < 7 ? `${daysAgo} days ago` :
                                daysAgo < 14 ? '1 week ago' :
                                `${Math.floor(daysAgo / 7)} weeks ago`;
                
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <div class="activity-info">
                        <h3 class="activity-title">${quiz.title}</h3>
                        <p class="activity-date">${timeAgo}</p>
                    </div>
                    <div class="activity-score">
                        ${quiz.score}/${quiz.total}
                    </div>
                    <button class="view-details-btn">View Details</button>
                `;
                
                recentActivityContainer.appendChild(activityItem);
            });
            
            // Add event listeners for view details buttons
            document.querySelectorAll('.view-details-btn').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    // Store the selected quiz result in localStorage
                    localStorage.setItem('currentQuizResult', JSON.stringify(quizHistory[index]));
                    // Navigate to the results page
                    window.location.href = 'results.html';
                });
            });
        }
        
        // Quiz Start Button Handlers
        const startButtons = document.querySelectorAll('.start-quiz-btn');
        
        startButtons.forEach(button => {
            button.addEventListener('click', function() {
                const quizCard = this.closest('.quiz-card');
                const quizTitle = quizCard.querySelector('.quiz-title').textContent;
                
                // Simple animation to show the quiz is starting
                this.textContent = 'Loading...';
                this.disabled = true;
                
                // Save the selected quiz data to localStorage
                const selectedQuiz = quizData[quizTitle] || [];
                if(selectedQuiz.length > 0) {
                    localStorage.setItem('currentQuiz', JSON.stringify({
                        title: quizTitle,
                        questions: selectedQuiz,
                        currentQuestion: 0,
                        userAnswers: Array(selectedQuiz.length).fill(null)
                    }));
                    
                    // Redirect to the quiz page
                    setTimeout(() => {
                        window.location.href = 'quiz.html';
                    }, 800);
                } else {
                    setTimeout(() => {
                        alert(`The "${quizTitle}" quiz is currently under development. Please try another quiz.`);
                        this.textContent = 'Start Quiz';
                        this.disabled = false;
                    }, 800);
                }
            });
        });
        
        // More Quizzes button functionality
        const moreQuizzesBtn = document.getElementById('more-quizzes');
        if (moreQuizzesBtn) {
            moreQuizzesBtn.addEventListener('click', function() {
                // Show search modal instead of alert
                showSearchModal();
            });
        }
        
        // Function to show the search modal with recommendations
        function showSearchModal() {
            // Create modal container
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'search-modal-overlay';
            
            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'search-modal-content';
            
            // Header with close button
            const modalHeader = document.createElement('div');
            modalHeader.className = 'search-modal-header';
            modalHeader.innerHTML = `
                <h2>Discover More Quizzes</h2>
                <button class="close-modal-btn">&times;</button>
            `;
            
            // Search input
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <div class="search-input-wrapper">
                    <input type="text" class="search-input" placeholder="Search for quiz topics...">
                    <span class="search-icon">🔍</span>
                </div>
            `;
            
            // Recommendations section
            const recommendationsContainer = document.createElement('div');
            recommendationsContainer.className = 'recommendations-container';
            
            // Trending topics section
            const trendingSection = document.createElement('div');
            trendingSection.className = 'recommendation-section';
            trendingSection.innerHTML = `
                <h3 class="recommendation-title">Trending Topics</h3>
                <ul class="recommendation-list trending-list">
                    <li class="recommendation-item">
                        <span class="recommendation-icon">🔥</span>
                        <span class="recommendation-text">Data Science</span>
                    </li>
                    <li class="recommendation-item">
                        <span class="recommendation-icon">🔥</span>
                        <span class="recommendation-text">Cloud Computing</span>
                    </li>
                    <li class="recommendation-item">
                        <span class="recommendation-icon">🔥</span>
                        <span class="recommendation-text">Blockchain Technology</span>
                    </li>
                    <li class="recommendation-item">
                        <span class="recommendation-icon">🔥</span>
                        <span class="recommendation-text">Quantum Computing</span>
                    </li>
                </ul>
            `;
            
            // New topics section
            const newTopicsSection = document.createElement('div');
            newTopicsSection.className = 'recommendation-section';
            newTopicsSection.innerHTML = `
                <h3 class="recommendation-title">New Topics</h3>
                <ul class="recommendation-list new-list">
                    <li class="recommendation-item">
                        <span class="recommendation-icon">🆕</span>
                        <span class="recommendation-text">DevOps Principles</span>
                    </li>
                    <li class="recommendation-item">
                        <span class="recommendation-icon">🆕</span>
                        <span class="recommendation-text">Augmented Reality</span>
                    </li>
                    <li class="recommendation-item">
                        <span class="recommendation-icon">🆕</span>
                        <span class="recommendation-text">Green Technology</span>
                    </li>
                    <li class="recommendation-item">
                        <span class="recommendation-icon">🆕</span>
                        <span class="recommendation-text">Internet of Things (IoT)</span>
                    </li>
                </ul>
            `;
            
            // Popular topics section
            const popularSection = document.createElement('div');
            popularSection.className = 'recommendation-section';
            popularSection.innerHTML = `
                <h3 class="recommendation-title">Popular Topics</h3>
                <ul class="recommendation-list popular-list">
                    <li class="recommendation-item">
                        <span class="recommendation-icon">⭐</span>
                        <span class="recommendation-text">Web3 Technologies</span>
                    </li>
                    <li class="recommendation-item">
                        <span class="recommendation-icon">⭐</span>
                        <span class="recommendation-text">Digital Marketing</span>
                    </li>
                    <li class="recommendation-item">
                        <span class="recommendation-icon">⭐</span>
                        <span class="recommendation-text">UX/UI Design</span>
                    </li>
                    <li class="recommendation-item">
                        <span class="recommendation-icon">⭐</span>
                        <span class="recommendation-text">Mobile Development</span>
                    </li>
                </ul>
            `;
            
            // Append sections to recommendations container
            recommendationsContainer.appendChild(trendingSection);
            recommendationsContainer.appendChild(newTopicsSection);
            recommendationsContainer.appendChild(popularSection);
            
            // Assemble the modal
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(searchContainer);
            modalContent.appendChild(recommendationsContainer);
            modalOverlay.appendChild(modalContent);
            
            // Add to document
            document.body.appendChild(modalOverlay);
            
            // Show modal with animation
            setTimeout(() => {
                modalOverlay.classList.add('active');
                modalContent.classList.add('active');
            }, 10);
            
            // Focus on input after animation
            setTimeout(() => {
                modalContent.querySelector('.search-input').focus();
            }, 300);
            
            // Event listeners
            
            // Close button
            modalContent.querySelector('.close-modal-btn').addEventListener('click', () => {
                closeSearchModal(modalOverlay, modalContent);
            });
            
            // Close when clicking outside
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closeSearchModal(modalOverlay, modalContent);
                }
            });
            
            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeSearchModal(modalOverlay, modalContent);
                }
            });
            
            // Search functionality
            const searchInput = modalContent.querySelector('.search-input');
            
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const allItems = modalContent.querySelectorAll('.recommendation-item');
                
                allItems.forEach(item => {
                    const text = item.querySelector('.recommendation-text').textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Check if each section has any visible items
                const sections = modalContent.querySelectorAll('.recommendation-section');
                sections.forEach(section => {
                    const visibleItems = section.querySelectorAll('.recommendation-item[style="display: flex;"]');
                    if (visibleItems.length === 0) {
                        section.querySelector('.recommendation-title').style.display = 'none';
                    } else {
                        section.querySelector('.recommendation-title').style.display = 'block';
                    }
                });
            });
            
            // Click on recommendation items
            const recommendationItems = modalContent.querySelectorAll('.recommendation-item');
            recommendationItems.forEach(item => {
                item.addEventListener('click', () => {
                    const topicName = item.querySelector('.recommendation-text').textContent;
                    alert(`The "${topicName}" quiz is currently under development. Check back soon!`);
                    closeSearchModal(modalOverlay, modalContent);
                });
            });
        }
        
        function closeSearchModal(overlay, content) {
            content.classList.remove('active');
            overlay.classList.remove('active');
            
            // Remove from DOM after animation
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }
        
        // Hover effects for quiz cards
        const quizCards = document.querySelectorAll('.quiz-card');
        
        quizCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Menu item functionality
        const settingsLink = document.querySelector('.dropdown-menu a[href="settings.html"]');
        const myScoresLink = document.querySelector('.dropdown-menu a[href="myscores.html"]');
        
        if (settingsLink) {
            settingsLink.addEventListener('click', function(e) {
                // Navigate to settings page
                window.location.href = 'settings.html';
            });
        }
        
        if (myScoresLink) {
            myScoresLink.addEventListener('click', function(e) {
                // Navigate to my scores page
                window.location.href = 'myscores.html';
            });
        }
    }

    // Settings page functionality
    if (document.querySelector('.settings-container')) {
        // Populate form with existing data
        const username = localStorage.getItem('quizMasterUser') || 'User';
        const userEmoji = localStorage.getItem('quizMasterUserEmoji') || '👤';
        
        // Set display name field
        const displayNameInput = document.getElementById('display-name');
        if (displayNameInput) {
            displayNameInput.value = username;
        }
        
        // Populate emoji grid
        const emojiGrid = document.getElementById('emoji-grid');
        if (emojiGrid) {
            const emojis = ['👩‍💻', '👨‍💻', '🧙‍♂️', '🧠', '🚀', '🔍', '🎮', '🎯', '🧪', '🔬', '💡', '⚡', '🌟', '🦉', '🦊', '🐼', '🐧', '🐸', '🦁', '🐱', '🐶', '🦄', '👑', '🌈'];
            
            emojis.forEach(emoji => {
                const emojiItem = document.createElement('div');
                emojiItem.className = 'emoji-item';
                if (emoji === userEmoji) {
                    emojiItem.classList.add('selected');
                }
                emojiItem.textContent = emoji;
                
                emojiItem.addEventListener('click', function() {
                    // Remove selected class from all emoji items
                    document.querySelectorAll('.emoji-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked item
                    this.classList.add('selected');
                });
                
                emojiGrid.appendChild(emojiItem);
            });
        }
        
        // Save profile button functionality
        const saveProfileBtn = document.getElementById('save-profile');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', function() {
                const newDisplayName = displayNameInput.value.trim();
                const selectedEmoji = document.querySelector('.emoji-item.selected')?.textContent || userEmoji;
                
                if (newDisplayName) {
                    localStorage.setItem('quizMasterUser', newDisplayName);
                    localStorage.setItem('quizMasterUserEmoji', selectedEmoji);
                    
                    // Show success message
                    alert('Profile settings saved successfully!');
                } else {
                    alert('Please enter a display name.');
                }
            });
        }
        
        // Save preferences button functionality
        const savePreferencesBtn = document.getElementById('save-preferences');
        if (savePreferencesBtn) {
            savePreferencesBtn.addEventListener('click', function() {
                const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
                const soundEffects = document.getElementById('sound-effects').checked;
                const animationEffects = document.getElementById('animation-effects').checked;
                const language = document.getElementById('language').value;
                
                // Save preferences to localStorage
                localStorage.setItem('quizMasterPreferences', JSON.stringify({
                    difficulty,
                    soundEffects,
                    animationEffects,
                    language
                }));
                
                // Show success message
                alert('Preferences saved successfully!');
            });
        }
        
        // Change password button
        const changePasswordBtn = document.getElementById('change-password');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', function() {
                alert('This feature will be available in a future update!');
            });
        }
        
        // Delete account button
        const deleteAccountBtn = document.getElementById('delete-account');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', function() {
                const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
                
                if (confirmation) {
                    // Clear all localStorage data
                    localStorage.clear();
                    
                    // Redirect to login page
                    window.location.href = 'login.html';
                }
            });
        }
    }
    
    // My Scores page functionality
    if (document.querySelector('.scores-container')) {
        // Set username with emoji
        const username = localStorage.getItem('quizMasterUser') || 'User';
        const userEmoji = localStorage.getItem('quizMasterUserEmoji') || '👤';
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.innerHTML = `<span class="user-emoji">${userEmoji}</span> ${username}`;
        }
        
        // Load quiz history data
        const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        
        // Update stats overview
        const totalQuizzesEl = document.getElementById('total-quizzes');
        const averageScoreEl = document.getElementById('average-score');
        const highestScoreEl = document.getElementById('highest-score');
        const totalCorrectEl = document.getElementById('total-correct');
        const scoreList = document.getElementById('score-list');
        const noScoresMessage = document.getElementById('no-scores-message');
        
        if (quizHistory.length === 0) {
            // Show empty state if no quiz history
            if (noScoresMessage) noScoresMessage.style.display = 'block';
            if (scoreList) scoreList.style.display = 'none';
            return;
        } else {
            // Hide empty state and show score list
            if (noScoresMessage) noScoresMessage.style.display = 'none';
            if (scoreList) scoreList.style.display = 'block';
        }
        
        // Calculate stats
        const totalQuizzes = quizHistory.length;
        let totalScore = 0;
        let highestScore = 0;
        let totalCorrectAnswers = 0;
        
        quizHistory.forEach(quiz => {
            const score = (quiz.score / quiz.total) * 100;
            totalScore += score;
            if (score > highestScore) {
                highestScore = score;
            }
            totalCorrectAnswers += quiz.score;
        });
        
        const averageScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;
        
        // Update DOM elements
        if (totalQuizzesEl) totalQuizzesEl.textContent = totalQuizzes;
        if (averageScoreEl) averageScoreEl.textContent = Math.round(averageScore) + '%';
        if (highestScoreEl) highestScoreEl.textContent = Math.round(highestScore) + '%';
        if (totalCorrectEl) totalCorrectEl.textContent = totalCorrectAnswers;
        
        // Fill score list
        if (scoreList) {
            // Sort by date (newest first)
            quizHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Generate score items
            quizHistory.forEach(quiz => {
                const scorePercentage = Math.round((quiz.score / quiz.total) * 100);
                const date = new Date(quiz.date);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                
                const scoreItem = document.createElement('div');
                scoreItem.className = 'score-item';
                scoreItem.innerHTML = `
                    <div class="score-date">${formattedDate}</div>
                    <div class="score-title">${quiz.title}</div>
                    <div class="score-value">${quiz.score}/${quiz.total} (${scorePercentage}%)</div>
                    <div class="score-actions">
                        <button class="score-btn view">View Details</button>
                    </div>
                `;
                
                scoreList.appendChild(scoreItem);
            });
            
            // Add event listeners for view details buttons
            document.querySelectorAll('.score-btn.view').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    // Store the selected result and navigate to results page
                    localStorage.setItem('currentQuizResult', JSON.stringify(quizHistory[index]));
                    window.location.href = 'results.html';
                });
            });
        }
        
        // Filter functionality
        const filterDropdown = document.getElementById('filter-scores');
        if (filterDropdown) {
            filterDropdown.addEventListener('change', function() {
                const filter = this.value;
                let filteredHistory = [...quizHistory];
                
                // Apply filter
                switch (filter) {
                    case 'recent':
                        filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
                        break;
                    case 'highest':
                        filteredHistory.sort((a, b) => {
                            const scoreA = (a.score / a.total) * 100;
                            const scoreB = (b.score / b.total) * 100;
                            return scoreB - scoreA;
                        });
                        break;
                    case 'lowest':
                        filteredHistory.sort((a, b) => {
                            const scoreA = (a.score / a.total) * 100;
                            const scoreB = (b.score / b.total) * 100;
                            return scoreA - scoreB;
                        });
                        break;
                    default:
                        // Default is 'all', sorted by recent
                        filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
                }
                
                // Clear current list
                scoreList.innerHTML = '';
                
                // Repopulate with filtered data
                filteredHistory.forEach(quiz => {
                    const scorePercentage = Math.round((quiz.score / quiz.total) * 100);
                    const date = new Date(quiz.date);
                    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                    
                    const scoreItem = document.createElement('div');
                    scoreItem.className = 'score-item';
                    scoreItem.innerHTML = `
                        <div class="score-date">${formattedDate}</div>
                        <div class="score-title">${quiz.title}</div>
                        <div class="score-value">${quiz.score}/${quiz.total} (${scorePercentage}%)</div>
                        <div class="score-actions">
                            <button class="score-btn view">View Details</button>
                        </div>
                    `;
                    
                    scoreList.appendChild(scoreItem);
                });
                
                // Re-add event listeners
                document.querySelectorAll('.score-btn.view').forEach((btn, index) => {
                    btn.addEventListener('click', () => {
                        localStorage.setItem('currentQuizResult', JSON.stringify(filteredHistory[index]));
                        window.location.href = 'results.html';
                    });
                });
            });
        }
    }
});

// Sample quiz questions for different categories
const quizData = {
    "General Knowledge": [
        {
            question: "Which is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"],
            correctAnswer: "Pacific Ocean"
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Jupiter", "Mars", "Saturn"],
            correctAnswer: "Mars"
        },
        {
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            correctAnswer: "William Shakespeare"
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correctAnswer: "Au"
        },
        {
            question: "What is the capital of Japan?",
            options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
            correctAnswer: "Tokyo"
        },
        {
            question: "Which of these is not a primary color?",
            options: ["Red", "Blue", "Yellow", "Green"],
            correctAnswer: "Green"
        },
        {
            question: "How many continents are there in the world?",
            options: ["5", "6", "7", "8"],
            correctAnswer: "7"
        },
        {
            question: "What is the smallest country in the world?",
            options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
            correctAnswer: "Vatican City"
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            correctAnswer: "Leonardo da Vinci"
        },
        {
            question: "Which element has the chemical symbol 'O'?",
            options: ["Osmium", "Oxygen", "Oganesson", "Oxide"],
            correctAnswer: "Oxygen"
        }
    ],
    "Science Quiz": [
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correctAnswer: "Au"
        },
        {
            question: "Which of these is NOT a state of matter?",
            options: ["Solid", "Liquid", "Gas", "Element"],
            correctAnswer: "Element"
        },
        {
            question: "What is the largest organ in the human body?",
            options: ["Brain", "Liver", "Skin", "Heart"],
            correctAnswer: "Skin"
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Platinum", "Diamond", "Quartz", "Titanium"],
            correctAnswer: "Diamond"
        },
        {
            question: "Which planet has the most moons?",
            options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
            correctAnswer: "Saturn"
        },
        {
            question: "What is the speed of light in a vacuum?",
            options: ["300,000 km/s", "150,000 km/s", "199,792 km/s", "299,792 km/s"],
            correctAnswer: "299,792 km/s"
        },
        {
            question: "Which of these elements is a noble gas?",
            options: ["Nitrogen", "Chlorine", "Neon", "Calcium"],
            correctAnswer: "Neon"
        },
        {
            question: "What is the process by which plants make their own food called?",
            options: ["Photosynthesis", "Respiration", "Fermentation", "Digestion"],
            correctAnswer: "Photosynthesis"
        },
        {
            question: "What is the smallest unit of matter?",
            options: ["Atom", "Molecule", "Electron", "Quark"],
            correctAnswer: "Quark"
        },
        {
            question: "Which vitamin is produced when skin is exposed to sunlight?",
            options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
            correctAnswer: "Vitamin D"
        }
    ],
    "History Trivia": [
        {
            question: "In which year did World War II end?",
            options: ["1943", "1945", "1947", "1950"],
            correctAnswer: "1945"
        },
        {
            question: "Who was the first President of the United States?",
            options: ["Thomas Jefferson", "John Adams", "George Washington", "Abraham Lincoln"],
            correctAnswer: "George Washington"
        },
        {
            question: "Which ancient civilization built the pyramids of Giza?",
            options: ["Romans", "Greeks", "Egyptians", "Mayans"],
            correctAnswer: "Egyptians"
        },
        {
            question: "Who was the first woman to fly solo across the Atlantic Ocean?",
            options: ["Amelia Earhart", "Bessie Coleman", "Sally Ride", "Valentina Tereshkova"],
            correctAnswer: "Amelia Earhart"
        },
        {
            question: "In which year did the Berlin Wall fall?",
            options: ["1987", "1989", "1991", "1993"],
            correctAnswer: "1989"
        },
        {
            question: "Which famous ship sank on its maiden voyage in 1912?",
            options: ["Lusitania", "Titanic", "Britannic", "Queen Mary"],
            correctAnswer: "Titanic"
        },
        {
            question: "Who was the leader of the Soviet Union during the Cuban Missile Crisis?",
            options: ["Joseph Stalin", "Leonid Brezhnev", "Nikita Khrushchev", "Vladimir Lenin"],
            correctAnswer: "Nikita Khrushchev"
        },
        {
            question: "Which civilization is known for creating the Machu Picchu complex?",
            options: ["Aztec", "Maya", "Inca", "Olmec"],
            correctAnswer: "Inca"
        },
        {
            question: "Who wrote 'The Communist Manifesto'?",
            options: ["Vladimir Lenin", "Joseph Stalin", "Karl Marx and Friedrich Engels", "Leon Trotsky"],
            correctAnswer: "Karl Marx and Friedrich Engels"
        },
        {
            question: "In which year did the United States declare independence?",
            options: ["1776", "1781", "1789", "1798"],
            correctAnswer: "1776"
        }
    ],
    "Cyber Security": [
        {
            question: "What is phishing?",
            options: [
                "A fishing technique used by hackers",
                "A type of computer virus",
                "A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity",
                "A method to secure wireless networks"
            ],
            correctAnswer: "A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity"
        },
        {
            question: "What does SSL stand for?",
            options: ["Secure Socket Layer", "System Security Link", "Safe Server Login", "Systematic Service Layer"],
            correctAnswer: "Secure Socket Layer"
        },
        {
            question: "Which of these is NOT a common type of cyber attack?",
            options: ["DDoS", "SQL Injection", "Cross-site Scripting", "Data Amplification"],
            correctAnswer: "Data Amplification"
        },
        {
            question: "What is a firewall?",
            options: [
                "A physical barrier to prevent computer theft",
                "Software that protects against malware",
                "A network security system that monitors and controls incoming and outgoing network traffic",
                "A backup system for data recovery"
            ],
            correctAnswer: "A network security system that monitors and controls incoming and outgoing network traffic"
        },
        {
            question: "What is two-factor authentication?",
            options: [
                "Using two passwords for login",
                "A security process in which users provide two different authentication factors",
                "Requiring two people to approve a login",
                "Using two different devices for login"
            ],
            correctAnswer: "A security process in which users provide two different authentication factors"
        },
        {
            question: "What is a zero-day vulnerability?",
            options: [
                "A vulnerability that exists for zero days",
                "A vulnerability that is impossible to exploit",
                "A software vulnerability unknown to those who should patch it",
                "A vulnerability that can be fixed in zero days"
            ],
            correctAnswer: "A software vulnerability unknown to those who should patch it"
        },
        {
            question: "What is social engineering in cybersecurity?",
            options: [
                "Using AI to detect threats",
                "Psychological manipulation to trick users into revealing information",
                "Creating social networks securely",
                "Engineering social platforms to be secure"
            ],
            correctAnswer: "Psychological manipulation to trick users into revealing information"
        },
        {
            question: "What is ransomware?",
            options: [
                "Software that rewards users for finding vulnerabilities",
                "Malicious software that blocks access to data until a ransom is paid",
                "A type of antivirus software",
                "Software that randomly tests network security"
            ],
            correctAnswer: "Malicious software that blocks access to data until a ransom is paid"
        },
        {
            question: "What is a VPN used for?",
            options: [
                "Virus Protection Network",
                "To speed up internet connections",
                "To provide a secure, encrypted connection over a less secure network",
                "To block all incoming network connections"
            ],
            correctAnswer: "To provide a secure, encrypted connection over a less secure network"
        },
        {
            question: "What does 'HTTPS' stand for?",
            options: [
                "Hypertext Transfer Protocol Secure",
                "High Transfer Protocol System",
                "Hypertext Transmission Protocol Standard",
                "Hypertext Transfer Protocol System"
            ],
            correctAnswer: "Hypertext Transfer Protocol Secure"
        }
    ],
    "Artificial Intelligence": [
        {
            question: "Who is considered the 'father of artificial intelligence'?",
            options: ["Alan Turing", "John McCarthy", "Marvin Minsky", "Herbert Simon"],
            correctAnswer: "John McCarthy"
        },
        {
            question: "Which of these is an example of a neural network architecture?",
            options: ["JSON", "REST", "CNN", "SQL"],
            correctAnswer: "CNN"
        },
        {
            question: "What is the Turing Test used to determine?",
            options: [
                "Computer processing speed", 
                "A machine's ability to exhibit intelligent behavior equivalent to a human", 
                "The security of an encryption algorithm",
                "The efficiency of a sorting algorithm"
            ],
            correctAnswer: "A machine's ability to exhibit intelligent behavior equivalent to a human"
        },
        {
            question: "What is machine learning?",
            options: [
                "A type of artificial intelligence that allows software applications to become more accurate in predicting outcomes without being explicitly programmed",
                "A method to teach machines to perform tasks",
                "A way to make machines learn human behavior",
                "A process to create new machines"
            ],
            correctAnswer: "A type of artificial intelligence that allows software applications to become more accurate in predicting outcomes without being explicitly programmed"
        },
        {
            question: "Which of these is a common application of AI?",
            options: [
                "Web development", 
                "Mobile app development", 
                "Natural language processing", 
                "Database management"
            ],
            correctAnswer: "Natural language processing"
        },
        {
            question: "What is deep learning?",
            options: [
                "A subset of machine learning involving neural networks with three or more layers", 
                "A method to teach machines to think deeply", 
                "A process to create deep neural networks",
                "A way to make machines learn deeply"
            ],
            correctAnswer: "A subset of machine learning involving neural networks with three or more layers"
        },
        {
            question: "Which of these is a popular deep learning framework?",
            options: ["TensorFlow", "React", "Angular", "Vue"],
            correctAnswer: "TensorFlow"
        },
        {
            question: "What is reinforcement learning?",
            options: [
                "A type of machine learning where an agent learns to make decisions by taking actions in an environment to maximize cumulative reward", 
                "A method to reinforce learning in machines", 
                "A process to create strong AI",
                "A way to make machines learn by reinforcement"
            ],
            correctAnswer: "A type of machine learning where an agent learns to make decisions by taking actions in an environment to maximize cumulative reward"
        },
        {
            question: "What is a chatbot?",
            options: [
                "A robot that chats with humans", 
                "A software application used to conduct an online chat conversation via text or text-to-speech", 
                "A machine that talks to humans",
                "A process to create chat applications"
            ],
            correctAnswer: "A software application used to conduct an online chat conversation via text or text-to-speech"
        },
        {
            question: "What is the goal of computer vision?",
            options: [
                "To enable computers to see and interpret visual information", 
                "To create visual effects in computers", 
                "To develop new computer screens",
                "To improve computer graphics"
            ],
            correctAnswer: "To enable computers to see and interpret visual information"
        }
    ],
    "Machine Learning": [
        {
            question: "Which algorithm is used for classification problems?",
            options: ["K-means", "Linear Regression", "Decision Trees", "Principal Component Analysis"],
            correctAnswer: "Decision Trees"
        },
        {
            question: "What does the term 'overfitting' refer to in machine learning?",
            options: [
                "When a model performs well on training data but poorly on new data", 
                "When a model has too many input features", 
                "When the learning rate is too high",
                "When the dataset is too small"
            ],
            correctAnswer: "When a model performs well on training data but poorly on new data"
        },
        {
            question: "Which of these is NOT a type of machine learning?",
            options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Determinate Learning"],
            correctAnswer: "Determinate Learning"
        },
        {
            question: "What is the primary goal of the SVM algorithm?",
            options: [
                "To find the largest margin between classes", 
                "To minimize computational complexity", 
                "To maximize the number of features",
                "To reduce dimensionality"
            ],
            correctAnswer: "To find the largest margin between classes"
        },
        {
            question: "What is a neural network?",
            options: [
                "A network of neurons in the brain", 
                "A series of algorithms that attempt to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates", 
                "A network of computers",
                "A process to create new networks"
            ],
            correctAnswer: "A series of algorithms that attempt to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates"
        },
        {
            question: "What is a decision tree?",
            options: [
                "A tree that makes decisions", 
                "A decision support tool that uses a tree-like model of decisions and their possible consequences", 
                "A process to create new decisions",
                "A way to make decisions in a tree structure"
            ],
            correctAnswer: "A decision support tool that uses a tree-like model of decisions and their possible consequences"
        },
        {
            question: "What is a random forest?",
            options: [
                "A forest that is random", 
                "An ensemble learning method for classification, regression, and other tasks that operates by constructing a multitude of decision trees at training time", 
                "A process to create random forests",
                "A way to make random decisions in a forest"
            ],
            correctAnswer: "An ensemble learning method for classification, regression, and other tasks that operates by constructing a multitude of decision trees at training time"
        },
        {
            question: "What is a support vector machine?",
            options: [
                "A machine that supports vectors", 
                "A supervised learning model with associated learning algorithms that analyze data for classification and regression analysis", 
                "A process to create support vectors",
                "A way to support machines with vectors"
            ],
            correctAnswer: "A supervised learning model with associated learning algorithms that analyze data for classification and regression analysis"
        },
        {
            question: "What is a k-nearest neighbor algorithm?",
            options: [
                "An algorithm that finds the k-nearest neighbors", 
                "A non-parametric method used for classification and regression", 
                "A process to create k-nearest neighbors",
                "A way to find neighbors in a k-nearest manner"
            ],
            correctAnswer: "A non-parametric method used for classification and regression"
        },
        {
            question: "What is a gradient boosting algorithm?",
            options: [
                "An algorithm that boosts gradients", 
                "A machine learning technique for regression and classification problems, which produces a prediction model in the form of an ensemble of weak prediction models", 
                "A process to create gradient boosting",
                "A way to boost gradients in an algorithm"
            ],
            correctAnswer: "A machine learning technique for regression and classification problems, which produces a prediction model in the form of an ensemble of weak prediction models"
        }
    ],
    "Data Structures": [
        {
            question: "What is the time complexity for searching in a balanced binary search tree?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: "O(log n)"
        },
        {
            question: "Which data structure operates on the LIFO principle?",
            options: ["Queue", "Stack", "Linked List", "Array"],
            correctAnswer: "Stack"
        },
        {
            question: "Which of these is NOT a linear data structure?",
            options: ["Array", "Linked List", "Queue", "Tree"],
            correctAnswer: "Tree"
        },
        {
            question: "What is a linked list?",
            options: [
                "A list that is linked", 
                "A linear data structure in which elements are not stored at contiguous memory locations", 
                "A process to create linked lists",
                "A way to link lists together"
            ],
            correctAnswer: "A linear data structure in which elements are not stored at contiguous memory locations"
        },
        {
            question: "What is a binary tree?",
            options: [
                "A tree with binary nodes", 
                "A tree data structure in which each node has at most two children", 
                "A process to create binary trees",
                "A way to make trees binary"
            ],
            correctAnswer: "A tree data structure in which each node has at most two children"
        },
        {
            question: "What is a hash table?",
            options: [
                "A table that hashes", 
                "A data structure that implements an associative array abstract data type, a structure that can map keys to values", 
                "A process to create hash tables",
                "A way to hash tables together"
            ],
            correctAnswer: "A data structure that implements an associative array abstract data type, a structure that can map keys to values"
        },
        {
            question: "What is a graph?",
            options: [
                "A visual representation of data", 
                "A data structure that consists of a finite set of nodes (or vertices) and a set of edges connecting them", 
                "A process to create graphs",
                "A way to graph data together"
            ],
            correctAnswer: "A data structure that consists of a finite set of nodes (or vertices) and a set of edges connecting them"
        },
        {
            question: "What is a queue?",
            options: [
                "A line of people", 
                "A linear data structure that follows the FIFO (First In First Out) principle", 
                "A process to create queues",
                "A way to queue data together"
            ],
            correctAnswer: "A linear data structure that follows the FIFO (First In First Out) principle"
        },
        {
            question: "What is a stack?",
            options: [
                "A pile of objects", 
                "A linear data structure that follows the LIFO (Last In First Out) principle", 
                "A process to create stacks",
                "A way to stack data together"
            ],
            correctAnswer: "A linear data structure that follows the LIFO (Last In First Out) principle"
        },
        {
            question: "What is a tree?",
            options: [
                "A plant with leaves", 
                "A hierarchical data structure that consists of nodes with a parent-child relationship", 
                "A process to create trees",
                "A way to tree data together"
            ],
            correctAnswer: "A hierarchical data structure that consists of nodes with a parent-child relationship"
        }
    ],
    "Web Development": [
        {
            question: "Which of these is NOT a frontend JavaScript framework?",
            options: ["React", "Angular", "Vue", "Django"],
            correctAnswer: "Django"
        },
        {
            question: "What does CSS stand for?",
            options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
            correctAnswer: "Cascading Style Sheets"
        },
        {
            question: "Which HTTP method is used to update a resource?",
            options: ["GET", "POST", "PUT", "DELETE"],
            correctAnswer: "PUT"
        },
        {
            question: "What is HTML?",
            options: [
                "A programming language", 
                "A markup language for creating web pages", 
                "A database management system",
                "A process to create web pages"
            ],
            correctAnswer: "A markup language for creating web pages"
        },
        {
            question: "What is JavaScript?",
            options: [
                "A programming language", 
                "A markup language", 
                "A database management system",
                "A process to create web pages"
            ],
            correctAnswer: "A programming language"
        },
        {
            question: "What is a web server?",
            options: [
                "A server that serves web pages", 
                "A computer that stores and delivers web pages to clients", 
                "A process to create web servers",
                "A way to serve web pages"
            ],
            correctAnswer: "A computer that stores and delivers web pages to clients"
        },
        {
            question: "What is a database?",
            options: [
                "A collection of data", 
                "A structured set of data held in a computer", 
                "A process to create databases",
                "A way to store data"
            ],
            correctAnswer: "A structured set of data held in a computer"
        },
        {
            question: "What is a URL?",
            options: [
                "A web address", 
                "A Uniform Resource Locator", 
                "A process to create URLs",
                "A way to locate resources"
            ],
            correctAnswer: "A Uniform Resource Locator"
        },
        {
            question: "What is a domain name?",
            options: [
                "A name that identifies a website", 
                "A process to create domain names", 
                "A way to name domains",
                "A way to identify websites"
            ],
            correctAnswer: "A name that identifies a website"
        },
        {
            question: "What is a web browser?",
            options: [
                "A software application for accessing information on the World Wide Web", 
                "A process to create web browsers", 
                "A way to browse the web",
                "A way to access information"
            ],
            correctAnswer: "A software application for accessing information on the World Wide Web"
        }
    ],
    "Programming Languages": [
        {
            question: "Which programming language was created by James Gosling at Sun Microsystems?",
            options: ["Python", "Java", "C++", "Ruby"],
            correctAnswer: "Java"
        },
        {
            question: "Which of the following is a functional programming language?",
            options: ["C#", "Haskell", "Go", "PHP"],
            correctAnswer: "Haskell"
        },
        {
            question: "Which programming language is commonly used for iOS app development?",
            options: ["Swift", "Kotlin", "C#", "JavaScript"],
            correctAnswer: "Swift"
        },
        {
            question: "What is Python?",
            options: [
                "A programming language", 
                "A markup language", 
                "A database management system",
                "A process to create web pages"
            ],
            correctAnswer: "A programming language"
        },
        {
            question: "What is Java?",
            options: [
                "A programming language", 
                "A markup language", 
                "A database management system",
                "A process to create web pages"
            ],
            correctAnswer: "A programming language"
        },
        {
            question: "What is C++?",
            options: [
                "A programming language", 
                "A markup language", 
                "A database management system",
                "A process to create web pages"
            ],
            correctAnswer: "A programming language"
        },
        {
            question: "What is JavaScript?",
            options: [
                "A programming language", 
                "A markup language", 
                "A database management system",
                "A process to create web pages"
            ],
            correctAnswer: "A programming language"
        },
        {
            question: "What is PHP?",
            options: [
                "A programming language", 
                "A markup language", 
                "A database management system",
                "A process to create web pages"
            ],
            correctAnswer: "A programming language"
        },
        {
            question: "What is Ruby?",
            options: [
                "A programming language", 
                "A markup language", 
                "A database management system",
                "A process to create web pages"
            ],
            correctAnswer: "A programming language"
        },
        {
            question: "What is Go?",
            options: [
                "A programming language", 
                "A markup language", 
                "A database management system",
                "A process to create web pages"
            ],
            correctAnswer: "A programming language"
        }
    ]
};

// Quiz page functionality
if (document.querySelector('.quiz-page')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Load quiz data
        const quizData = JSON.parse(localStorage.getItem('currentQuiz'));
        
        if (!quizData) {
            window.location.href = 'index.html';
            return;
        }
        
        const quizTitle = document.getElementById('quiz-title');
        const currentQuestionEl = document.getElementById('current-question');
        const totalQuestionsEl = document.getElementById('total-questions');
        const progressBar = document.getElementById('quiz-progress-bar');
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.querySelector('.options-container');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const timerEl = document.getElementById('timer-value');
        
        let currentQuestionIndex = quizData.currentQuestion;
        let timeRemaining = 30; // Default 30 seconds per question
        let timerInterval;
        let isProcessingAnswer = false; // Flag to prevent multiple answer submissions
        let hasAnsweredIncorrectly = false; // Flag to track if the user has already made an incorrect attempt
        
        // Initialize the quiz
        function initQuiz() {
            quizTitle.textContent = quizData.title + " Quiz";
            totalQuestionsEl.textContent = quizData.questions.length;
            loadQuestion(currentQuestionIndex);
            updateUI();
            
            // Event listeners for navigation buttons
            prevBtn.addEventListener('click', goToPrevQuestion);
            nextBtn.addEventListener('click', goToNextQuestion);
        }
        
        function loadQuestion(index) {
            const question = quizData.questions[index];
            questionText.textContent = question.question;
            
            // Reset the incorrect answer flag
            hasAnsweredIncorrectly = false;
            
            // Clear existing options
            optionsContainer.innerHTML = '';
            
            // Add options
            const optionLabels = ['A', 'B', 'C', 'D'];
            question.options.forEach((option, i) => {
                const optionEl = document.createElement('div');
                optionEl.className = 'option-item';
                optionEl.dataset.option = optionLabels[i];
                
                // Check if this option was previously selected
                if(quizData.userAnswers[index] === option) {
                    optionEl.classList.add('selected');
                }
                
                optionEl.innerHTML = `
                    <div class="option-label">${optionLabels[i]}</div>
                    <div class="option-text">${option}</div>
                `;
                
                optionEl.addEventListener('click', function() {
                    if (isProcessingAnswer) return; // Prevent clicking during animation
                    
                    const selectedOption = option;
                    const isCorrect = selectedOption === question.correctAnswer;
                    
                    // If user has already answered incorrectly once on this question, don't allow another attempt
                    if (!isCorrect && hasAnsweredIncorrectly) {
                        return;
                    }
                    
                    // Apply visual feedback
                    selectOption(selectedOption, isCorrect);
                    
                    // Show feedback animation
                    showFeedbackAnimation(isCorrect);
                    
                    // If answer is correct, show enhanced celebration
                    if (isCorrect) {
                        showEnhancedCelebration();
                    }
                    
                    // Save the answer regardless of correctness
                    quizData.userAnswers[currentQuestionIndex] = selectedOption;
                    localStorage.setItem('currentQuiz', JSON.stringify(quizData));
                    
                    // Set processing flag to prevent multiple clicks
                    isProcessingAnswer = true;
                    
                    // Auto-progress to next question for both correct and incorrect answers
                    // but with different delays
                    if (currentQuestionIndex < quizData.questions.length - 1) {
                        const delay = isCorrect ? 2000 : 1500; // Longer delay for correct answers to show celebration
                        
                        // If answer is incorrect, mark that they've used their chance
                        if (!isCorrect) {
                            hasAnsweredIncorrectly = true;
                        }
                        
                        setTimeout(() => {
                            goToNextQuestion();
                            isProcessingAnswer = false;
                        }, delay);
                    } else {
                        // If it's the last question, finish the quiz after showing animation
                        setTimeout(() => {
                            finishQuiz();
                        }, isCorrect ? 2000 : 1500);
                    }
                });
                
                optionsContainer.appendChild(optionEl);
            });
            
            // Set the time limit based on quiz difficulty
            getDifficultyTimeLimit();
            
            // Start timer
            startTimer();
        }
        
        function getDifficultyTimeLimit() {
            // Get difficulty from quiz card or set default
            const quizTitle = quizData.title;
            const quizCards = document.querySelectorAll('.quiz-card');
            let timePerQuestion = 30; // Default
            
            // Check each quiz card to find the matching one and extract time info
            if (!document.body.classList.contains('quiz-page')) {
                // We're on the results page or different page, use default
                return timePerQuestion;
            }
            
            // Set times based on difficulty level
            if (quizTitle.includes("General Knowledge") || quizTitle.includes("Web Development") || quizTitle.includes("History")) {
                timePerQuestion = 25; // Easy/Medium quizzes
            } else if (quizTitle.includes("Science") || quizTitle.includes("Artificial Intelligence") || quizTitle.includes("Data Structures") || quizTitle.includes("Programming")) {
                timePerQuestion = 30; // Medium quizzes
            } else if (quizTitle.includes("Cyber Security") || quizTitle.includes("Machine Learning")) {
                timePerQuestion = 35; // Hard quizzes
            }
            
            timeRemaining = timePerQuestion;
            return timePerQuestion;
        }
        
        function selectOption(option, isCorrect = null) {
            // Remove all selection classes from options
            document.querySelectorAll('.option-item').forEach(item => {
                item.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Add selected class to clicked option
            const selected = Array.from(document.querySelectorAll('.option-item')).find(item => 
                item.querySelector('.option-text').textContent === option
            );
            
            if (selected) {
                if (isCorrect === true) {
                    selected.classList.add('selected', 'correct');
                } else if (isCorrect === false) {
                    selected.classList.add('selected', 'incorrect');
                } else {
                    selected.classList.add('selected');
                }
            }
        }
        
        function showFeedbackAnimation(isCorrect) {
            // Create feedback overlay
            const feedback = document.createElement('div');
            feedback.className = `feedback-animation ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`;
            
            // Create icon
            const icon = document.createElement('div');
            icon.className = `feedback-icon ${isCorrect ? 'correct-icon' : 'incorrect-icon'}`;
            icon.textContent = isCorrect ? '✓' : '✗';
            
            feedback.appendChild(icon);
            document.body.appendChild(feedback);
            
            // Remove after animation completes
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 1500);
        }
        
        function showEnhancedCelebration() {
            // Create celebration particles
            const celebrationContainer = document.createElement('div');
            celebrationContainer.className = 'celebration-container';
            
            // Create fireworks/confetti
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'celebration-particle';
                // Randomize particle properties
                particle.style.backgroundColor = getRandomColor();
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 0.5}s`;
                
                celebrationContainer.appendChild(particle);
            }
            
            // Create star burst
            const starBurst = document.createElement('div');
            starBurst.className = 'star-burst';
            celebrationContainer.appendChild(starBurst);
            
            document.body.appendChild(celebrationContainer);
            
            // Remove celebration effect after animation completes
            setTimeout(() => {
                document.body.removeChild(celebrationContainer);
            }, 2000);
        }
        
        function showTimeoutMessage() {
            // Create timeout overlay
            const timeoutOverlay = document.createElement('div');
            timeoutOverlay.className = 'timeout-overlay';
            
            // Create timeout message
            const timeoutMessage = document.createElement('div');
            timeoutMessage.className = 'timeout-message';
            timeoutMessage.innerHTML = `
                <div class="timeout-icon">⏰</div>
                <div class="timeout-text">Time's Up!</div>
            `;
            
            timeoutOverlay.appendChild(timeoutMessage);
            document.body.appendChild(timeoutOverlay);
            
            // Remove after animation completes
            setTimeout(() => {
                document.body.removeChild(timeoutOverlay);
                
                // Auto-progress to next question
                if (currentQuestionIndex < quizData.questions.length - 1) {
                    goToNextQuestion();
                } else {
                    finishQuiz();
                }
            }, 1500);
        }
        
        function getRandomColor() {
            const colors = ['#FF5C8D', '#61B15A', '#FFCC29', '#38B6FF', '#9C5DE0', '#5E81F4'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        function goToPrevQuestion() {
            if (currentQuestionIndex > 0 && !isProcessingAnswer) {
                currentQuestionIndex--;
                quizData.currentQuestion = currentQuestionIndex;
                localStorage.setItem('currentQuiz', JSON.stringify(quizData));
                clearInterval(timerInterval);
                loadQuestion(currentQuestionIndex);
                updateUI();
            }
        }
        
        function goToNextQuestion() {
            if (currentQuestionIndex < quizData.questions.length - 1) {
                currentQuestionIndex++;
                quizData.currentQuestion = currentQuestionIndex;
                localStorage.setItem('currentQuiz', JSON.stringify(quizData));
                clearInterval(timerInterval);
                loadQuestion(currentQuestionIndex);
                updateUI();
            } else {
                // Quiz completed
                finishQuiz();
            }
        }
        
        function updateUI() {
            // Update question number
            currentQuestionEl.textContent = `Question ${currentQuestionIndex + 1}`;
            
            // Update progress bar
            const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
            progressBar.style.width = `${progress}%`;
            
            // Update button states
            prevBtn.disabled = currentQuestionIndex === 0;
            
            // Change next button text on last question
            if (currentQuestionIndex === quizData.questions.length - 1) {
                nextBtn.textContent = 'Finish Quiz';
            } else {
                nextBtn.textContent = 'Next';
            }
        }
        
        function startTimer() {
            // Clear any existing timers
            clearInterval(timerInterval);
            
            // Update timer display immediately
            timerEl.textContent = formatTime(timeRemaining);
            
            // Start counting down
            timerInterval = setInterval(() => {
                timeRemaining--;
                timerEl.textContent = formatTime(timeRemaining);
                
                // Highlight timer in red when less than 10 seconds
                if (timeRemaining <= 10) {
                    timerEl.parentElement.classList.add('timer-warning');
                }
                
                // Handle timeout
                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    showTimeoutMessage();
                }
            }, 1000); // Uses real-time clock for accurate timing
        }
        
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        
        function finishQuiz() {
            clearInterval(timerInterval);
            
            // Calculate score
            let score = 0;
            let userAnswers = [];
            
            quizData.questions.forEach((question, index) => {
                const isCorrect = quizData.userAnswers[index] === question.correctAnswer;
                if (isCorrect) {
                    score++;
                }
                
                userAnswers.push({
                    question: question.question,
                    userAnswer: quizData.userAnswers[index],
                    correctAnswer: question.correctAnswer,
                    isCorrect: isCorrect
                });
            });
            
            // Save score and answers
            const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
            const quizResult = {
                title: quizData.title,
                score: score,
                total: quizData.questions.length,
                date: new Date().toISOString(),
                answers: userAnswers
            };
            
            quizHistory.push(quizResult);
            localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
            
            // Store the current quiz result for the results page
            localStorage.setItem('currentQuizResult', JSON.stringify(quizResult));
            
            // Redirect to results page
            window.location.href = 'results.html';
        }
        
        // Start the quiz
        initQuiz();
    });
}

// Results page functionality
if (document.querySelector('.results-page')) {
    document.addEventListener('DOMContentLoaded', function() {
        const quizResult = JSON.parse(localStorage.getItem('currentQuizResult'));
        
        if (!quizResult) {
            window.location.href = 'index.html';
            return;
        }
        
        // Set username with emoji
        const username = localStorage.getItem('quizMasterUser') || 'User';
        const userEmoji = localStorage.getItem('quizMasterUserEmoji') || '👤';
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.innerHTML = `<span class="user-emoji">${userEmoji}</span> ${username}`;
        }
        
        // Display score
        const scoreValue = document.getElementById('score-value');
        const totalQuestions = document.getElementById('total-questions');
        const correctCount = document.getElementById('correct-count');
        const incorrectCount = document.getElementById('incorrect-count');
        const scorePercentage = document.getElementById('score-percentage');
        const progressCircle = document.getElementById('progress-circle');
        
        if (scoreValue) scoreValue.textContent = quizResult.score;
        if (totalQuestions) totalQuestions.textContent = quizResult.total;
        if (correctCount) correctCount.textContent = quizResult.score;
        if (incorrectCount) incorrectCount.textContent = quizResult.total - quizResult.score;
        
        // Calculate and display percentage
        const percentage = Math.round((quizResult.score / quizResult.total) * 100);
        if (scorePercentage) scorePercentage.textContent = percentage + '%';
        
        // Animate progress circle
        if (progressCircle) {
            const circumference = 2 * Math.PI * 80;
            const dashoffset = circumference * (1 - percentage / 100);
            progressCircle.style.strokeDasharray = circumference;
            
            // Adjust color based on score
            if (percentage >= 80) {
                progressCircle.style.stroke = '#3aad7b'; // Green for high scores
            } else if (percentage >= 60) {
                progressCircle.style.stroke = '#60a5fa'; // Blue for medium scores
            } else {
                progressCircle.style.stroke = '#f87171'; // Red for low scores
            }
            
            // Animate the circle
            setTimeout(() => {
                progressCircle.style.strokeDashoffset = dashoffset;
            }, 100);
        }
        
        // Display question breakdown
        const breakdownList = document.getElementById('breakdown-list');
        if (breakdownList && quizResult.answers) {
            quizResult.answers.forEach((answer, index) => {
                const item = document.createElement('div');
                item.className = `breakdown-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
                
                item.innerHTML = `
                    <div class="breakdown-question">
                        <span class="breakdown-item-icon ${answer.isCorrect ? 'correct-icon' : 'incorrect-icon'}">
                            ${answer.isCorrect ? '✓' : '✗'}
                        </span>
                        <span>Question ${index + 1}: ${answer.question}</span>
                    </div>
                    <div class="breakdown-answer">
                        Your answer: ${answer.userAnswer || 'No answer provided'}
                    </div>
                `;
                
                // Only show the correct answer if the user got it wrong
                if (!answer.isCorrect) {
                    item.innerHTML += `
                        <div class="breakdown-answer correct">
                            Correct answer: ${answer.correctAnswer}
                        </div>
                    `;
                }
                
                breakdownList.appendChild(item);
            });
        }
        
        // Retry quiz button
        const retryBtn = document.getElementById('retry-quiz');
        if (retryBtn) {
            retryBtn.addEventListener('click', function() {
                // Find the original quiz data
                const originalQuizTitle = quizResult.title;
                const selectedQuiz = quizData[originalQuizTitle] || [];
                
                if (selectedQuiz.length > 0) {
                    localStorage.setItem('currentQuiz', JSON.stringify({
                        title: originalQuizTitle,
                        questions: selectedQuiz,
                        currentQuestion: 0,
                        userAnswers: Array(selectedQuiz.length).fill(null)
                    }));
                    
                    window.location.href = 'quiz.html';
                } else {
                    alert('Sorry, this quiz is no longer available.');
                    window.location.href = 'index.html';
                }
            });
        }
    });
}
