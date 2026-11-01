// Samajh: reads a pasted letter in the browser and builds a plain-language plan.
// No server and no API key needed. Everything runs on the user's device.

const $ = (s) => document.querySelector(s);
let lang = "en";

const SAMPLE = "NOTICE OF DISCONNECTION. Consumer No. 4471920. Our records show that electricity charges of Rs. 4,820 for the billing period August-September remain unpaid despite earlier reminders. Failing payment within 7 days of this notice, supply to your premises shall be disconnected under Section 56 of the Electricity Act without further notice. Reconnection will attract additional charges.";

const UI = {
  en: { risk: ["Low urgency", "Medium urgency", "High urgency"], deadline: "Deadline", amount: "Amount", none: "Not mentioned", steps: "What to do", scam: "Possible scam: ", tip: "Good to know: ", copy: "Copy plan", copied: "Copied", tooShort: "Paste a longer letter first, at least a couple of sentences.", reading: "Reading..." , explain: "Explain", in: "within ", days: " days", hours: " hours", now: "Immediately" },
  hi: { risk: ["कम ज़रूरी", "मध्यम ज़रूरी", "बहुत ज़रूरी"], deadline: "अंतिम समय", amount: "राशि", none: "नहीं लिखा", steps: "क्या करें", scam: "ठगी का शक: ", tip: "ध्यान रखें: ", copy: "योजना कॉपी करें", copied: "कॉपी हो गया", tooShort: "पहले पूरा पत्र पेस्ट करें, कम से कम दो-तीन वाक्य।", reading: "पढ़ रहे हैं...", explain: "समझाएँ", in: "", days: " दिन के अंदर", hours: " घंटे के अंदर", now: "तुरंत" }
};

const TYPES = {
  bill: {
    kw: ["electricity", "power", "supply", "meter", "consumer no", "water bill", "gas", "disconnect", "discom", "kesco", "billing"],
    en: { name: "Utility bill or disconnection notice", sum: "This is a notice about an unpaid utility bill. If it is not paid in time, your supply can be cut and reconnecting costs extra.",
      steps: ["Check the amount against your last paid receipt.", "Pay on the official website, app or collection counter only.", "Keep the receipt or a screenshot as proof.", "If the amount looks wrong, complain to the consumer helpline before the deadline."],
      tip: "Reconnection usually costs more than paying on time." },
    hi: { name: "बिजली, पानी या गैस का नोटिस", sum: "यह बिल न भरने का नोटिस है। समय पर भुगतान न करने पर कनेक्शन कट सकता है और दोबारा जुड़वाने में अतिरिक्त पैसे लगते हैं।",
      steps: ["अपनी पिछली रसीद से राशि मिलाएँ।", "सिर्फ़ आधिकारिक वेबसाइट, ऐप या काउंटर पर भुगतान करें।", "रसीद या स्क्रीनशॉट सँभालकर रखें।", "राशि ग़लत लगे तो समय सीमा से पहले उपभोक्ता हेल्पलाइन पर शिकायत करें।"],
      tip: "कनेक्शन दोबारा जुड़वाना समय पर बिल भरने से महँगा पड़ता है।" }
  },
  bank: {
    kw: ["bank", "loan", "emi", "account", "kyc", "credit card", "overdue", "npa", "repayment", "cheque", "ifsc", "debit"],
    en: { name: "Bank or loan notice", sum: "This is a message from a bank or lender about your account, a loan, or a document they need from you.",
      steps: ["Open your bank's official app or visit the branch to confirm the notice is real.", "Check the dues or the document asked for.", "Pay or submit only through official channels.", "Ask for a written receipt or acknowledgement."],
      tip: "Real banks never ask for your OTP, PIN or password." },
    hi: { name: "बैंक या लोन का नोटिस", sum: "यह बैंक या कर्ज़ देने वाली संस्था का संदेश है, आपके खाते, लोन या किसी ज़रूरी दस्तावेज़ के बारे में।",
      steps: ["बैंक के आधिकारिक ऐप या शाखा में जाकर पुष्टि करें कि नोटिस असली है।", "बकाया राशि या माँगे गए दस्तावेज़ की जाँच करें।", "भुगतान या दस्तावेज़ सिर्फ़ आधिकारिक माध्यम से दें।", "लिखित रसीद या पावती ज़रूर लें।"],
      tip: "असली बैंक कभी आपका OTP, पिन या पासवर्ड नहीं माँगते।" }
  },
  tax: {
    kw: ["income tax", "gst", "assessment", "tax", "itr", "pan", "refund", "demand notice", "return", "tds"],
    en: { name: "Tax notice", sum: "This is a tax department notice. It may ask for a missing return, a payment, or an explanation of a mismatch.",
      steps: ["Find the section number and the reply date on the notice.", "Log in to the official tax portal and look for the same notice.", "Gather the documents it asks for.", "Reply on the portal before the date, or take help from a tax professional."],
      tip: "Always reply on the official portal, never through links in messages." },
    hi: { name: "टैक्स नोटिस", sum: "यह टैक्स विभाग का नोटिस है। इसमें छूटा हुआ रिटर्न, भुगतान या किसी अंतर का स्पष्टीकरण माँगा जा सकता है।",
      steps: ["नोटिस में धारा संख्या और जवाब की तारीख देखें।", "आधिकारिक टैक्स पोर्टल पर लॉगिन करके वही नोटिस ढूँढें।", "माँगे गए दस्तावेज़ इकट्ठा करें।", "तारीख से पहले पोर्टल पर जवाब दें या किसी टैक्स सलाहकार की मदद लें।"],
      tip: "जवाब हमेशा आधिकारिक पोर्टल पर दें, संदेश में आए लिंक से नहीं।" }
  },
  court: {
    kw: ["court", "summons", "hearing", "plaintiff", "defendant", "advocate", "magistrate", "petition", "legal notice", "decree", "appear"],
    en: { name: "Court or legal notice", sum: "This is a legal notice or court paper. It usually tells you to appear on a date or to respond in writing.",
      steps: ["Note the court name, case number and the date you must appear.", "Do not ignore it. Missing a date can lead to an order against you.", "Contact a lawyer or the free legal aid office (DLSA) in your district.", "Keep every paper and the envelope safe."],
      tip: "Free legal aid is available through the District Legal Services Authority." },
    hi: { name: "अदालत या क़ानूनी नोटिस", sum: "यह क़ानूनी नोटिस या अदालती काग़ज़ है। इसमें आम तौर पर किसी तारीख़ को पेश होने या लिखित जवाब देने को कहा जाता है।",
      steps: ["अदालत का नाम, केस नंबर और पेश होने की तारीख़ नोट करें।", "इसे अनदेखा न करें। तारीख़ चूकने पर आपके ख़िलाफ़ आदेश हो सकता है।", "वकील या अपने ज़िले के मुफ़्त क़ानूनी सहायता कार्यालय (DLSA) से मिलें।", "सारे काग़ज़ और लिफ़ाफ़ा सँभालकर रखें।"],
      tip: "ज़िला विधिक सेवा प्राधिकरण से मुफ़्त क़ानूनी मदद मिल सकती है।" }
  },
  college: {
    kw: ["college", "university", "exam", "admission", "fee", "scholarship", "semester", "hostel", "student", "registrar", "marks"],
    en: { name: "College or exam notice", sum: "This is a notice from a college or university about fees, exams, admission or a scholarship.",
      steps: ["Note the last date and the exact documents or fee required.", "Confirm the notice on the official website or with the office.", "Submit before the last date and keep the acknowledgement.", "If anything is unclear, visit the department office early."],
      tip: "Late fees and missed forms are the most common reasons students lose seats." },
    hi: { name: "कॉलेज या परीक्षा का नोटिस", sum: "यह कॉलेज या विश्वविद्यालय का नोटिस है, फ़ीस, परीक्षा, प्रवेश या छात्रवृत्ति के बारे में।",
      steps: ["अंतिम तिथि और माँगे गए दस्तावेज़ या फ़ीस ठीक से नोट करें।", "आधिकारिक वेबसाइट या कार्यालय से नोटिस की पुष्टि करें।", "अंतिम तिथि से पहले जमा करें और पावती सँभालें।", "कुछ समझ न आए तो जल्दी विभाग कार्यालय जाएँ।"],
      tip: "लेट फ़ीस और छूटे फ़ॉर्म की वजह से ही छात्र अक्सर सीट खोते हैं।" }
  },
  general: {
    kw: [],
    en: { name: "Official letter", sum: "This looks like an official letter that asks you to act or respond.",
      steps: ["Find who sent it and check they are real by contacting them through an official number.", "Note the date, amount and anything you must send back.", "Reply or pay only through official channels.", "Keep a copy of the letter and of anything you send."],
      tip: "When in doubt, visit the issuing office in person." },
    hi: { name: "सरकारी या आधिकारिक पत्र", sum: "यह एक आधिकारिक पत्र लगता है जिसमें आपसे कुछ करने या जवाब देने को कहा गया है।",
      steps: ["भेजने वाले को पहचानें और आधिकारिक नंबर पर बात करके पुष्टि करें।", "तारीख़, राशि और जो भेजना है, नोट करें।", "जवाब या भुगतान सिर्फ़ आधिकारिक माध्यम से करें।", "पत्र और भेजी गई हर चीज़ की कॉपी रखें।"],
      tip: "शक हो तो संबंधित कार्यालय में खुद जाकर पूछें।" }
  }
};

const SCAM = [
  { re: /\b(otp|cvv|password|pin number|share your pin)\b/i, en: "It asks for an OTP, PIN or password. Never share these.", hi: "इसमें OTP, पिन या पासवर्ड माँगा गया है। इन्हें कभी साझा न करें।" },
  { re: /(click (the |this )?(link|here)|bit\.ly|tinyurl|http:\/\/)/i, en: "It pushes you to click a link. Open the official website yourself instead.", hi: "इसमें लिंक पर क्लिक करने को कहा गया है। इसके बजाय आधिकारिक वेबसाइट खुद खोलें।" },
  { re: /(lottery|you have won|prize money|gift card|claim your reward)/i, en: "It talks about a prize or reward. This is a common scam.", hi: "इसमें इनाम या लॉटरी की बात है। यह ठगी का आम तरीका है।" },
  { re: /(pay (to|on) (this )?(personal|mobile|phone)|transfer to (this )?(number|account)|upi id)/i, en: "It asks you to pay to a personal number or account.", hi: "इसमें किसी निजी नंबर या खाते में पैसे भेजने को कहा गया है।" }
];

const HIGH = ["disconnect", "penalty", "legal action", "court", "arrest", "recovery", "blacklist", "seize", "terminate", "suspend", "final notice", "last notice", "prosecution", "summons", "attach"];
const MED = ["reminder", "overdue", "due", "pending", "unpaid", "fine", "interest", "submit", "verify", "failing", "default", "late fee"];

function analyze(text) {
  const t = text.toLowerCase();

  let best = "general", top = 0;
  for (const [key, def] of Object.entries(TYPES)) {
    const score = def.kw.filter((k) => t.includes(k)).length;
    if (score > top) { top = score; best = key; }
  }

  const amounts = [...text.matchAll(/(?:rs\.?|inr|₹)\s?([\d,]+(?:\.\d+)?)/gi)]
    .map((m) => ({ raw: m[0].replace(/\s+/g, " "), n: parseFloat(m[1].replace(/,/g, "")) }))
    .filter((a) => !isNaN(a.n));
  const amount = amounts.length ? amounts.sort((a, b) => b.n - a.n)[0].raw : null;

  let deadline = null;
  const rel = text.match(/within\s+(\d+)\s*(day|hour)s?/i);
  const date = text.match(/\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b|\b\d{1,2}(?:st|nd|rd|th)?\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s\d{4}\b/i);
  if (rel) deadline = { n: rel[1], unit: rel[2].toLowerCase() };
  else if (date) deadline = { text: date[0] };
  else if (/immediately|forthwith|at once|urgent/i.test(text)) deadline = { now: true };

  const flags = SCAM.filter((s) => s.re.test(text));
  let score = HIGH.filter((k) => t.includes(k)).length * 2 + MED.filter((k) => t.includes(k)).length;
  if (flags.length) score += 3;
  const risk = score >= 3 ? 2 : score >= 1 ? 1 : 0;

  return { type: best, amount, deadline, flags, risk };
}

function deadlineText(d, L) {
  if (!d) return L.none;
  if (d.now) return L.now;
  if (d.text) return d.text;
  return L.in + d.n + (d.unit === "hour" ? L.hours : L.days);
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function render(text) {
  const L = UI[lang], r = analyze(text), T = TYPES[r.type][lang];
  const level = ["low", "medium", "high"][r.risk];
  const note = r.flags.length
    ? `<div class="alert scam"><strong>${L.scam}</strong>${esc(r.flags.map((f) => f[lang]).join(" "))}</div>`
    : `<div class="alert"><strong>${L.tip}</strong>${esc(T.tip)}</div>`;

  $("#out").innerHTML = `<div class="res">
    <p class="kind">${esc(T.name)}</p>
    <h3>${esc(T.sum)}</h3>
    <div class="meter risk-${level}"><span class="bars"><i></i><i></i><i></i></span>${L.risk[r.risk]}</div>
    <div class="facts">
      <div class="fact"><small>${L.deadline}</small><strong>${esc(deadlineText(r.deadline, L))}</strong></div>
      <div class="fact"><small>${L.amount}</small><strong>${esc(r.amount || L.none)}</strong></div>
    </div>
    <p class="steps-title">${L.steps}</p>
    <ol>${T.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    ${note}
    <button class="ghost copy" id="copy" type="button">${L.copy}</button>
  </div>`;

  $("#copy").onclick = async (e) => {
    const plan = `${T.name}\n${T.sum}\n\n${L.deadline}: ${deadlineText(r.deadline, L)}\n${L.amount}: ${r.amount || L.none}\n\n${L.steps}:\n${T.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    try { await navigator.clipboard.writeText(plan); e.target.textContent = L.copied; } catch (_) {}
  };
}

$("#sample").onclick = () => { $("#letter").value = SAMPLE; };

document.querySelectorAll(".seg button").forEach((b) => {
  b.onclick = () => {
    lang = b.dataset.lang;
    document.querySelectorAll(".seg button").forEach((x) => x.classList.toggle("on", x === b));
    const text = $("#letter").value.trim();
    if (text.length >= 20) render(text);
  };
});

$("#go").onclick = () => {
  const text = $("#letter").value.trim();
  if (text.length < 20) {
    $("#out").innerHTML = `<div class="empty"><p class="empty-title">${UI[lang].tooShort}</p></div>`;
    return;
  }
  render(text);
  if (window.innerWidth < 860) $("#out").scrollIntoView({ behavior: "smooth", block: "start" });
};
