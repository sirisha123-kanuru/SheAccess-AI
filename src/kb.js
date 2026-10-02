import { EXTRA } from "./kb_extra.js"
// Offline knowledge base: works with no API key. Gemini is used when available.
export const SCHEMES = [
  { id: 'scholar', icon: '🎓', url: 'https://scholarships.gov.in',
    k: ['scholar', 'school', 'study', 'fee', 'college', 'education', 'छात्रवृत्ति', 'पढ़', 'स्कूल', 'पढ़ाई', 'உதவித்தொகை', 'கல்வி', 'படி', 'பள்ளி'],
    name: { en: 'National Scholarship Portal', hi: 'राष्ट्रीय छात्रवृत्ति पोर्टल', ta: 'தேசிய கல்வி உதவித்தொகை' },
    intro: { en: 'This scheme gives money for a girl’s studies.', hi: 'यह योजना बेटी की पढ़ाई के लिए पैसे देती है।', ta: 'இந்தத் திட்டம் பெண்ணின் படிப்புக்குப் பணம் தருகிறது.' },
    docs: { en: ['Aadhaar card', 'Bank passbook', 'School certificate', 'Income certificate'], hi: ['आधार कार्ड', 'बैंक पासबुक', 'स्कूल प्रमाणपत्र', 'आय प्रमाणपत्र'], ta: ['ஆதார் அட்டை', 'வங்கிப் புத்தகம்', 'பள்ளிச் சான்றிதழ்', 'வருமானச் சான்றிதழ்'] },
    steps: {
      en: ['Keep your Aadhaar card, bank passbook and school certificate ready.', 'Go to the nearest Common Service Centre, called CSC, or ask the school office.', 'Tell them: I want to apply for a scholarship. They will fill the form for you.', 'Keep the receipt safe. Money comes to your bank account.'],
      hi: ['आधार कार्ड, बैंक पासबुक और स्कूल का प्रमाणपत्र तैयार रखिए।', 'पास के जन सेवा केंद्र, यानी सीएससी, या स्कूल के दफ़्तर जाइए।', 'कहिए: मुझे छात्रवृत्ति का फ़ॉर्म भरना है। वे आपके लिए फ़ॉर्म भर देंगे।', 'रसीद संभालकर रखिए। पैसा आपके बैंक खाते में आएगा।'],
      ta: ['ஆதார் அட்டை, வங்கிப் புத்தகம், பள்ளிச் சான்றிதழ் தயாராக வையுங்கள்.', 'அருகிலுள்ள பொது சேவை மையம் அல்லது பள்ளி அலுவலகத்துக்குப் போங்கள்.', 'எனக்கு உதவித்தொகைக்கு விண்ணப்பிக்க வேண்டும் என்று சொல்லுங்கள். அவர்கள் படிவத்தை நிரப்புவார்கள்.', 'ரசீதைப் பத்திரமாக வையுங்கள். பணம் உங்கள் வங்கிக் கணக்கில் வரும்.'] } },
  { id: 'health', icon: '🏥', url: 'https://pmjay.gov.in',
    k: ['health', 'hospital', 'doctor', 'medical', 'insurance', 'treatment', 'ayushman', 'स्वास्थ्य', 'अस्पताल', 'इलाज', 'बीमा', 'दवा', 'மருத்துவ', 'சிகிச்சை', 'காப்பீடு', 'மருத்துவமனை'],
    name: { en: 'Ayushman Bharat (PM-JAY)', hi: 'आयुष्मान भारत', ta: 'ஆயுஷ்மான் பாரத்' },
    intro: { en: 'This scheme gives free hospital treatment up to five lakh rupees.', hi: 'यह योजना अस्पताल में पाँच लाख रुपये तक मुफ़्त इलाज देती है।', ta: 'இந்தத் திட்டம் ஐந்து லட்சம் ரூபாய் வரை இலவச மருத்துவமனை சிகிச்சை தருகிறது.' },
    docs: { en: ['Aadhaar card', 'Ration card'], hi: ['आधार कार्ड', 'राशन कार्ड'], ta: ['ஆதார் அட்டை', 'ரேஷன் அட்டை'] },
    steps: {
      en: ['Take your Aadhaar card and ration card.', 'Go to the nearest government hospital or CSC and ask for the Ayushman card.', 'They check your name on the list. If it is there, they make your card.', 'Show this card at the hospital for free treatment.'],
      hi: ['आधार कार्ड और राशन कार्ड साथ लीजिए।', 'पास के सरकारी अस्पताल या सीएससी में आयुष्मान कार्ड माँगिए।', 'वे सूची में आपका नाम देखेंगे। नाम हो तो कार्ड बन जाएगा।', 'इलाज के लिए अस्पताल में यह कार्ड दिखाइए।'],
      ta: ['ஆதார் அட்டை, ரேஷன் அட்டையை எடுத்துச் செல்லுங்கள்.', 'அருகிலுள்ள அரசு மருத்துவமனை அல்லது பொது சேவை மையத்தில் ஆயுஷ்மான் அட்டை கேளுங்கள்.', 'பட்டியலில் உங்கள் பெயரைப் பார்ப்பார்கள். இருந்தால் அட்டை செய்து தருவார்கள்.', 'சிகிச்சைக்கு மருத்துவமனையில் இந்த அட்டையைக் காட்டுங்கள்.'] } },
  { id: 'skill', icon: '🧵', url: 'https://www.skillindiadigital.gov.in',
    k: ['job', 'work', 'skill', 'train', 'earn', 'income', 'course', 'नौकरी', 'काम', 'रोजगार', 'प्रशिक्षण', 'कमाई', 'सीख', 'வேலை', 'பயிற்சி', 'சம்பாத', 'திறன்'],
    name: { en: 'Skill India (PMKVY)', hi: 'स्किल इंडिया', ta: 'ஸ்கில் இந்தியா' },
    intro: { en: 'This scheme gives free skill training, and a certificate that helps get work.', hi: 'यह योजना मुफ़्त हुनर सिखाती है और काम पाने में मदद करने वाला प्रमाणपत्र देती है।', ta: 'இந்தத் திட்டம் இலவசத் திறன் பயிற்சியும் வேலைக்கு உதவும் சான்றிதழும் தருகிறது.' },
    docs: { en: ['Aadhaar card', 'Bank passbook', 'Mobile number'], hi: ['आधार कार्ड', 'बैंक पासबुक', 'मोबाइल नंबर'], ta: ['ஆதார் அட்டை', 'வங்கிப் புத்தகம்', 'கைப்பேசி எண்'] },
    steps: {
      en: ['Keep your Aadhaar card, bank passbook and mobile number ready.', 'Go to the nearest Skill India training centre or CSC.', 'Tell them which work you like: sewing, beauty, computer or other.', 'They will enrol you in a free course and give a certificate at the end.'],
      hi: ['आधार कार्ड, बैंक पासबुक और मोबाइल नंबर तैयार रखिए।', 'पास के स्किल इंडिया प्रशिक्षण केंद्र या सीएससी जाइए।', 'बताइए कौन सा काम पसंद है: सिलाई, ब्यूटी, कंप्यूटर या कुछ और।', 'वे मुफ़्त कोर्स में नाम लिखेंगे और अंत में प्रमाणपत्र देंगे।'],
      ta: ['ஆதார் அட்டை, வங்கிப் புத்தகம், கைப்பேசி எண் தயாராக வையுங்கள்.', 'அருகிலுள்ள ஸ்கில் இந்தியா பயிற்சி மையம் அல்லது பொது சேவை மையத்துக்குப் போங்கள்.', 'தையல், அழகுக்கலை, கணினி போன்ற விருப்பமான வேலையைச் சொல்லுங்கள்.', 'இலவசப் பயிற்சியில் சேர்த்து, முடிவில் சான்றிதழ் தருவார்கள்.'] } }
]
const L = (o, lang) => o[lang] || o.en
export function localHelp(q, lang) {
  const t = q.toLowerCase()
  const score = (x) => x.k.reduce((n, w) => n + (t.includes(w.toLowerCase()) ? 1 : 0), 0)
  const best = SCHEMES.map((x) => [score(x), x]).sort((a, b) => b[0] - a[0])[0]
  const s = best && best[0] > 0 ? best[1] : null
  if (!s) return { scheme: null, reply: '', steps: [], url: 'https://web.umang.gov.in', live: false }
  return { scheme: s.id, name: L(s.name, lang), reply: L(s.intro, lang), steps: L(s.steps, lang), url: s.url, live: false }
}
export const localName = (id, lang) => { const s = SCHEMES.find((x) => x.id === id); return s ? L(s.name, lang) : '' }
export function localScam(t) {
  const x = t.toLowerCase()
  const hits = ['otp', 'http', 'bit.ly', 'click', 'lottery', 'prize', 'kyc', 'urgent', 'blocked', 'password', 'pin', 'send money', 'gift', 'ओटीपी', 'लॉटरी', 'इनाम', 'तुरंत', 'ஓடிபி', 'பரிசு', 'உடனே'].filter((w) => x.includes(w)).length
  return hits >= 3 ? 'HIGH' : hits >= 1 ? 'MEDIUM' : 'LOW'
}
for (const s of SCHEMES) { const x = EXTRA[s.id]; s.k.push(...x.k); for (const f of ['name', 'intro', 'docs', 'steps']) Object.assign(s[f], x[f]) }

// Words that speech recognition produces (native-script spellings of English words, common synonyms)
const MORE = {
  scholar: ['स्कॉलरशिप', 'स्कालरशिप', 'स्कॉलर', 'वजीफा', 'वज़ीफ़ा', 'फीस', 'बेटी', 'ஸ்காலர்ஷிப்', 'ஸ்காலர்', 'உதவி தொகை', 'கல்வி உதவி', 'மகள்', 'ஃபீஸ்', 'స్కాలర్షిప్', 'స్కాలర్‌షిప్', 'స్కాలర్', 'ఉపకారవేతనం', 'కూతురు', 'బిడ్డ', 'স্কলারশিপ', 'স্কলার', 'মেয়ে', 'ফিস', 'padhai', 'padai', 'beti', 'daughter', 'girl'],
  health: ['हेल्थ', 'डॉक्टर', 'दवाई', 'बीमार', 'बीमारी', 'आयुष्मान', 'ஹெல்த்', 'டாக்டர்', 'நோய்', 'உடல்நல', 'ஆயுஷ்மான்', 'మందులు', 'ఆయుష్మాన్', 'హెల్త్', 'అనారోగ్య', 'జబ్బు', 'হেলথ', 'অসুস্থ', 'আয়ুষ্মান', 'অসুখ', 'sick', 'medicine', 'pmjay', 'surgery', 'treat'],
  skill: ['जॉब', 'रोज़गार', 'ट्रेनिंग', 'सिलाई', 'हुनर', 'स्किल', 'ஜாப்', 'தையல்', 'ட்ரெயினிங்', 'ஸ்கில்', 'சம்பளம்', 'జాబ్', 'ఉద్యోగం', 'కుట్టు', 'ట్రైనింగ్', 'స్కిల్', 'జీతం', 'জব', 'সেলাই', 'ট্রেনিং', 'স্কিল', 'tailoring', 'sewing', 'salary', 'business']
}
for (const s of SCHEMES) s.k.push(...MORE[s.id])
