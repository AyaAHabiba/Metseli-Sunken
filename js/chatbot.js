// Simple rule-based bilingual chatbot for Metseli Sunken Museum

const chatbotBtn = document.getElementById('openChatbot');
const chatbotModal = document.getElementById('chatbotModal');
const closeChatbot = document.getElementById('closeChatbot');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

// Language state
let chatbotLang = 'en';

// Listen for language change from the language switcher
document.querySelectorAll('.language-options li').forEach(li => {
  li.addEventListener('click', function() {
    chatbotLang = this.getAttribute('data-lang');
    // Optional: clear chatbot messages and greet in new language
    chatbotMessages.innerHTML = '';
    addMessage(
      chatbotLang === 'ar'
        ? "مرحبًا بك في متحف متسيلي الغارق! كيف يمكنني مساعدتك اليوم؟"
        : "Welcome to Metseli Sunken Museum! How can I assist you today?"
    );
  });
});

chatbotBtn.onclick = () => chatbotModal.style.display = 'block';
closeChatbot.onclick = () => chatbotModal.style.display = 'none';

function addMessage(text, sender = 'bot') {
  const msg = document.createElement('div');
  msg.style.margin = '8px 0';
  msg.style.textAlign = sender === 'user' ? 'right' : 'left';
  msg.innerHTML = `<span style="background:${sender==='user'?'#0094ff':'#eee'};color:${sender==='user'?'#fff':'#222'};padding:7px 12px;border-radius:16px;display:inline-block;max-width:80%;">${text}</span>`;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getBotResponse(input) {
  const msg = input.toLowerCase();

  if (chatbotLang === 'ar') {

    if (msg.includes('مرحبا') || msg.includes('اهلا')) return "مرحبًا! كيف يمكنني مساعدتك في متحف متسيلي الغارق؟";
    if (msg.includes('اسمك')) return "اسمي متسيلي بوت، مساعدك لمتحف متسيلي الغارق.";
    if (msg.includes('تذكرة') || msg.includes('سعر')) return "يمكنك مشاهدة أسعار التذاكر في قسم الفعاليات والباقات. هل تريد تفاصيل عن فعالية أو باقة معينة؟";
    if (msg.includes('موقع')) return "يقع المتحف في شارع القصير، مرسى علم، طريق 65 (بجوار مارينا مرسى علم). راجع قسم التواصل للمزيد.";
    if (msg.includes('فعالية')) return "لدينا فعاليات متنوعة مثل مشاهدة المعالم من النوافذ، المسرح البدوي، المطعم تحت الماء، كبسولة الزمن، البازار التراثي، والغوص حول العجائب القديمة. اسأل عن أي فعالية للمزيد!";
    if (msg.includes('متجر') || msg.includes('هدايا')) return "يقدم متجرنا هدايا وتذكارات وكتب والمزيد. زر قسم المتجر للاستكشاف.";
    if (msg.includes('وقت') && msg.includes('فتح')) return "المتحف مفتوح من الساعة 9 صباحا حتي 9 مساءا للنوافذ وبعض الفعاليات. راجع قسم الفعاليات للمواعيد.";
    if (msg.includes('تواصل')) return "يمكنك التواصل معنا عبر البريد الإلكتروني: Metselisunkenmuseum@gmail.com أو الاتصال على +20 1276595483.";
    if (msg.includes('شكرا')) return "على الرحب والسعة! إذا كان لديك المزيد من الأسئلة فقط اسأل.";
    if (msg.includes('حجز')) return "اضغط على زر احجز الآن واملأ بياناتك ثم أرسلها.";
    if (msg.includes('إلغاء')|| msg.includes('استرجاع')) return "سيتم معالجة طلب الإلغاء أو الاسترجاع خلال 3 أيام عمل.";
    if (msg.includes('باقة ')) return "لدينا باقة مشاهدة المعالم من النوافذ وحضور المسرح البدوي معًا بسعر 175 جنيه للطلاب، 300 جنيه للمواطنين، و600 جنيه للأجانب."; 
    if (msg.includes('مشاهدة المعالم الأثرية من خلال نوافذ العرض')) return "متاحة طوال الوقت. يمكنك الاستمتاع بمشاهدة التماثيل الفرعونية والهياكل اليونانية والآثار تحت الماء من خلال نوافذ المراقبة البانورامية. السعر: 150 جنيه للطلاب، 250 جنيه للمواطنين، و500 جنيه للأجانب.";
    if (msg.includes('المسرح البدوي')) return "متاح كل يوم(الساعه: 12 ظهرا و 2 مساءا و 4 مساءا و 6 مساءا ). يقدم المسرح عروض موسيقية ورقصات وقصص تراثية لقبائل العبابدة والبشاريين. السعر: 75 جنيه للطلاب، 150 جنيه للمواطنين، و300 جنيه للأجانب.";
    if (msg.includes('الغوص')) return "متاح طوال الوقت من 10 صباحًا حتى 5 مساءً. يمكن للغواصين المعتمدين استكشاف تماثيل فرعونية مغمورة. السعر: 300 جنيه للطلاب، 450 جنيه للمواطنين، و800 جنيه للأجانب.";
    if (msg.includes('البازار')) return "متاح طوال الوقت. اكتشف الحرف اليدوية والتماثيل المقلدة والملابس التقليدية من قبائل العبابدة والبشاريين.";
    
    if (msg.includes('مطعم تحت الماء')) return "متاح طوال الوقت. استمتع بتجربة تناول الطعام الفريدة تحت الماء، محاطًا بجمال الشعاب المرجانية والحياة البحرية. نقدم مجموعة غنية من المأكولات الشرقية والدولية، بالإضافة إلى أطباق تقليدية من التراث العبابدي.";
  
    if (msg.includes('كبسولة الزمن')) return "اكتب رسالتك في كبسولة الزمن وسيتم دعوتك بعد 5 سنوات لفتحها (مجانًا).";
    return "أنا هنا للمساعدة! يمكنك أن تسأل عن التذاكر أو الفعاليات أو الموقع أو المتجر أو أي شيء عن المتحف.";
  }




  if (msg.includes('hello') || msg.includes('hi')) return "Hello! How can I help you with Metseli Sunken Museum?";
  if (msg.includes('what is your name')|| msg.includes('whats your name')|| msg.includes('whats ur name')) return "My name is Metseli Bot, your assistant for the Metseli Sunken Museum.";
  if (msg.includes('ticket') || msg.includes('price')) return "You can view ticket prices in the Events and Packages sections. Would you like details about a specific event or package?";
  if (msg.includes('location')) return "The museum is located at Al quseir Street, Marsa Alam, Road 65 (Next to Marina Marsa Alam). Check the Contact section for more details.";
  if (msg.includes('event')) return "We have various events including View the Monuments Through the Observation Windows, Bedouin Folklore Theater, Underwater Restaurant,Time capsule, The Heritage Bazaar, Dive Around Ancient Wonders . Ask about any event for details!";
  if (msg.includes('shop') || msg.includes('gift')) return "Our shop offers gifts, collectibles, books, and more. Visit the Shop section to explore.";
  if (msg.includes('open') && msg.includes('time')) return "The museum is open at 9.00 am - 9.00 pm for observation windows and some events. Check the Events section for specific timings.";
  if (msg.includes('contact')) return "You can contact us via email at Metselisunkenmuseum@gmail.com or call +20 1276595483.";
  if (msg.includes('thank')) return "You're welcome! If you have more questions, just ask.";
  if (msg.includes('book')) return "You will press on the Book Now button and fill your information then sumbit it.";
  if (msg.includes('cancel')|| msg.includes('refund')) return "We will process your cancellation or refund request within 3 working days.";
  
  if (msg.includes('package')) return "We have View the Monuments through the musuem windows and attend the Bedouin Folklore Theater togther with 175 EGP for student, 300 EGP for citizen and 600 EGP for foreign. Ask about any event for details!";
  
  if (msg.includes('underwater restaurant')) return "Avaliable all the time, Dive into a once-in-a-lifetime dining experience at our underwater restaurant, where you’re surrounded by the breathtaking beauty of the Red Sea’s coral reefs and marine life. Enjoy a rich selection of Oriental and international cuisines, complemented by authentic tribal dishes from the Ababda heritage—like the traditional “Salat” dish. With every bite, you’re not only tasting flavors, but also immersing yourself in culture, nature, and elegance beneath the waves.";
  
  if (msg.includes('view the monuments through the observation windows')) return "Avaliable all the time, Not a diver? No worries! Thanks to our panoramic underwater observation windows, you can still immerse yourself in the magic of ancient Egypt. Witness breathtaking Pharaonic statues, Greek architecture, and iconic underwater ruins surrounded by vibrant coral reefs and exotic marine life. It’s a visual experience that brings history and nature together—no diving suit required! The price for View the Monuments Through the Observation Windows is 150 EGP for students, 250 EGP for citizens, and 500 EGP for foreigners.";
  if (msg.includes('bedouin folklore theater')) return "Avaliable all the days (12 pm, 2 pm , 4pm , 6pm). This enchanting open-air theater offers a cultural journey through the rich heritage of the Ababda and Bishari tribes. Featuring live music, traditional dances, and storytelling, it brings the spirit of the desert to life. Blending Pharaonic architecture with Bedouin soul, the theater sits along the Red Sea shore, creating an unforgettable atmosphere that celebrates authenticity and artistry. Each night, lanterns glow and tribal songs echo, inviting visitors to experience a timeless piece of Egypt’s living heritage in an immersive and soulful setting. The price for View the Monuments Through the Observation Windows is 75 EGP for students, 150 EGP for citizens, and 300 EGP for foreigners.";
  if (msg.includes('dive around ancient wonders')) return "Avaliable all the time, 10.00 am- 5.00 pm. Prepare for an extraordinary adventure where history meets the deep blue. In this section of the museum, certified divers can explore majestic replicas of Pharaonic monuments, including towering statues, obelisks, and a life-sized Sphinx—all submerged beneath the Red Sea. This isn’t just a dive—it’s a journey through time, surrounded by vibrant coral reefs and timeless Egyptian heritage, offering an awe-inspiring fusion of culture and nature. The price for View the Monuments Through the Observation Windows is 300 EGP for students, 450 EGP for citizens, and 800 EGP for foreigners.";
  if (msg.includes('heritage bazaar')) return "Avaliable all the time. Where History Meets Handcrafts Step into our museum’s cultural bazaar and discover a diverse collection of replica statues from the Pharaonic, Greek, and Roman eras, as well as traditional clothing and crafts from the Ababda and Bishari tribes. From intricately carved artifacts to handwoven Bedouin garments, every item reflects a deep connection to Egypt’s rich and layered heritage. It’s more than just a market—it’s a living gallery of craftsmanship, offering authentic souvenirs and a direct way to support local communities.";
  if (msg.includes('time capsule')) return "your message in the time capsule and you will be invited after 5 years to open it and see the message you left (free charge)."; 
  return chatbotLang === 'ar'
    ? "أنا هنا للمساعدة! يمكنك أن تسأل عن التذاكر أو الفعاليات أو الموقع أو المتجر أو أي شيء عن المتحف."
    : "I'm here to help! You can ask about tickets, events, location, shop, or anything about the museum.";
}

chatbotForm.onsubmit = function(e) {
  e.preventDefault();
  const userInput = chatbotInput.value.trim();
  if (!userInput) return;
  addMessage(userInput, 'user');
  setTimeout(() => {
    addMessage(getBotResponse(userInput), 'bot');
  }, 500);
  chatbotInput.value = '';
};

// Greet on open if empty
chatbotBtn.addEventListener('click', () => {
  if (!chatbotMessages.innerHTML) {
    addMessage(
      chatbotLang === 'ar'
        ? "مرحبًا بك في متحف متسيلي الغارق! كيف يمكنني مساعدتك اليوم؟"
        : "Welcome to Metseli Sunken Museum! How can I assist you today?"
    );
  }
});