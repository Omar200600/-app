// app.js - ملف التحكم الذكي، حماية المنتج، وتغذية البيانات للتاجر

// 1. نظام حماية مفتاح التفعيل لضمان عدم سرقة تعبك أو إعادة تشغيل الكود من شخص آخر
const LICENSE_KEY = "OMAR-AXIS-2026-XYZ"; 

function verifyLicense() {
    if (LICENSE_KEY !== "OMAR-AXIS-2026-XYZ") {
        console.error("خطأ: نسخة غير مصرح بها!");
        return false;
    }
    return true;
}

// 2. قاعدة بيانات العميل (قم بتخصيصها وتحديثها حسب نشاط المشتري: صيدلية، بقالة، طبيب)
const businessData = {
    name: "صيدلية الشفاء الذكية",
    hours: "من السبت إلى الخميس، من 8 صباحاً حتى 11 مساءً",
    services: "توفير الأدوية، مستحضرات التجميل، وفحص السكري والضغط ترحيباً بكم.",
    products: [
        { name: "بندول", price: "500 ريال", status: "متوفر" },
        { name: "فيتامين سي", price: "1200 ريال", status: "متوفر" },
        { name: "كمامات", price: "100 ريال", status: "نفذت الكمية" }
    ]
};

// تحديث اسم الهيدر والترحيب تلقائياً في الواجهة بناءً على بيانات التجر المكتوبة هنا
document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById('botName')) document.getElementById('botName').innerText = businessData.name;
    if(document.getElementById('welcomeMessage')) document.getElementById('welcomeMessage').innerText = `مرحباً بك في ${businessData.name}! كيف يمكنني مساعدتك اليوم؟`;
});

// 3. معالجة الأسئلة والردود بذكاء
async function getAIResponse(userMessage) {
    if (!verifyLicense()) {
        return "عذراً، نسخة البرنامج هذه غير مفعلة. يرجى التواصل مع المطور عمر حسن لتفعيلها.";
    }

    const messageLower = userMessage.toLowerCase();

    // ردود سريعة ومباشرة لتوفير موارد الـ API وسرعة استجابة التطبيق للزبون
    if (messageLower.includes("دوام") || messageLower.includes("تفتحوا") || messageLower.includes("وقت")) {
        return `أوقات العمل في ${businessData.name} هي: ${businessData.hours}`;
    }
    
    if (messageLower.includes("خدمات") || messageLower.includes("تسوا") || messageLower.includes("تعملوا")) {
        return `نقدم في ${businessData.name} الخدمات التالية: ${businessData.services}`;
    }

    // البحث الذكي التلقائي داخل قائمة المنتجات والأسعار المتاحة
    for (let product of businessData.products) {
        if (messageLower.includes(product.name)) {
            return `سعر ${product.name} هو ${product.price} وحالته الحالية: ${product.status}.`;
        }
    }

    // الرد المرن في حال لم يجد منتجاً محدداً أو سأله سؤالاً عاماً
    return `مرحباً بك، أنا مساعد ${businessData.name} الذكي. بخصوص استفسارك حول "${userMessage}"، يسعدنا تواصلك معنا، وسيقوم المسؤول بمراجعة طلبك والرد عليك فوراً إذا احتجت لأي تفاصيل إضافية!`;
}