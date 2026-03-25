document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form');
    const submitBtn = document.getElementById('submit-btn');
    const formView = document.getElementById('form-view');
    const resultView = document.getElementById('result-view');
    const resultBack = document.getElementById('result-back');
    const tabSlider = document.querySelector('.tab-slider');
    const resultDetails = document.getElementById('result-details');

    // Result Display Elements
    const displayAmount = document.getElementById('display-amount');
    const displayRate = document.getElementById('display-rate');
    const displayAuditTime = document.getElementById('display-audit-time');

    let currentType = 'enterprise';

    // Tab Switching Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.getAttribute('data-type');
            if (type === currentType) return;

            currentType = type;
            
            // Update active tab UI
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update slider position
            if (type === 'personal') {
                tabSlider.style.transform = 'translateX(100%)';
            } else {
                tabSlider.style.transform = 'translateX(0)';
            }

            // Update active form
            forms.forEach(f => f.classList.remove('active'));
            document.getElementById(`${type}-form`).classList.add('active');
        });
    });

    // Format Number as Currency (1,000,000.00)
    function formatCurrency(num) {
        return parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Get current time in YYYY-MM-DD HH:mm:ss format
    function getCurrentDateTime() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        return `${y}-${m}-${d} ${h}:${mm}:${ss}`;
    }

    // Submit Logic
    submitBtn.addEventListener('click', () => {
        const activeForm = document.querySelector('.form.active');
        const formData = new FormData(activeForm);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        const requiredFields = {
            enterprise: ['companyName', 'taxAccount', 'expectedAmount', 'rateMin', 'rateMax'],
            personal: ['applicantName', 'idNumber', 'phoneNumber', 'expectedAmount', 'rateMin', 'rateMax']
        };

        const missing = requiredFields[currentType].filter(field => !data[field]);
        if (missing.length > 0) {
            alert('请填写所有带星号的必填项');
            return;
        }

        // Map data to Result View
        const amount = parseFloat(data.expectedAmount) * 10000;
        displayAmount.textContent = formatCurrency(amount);
        displayRate.textContent = `${data.rateMin} % - ${data.rateMax} %`;
        
        // Audit Time (Current Time)
        const currentTime = getCurrentDateTime();
        displayAuditTime.textContent = currentTime;

        // Clear and Generate Details
        resultDetails.innerHTML = '';
        const details = [];

        if (currentType === 'enterprise') {
            details.push({ label: '企业名称', value: data.companyName });
            details.push({ label: '统一社会信用代码', value: data.taxAccount });
            details.push({ label: '预期额度', value: data.expectedAmount + ' 万元' });
            details.push({ label: '审批时间', value: currentTime });
        } else {
            details.push({ label: '申请人姓名', value: data.applicantName });
            details.push({ label: '身份证号', value: data.idNumber });
            details.push({ label: '预期额度', value: data.expectedAmount + ' 万元' });
            details.push({ label: '审批时间', value: currentTime });
        }

        details.forEach(item => {
            const div = document.createElement('div');
            div.className = 'detail-item';
            div.innerHTML = `
                <span class="detail-label">${item.label}</span>
                <span class="detail-value">${item.value}</span>
            `;
            resultDetails.appendChild(div);
        });

        // Switch View
        formView.classList.remove('active');
        resultView.classList.add('active');
        window.scrollTo(0, 0);
    });

    // Back to Form
    resultBack.addEventListener('click', () => {
        resultView.classList.remove('active');
        formView.classList.add('active');
        window.scrollTo(0, 0);
    });

    // Header back button (just alert or go back)
    document.querySelector('.back-btn').addEventListener('click', () => {
        if (confirm('确认退出工具？')) {
            // In a real app, this would go back in history
            console.log('Back button clicked');
        }
    });
});
