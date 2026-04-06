// تعريف المتغيرات بشكل صحيح
let wishlist = JSON.parse(localStorage.getItem('halaWishlist')) || [];
let currentProduct = "";

document.addEventListener('DOMContentLoaded', () => {
    // تحديث القائمة فور التحميل
    updateWishlistUI();

    // ابحثي عن هذا الجزء وتأكدي أنه هكذا
const modeToggle = document.getElementById('darkModeToggle');

if (modeToggle) {
    modeToggle.addEventListener('click', () => {
        // إضافة أو إزالة الكلاس من الـ body
        document.body.classList.toggle('dark-mode');
        
        // تغيير شكل الأيقونة بين الشمس والقمر
        if (document.body.classList.contains('dark-mode')) {
            modeToggle.innerText = '☀️';
        } else {
            modeToggle.innerText = '🌙';
        }
    });
}
    
    // مراقب التمرير لإظهار المنتجات بسلاسة
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.cup-card').forEach(card => {
        observer.observe(card);
    });
});

// فتح نافذة الطلب
function openOrderModal(productName) {
    currentProduct = productName;
    const nameElement = document.getElementById('selectedProductName');
    const modal = document.getElementById('orderModal');
    if (nameElement) nameElement.innerText = "المنتج: " + productName;
    if (modal) modal.style.display = "block";

    const detailsGroup = document.getElementById('detailsGroup');
    if (detailsGroup) {
        detailsGroup.style.display = productName.includes("طلب تصميم مخصص") ? "block" : "none";
    }
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = "none";
}

// إضافة للمفضلة مع التنبيه
function addToWishlist(id, title, price, img, element) {
    const index = wishlist.findIndex(item => item.id === id);
    const toast = document.getElementById('toast');

    if (index > -1) {
        wishlist.splice(index, 1);
        element.innerText = "♡";
    } else {
        wishlist.push({ id, title, price, img });
        element.innerText = "❤️";
        
        if (toast) {
            toast.classList.add('show-toast');
            setTimeout(() => { toast.classList.remove('show-toast'); }, 2500);
        }
    }
    localStorage.setItem('halaWishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    const countElement = document.getElementById('wishlist-count');
    if(countElement) countElement.innerText = wishlist.length;
    
    const itemsContainer = document.getElementById('wishlist-items');
    if(!itemsContainer) return;
    
    if (wishlist.length === 0) {
        itemsContainer.innerHTML = '<p style="padding:20px; text-align:center; color:#888;">قائمتك فارغة حالياً..</p>';
        return;
    }

    itemsContainer.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.img}">
            <div class="wishlist-item-info">
                <h4>${item.title}</h4>
                <span>${item.price} شيكل</span>
            </div>
            <button onclick="removeFromWishlist(${item.id})" style="background:none; border:none; color:red; cursor:pointer; font-size:1.2rem;">×</button>
        </div>
    `).join('');
}

function removeFromWishlist(id) {
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem('halaWishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function toggleWishlist() {
    const modal = document.getElementById('wishlist-modal');
    if(modal) {
        modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
    }
}

// الوظائف العامة (البحث، العودة للأعلى، واتساب)
function searchCups() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('cup-card');
    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].querySelector('.cup-title')?.innerText.toLowerCase() || "";
        cards[i].style.display = title.includes(input) ? "" : "none";
    }
}

window.onscroll = function() {
    const btn = document.getElementById('backToTop');
    if (btn) {
        btn.style.display = (window.scrollY > 300) ? "block" : "none";
    }
};

function scrollToTop() { window.scrollTo({top: 0, behavior: 'smooth'}); }

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
};

function finalWishlistOrder() {
    // التأكد من وجود بيانات في القائمة
    if (!wishlist || wishlist.length === 0) {
        alert("قائمة المفضلة فارغة حالياً.. أضيفي بعض الأكواب أولاً ❤️");
        return;
    }

    // تجهيز النص
    let messageText = "*طلب قائمة الأكواب المفضلة* ❤️%0A%0A";
    
    wishlist.forEach((item, index) => {
        messageText += `${index + 1}- ${item.title} (${item.price} شيكل)%0A`;
    });

    messageText += "%0Aأرجو التواصل لتأكيد الطلب ✨";

    // رقم الواتساب الخاص بكِ
    const myNumber = "972597825817";

    // فتح الرابط
    const finalUrl = `https://wa.me/${myNumber}?text=${messageText}`;
    window.open(finalUrl, '_blank');
}


// دالة تأكيد الطلب وإرسال البيانات للواتساب
// دالة إرسال الطلب للواتساب - تأكدي أن الاسم مطابق للـ HTML
function sendToWhatsApp() {
    // 1. جلب البيانات باستخدام الـ IDs الموجودة في الـ HTML الخاص بكِ
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const details = document.getElementById('customDetails').value;
    const payment = document.getElementById('paymentMethod').value;
    
    // جلب اسم المنتج الذي تم اختياره (مخزن في المتغير العام currentProduct)
    const product = currentProduct; 

    // 2. التحقق من الحقول المطلوبة
    if (!name || !phone || !address) {
        alert("الرجاء إدخال الاسم، رقم الجوال، والعنوان لإتمام الطلب.");
        return;
    }

    // 3. تجهيز نص الرسالة
    const whatsappNumber = "972597825817"; // رقمك بصيغة دولية بدون أصفار أو +
    const message = `*طلب جديد من متجر هالة* 🎨%0A%0A` +
                    `*المنتج:* ${product}%0A` +
                    `*الاسم:* ${name}%0A` +
                    `*الجوال:* ${phone}%0A` +
                    `*العنوان:* ${address}%0A` +
                    `*طريقة الدفع:* ${payment}%0A` +
                    (details ? `*تفاصيل إضافية:* ${details}` : "");

    // 4. فتح رابط الواتساب
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, '_blank');

    // 5. إغلاق المودال
    closeOrderModal();
}
