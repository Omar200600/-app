// app.js - ملف التحكم والحماية البرمجية المستقل

const LICENSE_KEY = "OMAR-AXIS-2026-XYZ"; 
const MERCHANT_WHATSAPP = "967777777777"; // يمكنك استبدال هذا برقم واتساب التاجر الحقيقي لاحقاً

function verifyLicense() {
    return LICENSE_KEY === "OMAR-AXIS-2026-XYZ";
}

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

// تحديث النصوص الأساسية للواجهة فور تحميل الملف
document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById('botName')) document.getElementById('botName').innerText = businessData.name;
    if(document.getElementById('welcomeMessage')) document.getElementById('welcomeMessage').innerText = `مرحباً بك في ${businessData.name}! كيف يمكنني مساعدتك اليوم؟`;
});

async function getAIResponse(userMessage) {
    if (!verifyLicense()) {
        appendMessage("عذراً، نسخة البرنامج هذه غير مفعلة.", 'bot');
        return;
    }

    const messageLower = userMessage.toLowerCase();

    // 1. الإجابة عن مواعيد العمل
    if (messageLower.includes("دوام") || messageLower.includes("تفتحوا") || messageLower.includes("وقت")) {
        appendMessage(`أوقات العمل في ${businessData.name} هي: ${businessData.hours}`, 'bot');
        return;
    }
    
    // 2. الإجابة عن الخدمات
    if (messageLower.includes("خدمات") || messageLower.includes("تسوا") || messageLower.includes("تعملوا")) {
        appendMessage(`نقدم في ${businessData.name} الخدمات التالية: ${businessData.services}`, 'bot');
        return;
    }

    // 3. البحث في المنتجات المتاحة وتوليد زر الواتساب الأخضر
    for (let product of businessData.products) {
        if (messageLower.includes(product.name)) {
            if (product.status === "متوفر") {
                const whatsappText = encodeURIComponent(`مرحباً ${businessData.name}، أود طلب منتج: (${product.name}) بسعر ${product.price} عبر المساعد الذكي.`);
                const whatsappUrl = `https://wa.me/${MERCHANT_WHATSAPP}?text=${whatsappText}`;

                const responseHtml = `
                    <div>سعر ${product.name} هو ${product.price} وحالته الحالية: ${product.status}.</div>
                    <a href="${whatsappUrl}" target="_blank" class="whatsapp-btn">
                         طلب الشراء عبر الواتساب 💬
                    </a>
                `;
                appendHtmlMessage(responseHtml, 'bot');
            } else {
                appendMessage(`منتج ${product.name} سعره ${product.price} ولكنه للأسف: ${product.status} حالياً.`, 'bot');
            }
            return;
        }
    }

    // 4. الرد الافتراضي المرن
    appendMessage(`مرحباً بك، أنا مساعد ${businessData.name} الذكي. بخصوص استفسارك حول "${userMessage}"، يسعدنا تواصلك معنا، وسيقوم الصيدلي بمراجعة طلبك فوراً!`, 'bot');
}
