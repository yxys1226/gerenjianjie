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
});

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
            title: '社区志愿服务平台',
            subtitle: '基于区块链的志愿服务管理系统',
            image: 'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            description: '设计并实施了一个基于区块链技术的社区志愿服务管理平台，通过智能合约记录志愿服务时长，建立可信的志愿者积分体系，提高社区志愿服务的透明度和激励机制。',
            tags: ['区块链', '智能合约', 'Vue.js', 'Node.js', 'MongoDB'],
            features: [
                '基于以太坊智能合约的志愿时长记录',
                '去中心化的志愿者积分系统',
                '可视化的社区志愿服务数据分析',
                '移动端友好的响应式设计',
                '多角色权限管理系统'
            ],
            responsibilities: [
                '负责系统架构设计和技术选型',
                '开发智能合约和区块链交互模块',
                '设计并实现前端用户界面',
                '协调团队开发进度和代码评审',
                '参与系统测试和部署上线'
            ]
        },
        1: {
            title: '大学生体育赛事管理系统',
            subtitle: '校园体育活动组织与管理平台',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            description: '开发了一套完整的大学生体育赛事管理系统，涵盖赛事报名、比赛安排、成绩统计、裁判管理等功能模块，显著提高了校园体育活动的组织效率。',
            tags: ['Java', 'Spring Boot', 'MySQL', 'Bootstrap', 'RESTful API'],
            features: [
                '在线赛事报名和审核系统',
                '自动化的比赛赛程安排',
                '实时的比赛成绩录入与统计',
                '裁判员资质认证和排班管理',
                '数据可视化的赛事分析报告'
            ],
            responsibilities: [
                '担任项目技术负责人',
                '设计数据库架构和API接口',
                '开发核心业务逻辑模块',
                '指导团队成员技术实现',
                '负责系统性能优化和维护'
            ]
        },
        2: {
            title: '志愿者培训学习平台',
            subtitle: '在线教育与认证管理系统',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            description: '构建了一个综合性的志愿者培训学习平台，包含在线课程学习、知识测评、证书管理等功能，为志愿者提供专业化的培训服务。',
            tags: ['React', 'Express.js', 'PostgreSQL', 'Redis', 'Docker'],
            features: [
                '多媒体在线课程播放系统',
                '智能化的学习进度跟踪',
                '在线考试和自动评分系统',
                '电子证书生成和验证',
                '学习数据分析和推荐算法'
            ],
            responsibilities: [
                '主导前端架构设计和开发',
                '实现用户学习行为分析功能',
                '开发在线考试和评分系统',
                '负责系统部署和运维工作',
                '进行用户体验优化和迭代'
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