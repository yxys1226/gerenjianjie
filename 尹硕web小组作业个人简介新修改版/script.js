// ======================
// 变量定义
// ======================
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
let slideInterval;
let isTransitioning = false;

// 触摸滑动变量
let startX = 0;
let endX = 0;
let isDragging = false;

// ======================
// DOM 加载完成后执行
// ======================
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载动画
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }, 800);
    
    // 初始化所有功能
    initHeroSlider();
    initNavigation();
    initSkillsAnimation();
    initSkillsChart();
    initProjects();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    
    // 初始化主题切换
    initThemeToggle();
    
    // 初始化聊天机器人
    initChatbot();
});

// ======================
// 主题切换功能
// ======================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // 应用保存的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    });
}

// ======================
// 聊天机器人功能
// ======================
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatbotMessages');
    
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
    });
    
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 如果是用户消息，模拟AI回复
        if (isUser) {
            setTimeout(() => {
                let response = "感谢您的消息！我是AI助手，目前是演示版本。在实际项目中，我会连接到DeepSeek或OpenAI API提供智能回复。";
                
                const userText = text.toLowerCase();
                if (userText.includes('你好') || userText.includes('hi')) {
                    response = "你好！我是你的AI简历助手，有什么我可以帮您的吗？";
                } else if (userText.includes('项目') || userText.includes('经验')) {
                    response = "您可以在工作经验部分查看我的经历：篮球教练、社区工作和志愿服务。";
                } else if (userText.includes('技能') || userText.includes('技术')) {
                    response = "我的专业技能包括区块链技术、办公软件应用、志愿服务组织和体育运动指导。具体技能水平可以通过进度条查看。";
                } else if (userText.includes('联系') || userText.includes('方式')) {
                    response = "您可以通过页面底部的联系方式部分查看我的邮箱、电话等信息。";
                } else if (userText.includes('教育') || userText.includes('背景')) {
                    response = "我在三亚学院区块链工程专业就读，目前大二。详细信息可以在教育背景部分查看。";
                }
                
                addMessage(response, false);
            }, 1000);
        }
    }
    
    sendMessageBtn.addEventListener('click', () => {
        if (chatInput.value.trim() !== '') {
            addMessage(chatInput.value.trim(), true);
            chatInput.value = '';
        }
    });
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            addMessage(chatInput.value.trim(), true);
            chatInput.value = '';
        }
    });
    
    // 初始化添加一条欢迎消息
    setTimeout(() => {
        addMessage("你好！我是你的AI简历助手，有什么我可以帮您的吗？", false);
    }, 2000);
}

// ======================
// 轮播图功能 - 增强版
// ======================
function initHeroSlider() {
    if (slides.length === 0) return;
    
    // 显示第一张幻灯片
    showSlide(0);
    
    // 自动轮播
    startAutoSlide();
    
    // 添加控制按钮事件
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }
    
    // 指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetAutoSlide();
        });
    });
    
    // 鼠标悬停时暂停自动轮播
    const carousel = document.getElementById('carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        
        // 添加触摸事件支持
        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // 添加鼠标拖拽支持
        carousel.addEventListener('mousedown', handleMouseDown);
        carousel.addEventListener('mousemove', handleMouseMove);
        carousel.addEventListener('mouseup', handleMouseUp);
        carousel.addEventListener('mouseleave', handleMouseUp);
    }
}

// 触摸开始
function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoSlide();
}

// 触摸移动
function handleTouchMove(e) {
    if (!isDragging) return;
    endX = e.touches[0].clientX;
}

// 触摸结束
function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const difference = startX - endX;
    const minSwipeDistance = 50;
    
    if (Math.abs(difference) > minSwipeDistance) {
        if (difference > 0) {
            nextSlide(); // 向左滑动，显示下一张
        } else {
            prevSlide(); // 向右滑动，显示上一张
        }
    }
    
    startAutoSlide();
}

// 鼠标拖拽事件
function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
    stopAutoSlide();
    e.preventDefault();
}

function handleMouseMove(e) {
    if (!isDragging) return;
    endX = e.clientX;
}

function handleMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const difference = startX - endX;
    const minSwipeDistance = 50;
    
    if (Math.abs(difference) > minSwipeDistance) {
        if (difference > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
    
    startAutoSlide();
}

function showSlide(index) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
    
    indicators.forEach((indicator, i) => {
        indicator.classList.remove('active');
        if (i === index) {
            indicator.classList.add('active');
        }
    });
    
    currentSlide = index;
    
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prev);
}

function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// ======================
// 导航功能
// ======================
function initNavigation() {
    // 移动端导航切换
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // 平滑滚动到对应部分
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(item.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // 移动端关闭导航菜单
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });
    
    // 滚动时高亮当前导航项
    window.addEventListener('scroll', highlightActiveNav);
    
    // 返回顶部和进度条
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // 进度条
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
        
        // 返回顶部按钮
        if (backToTop) {
            if (scrollTop > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });
    
    // 返回顶部点击事件
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function highlightActiveNav() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

// ======================
// 技能动画
// ======================
function initSkillsAnimation() {
    const skillProgress = document.querySelectorAll('.skill-progress');
    
    const animateSkills = () => {
        skillProgress.forEach(skill => {
            const rect = skill.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const width = skill.getAttribute('data-width');
                skill.style.width = width + '%';
            }
        });
    };
    
    window.addEventListener('scroll', animateSkills);
    animateSkills(); // 初始检查
}

// ======================
// 技能雷达图
// ======================
function initSkillsChart() {
    const ctx = document.getElementById('skillsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                '区块链技术',
                '志愿服务',
                '办公软件',
                '体育指导',
                '团队协作',
                '沟通能力'
            ],
            datasets: [{
                label: '技能水平',
                data: [85, 90, 95, 88, 85, 90],
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                borderColor: 'rgba(33, 150, 243, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(33, 150, 243, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            family: 'Microsoft YaHei, sans-serif'
                        },
                        color: '#333'
                    },
                    ticks: {
                        display: false,
                        min: 0,
                        max: 100,
                        stepSize: 20
                    }
                }
            }
        }
    });
}

// ======================
// 项目详情模态框
// ======================
function initProjects() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal-close');
    
    // 项目详细数据
    const projectDetails = {
        0: {
            title: '篮球教练',
            subtitle: '济南大树篮球馆 | 2023.06-2023.09',
            image: '篮球教练工作.png',
            description: '负责指导和培训球员，设计训练计划，参与战术制定和比赛策划，带领球队取得显著进步和优异成绩。',
            tags: ['体育教学', '团队管理', '战术指导'],
            features: [
                '设计和实施个性化训练计划',
                '组织团队训练和比赛',
                '评估球员表现并提供反馈',
                '培养球员团队合作精神',
                '提高球队整体竞技水平'
            ],
            responsibilities: [
                '制定每周训练计划',
                '指导球员技术动作',
                '组织团队战术演练',
                '带队参加各类比赛',
                '评估球员表现并提供改进建议'
            ]
        },
        1: {
            title: '社区工作人员',
            subtitle: '济南市龙洞街道锦屏第二社区 | 2024.06-2024.09',
            image: '社区工作.png',
            description: '负责宣传内容策划、组织社区活动、入户宣传调研、线上线下推广等工作，提升社区服务质量。',
            tags: ['活动策划', '宣传推广', '社区服务'],
            features: [
                '策划并执行社区文化活动',
                '制作宣传材料和海报',
                '组织居民参与社区活动',
                '收集居民反馈和建议',
                '维护社区公众号和宣传栏'
            ],
            responsibilities: [
                '制定月度活动计划',
                '设计宣传材料和内容',
                '组织社区志愿服务',
                '收集整理居民反馈',
                '维护社区线上平台'
            ]
        },
        2: {
            title: '志愿服务经验',
            subtitle: '多个志愿组织 | 2年经验',
            image: '志愿服务.png',
            description: '具备丰富的志愿服务推广经验，擅长会场布置、引导观众、解答疑问、维持秩序等工作。',
            tags: ['志愿服务', '秩序维护', '现场协调'],
            features: [
                '参与大型活动志愿服务',
                '维护活动现场秩序',
                '引导观众和解答疑问',
                '协助处理突发事件',
                '提供高质量服务体验'
            ],
            responsibilities: [
                '负责活动区域秩序维护',
                '引导观众入场和离场',
                '解答参与者疑问',
                '协助处理紧急情况',
                '提供优质志愿服务'
            ]
        }
    };
    
    // 绑定项目卡片点击事件
    projectCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            openProjectModal(index);
        });
    });
    
    // 绑定模态框关闭事件
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    function openProjectModal(index) {
        const project = projectDetails[index];
        if (!project || !modal) return;
        
        // 填充模态框内容
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalSubtitle').textContent = project.subtitle;
        document.getElementById('modalImage').src = project.image;
        document.getElementById('modalDescription').textContent = project.description;
        
        // 填充技术标签
        const tagsContainer = document.getElementById('modalTags');
        tagsContainer.innerHTML = '';
        project.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        // 填充项目特色
        const featuresContainer = document.getElementById('modalFeatures');
        featuresContainer.innerHTML = '';
        project.features.forEach(feature => {
            const featureElement = document.createElement('li');
            featureElement.textContent = feature;
            featuresContainer.appendChild(featureElement);
        });
        
        // 填充工作职责
        const responsibilitiesContainer = document.getElementById('modalResponsibilities');
        responsibilitiesContainer.innerHTML = '';
        project.responsibilities.forEach(responsibility => {
            const responsibilityElement = document.createElement('li');
            responsibilityElement.textContent = responsibility;
            responsibilitiesContainer.appendChild(responsibilityElement);
        });
        
        // 显示模态框
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 禁用背景滚动
    }
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    }
}

// ======================
// 滚动动画
// ======================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.section, .card, .timeline-item, .project-card');
    animateElements.forEach(el => observer.observe(el));
}

// ======================
// 返回顶部按钮
// ======================
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
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
    }
}

// ======================
// 联系表单
// ======================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // 简单的表单验证
            if (!data.name || !data.email || !data.message) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 模拟表单提交
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '发送中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('感谢您的留言！我会尽快回复您。');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// ======================
// 页面可见性处理
// ======================
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoSlide();
    } else {
        startAutoSlide();
    }
});

// ======================
// 页面卸载清理
// ======================
window.addEventListener('beforeunload', function() {
    stopAutoSlide();
});