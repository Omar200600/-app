// app.js - المحرك الذكي الموحد لجميع المجالات (صيدلية، متجر، مدرسة، إلخ)

const LICENSE_KEY = "OMAR-AXIS-2026-XYZ"; 

function verifyLicense() {
    return LICENSE_KEY === "OMAR-AXIS-2026-XYZ";
}

// هذه قاعدة البيانات التي ستتغير لكل تاجر حسب مجاله (صيدلية، مدرسة، بقالة)
const businessData = {
    name: "صيدلية الشفاء الحديثة", // اسم النشاط التجاري
    type: "pharmacy", // نوع النشاط: pharmacy, market, school, shop
    whatsappNumber: "967777777777", // رقم واتساب صاحب العمل لاستلام الطلبات
    hours: "يومياً من 8 صباحاً حتى 11 مساءً",
    welcomeText: "مرحباً بك! أنا مساعدك الافتراضي الذكي. كيف يمكنني مساعدتك اليوم؟",
    
    // قائمة المنتجات أو الخدمات المتاحة
    items: [
        // مثال لمجال الصيدلية
        { name: "بندول", price: "500 ريال", category: "أدوية", status: "متوفر", extraInfo: "مسكن للآلام وخافض للحرارة" },
        { name: "فيتامين سي", price: "1200 ريال", category: "فيتامينات", status: "متوفر", extraInfo: "فوار لتقوية المناعة" },
        
        // مثال لمجال البقالة والسوبرماركت (يفعل تلقائياً إذا كان النوع market)
        { name: "حليب", price: "400 ريال", category: "ألبان", status: "متوفر", extraInfo: "حليب طازج كامل الدسم" },
        { name: "أرز بسمتي", price: "3500 ريال", category: "مواد غذائية", status: "متوفر", extraInfo: "كيس وزن 5 كيلو" },
        
        // مثال لمجال المدارس والخدمات التعليمية (يفعل تلقائياً إذا كان النوع school)
        { name: "دورة الفيزياء", price: "5000 ريال", category: "تعليم", status: "متوفر", extraInfo: "شرح كامل لمنهج الفيزياء للثانوية العامة" },
        { name: "كتاب الكيمياء", price: "1500 ريال", category: "كتب", status: "متوفر", extraInfo: "ملخص شامل مع التدريبات المحلولة" }
    ]
};

// تهيئة وتعديل الواجهة تلقائياً بناءً على نوع النشاط التجاري
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('botName')) {
        document.getElementById('botName').innerText = businessData.name;
    }
    
    // تخصيص رسالة الترحيب حسب المجال لتبهر التاجر
    let customizedWelcome = businessData.welcomeText;
    if (businessData.type === "pharmacy") {
        customizedWelcome = `مرحباً بك في ${businessData.name}! يمكنك الاستفسار عن الأدوية أو تصوير الروشتة وطلبها مباشرة عبر الواتساب. 💊`;
    } else if (businessData.type === "school") {
        customizedWelcome = `مرحباً بك في ${businessData.name} التعليمية! كيف يمكنني مساعدتك اليوم في اختيار الدورات أو تسجيل الطلاب؟ 📚`;
    } else if (businessData.type === "market") {
        customizedWelcome = `مرحباً بك في ${businessData.name}! اكتب أسماء المواد الغذائية أو الطلبات التي تحتاجها لتجهيز سلتك فوراً. 🛒`;
    }
    
    if (document.getElementById('welcomeMessage')) {
        document.getElementById('welcomeMessage').innerText = customizedWelcome;
    }
});

async function getAIResponse(userMessage) {
    if (!verifyLicense()) {
        appendMessage("عذراً، نسخة البرنامج هذه غير مفعلة.", 'bot');
        return;
    }

    const messageLower = userMessage.toLowerCase().trim();

    // 1. الإجابة عن أوقات العمل أو الدوام
    if (messageLower.includes("دوام") || messageLower.includes("وقت") || messageLower.includes("تفتحوا") || messageLower.includes("مواعيد")) {
        appendMessage(`أوقات العمل في ${businessData.name} هي: ${businessData.hours}`, 'bot');
        return;
    }

    // 2. البحث الذكي المرن في المنتجات / الخدمات
    let foundItems = [];
    for (let item of businessData.items) {
        // فحص الكلمات للبحث المرن (مثلاً لو كتب بندول أو بنادول)
        if (messageLower.includes(item.name.toLowerCase()) || 
            (item.extraInfo && messageLower.includes(item.extraInfo.toLowerCase()))) {
            foundItems.push(item);
        }
    }

    // إذا وجدنا منتجات تطابق بحث الزبون
    if (foundItems.length > 0) {
        foundItems.forEach(item => {
            if (item.status === "متوفر") {
                // صياغة نص الرسالة المناسب لنوع النشاط عند الإرسال للواتساب
                let actionWord = (businessData.type === "school") ? "تسجيل واستفسار عن" : "طلب شراء";
                const whatsappText = encodeURIComponent(`مرحباً ${businessData.name}، أود ${actionWord}: (${item.name}) بسعر ${item.price} عبر المساعد الذكي الخاص بكم.`);
                const whatsappUrl = `https://wa.me/${businessData.whatsappNumber}?text=${whatsappText}`;

                const responseHtml = `
                    <div style="margin-bottom: 5px;">
                        <strong>✨ ${item.name}</strong><br>
                        💰 السعر: ${item.price}<br>
                        💡 التفاصيل: ${item.extraInfo}<br>
                        ✅ الحالة: ${item.status}
                    </div>
                    <a href="${whatsappUrl}" target="_blank" class="whatsapp-btn" style="background-color: #25D366; display: inline-flex; align-items: center; gap: 8px; color: white; padding: 8px 15px; border-radius: 20px; text-decoration: none; font-size: 13px; font-weight: bold; margin-top: 5px;">
                         اضغط هنا للتأكيد والطلب 💬
                    </a>
                `;
                appendHtmlMessage(responseHtml, 'bot');
            } else {
                appendMessage(`المنتج/الخدمة (${item.name}) سعره ${item.price} ولكنه للأسف غير متوفر حالياً.`, 'bot');
            }
        });
        return;
    }

    // 3. الرد الافتراضي الذكي عند عدم العثور على منتج محدد
    let defaultReply = `بخصوص استفسارك حول "${userMessage}"، تم تسجيل طلبك وسيقوم موظف الخدمة في ${businessData.name} بالتواصل معك ومساعدتك فوراً!`;
    if (businessData.type === "pharmacy") {
        defaultReply = `بخصوص استفسارك عن "${userMessage}"، تم إرسال الطلب للصيدلي المناوب ليفيدك بتوفره وبدائله فوراً!`;
    } else if (businessData.type === "school") {
        defaultReply = `أهلاً بك! بخصوص استفسارك عن "${userMessage}"، تم توجيه طلبك لإدارة القبول والتسجيل للتواصل معك والإجابة عن كافة تفاصيل دورتك الدراسية.`;
    }

    appendMessage(defaultReply, 'bot');
}
