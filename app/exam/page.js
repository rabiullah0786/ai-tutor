
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ---------------- QUESTIONS BY CLASS ---------------- */
const QUESTIONS_BY_CLASS = {
  9: [
    // Level 1
    [
      { q: "Class 9 Math: 5 + 7 = ?", options: ["10", "11", "12", "13"], correct: 2 },
      { q: "2x + 3x = ?", options: ["5x", "6x", "2x", "3x"], correct: 0 },
      { q: "√81 = ?", options: ["7", "8", "9", "10"], correct: 2 },
      { q: "5 × 6 = ?", options: ["11", "30", "25", "35"], correct: 1 },
      { q: "Area of square side 4?", options: ["16", "8", "12", "20"], correct: 0 },
    ],
    // Level 2
    [
      { q: "9 Science: H2O is?", options: ["Water", "Oxygen", "Hydrogen", "CO2"], correct: 0 },
      { q: "Photosynthesis needs?", options: ["CO2", "O2", "N2", "H2"], correct: 0 },
      { q: "Earth layer with life?", options: ["Lithosphere", "Biosphere", "Hydrosphere", "Atmosphere"], correct: 1 },
      { q: "Force unit?", options: ["Joule", "Newton", "Pascal", "Watt"], correct: 1 },
      { q: "Electric current unit?", options: ["Volt", "Ampere", "Ohm", "Watt"], correct: 1 },
    ],
    // Level 3
    [
      { q: "Largest democracy?", options: ["USA", "China", "India", "Russia"], correct: 2 },
      { q: "UN stands for?", options: ["United Nation", "Union Nation", "United Network", "Universal Nation"], correct: 0 },
      { q: "Cutting trees called?", options: ["Afforestation", "Deforestation", "Reforestation", "Cultivation"], correct: 1 },
      { q: "Ganga of South?", options: ["Krishna", "Kaveri", "Godavari", "Yamuna"], correct: 2 },
      { q: "Plant roots absorb water by?", options: ["Diffusion", "Osmosis", "Evaporation", "Filtration"], correct: 1 },
    ],
    // Level 4
    [
      { q: "Speed of light approx?", options: ["3×10⁵ m/s", "3×10⁸ m/s", "3×10⁶ m/s", "3×10³ m/s"], correct: 1 },
      { q: "Mirror used in car?", options: ["Convex", "Concave", "Plane", "Spherical"], correct: 0 },
      { q: "SI unit of energy?", options: ["Joule", "Newton", "Watt", "Hertz"], correct: 0 },
      { q: "Which vitamin from sunlight?", options: ["A", "B12", "C", "D"], correct: 3 },
      { q: "Which organ purifies blood?", options: ["Heart", "Liver", "Kidney", "Lungs"], correct: 2 },
    ],
    // Level 5
    [
      { q: "Odd one out: 2,4,8,16,30", options: ["16", "8", "4", "30"], correct: 3 },
      { q: "CAT=3120, DOG=?", options: ["4157", "4720", "4158", "4170"], correct: 0 },
      { q: "Mirror of EAST?", options: ["TSAE", "SAET", "TAES", "TSAE"], correct: 1 },
      { q: "Next number? 5,11,17,23,?", options: ["26", "28", "29", "30"], correct: 1 },
      { q: "If A=1, Z=26, then C+D=?", options: ["5", "6", "3", "7"], correct: 0 },
    ],
  ],

  
  10: [
    // Level 1 — Math
    [
      { q: "Class 10 Math: 12 + 8 = ?", options: ["18", "20", "22", "24"], correct: 1 },
      { q: "5 × 7 = ?", options: ["30", "35", "25", "40"], correct: 1 },
      { q: "√64 = ?", options: ["6", "7", "8", "9"], correct: 2 },
      { q: "Area of square side 5?", options: ["20", "25", "15", "30"], correct: 1 },
      { q: "Value of (a+b)² if a=2, b=3?", options: ["10", "15", "25", "20"], correct: 2 },
    ],
    // Level 2 — English
    [
      { q: "Choose synonym of 'Happy'", options: ["Sad", "Joyful", "Angry", "Tired"], correct: 1 },
      { q: "Antonym of 'Generous'?", options: ["Kind", "Greedy", "Honest", "Brave"], correct: 1 },
      { q: "Fill: He ___ playing.", options: ["is", "am", "are", "be"], correct: 0 },
      { q: "Select correct spelling:", options: ["Accomodate", "Acommodate", "Accommodate", "Acommodete"], correct: 2 },
      { q: "Choose correct article: ___ apple a day keeps doctor away.", options: ["A", "An", "The", "No"], correct: 1 },
    ],
    // Level 3 — Social
    [
      { q: "Largest democracy in the world?", options: ["USA", "China", "India", "Russia"], correct: 2 },
      { q: "UN stands for?", options: ["United Nation", "Union Nation", "United Network", "Universal Nation"], correct: 0 },
      { q: "Cutting trees called?", options: ["Afforestation", "Deforestation", "Reforestation", "Cultivation"], correct: 1 },
      { q: "Ganga of South?", options: ["Krishna", "Kaveri", "Godavari", "Yamuna"], correct: 1 },
      { q: "Indian National Anthem writer?", options: ["Tagore", "Nehru", "Gandhi", "Bose"], correct: 0 },
    ],
    // Level 4 — Science
    [
      { q: "H2O is?", options: ["Water", "Oxygen", "Hydrogen", "CO2"], correct: 0 },
      { q: "Photosynthesis needs?", options: ["CO2", "O2", "N2", "H2"], correct: 0 },
      { q: "Force unit?", options: ["Joule", "Newton", "Pascal", "Watt"], correct: 1 },
      { q: "Electric current unit?", options: ["Volt", "Ampere", "Ohm", "Watt"], correct: 1 },
      { q: "Which vitamin from sunlight?", options: ["A", "B12", "C", "D"], correct: 3 },
    ],
    // Level 5 — Hindi
    [
      { q: "'पुस्तक' का पर्यायवाची क्या है?", options: ["किताब", "पाठ", "साहित्य", "निबंध"], correct: 0 },
      { q: "'विद्यालय' का पर्यायवाची?", options: ["स्कूल", "कॉलेज", "महाविद्यालय", "कक्षा"], correct: 0 },
      { q: "'सूर्य' का विलोम शब्द?", options: ["चाँद", "तारा", "दिन", "अंधकार"], correct: 3 },
      { q: "'जल' का विलोम?", options: ["अग्नि", "पानी", "सागर", "नदी"], correct: 0 },
      { q: "'सपना' का पर्यायवाची?", options: ["स्वप्न", "योजना", "कल्पना", "दृश्य"], correct: 0 },
    ],
  ],

  11: [
    // Level 1 — Math
    [
      { q: "Class 11 Math: 2x + 3x = ?", options: ["5x", "6x", "2x", "3x"], correct: 0 },
      { q: "Derivative of x²?", options: ["x", "2x", "x²", "2"], correct: 1 },
      { q: "∫dx of x?", options: ["1", "x", "x²/2", "2x"], correct: 2 },
      { q: "Solve: 3x - 5 = 10", options: ["5", "10", "15", "20"], correct: 2 },
      { q: "Value of √144?", options: ["10", "12", "14", "16"], correct: 1 },
    ],
    // Level 2 — English
    [
      { q: "Synonym of 'Brave'?", options: ["Coward", "Bold", "Afraid", "Fearless"], correct: 1 },
      { q: "Antonym of 'Honest'?", options: ["Truthful", "Loyal", "Dishonest", "Kind"], correct: 2 },
      { q: "Fill: He ___ studying.", options: ["is", "am", "are", "be"], correct: 0 },
      { q: "Choose correct tense: I ___ finished my work.", options: ["have", "has", "had", "having"], correct: 0 },
      { q: "Identify adverb: He runs quickly.", options: ["He", "runs", "quickly", "none"], correct: 2 },
    ],
    // Level 3 — Social
    [
      { q: "Who is the President of India?", options: ["Modi", "Droupadi Murmu", "Rajnath Singh", "Shah"], correct: 1 },
      { q: "Capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2 },
      { q: "UNHQ located in?", options: ["London", "New York", "Paris", "Geneva"], correct: 1 },
      { q: "Indian Independence Year?", options: ["1945", "1947", "1950", "1952"], correct: 1 },
      { q: "Which movement led by Gandhi?", options: ["Salt March", "Quit India", "Swadeshi", "None"], correct: 0 },
    ],
    // Level 1 - Physics
    [
      { q: "What is the SI unit of force?", options: ["Joule", "Newton", "Pascal", "Watt"], correct: 1 },
      { q: "Acceleration due to gravity on Earth?", options: ["9.8 m/s²", "10 m/s²", "8 m/s²", "9 m/s²"], correct: 0 },
      { q: "Velocity formula?", options: ["u+at", "s=ut+1/2at²", "F=ma", "p=mv"], correct: 0 },
      { q: "Work done formula?", options: ["W=F×d", "W=F/d", "W=Fd²", "W=F+d"], correct: 0 },
      { q: "Unit of power?", options: ["Joule", "Newton", "Watt", "Pascal"], correct: 2 },
    ],
    // Level 2 - Chemistry
    [
      { q: "Atomic number of Hydrogen?", options: ["1", "2", "3", "4"], correct: 0 },
      { q: "Formula of water?", options: ["H2O", "CO2", "O2", "H2"], correct: 0 },
      { q: "pH of neutral solution?", options: ["0", "7", "14", "1"], correct: 1 },
      { q: "NaCl is?", options: ["Acid", "Base", "Salt", "Metal"], correct: 2 },
      { q: "Avogadro's number?", options: ["6.022×10²³", "3.14", "9.8", "1.6×10⁻¹⁹"], correct: 0 },
    ],
  ],

  12: [
    // Level 1 — Math
    [
      { q: "Class 12 Math: Derivative of sinx?", options: ["cosx", "-cosx", "sinx", "-sinx"], correct: 0 },
      { q: "Integral of cosx dx?", options: ["sinx", "-sinx", "cosx", "-cosx"], correct: 0 },
      { q: "Limit of (1+1/n)^n as n→∞?", options: ["0", "1", "e", "∞"], correct: 2 },
      { q: "Solve: x² - 4 = 0", options: ["x=2", "x=-2", "x=±2", "x=0"], correct: 2 },
      { q: "Value of log10 100?", options: ["1", "2", "10", "100"], correct: 1 },
    ],
    // Level 2 — English
    [
      { q: "Synonym of 'Intelligent'?", options: ["Smart", "Dumb", "Lazy", "Fool"], correct: 0 },
      { q: "Antonym of 'Victory'?", options: ["Success", "Defeat", "Win", "Achievement"], correct: 1 },
      { q: "Choose correct: He ___ done his homework.", options: ["have", "has", "had", "having"], correct: 1 },
      { q: "Identify noun: The boy runs fast.", options: ["boy", "runs", "fast", "the"], correct: 0 },
      { q: "Select adjective: A beautiful garden.", options: ["beautiful", "garden", "A", "None"], correct: 0 },
    ],
    // Level 3 — Social
    [
      { q: "Capital of India?", options: ["Delhi", "Mumbai", "Chennai", "Kolkata"], correct: 0 },
      { q: "National Animal?", options: ["Tiger", "Lion", "Elephant", "Peacock"], correct: 0 },
      { q: "UN Headquarters?", options: ["Paris", "London", "New York", "Geneva"], correct: 2 },
      { q: "Year of Indian Republic?", options: ["1947", "1950", "1952", "1949"], correct: 1 },
      { q: "Nobel Prize in Physics 1921?", options: ["Einstein", "Curie", "Newton", "Tesla"], correct: 0 },
    ],
    // Level 1 - Physics
    [
      { q: "Unit of electric field?", options: ["V/m", "N", "W", "J"], correct: 0 },
      { q: "Charge of electron?", options: ["-1.6×10⁻¹⁹ C", "+1.6×10⁻¹⁹ C", "0", "1"], correct: 0 },
      { q: "Coulomb's law formula?", options: ["F=kq1q2/r²", "F=q1q2", "F=k/q1q2", "F=kq1/q2"], correct: 0 },
      { q: "Unit of magnetic flux?", options: ["Weber", "Tesla", "Ampere", "Volt"], correct: 0 },
      { q: "Ohm's law in conductor?", options: ["V=IR", "V=I+R", "V=I²R", "V=R/I"], correct: 0 },
    ],
    // Level 2 - Chemistry
    [
      { q: "Electronegativity of Fluorine?", options: ["4", "3", "2", "1"], correct: 0 },
      { q: "Molar mass of H2O?", options: ["18 g/mol", "16 g/mol", "20 g/mol", "22 g/mol"], correct: 0 },
      { q: "Ionic compound?", options: ["NaCl", "CH4", "H2O", "O2"], correct: 0 },
      { q: "Redox reaction example?", options: ["Zn+Cu²⁺ → Zn²⁺ + Cu", "H2O", "NaCl", "CO2"], correct: 0 },
      { q: "Strong base?", options: ["NaOH", "NH3", "CH3COOH", "HCl"], correct: 0 },
    ],
  ],

  // SSC random placeholder questions
  SSC: [
    // 1. General Knowledge (सामान्य ज्ञान)
    [
      { q: "भारत का राष्ट्रीय पशु कौन सा है?", options: ["शेर", "हाथी", "सिंह", "टाइगर"], correct: 3 },
      { q: "भारतीय संविधान कब लागू हुआ?", options: ["26 जनवरी 1950", "15 अगस्त 1947", "2 अक्टूबर 1950", "26 जनवरी 1949"], correct: 0 },
      { q: "भारत की राजधानी कौन सी है?", options: ["मुंबई", "दिल्ली", "कोलकाता", "चेन्नई"], correct: 1 },
      { q: "भारत का सबसे लंबा नदी कौन सा है?", options: ["गंगा", "यमुना", "गोदावरी", "सिंधु"], correct: 0 },
      { q: "भारत का राष्ट्रीय खेल कौन सा है?", options: ["हॉकी", "क्रिकेट", "फुटबॉल", "कबड्डी"], correct: 0 },
    ],
    // 2. Mathematics (गणित)
    [
      { q: "यदि 5x + 3 = 18, तो x = ?", options: ["2", "3", "4", "5"], correct: 1 },
      { q: "15 का 20% कितना होता है?", options: ["2", "3", "4", "5"], correct: 1 },
      { q: "7 × 8 =", options: ["54", "56", "48", "58"], correct: 1 },
      { q: "√144 =", options: ["10", "11", "12", "14"], correct: 2 },
      { q: "5 + 7 × 2 =", options: ["24", "19", "26", "20"], correct: 1 },
    ],
    // 3. Reasoning (तार्किक क्षमता)
    [
      { q: "अगर सभी A B हैं और सभी B C हैं, तो क्या सभी A C हैं?", options: ["हाँ", "नहीं", "कुछ हद तक", "कह नहीं सकते"], correct: 0 },
      { q: "5, 10, 20, 40, ?", options: ["60", "70", "80", "80"], correct: 3 },
      { q: "कौन सा शब्द बाकी तीनों से अलग है: सेब, केला, गाजर, अंगूर?", options: ["सेब", "केला", "गाजर", "अंगूर"], correct: 2 },
      { q: "Logic: अगर सभी कुर्सियाँ लकड़ी की हैं और कुछ लकड़ी की चीज़ें मेज हैं, तो क्या सभी मेज कुर्सियाँ हैं?", options: ["हाँ", "नहीं", "कुछ हद तक", "कह नहीं सकते"], correct: 1 },
      { q: "2, 4, 8, 16, ?", options: ["20", "24", "32", "30"], correct: 2 },
    ],
    // 4. English (अंग्रेज़ी)
    [
      { q: "'Happy' का पर्यायवाची शब्द क्या है?", options: ["Sad", "Joyful", "Angry", "Tired"], correct: 1 },
      { q: "'Big' का विलोम शब्द क्या है?", options: ["Large", "Small", "Tall", "Huge"], correct: 1 },
      { q: "Fill in: He ___ playing football.", options: ["is", "are", "am", "be"], correct: 0 },
      { q: "Choose correct article: ___ apple a day keeps doctor away.", options: ["A", "An", "The", "No"], correct: 1 },
      { q: "Select correct spelling:", options: ["Accomodate", "Acommodate", "Accommodate", "Acommodete"], correct: 2 },
    ],
    // 5. Social Science (सामाजिक विज्ञान)
    [
      { q: "भारतीय स्वतंत्रता संग्राम का नेतृत्व किसने किया?", options: ["महात्मा गांधी", "नेहरू", "सुभाष चंद्र बोस", "सावरकर"], correct: 0 },
      { q: "भारत में प्रथम संविधान सभा का गठन कब हुआ?", options: ["1946", "1947", "1950", "1952"], correct: 0 },
      { q: "भारत का राष्ट्रीय पक्षी कौन सा है?", options: ["मोर", "कबूतर", "गिद्ध", "सारस"], correct: 0 },
      { q: "गंगा नदी किस राज्य से होकर बहती है?", options: ["उत्तर प्रदेश", "बिहार", "उत्तराखंड", "सभी"], correct: 3 },
      { q: "भारत का संविधान किसने लिखा?", options: ["डॉ. राजेंद्र प्रसाद", "डॉ. भीमराव अंबेडकर", "गांधी", "नेहरू"], correct: 1 },
    ],
  ],

  // NEET random placeholder questions
  NEET: [
    [
      { q: "What is the SI unit of Force?", options: ["Joule", "Newton", "Pascal", "Watt"], correct: 1 },
      { q: "Acceleration due to gravity on Earth?", options: ["9.8 m/s²", "10 m/s²", "8 m/s²", "9 m/s²"], correct: 0 },
      { q: "Formula for velocity?", options: ["v = u + at", "v = u - at", "v = at²/2", "v = u² + 2as"], correct: 0 },
      { q: "Work done formula?", options: ["W = F × d", "W = F / d", "W = F + d", "W = F² × d"], correct: 0 },
      { q: "Power is defined as?", options: ["Work × Time", "Work / Time", "Force × Distance", "Energy × Time"], correct: 1 },
      { q: "Chemical formula of water?", options: ["H2O", "CO2", "O2", "H2"], correct: 0 },
      { q: "Atomic number of Hydrogen?", options: ["1", "2", "3", "4"], correct: 0 },
      { q: "pH of neutral solution?", options: ["7", "0", "14", "1"], correct: 0 },
      { q: "NaCl is a?", options: ["Acid", "Base", "Salt", "Metal"], correct: 2 },
      { q: "Molecular formula of Glucose?", options: ["C6H12O6", "CH4", "C2H5OH", "C12H22O11"], correct: 0 },

    ],
    [
      // 🧪 Chemistry
      { q: "Chemical formula of water?", options: ["H2O", "CO2", "O2", "H2"], correct: 0 },
      { q: "Atomic number of Hydrogen?", options: ["1", "2", "3", "4"], correct: 0 },
      { q: "pH of neutral solution?", options: ["7", "0", "14", "1"], correct: 0 },
      { q: "NaCl is a?", options: ["Acid", "Base", "Salt", "Metal"], correct: 2 },
      { q: "Molecular formula of Glucose?", options: ["C6H12O6", "CH4", "C2H5OH", "C12H22O11"], correct: 0 },
      { q: "Gas used in photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correct: 2 },
      { q: "Strong acid among following?", options: ["CH3COOH", "HCl", "H2CO3", "NH4OH"], correct: 1 },
      { q: "Atomic number of Oxygen?", options: ["6", "7", "8", "9"], correct: 2 },
      { q: "SI unit of amount of substance?", options: ["Gram", "Mole", "Kilogram", "Litre"], correct: 1 },
      { q: "Which is an alkali metal?", options: ["Sodium", "Calcium", "Iron", "Copper"], correct: 0 },
    ],

    [
      // 🌱 Biology
      { q: "Powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], correct: 2 },
      { q: "Functional unit of kidney?", options: ["Neuron", "Nephron", "Alveoli", "Axon"], correct: 1 },
      { q: "Which vitamin is synthesized in skin?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correct: 3 },
      { q: "Blood group universal donor?", options: ["A", "B", "AB", "O"], correct: 3 },
      { q: "Main site of photosynthesis?", options: ["Root", "Stem", "Leaf", "Flower"], correct: 2 },
      { q: "Genetic material in humans?", options: ["RNA", "Protein", "DNA", "Carbohydrate"], correct: 2 },
      { q: "Hormone regulating blood sugar?", options: ["Adrenaline", "Insulin", "Thyroxine", "Estrogen"], correct: 1 },
      { q: "Normal human body temperature?", options: ["35°C", "36°C", "37°C", "38°C"], correct: 2 },
      { q: "Part of brain controlling balance?", options: ["Cerebrum", "Medulla", "Cerebellum", "Pons"], correct: 2 },
      { q: "Which organ detoxifies blood?", options: ["Kidney", "Liver", "Heart", "Lung"], correct: 1 },
    ],

    [
      // ⚡ Physics
      { q: "SI unit of force?", options: ["Joule", "Watt", "Newton", "Pascal"], correct: 2 },
      { q: "Speed of light in vacuum?", options: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10⁵ m/s", "3×10⁷ m/s"], correct: 0 },
      { q: "Unit of electric current?", options: ["Volt", "Ohm", "Ampere", "Coulomb"], correct: 2 },
      { q: "Instrument used to measure electric current?", options: ["Voltmeter", "Ammeter", "Galvanometer", "Barometer"], correct: 1 },
      { q: "SI unit of work?", options: ["Watt", "Newton", "Joule", "Pascal"], correct: 2 },
      { q: "Which quantity has no direction?", options: ["Velocity", "Acceleration", "Force", "Speed"], correct: 3 },
      { q: "Energy stored in stretched spring?", options: ["Kinetic", "Thermal", "Potential", "Electrical"], correct: 2 },
      { q: "Mirror used in vehicle headlights?", options: ["Plane", "Convex", "Concave", "Cylindrical"], correct: 2 },
      { q: "Unit of frequency?", options: ["Second", "Hertz", "Meter", "Tesla"], correct: 1 },
      { q: "Which wave does not need medium?", options: ["Sound", "Water", "Electromagnetic", "Seismic"], correct: 2 }
    ],

    [
      { q: "Chemical formula of water?", options: ["H2O", "CO2", "O2", "H2"], correct: 0 },
      { q: "Atomic number of Hydrogen?", options: ["1", "2", "3", "4"], correct: 0 },
      { q: "pH of neutral solution?", options: ["7", "0", "14", "1"], correct: 0 },
      { q: "NaCl is a?", options: ["Acid", "Base", "Salt", "Metal"], correct: 2 },
      { q: "Molecular formula of Glucose?", options: ["C6H12O6", "CH4", "C2H5OH", "C12H22O11"], correct: 0 },
      { q: "Functional unit of kidney?", options: ["Neuron", "Nephron", "Alveoli", "Osteon"], correct: 1 },
      { q: "Photosynthesis occurs in?", options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"], correct: 1 },
      { q: "Human blood group AB has?", options: ["A antigen", "B antigen", "A and B antigen", "No antigen"], correct: 2 },
      { q: "Largest organ in human body?", options: ["Heart", "Liver", "Skin", "Lungs"], correct: 2 },
      { q: "Which vitamin helps in clotting?", options: ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin D"], correct: 2 },
    ],
  ],
}




/* -------------------- MAIN COMPONENT -------------------- */
export default function ExamPage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [level, setLevel] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [time, setTime] = useState(20);

  const QR_LINK = "https://televora.in";

  useEffect(() => setMounted(true), []);

  // Timer
  useEffect(() => {
    if (!mounted || finished || !selectedClass) return;
    if (time === 0) {
      nextQuestion();
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time, mounted, finished, selectedClass]);

  if (!mounted) return <div className="p-6 text-center">Loading Exam...</div>;

  // -------------------- CLASS SELECTION --------------------
  if (!selectedClass) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Select Your Class</h1>
        <div className="grid grid-cols-2 gap-4">
          {["9", "10", "11", "12", "SSC", "NEET"].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Class {cls}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const totalLevels = QUESTIONS_BY_CLASS[selectedClass].length;

  // ✅ NEET me 10 question per level, baki me jitne data me hain
  const totalQuestions =
    selectedClass === "NEET" ? 10 : QUESTIONS_BY_CLASS[selectedClass][level].length;

  const question = QUESTIONS_BY_CLASS[selectedClass][level][qIndex];

  const answer = (i) => {
    setSelectedOption(i);
    setTimeout(() => {
      if (i === question.correct) setScore((s) => s + 1);
      nextQuestion();
      setSelectedOption(null);
    }, 600);
  };

  const nextQuestion = () => {
    if (qIndex + 1 < totalQuestions) {
      setQIndex(qIndex + 1);
      setTime(30);
    } else if (level + 1 < totalLevels) {
      setLevel(level + 1);
      setQIndex(0);
      setTime(30);
    } else {
      setFinished(true);
    }
  };

  const getStudentName = () => {
    try {
      const email = session?.user?.email || "";
      const name = session?.user?.name || "";
      if (email.toLowerCase().endsWith("@gmail.com")) {
        if (name && name.trim() !== "") return name;
        const local = email.split("@")[0] || "Student";
        return local.charAt(0).toUpperCase() + local.slice(1);
      }
      return "Mr Boy";
    } catch (e) {
      return "Mr Boy";
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById("certificate-card");
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.addImage(img, "PNG", 0, 0, w, h);
    const studentName = getStudentName();
    pdf.save(`${studentName}-Televora-Certificate.pdf`);
  };

  // -------------------- CERTIFICATE --------------------
  if (finished) {
    const percent = Math.round((score / (totalLevels * totalQuestions)) * 100);
    const studentName = getStudentName();
    return (
      <div className="flex flex-col items-center p-6">
        <div id="certificate-card" className="relative w-full max-w-[900px] bg-gradient-to-br from-white to-gray-50 shadow-2xl border-4 border-yellow-500 p-4 sm:p-10 rounded-xl overflow-hidden h-[540px] sm:h-[600px]">
          <div className="absolute top-0 left-0 right-0 h-10 sm:h-16 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
          <h1 className="relative text-2xl sm:text-4xl font-extrabold text-yellow-700 mb-2 mt-4 py-2 text-center tracking-wider">Televora-AI Achievement Certificate</h1>
          <p className="relative text-sm sm:text-lg text-gray-600 mt-6 text-center">Awarded To</p>
          <p className="relative text-3xl sm:text-5xl font-bold text-gray-800 text-center mt-2">{studentName}</p>
          <p className="relative mt-6 text-xs sm:text-base text-gray-600 text-center px-4 sm:px-20">
            This certificate is proudly presented to <b>{studentName}</b> for successfully completing the Televora-AI Online Examination.
          </p>
          <div className="relative mt-4 sm:mt-8 text-center">
            <span className="text-sm sm:text-2xl font-semibold text-gray-800">Score: </span>
            <span className="text-sm sm:text-2xl font-extrabold">{score}</span>
            <span className="text-sm sm:text-2xl font-semibold text-gray-800"> / {totalLevels * totalQuestions}</span>
            <div className="mt-1 sm:mt-2 text-[10px] sm:text-base text-gray-600">Percentage: {percent}%</div>
          </div>
          <div className="absolute bottom-8 sm:bottom-14 right-4 sm:right-10 text-right text-[10px] sm:text-base">
            <p className="font-medium text-gray-700">Company</p>
            <p className="font-semibold text-xs sm:text-lg">Televora-AI</p>
          </div>
          <div className="absolute bottom-2 left-4 flex flex-col items-start">
            <img src="/qrcode.png" alt="QR" className="w-12 h-10 sm:w-24 sm:h-24 border p-1 bg-white rounded-sm shadow cursor-pointer" onClick={() => window.location.href = QR_LINK} />
            <div className="mt-1 text-[8px] sm:text-xs text-gray-600 leading-tight">
              <div>Scan to visit</div>
              <div className="font-semibold text-gray-800">televora.in</div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <button onClick={downloadPDF} className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg shadow-lg text-base sm:text-lg w-full sm:w-auto">Download Certificate PDF</button>
          <button onClick={() => { setSelectedClass(null); setLevel(0); setQIndex(0); setScore(0); setFinished(false); setTime(20); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg w-full sm:w-auto">Retake Exam</button>
        </div>
      </div>
    );
  }

  // -------------------- EXAM SCREEN --------------------
  const progress = ((level * totalQuestions + qIndex + 1) / (totalLevels * totalQuestions)) * 100;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Class {selectedClass} Exam - Level {level + 1}</h1>

      <div className="w-full bg-gray-200 h-3 rounded-full mb-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold">Question {qIndex + 1} / {totalQuestions}</h2>
        </div>
        <div className="text-red-500 font-bold">⏱ {time}s</div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm mb-4">
        <h3 className="text-xl font-semibold mb-3">{question.q}</h3>
        <div className="space-y-3">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correct;
            const isSelected = selectedOption === i;
            return (
              <button key={i} onClick={() => answer(i)} className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${isSelected ? (isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600") : "bg-gray-50 hover:bg-gray-100 border-gray-200"}`}>{opt}</button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
