import { useEffect, useMemo, useRef, useState } from "react";
import {
  getOfflineTransactions,
  saveOfflineTransaction,
} from "./offlineStorage";
import Stock from "./Stock";

const API_URL =
  "https://opulent-winner-97pjp6qxq9g9f66-5000.app.github.dev";

const DEMO_BENEFICIARY = {
  card: "RC1001",
  name: "Ravi Kumar",
  family: "4 Members",
  village: "Bengaluru",
  riceEntitlement: 20,
  wheatEntitlement: 10,
};

// English is the fallback language.
// Missing translations automatically display the English text.
const translations = {
  English: {},

  Kannada: {
    Dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "Beneficiary Search": "ಫಲಾನುಭವಿ ಹುಡುಕಾಟ",
    Authentication: "ದೃಢೀಕರಣ",
    Entitlement: "ಪಡಿತರ ಹಕ್ಕು",
    "Ration Distribution": "ಪಡಿತರ ವಿತರಣೆ",
    Transactions: "ವಹಿವಾಟುಗಳು",
    "Pending Transactions": "ಬಾಕಿ ವಹಿವಾಟುಗಳು",
    Stock: "ದಾಸ್ತಾನು",
    Settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "Shopkeeper Panel": "ಅಂಗಡಿ ಮಾಲೀಕರ ವಿಭಾಗ",
    "Smart Ration Management System": "ಸ್ಮಾರ್ಟ್ ಪಡಿತರ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ",
    "Total Beneficiaries": "ಒಟ್ಟು ಫಲಾನುಭವಿಗಳು",
    Connection: "ಸಂಪರ್ಕ",
    Online: "ಆನ್‌ಲೈನ್",
    Offline: "ಆಫ್‌ಲೈನ್",
    "Search Beneficiary": "ಫಲಾನುಭವಿಯನ್ನು ಹುಡುಕಿ",
    "Ration Card Number": "ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ",
    Search: "ಹುಡುಕಿ",
    "Beneficiary Details": "ಫಲಾನುಭವಿಯ ವಿವರಗಳು",
    Name: "ಹೆಸರು",
    Family: "ಕುಟುಂಬ",
    Village: "ಗ್ರಾಮ",
    Beneficiary: "ಫಲಾನುಭವಿ",
    "Beneficiary Authentication": "ಫಲಾನುಭವಿ ದೃಢೀಕರಣ",
    "Enter Demo OTP": "OTP ನಮೂದಿಸಿ",
    "Verify OTP": "OTP ಪರಿಶೀಲಿಸಿ",
    "Monthly Entitlement": "ಮಾಸಿಕ ಪಡಿತರ ಹಕ್ಕು",
    "Rice Entitlement": "ಅಕ್ಕಿ ಪಡಿತರ",
    "Wheat Entitlement": "ಗೋಧಿ ಪಡಿತರ",
    "Rice Quantity (kg)": "ಅಕ್ಕಿ ಪ್ರಮಾಣ (ಕೆಜಿ)",
    "Wheat Quantity (kg)": "ಗೋಧಿ ಪ್ರಮಾಣ (ಕೆಜಿ)",
    "Save Distribution": "ವಿತರಣೆಯನ್ನು ಉಳಿಸಿ",
    "Transaction History": "ವಹಿವಾಟಿನ ಇತಿಹಾಸ",
    "Transaction ID": "ವಹಿವಾಟು ID",
    "Card Number": "ಚೀಟಿ ಸಂಖ್ಯೆ",
    Status: "ಸ್ಥಿತಿ",
    Date: "ದಿನಾಂಕ",
    "Sync Now": "ಈಗ ಸಿಂಕ್ ಮಾಡಿ",
    "Syncing...": "ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...",
    Synced: "ಸಿಂಕ್ ಆಗಿದೆ",
    "Pending Offline": "ಆಫ್‌ಲೈನ್ ಬಾಕಿ",
    "Pending Sync": "ಸಿಂಕ್ ಬಾಕಿ",
    "Shop Stock": "ಅಂಗಡಿ ದಾಸ್ತಾನು",
    Language: "ಭಾಷೆ",
    "Welcome, Shopkeeper!": "ಸ್ವಾಗತ, ಅಂಗಡಿ ಮಾಲೀಕರೇ!",
    "Demo record": "ಡೆಮೊ ದಾಖಲೆ",
    "Saved in this browser": "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ",
    "Awaiting server sync": "ಸರ್ವರ್ ಸಿಂಕ್‌ಗಾಗಿ ಕಾಯುತ್ತಿದೆ",
    "Live browser connection status": "ಲೈವ್ ಬ್ರೌಸರ್ ಸಂಪರ್ಕ ಸ್ಥಿತಿ",
    "Demo beneficiary card": "ಡೆಮೊ ಫಲಾನುಭವಿ ಕಾರ್ಡ್",
    "Demo OTP": "ಡೆಮೊ OTP",
    "Search beneficiaries, verify OTP, check entitlement, distribute ration, and view saved transactions.":
      "ಫಲಾನುಭವಿಗಳನ್ನು ಹುಡುಕಿ, OTP ಪರಿಶೀಲಿಸಿ, ಪಡಿತರ ಹಕ್ಕನ್ನು ಪರಿಶೀಲಿಸಿ, ಪಡಿತರ ವಿತರಿಸಿ ಮತ್ತು ಉಳಿಸಿದ ವಹಿವಾಟುಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",
    "Beneficiary found successfully.": "ಫಲಾನುಭವಿ ಯಶಸ್ವಿಯಾಗಿ ಕಂಡುಬಂದಿದ್ದಾರೆ.",
    "Beneficiary not found. Try demo card RC1001.": "ಫಲಾನುಭವಿ ಕಂಡುಬಂದಿಲ್ಲ. RC1001 ಡೆಮೊ ಕಾರ್ಡ್ ಪ್ರಯತ್ನಿಸಿ.",
    "Search for a beneficiary first.": "ಮೊದಲು ಫಲಾನುಭವಿಯನ್ನು ಹುಡುಕಿ.",
    "Please authenticate the beneficiary first.": "ಮೊದಲು ಫಲಾನುಭವಿಯನ್ನು ದೃಢೀಕರಿಸಿ.",
    "Demo OTP verified successfully.": "ಡೆಮೊ OTP ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
    "Incorrect demo OTP. Use 123456.": "ತಪ್ಪಾದ ಡೆಮೊ OTP. 123456 ಬಳಸಿ.",
    "No transactions available yet.": "ಇನ್ನೂ ಯಾವುದೇ ವಹಿವಾಟುಗಳಿಲ್ಲ.",
    "Sync completed.": "ಸಿಂಕ್ ಪೂರ್ಣಗೊಂಡಿದೆ.",
    "Loading saved transactions...": "ಉಳಿಸಿದ ವಹಿವಾಟುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    "Pending count": "ಬಾಕಿ ವಹಿವಾಟುಗಳ ಸಂಖ್ಯೆ",
    "Authentication": "ದೃಢೀಕರಣ",
    Verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    "Not verified": "ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ",
    "Rice (kg)": "ಅಕ್ಕಿ (ಕೆಜಿ)",
    "Wheat (kg)": "ಗೋಧಿ (ಕೆಜಿ)",
    "No receipt available": "ರಸೀದಿ ಲಭ್ಯವಿಲ್ಲ",
    "Ration Distribution Receipt": "ಪಡಿತರ ವಿತರಣೆಯ ರಸೀದಿ",
    "Ration Card": "ಪಡಿತರ ಚೀಟಿ",
    "Thank you!": "ಧನ್ಯವಾದಗಳು!",
    "Print Receipt": "ರಸೀದಿ ಮುದ್ರಿಸಿ",
    "Back to Dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    "You are offline. Transactions remain saved on this device.":
      "ನೀವು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ. ವಹಿವಾಟುಗಳು ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಯುತ್ತವೆ.",
    "There are no pending transactions to sync.":
      "ಸಿಂಕ್ ಮಾಡಲು ಯಾವುದೇ ಬಾಕಿ ವಹಿವಾಟುಗಳಿಲ್ಲ.",
    "Saved locally. Starting server synchronization...":
      "ಸ್ಥಳೀಯವಾಗಿ ಉಳಿಸಲಾಗಿದೆ. ಸರ್ವರ್ ಸಿಂಕ್ ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ...",
    "Saved safely on this device while offline.":
      "ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿರುವಾಗ ಈ ಸಾಧನದಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಸಲಾಗಿದೆ.",
    "Insufficient stock available!": "ಸಾಕಷ್ಟು ದಾಸ್ತಾನು ಲಭ್ಯವಿಲ್ಲ!",
    "Storage": "ಸಂಗ್ರಹಣೆ",
    "Shopkeeper": "ಅಂಗಡಿ ಮಾಲೀಕ",
    "Demo Shopkeeper": "ಡೆಮೊ ಅಂಗಡಿ ಮಾಲೀಕ",
  },

  Telugu: {
    Dashboard: "డాష్‌బోర్డ్",
    "Beneficiary Search": "లబ్ధిదారుని శోధన",
    Authentication: "ధృవీకరణ",
    Entitlement: "రేషన్ అర్హత",
    "Ration Distribution": "రేషన్ పంపిణీ",
    Transactions: "లావాదేవీలు",
    "Pending Transactions": "పెండింగ్ లావాదేవీలు",
    Stock: "స్టాక్",
    Settings: "సెట్టింగులు",
    "Shopkeeper Panel": "దుకాణదారు ప్యానెల్",
    "Smart Ration Management System": "స్మార్ట్ రేషన్ నిర్వహణ వ్యవస్థ",
    "Total Beneficiaries": "మొత్తం లబ్ధిదారులు",
    Connection: "కనెక్షన్",
    Online: "ఆన్‌లైన్",
    Offline: "ఆఫ్‌లైన్",
    "Search Beneficiary": "లబ్ధిదారుని వెతకండి",
    "Ration Card Number": "రేషన్ కార్డు నంబర్",
    Search: "శోధించండి",
    "Beneficiary Details": "లబ్ధిదారుని వివరాలు",
    Name: "పేరు",
    Family: "కుటుంబం",
    Village: "గ్రామం",
    Beneficiary: "లబ్ధిదారు",
    "Beneficiary Authentication": "లబ్ధిదారు ధృవీకరణ",
    "Enter Demo OTP": "OTP నమోదు చేయండి",
    "Verify OTP": "OTP ధృవీకరించండి",
    "Monthly Entitlement": "నెలవారీ రేషన్ అర్హత",
    "Rice Entitlement": "బియ్యం అర్హత",
    "Wheat Entitlement": "గోధుమ అర్హత",
    "Rice Quantity (kg)": "బియ్యం పరిమాణం (కిలోలు)",
    "Wheat Quantity (kg)": "గోధుమ పరిమాణం (కిలోలు)",
    "Save Distribution": "పంపిణీని సేవ్ చేయండి",
    "Transaction History": "లావాదేవీల చరిత్ర",
    "Transaction ID": "లావాదేవీ ID",
    "Card Number": "కార్డు నంబర్",
    Status: "స్థితి",
    Date: "తేదీ",
    "Sync Now": "ఇప్పుడే సింక్ చేయండి",
    "Syncing...": "సింక్ అవుతోంది...",
    Synced: "సింక్ అయింది",
    "Pending Offline": "ఆఫ్‌లైన్ పెండింగ్",
    "Pending Sync": "సింక్ పెండింగ్",
    "Shop Stock": "దుకాణం స్టాక్",
    Language: "భాష",
    "Welcome, Shopkeeper!": "స్వాగతం, దుకాణదారుడా!",
    "Demo record": "డెమో రికార్డు",
    "Saved in this browser": "ఈ బ్రౌజర్‌లో సేవ్ చేయబడింది",
    "Awaiting server sync": "సర్వర్ సింక్ కోసం వేచి ఉంది",
    "Live browser connection status": "ప్రత్యక్ష బ్రౌజర్ కనెక్షన్ స్థితి",
    "Demo beneficiary card": "డెమో లబ్ధిదారు కార్డు",
    "Demo OTP": "డెమో OTP",
    "Search beneficiaries, verify OTP, check entitlement, distribute ration, and view saved transactions.":
      "లబ్ధిదారులను వెతకండి, OTP ధృవీకరించండి, రేషన్ అర్హతను తనిఖీ చేయండి, రేషన్ పంపిణీ చేయండి మరియు సేవ్ చేసిన లావాదేవీలను చూడండి.",
    "Beneficiary found successfully.": "లబ్ధిదారు విజయవంతంగా కనుగొనబడ్డారు.",
    "Beneficiary not found. Try demo card RC1001.": "లబ్ధిదారు కనబడలేదు. RC1001 డెమో కార్డును ప్రయత్నించండి.",
    "Search for a beneficiary first.": "ముందుగా లబ్ధిదారుని వెతకండి.",
    "Please authenticate the beneficiary first.": "ముందుగా లబ్ధిదారుని ధృవీకరించండి.",
    "Demo OTP verified successfully.": "డెమో OTP విజయవంతంగా ధృవీకరించబడింది.",
    "Incorrect demo OTP. Use 123456.": "తప్పు డెమో OTP. 123456 ఉపయోగించండి.",
    "No transactions available yet.": "ఇంకా లావాదేవీలు లేవు.",
    "Sync completed.": "సింక్ పూర్తయింది.",
    "Loading saved transactions...": "సేవ్ చేసిన లావాదేవీలు లోడ్ అవుతున్నాయి...",
    "Pending count": "పెండింగ్ సంఖ్య",
    "Authentication": "ధృవీకరణ",
    Verified: "ధృవీకరించబడింది",
    "Not verified": "ధృవీకరించబడలేదు",
    "Rice (kg)": "బియ్యం (కిలోలు)",
    "Wheat (kg)": "గోధుమ (కిలోలు)",
    "No receipt available": "రసీదు అందుబాటులో లేదు",
    "Ration Distribution Receipt": "రేషన్ పంపిణీ రసీదు",
    "Ration Card": "రేషన్ కార్డు",
    "Thank you!": "ధన్యవాదాలు!",
    "Print Receipt": "రసీదు ముద్రించండి",
    "Back to Dashboard": "డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",
    "You are offline. Transactions remain saved on this device.":
      "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. లావాదేవీలు ఈ పరికరంలో సేవ్ చేయబడతాయి.",
    "There are no pending transactions to sync.": "సింక్ చేయడానికి పెండింగ్ లావాదేవీలు లేవు.",
    "Saved locally. Starting server synchronization...": "స్థానికంగా సేవ్ చేయబడింది. సర్వర్ సింక్ ప్రారంభమవుతోంది...",
    "Saved safely on this device while offline.": "ఆఫ్‌లైన్‌లో ఉన్నప్పుడు ఈ పరికరంలో సురక్షితంగా సేవ్ చేయబడింది.",
    "Insufficient stock available!": "తగినంత స్టాక్ అందుబాటులో లేదు!",
    Storage: "నిల్వ",
    Shopkeeper: "దుకాణదారు",
    "Demo Shopkeeper": "డెమో దుకాణదారు",
  },

  Tamil: {
    Dashboard: "டாஷ்போர்டு",
    "Beneficiary Search": "பயனாளி தேடல்",
    Authentication: "அங்கீகாரம்",
    Entitlement: "ரேஷன் உரிமை",
    "Ration Distribution": "ரேஷன் விநியோகம்",
    Transactions: "பரிவர்த்தனைகள்",
    "Pending Transactions": "நிலுவை பரிவர்த்தனைகள்",
    Stock: "இருப்பு",
    Settings: "அமைப்புகள்",
    "Shopkeeper Panel": "கடைக்காரர் பகுதி",
    "Smart Ration Management System": "ஸ்மார்ட் ரேஷன் மேலாண்மை அமைப்பு",
    "Total Beneficiaries": "மொத்த பயனாளிகள்",
    Connection: "இணைப்பு",
    Online: "ஆன்லைன்",
    Offline: "ஆஃப்லைன்",
    "Search Beneficiary": "பயனாளியைத் தேடு",
    "Ration Card Number": "ரேஷன் அட்டை எண்",
    Search: "தேடு",
    "Beneficiary Details": "பயனாளர் விவரங்கள்",
    Name: "பெயர்",
    Family: "குடும்பம்",
    Village: "கிராமம்",
    Beneficiary: "பயனாளர்",
    "Beneficiary Authentication": "பயனாளர் அங்கீகாரம்",
    "Enter Demo OTP": "டெமோ OTP உள்ளிடவும்",
    "Verify OTP": "OTP சரிபார்",
    "Monthly Entitlement": "மாதாந்திர ரேஷன் உரிமை",
    "Rice Entitlement": "அரிசி உரிமை",
    "Wheat Entitlement": "கோதுமை உரிமை",
    "Rice Quantity (kg)": "அரிசி அளவு (கிலோ)",
    "Wheat Quantity (kg)": "கோதுமை அளவு (கிலோ)",
    "Save Distribution": "விநியோகத்தைச் சேமி",
    "Transaction History": "பரிவர்த்தனை வரலாறு",
    "Transaction ID": "பரிவர்த்தனை ID",
    "Card Number": "அட்டை எண்",
    Status: "நிலை",
    Date: "தேதி",
    "Sync Now": "இப்போது ஒத்திசை",
    "Syncing...": "ஒத்திசைக்கிறது...",
    Synced: "ஒத்திசைக்கப்பட்டது",
    "Pending Offline": "ஆஃப்லைனில் நிலுவை",
    "Pending Sync": "ஒத்திசைவு நிலுவை",
    "Shop Stock": "கடை இருப்பு",
    Language: "மொழி",
    "Welcome, Shopkeeper!": "வரவேற்கிறோம், கடைக்காரரே!",
    "Demo record": "செயல்விளக்க பதிவு",
    "Saved in this browser": "இந்த உலாவியில் சேமிக்கப்பட்டது",
    "Awaiting server sync": "சேவையக ஒத்திசைவுக்காக காத்திருக்கிறது",
    "Live browser connection status": "நேரடி உலாவி இணைப்பு நிலை",
    "Demo beneficiary card": "செயல்விளக்க பயனாளர் அட்டை",
    "Demo OTP": "செயல்விளக்க OTP",
    "Search beneficiaries, verify OTP, check entitlement, distribute ration, and view saved transactions.":
      "பயனாளிகளைத் தேடுங்கள், OTP சரிபார்க்கவும், ரேஷன் உரிமையைச் சரிபார்க்கவும், ரேஷனை விநியோகிக்கவும், சேமிக்கப்பட்ட பரிவர்த்தனைகளைப் பார்க்கவும்.",
    "Beneficiary found successfully.": "பயனாளர் வெற்றிகரமாகக் கண்டறியப்பட்டார்.",
    "Beneficiary not found. Try demo card RC1001.": "பயனாளர் கிடைக்கவில்லை. RC1001 டெமோ அட்டையை முயற்சிக்கவும்.",
    "Search for a beneficiary first.": "முதலில் பயனாளியைத் தேடுங்கள்.",
    "Please authenticate the beneficiary first.": "முதலில் பயனாளியை அங்கீகரிக்கவும்.",
    "Demo OTP verified successfully.": "டெமோ OTP வெற்றிகரமாகச் சரிபார்க்கப்பட்டது.",
    "Incorrect demo OTP. Use 123456.": "தவறான டெமோ OTP. 123456 பயன்படுத்தவும்.",
    "No transactions available yet.": "இன்னும் பரிவர்த்தனைகள் இல்லை.",
    "Sync completed.": "ஒத்திசைவு முடிந்தது.",
    "Loading saved transactions...": "சேமிக்கப்பட்ட பரிவர்த்தனைகள் ஏற்றப்படுகின்றன...",
    "Pending count": "நிலுவை எண்ணிக்கை",
    Verified: "சரிபார்க்கப்பட்டது",
    "Not verified": "சரிபார்க்கப்படவில்லை",
    "Rice (kg)": "அரிசி (கிலோ)",
    "Wheat (kg)": "கோதுமை (கிலோ)",
    "No receipt available": "ரசீது கிடைக்கவில்லை",
    "Ration Distribution Receipt": "ரேஷன் விநியோக ரசீது",
    "Ration Card": "ரேஷன் அட்டை",
    "Thank you!": "நன்றி!",
    "Print Receipt": "ரசீதை அச்சிடு",
    "Back to Dashboard": "டாஷ்போர்டுக்குத் திரும்பு",
    "You are offline. Transactions remain saved on this device.":
      "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். பரிவர்த்தனைகள் இந்தச் சாதனத்தில் சேமிக்கப்படும்.",
    "There are no pending transactions to sync.": "ஒத்திசைக்க நிலுவையில் உள்ள பரிவர்த்தனைகள் இல்லை.",
    "Saved locally. Starting server synchronization...": "உள்ளூரில் சேமிக்கப்பட்டது. சேவையக ஒத்திசைவு தொடங்குகிறது...",
    "Saved safely on this device while offline.": "ஆஃப்லைனில் இந்தச் சாதனத்தில் பாதுகாப்பாகச் சேமிக்கப்பட்டது.",
    "Insufficient stock available!": "போதுமான இருப்பு இல்லை!",
    Storage: "சேமிப்பு",
    Shopkeeper: "கடைக்காரர்",
    "Demo Shopkeeper": "டெமோ கடைக்காரர்",
  },

  Malayalam: {
    Dashboard: "ഡാഷ്ബോർഡ്",
    "Beneficiary Search": "ഗുണഭോക്താവിനെ തിരയുക",
    Authentication: "സ്ഥിരീകരണം",
    Entitlement: "റേഷൻ വിഹിതം",
    "Ration Distribution": "റേഷൻ വിതരണം",
    Transactions: "ഇടപാടുകൾ",
    "Pending Transactions": "തീർപ്പാക്കാത്ത ഇടപാടുകൾ",
    Stock: "സ്റ്റോക്ക്",
    Settings: "ക്രമീകരണങ്ങൾ",
    "Shopkeeper Panel": "കടയുടമ പാനൽ",
    "Smart Ration Management System": "സ്മാർട്ട് റേഷൻ മാനേജ്മെന്റ് സിസ്റ്റം",
    "Total Beneficiaries": "ആകെ ഗുണഭോക്താക്കൾ",
    Connection: "കണക്ഷൻ",
    Online: "ഓൺലൈൻ",
    Offline: "ഓഫ്‌ലൈൻ",
    "Search Beneficiary": "ഗുണഭോക്താവിനെ തിരയുക",
    "Ration Card Number": "റേഷൻ കാർഡ് നമ്പർ",
    Search: "തിരയുക",
    "Beneficiary Details": "ഗുണഭോക്താവിന്റെ വിവരങ്ങൾ",
    Name: "പേര്",
    Family: "കുടുംബം",
    Village: "ഗ്രാമം",
    Beneficiary: "ഗുണഭോക്താവ്",
    "Beneficiary Authentication": "ഗുണഭോക്തൃ സ്ഥിരീകരണം",
    "Enter Demo OTP": "ഡെമോ OTP നൽകുക",
    "Verify OTP": "OTP പരിശോധിക്കുക",
    "Monthly Entitlement": "പ്രതിമാസ റേഷൻ വിഹിതം",
    "Rice Entitlement": "അരി വിഹിതം",
    "Wheat Entitlement": "ഗോതമ്പ് വിഹിതം",
    "Rice Quantity (kg)": "അരിയുടെ അളവ് (കിലോ)",
    "Wheat Quantity (kg)": "ഗോതമ്പിന്റെ അളവ് (കിലോ)",
    "Save Distribution": "വിതരണം സംരക്ഷിക്കുക",
    "Transaction History": "ഇടപാട് ചരിത്രം",
    "Transaction ID": "ഇടപാട് ID",
    "Card Number": "കാർഡ് നമ്പർ",
    Status: "നില",
    Date: "തീയതി",
    "Sync Now": "ഇപ്പോൾ സമന്വയിപ്പിക്കുക",
    "Syncing...": "സമന്വയിപ്പിക്കുന്നു...",
    Synced: "സമന്വയിപ്പിച്ചു",
    "Pending Offline": "ഓഫ്‌ലൈനിൽ ബാക്കി",
    "Pending Sync": "സമന്വയം ബാക്കി",
    "Shop Stock": "കടയിലെ സ്റ്റോക്ക്",
    Language: "ഭാഷ",
    "Welcome, Shopkeeper!": "സ്വാഗതം, കടയുടമയേ!",
    "Demo record": "ഡെമോ രേഖ",
    "Saved in this browser": "ഈ ബ്രൗസറിൽ സംരക്ഷിച്ചു",
    "Awaiting server sync": "സെർവർ സിങ്കിനായി കാത്തിരിക്കുന്നു",
    "Live browser connection status": "തത്സമയ ബ്രൗസർ കണക്ഷൻ നില",
    "Demo beneficiary card": "ഡെമോ ഗുണഭോക്തൃ കാർഡ്",
    "Demo OTP": "ഡെമോ OTP",
    "Search beneficiaries, verify OTP, check entitlement, distribute ration, and view saved transactions.":
      "ഗുണഭോക്താക്കളെ തിരയുക, OTP പരിശോധിക്കുക, റേഷൻ വിഹിതം പരിശോധിക്കുക, റേഷൻ വിതരണം ചെയ്യുക, സംരക്ഷിച്ച ഇടപാടുകൾ കാണുക.",
    "Beneficiary found successfully.": "ഗുണഭോക്താവിനെ വിജയകരമായി കണ്ടെത്തി.",
    "Beneficiary not found. Try demo card RC1001.": "ഗുണഭോക്താവിനെ കണ്ടെത്തിയില്ല. RC1001 ഡെമോ കാർഡ് ശ്രമിക്കുക.",
    "Search for a beneficiary first.": "ആദ്യം ഗുണഭോക്താവിനെ തിരയുക.",
    "Please authenticate the beneficiary first.": "ആദ്യം ഗുണഭോക്താവിനെ സ്ഥിരീകരിക്കുക.",
    "Demo OTP verified successfully.": "ഡെമോ OTP വിജയകരമായി പരിശോധിച്ചു.",
    "Incorrect demo OTP. Use 123456.": "തെറ്റായ ഡെമോ OTP. 123456 ഉപയോഗിക്കുക.",
    "No transactions available yet.": "ഇതുവരെ ഇടപാടുകളൊന്നുമില്ല.",
    "Sync completed.": "സമന്വയം പൂർത്തിയായി.",
    "Loading saved transactions...": "സംരക്ഷിച്ച ഇടപാടുകൾ ലോഡ് ചെയ്യുന്നു...",
    "Pending count": "ബാക്കി ഇടപാടുകളുടെ എണ്ണം",
    Verified: "പരിശോധിച്ചു",
    "Not verified": "പരിശോധിച്ചിട്ടില്ല",
    "Rice (kg)": "അരി (കിലോ)",
    "Wheat (kg)": "ഗോതമ്പ് (കിലോ)",
    "No receipt available": "രസീത് ലഭ്യമല്ല",
    "Ration Distribution Receipt": "റേഷൻ വിതരണ രസീത്",
    "Ration Card": "റേഷൻ കാർഡ്",
    "Thank you!": "നന്ദി!",
    "Print Receipt": "രസീത് അച്ചടിക്കുക",
    "Back to Dashboard": "ഡാഷ്ബോർഡിലേക്ക് മടങ്ങുക",
    "You are offline. Transactions remain saved on this device.":
      "നിങ്ങൾ ഓഫ്‌ലൈനിലാണ്. ഇടപാടുകൾ ഈ ഉപകരണത്തിൽ സംരക്ഷിക്കപ്പെടും.",
    "There are no pending transactions to sync.": "സമന്വയിപ്പിക്കാൻ ബാക്കി ഇടപാടുകളില്ല.",
    "Saved locally. Starting server synchronization...": "പ്രാദേശികമായി സംരക്ഷിച്ചു. സെർവർ സമന്വയം ആരംഭിക്കുന്നു...",
    "Saved safely on this device while offline.": "ഓഫ്‌ലൈനിലായിരിക്കുമ്പോൾ ഈ ഉപകരണത്തിൽ സുരക്ഷിതമായി സംരക്ഷിച്ചു.",
    "Insufficient stock available!": "ആവശ്യത്തിന് സ്റ്റോക്ക് ലഭ്യമല്ല!",
    Storage: "സംഭരണം",
    Shopkeeper: "കടയുടമ",
    "Demo Shopkeeper": "ഡെമോ കടയുടമ",
  },

  Marathi: {
    Dashboard: "डॅशबोर्ड",
    "Beneficiary Search": "लाभार्थी शोध",
    Authentication: "प्रमाणीकरण",
    Entitlement: "रेशन पात्रता",
    "Ration Distribution": "रेशन वितरण",
    Transactions: "व्यवहार",
    "Pending Transactions": "प्रलंबित व्यवहार",
    Stock: "साठा",
    Settings: "सेटिंग्ज",
    "Shopkeeper Panel": "दुकानदार पॅनेल",
    "Smart Ration Management System": "स्मार्ट रेशन व्यवस्थापन प्रणाली",
    "Total Beneficiaries": "एकूण लाभार्थी",
    Connection: "कनेक्शन",
    Online: "ऑनलाइन",
    Offline: "ऑफलाइन",
    "Search Beneficiary": "लाभार्थी शोधा",
    "Ration Card Number": "रेशन कार्ड क्रमांक",
    Search: "शोधा",
    "Beneficiary Details": "लाभार्थी तपशील",
    Name: "नाव",
    Family: "कुटुंब",
    Village: "गाव",
    Beneficiary: "लाभार्थी",
    "Beneficiary Authentication": "लाभार्थी प्रमाणीकरण",
    "Enter Demo OTP": "डेमो OTP प्रविष्ट करा",
    "Verify OTP": "OTP सत्यापित करा",
    "Monthly Entitlement": "मासिक रेशन पात्रता",
    "Rice Entitlement": "तांदळाची पात्रता",
    "Wheat Entitlement": "गव्हाची पात्रता",
    "Rice Quantity (kg)": "तांदळाचे प्रमाण (किलो)",
    "Wheat Quantity (kg)": "गव्हाचे प्रमाण (किलो)",
    "Save Distribution": "वितरण जतन करा",
    "Transaction History": "व्यवहार इतिहास",
    "Transaction ID": "व्यवहार ID",
    "Card Number": "कार्ड क्रमांक",
    Status: "स्थिती",
    Date: "तारीख",
    "Sync Now": "आता सिंक करा",
    "Syncing...": "सिंक होत आहे...",
    Synced: "सिंक झाले",
    "Pending Offline": "ऑफलाइन प्रलंबित",
    "Pending Sync": "सिंक प्रलंबित",
    "Shop Stock": "दुकानाचा साठा",
    Language: "भाषा",
    "Welcome, Shopkeeper!": "स्वागत आहे, दुकानदार!",
    "Demo record": "डेमो नोंद",
    "Saved in this browser": "या ब्राउझरमध्ये जतन केले",
    "Awaiting server sync": "सर्व्हर सिंकची प्रतीक्षा आहे",
    "Live browser connection status": "थेट ब्राउझर कनेक्शन स्थिती",
    "Demo beneficiary card": "डेमो लाभार्थी कार्ड",
    "Demo OTP": "डेमो OTP",
    "Search beneficiaries, verify OTP, check entitlement, distribute ration, and view saved transactions.":
      "लाभार्थी शोधा, OTP सत्यापित करा, रेशन पात्रता तपासा, रेशन वितरित करा आणि जतन केलेले व्यवहार पहा.",
    "Beneficiary found successfully.": "लाभार्थी यशस्वीरित्या सापडला.",
    "Beneficiary not found. Try demo card RC1001.": "लाभार्थी सापडला नाही. RC1001 डेमो कार्ड वापरून पहा.",
    "Search for a beneficiary first.": "प्रथम लाभार्थी शोधा.",
    "Please authenticate the beneficiary first.": "प्रथम लाभार्थ्याचे प्रमाणीकरण करा.",
    "Demo OTP verified successfully.": "डेमो OTP यशस्वीरित्या सत्यापित झाला.",
    "Incorrect demo OTP. Use 123456.": "चुकीचा डेमो OTP. 123456 वापरा.",
    "No transactions available yet.": "अद्याप कोणतेही व्यवहार उपलब्ध नाहीत.",
    "Sync completed.": "सिंक पूर्ण झाले.",
    "Loading saved transactions...": "जतन केलेले व्यवहार लोड होत आहेत...",
    "Pending count": "प्रलंबित संख्या",
    Verified: "सत्यापित",
    "Not verified": "सत्यापित नाही",
    "Rice (kg)": "तांदूळ (किलो)",
    "Wheat (kg)": "गहू (किलो)",
    "No receipt available": "पावती उपलब्ध नाही",
    "Ration Distribution Receipt": "रेशन वितरण पावती",
    "Ration Card": "रेशन कार्ड",
    "Thank you!": "धन्यवाद!",
    "Print Receipt": "पावती प्रिंट करा",
    "Back to Dashboard": "डॅशबोर्डवर परत जा",
    "You are offline. Transactions remain saved on this device.":
      "तुम्ही ऑफलाइन आहात. व्यवहार या डिव्हाइसवर जतन राहतील.",
    "There are no pending transactions to sync.": "सिंक करण्यासाठी प्रलंबित व्यवहार नाहीत.",
    "Saved locally. Starting server synchronization...": "स्थानिकरित्या जतन केले. सर्व्हर सिंक सुरू होत आहे...",
    "Saved safely on this device while offline.": "ऑफलाइन असताना या डिव्हाइसवर सुरक्षितपणे जतन केले.",
    "Insufficient stock available!": "पुरेसा साठा उपलब्ध नाही!",
    Storage: "संचयन",
    Shopkeeper: "दुकानदार",
    "Demo Shopkeeper": "डेमो दुकानदार",
  },

  Hindi: {
    Dashboard: "डैशबोर्ड",
    "Beneficiary Search": "लाभार्थी खोज",
    Authentication: "प्रमाणीकरण",
    Entitlement: "राशन पात्रता",
    "Ration Distribution": "राशन वितरण",
    Transactions: "लेन-देन",
    "Pending Transactions": "लंबित लेन-देन",
    Stock: "स्टॉक",
    Settings: "सेटिंग्स",
    "Shopkeeper Panel": "दुकानदार पैनल",
    "Smart Ration Management System": "स्मार्ट राशन प्रबंधन प्रणाली",
    "Total Beneficiaries": "कुल लाभार्थी",
    Connection: "कनेक्शन",
    Online: "ऑनलाइन",
    Offline: "ऑफलाइन",
    "Search Beneficiary": "लाभार्थी खोजें",
    "Ration Card Number": "राशन कार्ड नंबर",
    Search: "खोजें",
    "Beneficiary Details": "लाभार्थी विवरण",
    Name: "नाम",
    Family: "परिवार",
    Village: "गाँव",
    Beneficiary: "लाभार्थी",
    "Beneficiary Authentication": "लाभार्थी प्रमाणीकरण",
    "Enter Demo OTP": "डेमो OTP दर्ज करें",
    "Verify OTP": "OTP सत्यापित करें",
    "Monthly Entitlement": "मासिक राशन पात्रता",
    "Rice Entitlement": "चावल पात्रता",
    "Wheat Entitlement": "गेहूँ पात्रता",
    "Rice Quantity (kg)": "चावल की मात्रा (किलो)",
    "Wheat Quantity (kg)": "गेहूँ की मात्रा (किलो)",
    "Save Distribution": "वितरण सहेजें",
    "Transaction History": "लेन-देन इतिहास",
    "Transaction ID": "लेन-देन ID",
    "Card Number": "कार्ड नंबर",
    Status: "स्थिति",
    Date: "तारीख",
    "Sync Now": "अभी सिंक करें",
    "Syncing...": "सिंक हो रहा है...",
    Synced: "सिंक हो गया",
    "Pending Offline": "ऑफलाइन लंबित",
    "Pending Sync": "सिंक लंबित",
    "Shop Stock": "दुकान का स्टॉक",
    Language: "भाषा",
    "Welcome, Shopkeeper!": "स्वागत है, दुकानदार!",
    "Demo record": "डेमो रिकॉर्ड",
    "Saved in this browser": "इस ब्राउज़र में सहेजा गया",
    "Awaiting server sync": "सर्वर सिंक की प्रतीक्षा है",
    "Live browser connection status": "लाइव ब्राउज़र कनेक्शन स्थिति",
    "Demo beneficiary card": "डेमो लाभार्थी कार्ड",
    "Demo OTP": "डेमो OTP",
    "Search beneficiaries, verify OTP, check entitlement, distribute ration, and view saved transactions.":
      "लाभार्थियों को खोजें, OTP सत्यापित करें, राशन पात्रता जांचें, राशन वितरित करें और सहेजे गए लेन-देन देखें।",
    "Beneficiary found successfully.": "लाभार्थी सफलतापूर्वक मिल गया।",
    "Beneficiary not found. Try demo card RC1001.": "लाभार्थी नहीं मिला। RC1001 डेमो कार्ड आज़माएँ।",
    "Search for a beneficiary first.": "पहले लाभार्थी खोजें।",
    "Please authenticate the beneficiary first.": "पहले लाभार्थी का प्रमाणीकरण करें।",
    "Demo OTP verified successfully.": "डेमो OTP सफलतापूर्वक सत्यापित हुआ।",
    "Incorrect demo OTP. Use 123456.": "गलत डेमो OTP। 123456 का उपयोग करें।",
    "No transactions available yet.": "अभी कोई लेन-देन उपलब्ध नहीं है।",
    "Sync completed.": "सिंक पूरा हुआ।",
    "Loading saved transactions...": "सहेजे गए लेन-देन लोड हो रहे हैं...",
    "Pending count": "लंबित संख्या",
    Verified: "सत्यापित",
    "Not verified": "सत्यापित नहीं",
    "Rice (kg)": "चावल (किलो)",
    "Wheat (kg)": "गेहूँ (किलो)",
    "No receipt available": "कोई रसीद उपलब्ध नहीं है",
    "Ration Distribution Receipt": "राशन वितरण रसीद",
    "Ration Card": "राशन कार्ड",
    "Thank you!": "धन्यवाद!",
    "Print Receipt": "रसीद प्रिंट करें",
    "Back to Dashboard": "डैशबोर्ड पर वापस जाएँ",
    "You are offline. Transactions remain saved on this device.":
      "आप ऑफलाइन हैं। लेन-देन इस डिवाइस पर सुरक्षित रहेंगे।",
    "There are no pending transactions to sync.": "सिंक करने के लिए कोई लंबित लेन-देन नहीं है।",
    "Saved locally. Starting server synchronization...": "स्थानीय रूप से सहेजा गया। सर्वर सिंक शुरू हो रहा है...",
    "Saved safely on this device while offline.": "ऑफलाइन होने पर इस डिवाइस पर सुरक्षित रूप से सहेजा गया।",
    "Insufficient stock available!": "पर्याप्त स्टॉक उपलब्ध नहीं है!",
    Storage: "स्टोरेज",
    Shopkeeper: "दुकानदार",
    "Demo Shopkeeper": "डेमो दुकानदार",
  },

  Bengali: {
    Dashboard: "ড্যাশবোর্ড",
    "Beneficiary Search": "উপভোক্তা অনুসন্ধান",
    Authentication: "যাচাইকরণ",
    Entitlement: "রেশন প্রাপ্যতা",
    "Ration Distribution": "রেশন বিতরণ",
    Transactions: "লেনদেন",
    "Pending Transactions": "বিচারাধীন লেনদেন",
    Stock: "স্টক",
    Settings: "সেটিংস",
    "Shopkeeper Panel": "দোকানদার প্যানেল",
    "Smart Ration Management System": "স্মার্ট রেশন ব্যবস্থাপনা সিস্টেম",
    "Total Beneficiaries": "মোট উপভোক্তা",
    Connection: "সংযোগ",
    Online: "অনলাইন",
    Offline: "অফলাইন",
    "Search Beneficiary": "উপভোক্তা খুঁজুন",
    "Ration Card Number": "রেশন কার্ড নম্বর",
    Search: "খুঁজুন",
    "Beneficiary Details": "উপভোক্তার বিবরণ",
    Name: "নাম",
    Family: "পরিবার",
    Village: "গ্রাম",
    Beneficiary: "উপভোক্তা",
    "Beneficiary Authentication": "উপভোক্তা যাচাইকরণ",
    "Enter Demo OTP": "ডেমো OTP লিখুন",
    "Verify OTP": "OTP যাচাই করুন",
    "Monthly Entitlement": "মাসিক রেশন প্রাপ্যতা",
    "Rice Entitlement": "চালের প্রাপ্যতা",
    "Wheat Entitlement": "গমের প্রাপ্যতা",
    "Rice Quantity (kg)": "চালের পরিমাণ (কেজি)",
    "Wheat Quantity (kg)": "গমের পরিমাণ (কেজি)",
    "Save Distribution": "বিতরণ সংরক্ষণ করুন",
    "Transaction History": "লেনদেনের ইতিহাস",
    "Transaction ID": "লেনদেন ID",
    "Card Number": "কার্ড নম্বর",
    Status: "অবস্থা",
    Date: "তারিখ",
    "Sync Now": "এখন সিঙ্ক করুন",
    "Syncing...": "সিঙ্ক হচ্ছে...",
    Synced: "সিঙ্ক হয়েছে",
    "Pending Offline": "অফলাইনে অপেক্ষমাণ",
    "Pending Sync": "সিঙ্ক অপেক্ষমাণ",
    "Shop Stock": "দোকানের স্টক",
    Language: "ভাষা",
    "Welcome, Shopkeeper!": "স্বাগতম, দোকানদার!",
    "Demo record": "ডেমো রেকর্ড",
    "Saved in this browser": "এই ব্রাউজারে সংরক্ষিত",
    "Awaiting server sync": "সার্ভার সিঙ্কের অপেক্ষায়",
    "Live browser connection status": "লাইভ ব্রাউজার সংযোগের অবস্থা",
    "Demo beneficiary card": "ডেমো উপভোক্তা কার্ড",
    "Demo OTP": "ডেমো OTP",
    "Search beneficiaries, verify OTP, check entitlement, distribute ration, and view saved transactions.":
      "উপভোক্তাদের খুঁজুন, OTP যাচাই করুন, রেশনের অধিকার পরীক্ষা করুন, রেশন বিতরণ করুন এবং সংরক্ষিত লেনদেন দেখুন।",
    "Beneficiary found successfully.": "উপভোক্তাকে সফলভাবে পাওয়া গেছে।",
    "Beneficiary not found. Try demo card RC1001.": "উপভোক্তাকে পাওয়া যায়নি। RC1001 ডেমো কার্ড চেষ্টা করুন।",
    "Search for a beneficiary first.": "প্রথমে উপভোক্তাকে খুঁজুন।",
    "Please authenticate the beneficiary first.": "প্রথমে উপভোক্তাকে যাচাই করুন।",
    "Demo OTP verified successfully.": "ডেমো OTP সফলভাবে যাচাই হয়েছে।",
    "Incorrect demo OTP. Use 123456.": "ভুল ডেমো OTP। 123456 ব্যবহার করুন।",
    "No transactions available yet.": "এখনও কোনো লেনদেন নেই।",
    "Sync completed.": "সিঙ্ক সম্পন্ন হয়েছে।",
    "Loading saved transactions...": "সংরক্ষিত লেনদেন লোড হচ্ছে...",
    "Pending count": "অপেক্ষমাণ সংখ্যা",
    Verified: "যাচাইকৃত",
    "Not verified": "যাচাই করা হয়নি",
    "Rice (kg)": "চাল (কেজি)",
    "Wheat (kg)": "গম (কেজি)",
    "No receipt available": "কোনো রসিদ নেই",
    "Ration Distribution Receipt": "রেশন বিতরণের রসিদ",
    "Ration Card": "রেশন কার্ড",
    "Thank you!": "ধন্যবাদ!",
    "Print Receipt": "রসিদ প্রিন্ট করুন",
    "Back to Dashboard": "ড্যাশবোর্ডে ফিরে যান",
    "You are offline. Transactions remain saved on this device.":
      "আপনি অফলাইনে আছেন। লেনদেন এই ডিভাইসে সংরক্ষিত থাকবে।",
    "There are no pending transactions to sync.": "সিঙ্ক করার জন্য কোনো অপেক্ষমাণ লেনদেন নেই।",
    "Saved locally. Starting server synchronization...": "স্থানীয়ভাবে সংরক্ষিত। সার্ভার সিঙ্ক শুরু হচ্ছে...",
    "Saved safely on this device while offline.": "অফলাইনে থাকাকালীন এই ডিভাইসে নিরাপদে সংরক্ষিত হয়েছে।",
    "Insufficient stock available!": "পর্যাপ্ত স্টক নেই!",
    Storage: "সংরক্ষণ",
    Shopkeeper: "দোকানদার",
    "Demo Shopkeeper": "ডেমো দোকানদার",
  },

  Gujarati: {
    Dashboard: "ડેશબોર્ડ",
    "Beneficiary Search": "લાભાર્થી શોધ",
    Authentication: "પ્રમાણીકરણ",
    Entitlement: "રેશન હક",
    "Ration Distribution": "રેશન વિતરણ",
    Transactions: "વ્યવહારો",
    "Pending Transactions": "બાકી વ્યવહારો",
    Stock: "સ્ટોક",
    Settings: "સેટિંગ્સ",
    "Shopkeeper Panel": "દુકાનદાર પેનલ",
    "Smart Ration Management System": "સ્માર્ટ રેશન મેનેજમેન્ટ સિસ્ટમ",
    "Total Beneficiaries": "કુલ લાભાર્થીઓ",
    Connection: "કનેક્શન",
    Online: "ઓનલાઇન",
    Offline: "ઓફલાઇન",
    "Search Beneficiary": "લાભાર્થી શોધો",
    "Ration Card Number": "રેશન કાર્ડ નંબર",
    Search: "શોધો",
    "Beneficiary Details": "લાભાર્થીની વિગતો",
    Name: "નામ",
    Family: "કુટુંબ",
    Village: "ગામ",
    Beneficiary: "લાભાર્થી",
    "Beneficiary Authentication": "લાભાર્થીનું પ્રમાણીકરણ",
    "Enter Demo OTP": "ડેમો OTP દાખલ કરો",
    "Verify OTP": "OTP ચકાસો",
    "Monthly Entitlement": "માસિક રેશન હક",
    "Rice Entitlement": "ચોખાનો હક",
    "Wheat Entitlement": "ઘઉંનો હક",
    "Rice Quantity (kg)": "ચોખાનું પ્રમાણ (કિલો)",
    "Wheat Quantity (kg)": "ઘઉંનું પ્રમાણ (કિલો)",
    "Save Distribution": "વિતરણ સાચવો",
    "Transaction History": "વ્યવહાર ઇતિહાસ",
    "Transaction ID": "વ્યવહાર ID",
    "Card Number": "કાર્ડ નંબર",
    Status: "સ્થિતિ",
    Date: "તારીખ",
    "Sync Now": "હમણાં સિંક કરો",
    "Syncing...": "સિંક થઈ રહ્યું છે...",
    Synced: "સિંક થયું",
    "Pending Offline": "ઓફલાઇન બાકી",
    "Pending Sync": "સિંક બાકી",
    "Shop Stock": "દુકાનનો સ્ટોક",
    Language: "ભાષા",
    "Welcome, Shopkeeper!": "સ્વાગત છે, દુકાનદાર!",
    "Demo record": "ડેમો રેકોર્ડ",
    "Saved in this browser": "આ બ્રાઉઝરમાં સાચવેલ",
    "Awaiting server sync": "સર્વર સિંકની રાહ જોઈ રહ્યું છે",
    "Live browser connection status": "લાઇવ બ્રાઉઝર કનેક્શન સ્થિતિ",
    "Demo beneficiary card": "ડેમો લાભાર્થી કાર્ડ",
    "Demo OTP": "ડેમો OTP",
    "Search beneficiaries, verify OTP, check entitlement, distribute ration, and view saved transactions.":
      "લાભાર્થીઓ શોધો, OTP ચકાસો, રેશનનો હક તપાસો, રેશન વિતરો અને સાચવેલા વ્યવહારો જુઓ.",
    "Beneficiary found successfully.": "લાભાર્થી સફળતાપૂર્વક મળ્યો.",
    "Beneficiary not found. Try demo card RC1001.": "લાભાર્થી મળ્યો નથી. RC1001 ડેમો કાર્ડ અજમાવો.",
    "Search for a beneficiary first.": "પહેલા લાભાર્થી શોધો.",
    "Please authenticate the beneficiary first.": "પહેલા લાભાર્થીનું પ્રમાણીકરણ કરો.",
    "Demo OTP verified successfully.": "ડેમો OTP સફળતાપૂર્વક ચકાસાયો.",
    "Incorrect demo OTP. Use 123456.": "ખોટો ડેમો OTP. 123456 વાપરો.",
    "No transactions available yet.": "હજુ સુધી કોઈ વ્યવહાર ઉપલબ્ધ નથી.",
    "Sync completed.": "સિંક પૂર્ણ થયું.",
    "Loading saved transactions...": "સાચવેલા વ્યવહારો લોડ થઈ રહ્યા છે...",
    "Pending count": "બાકી સંખ્યા",
    Verified: "ચકાસાયેલ",
    "Not verified": "ચકાસાયેલ નથી",
    "Rice (kg)": "ચોખા (કિલો)",
    "Wheat (kg)": "ઘઉં (કિલો)",
    "No receipt available": "રસીદ ઉપલબ્ધ નથી",
    "Ration Distribution Receipt": "રેશન વિતરણ રસીદ",
    "Ration Card": "રેશન કાર્ડ",
    "Thank you!": "આભાર!",
    "Print Receipt": "રસીદ પ્રિન્ટ કરો",
    "Back to Dashboard": "ડેશબોર્ડ પર પાછા જાઓ",
    "You are offline. Transactions remain saved on this device.":
      "તમે ઓફલાઇન છો. વ્યવહારો આ ઉપકરણમાં સાચવેલા રહેશે.",
    "There are no pending transactions to sync.": "સિંક કરવા માટે કોઈ બાકી વ્યવહાર નથી.",
    "Saved locally. Starting server synchronization...": "સ્થાનિક રીતે સાચવ્યું. સર્વર સિંક શરૂ થઈ રહ્યું છે...",
    "Saved safely on this device while offline.": "ઓફલાઇન દરમિયાન આ ઉપકરણમાં સુરક્ષિત રીતે સાચવ્યું.",
    "Insufficient stock available!": "પૂરતો સ્ટોક ઉપલબ્ધ નથી!",
    Storage: "સંગ્રહ",
    Shopkeeper: "દુકાનદાર",
    "Demo Shopkeeper": "ડેમો દુકાનદાર",
  },

  Urdu: {
    Dashboard: "ڈیش بورڈ",
    "Beneficiary Search": "مستفید کی تلاش",
    Authentication: "تصدیق",
    Entitlement: "راشن کا حق",
    "Ration Distribution": "راشن کی تقسیم",
    Transactions: "لین دین",
    "Pending Transactions": "زیر التوا لین دین",
    Stock: "اسٹاک",
    Settings: "ترتیبات",
    "Shopkeeper Panel": "دکاندار پینل",
    "Smart Ration Management System": "اسمارٹ راشن مینجمنٹ سسٹم",
    "Total Beneficiaries": "کل مستفیدین",
    Connection: "کنکشن",
    Online: "آن لائن",
    Offline: "آف لائن",
    "Search Beneficiary": "مستفید کو تلاش کریں",
    "Ration Card Number": "راشن کارڈ نمبر",
    Search: "تلاش کریں",
    "Beneficiary Details": "مستفید کی تفصیلات",
    Name: "نام",
    Family: "خاندان",
    Village: "گاؤں",
    Beneficiary: "مستفید",
    "Beneficiary Authentication": "مستفید کی تصدیق",
    "Enter Demo OTP": "ڈیمو OTP درج کریں",
    "Verify OTP": "OTP کی تصدیق کریں",
    "Monthly Entitlement": "ماہانہ راشن کا حق",
    "Rice Entitlement": "چاول کا حق",
    "Wheat Entitlement": "گندم کا حق",
    "Rice Quantity (kg)": "چاول کی مقدار (کلو)",
    "Wheat Quantity (kg)": "گندم کی مقدار (کلو)",
    "Save Distribution": "تقسیم محفوظ کریں",
    "Transaction History": "لین دین کی تاریخ",
    "Transaction ID": "لین دین ID",
    "Card Number": "کارڈ نمبر",
    Status: "حیثیت",
    Date: "تاریخ",
    "Sync Now": "ابھی سنک کریں",
    "Syncing...": "سنک ہو رہا ہے...",
    Synced: "سنک ہو گیا",
    "Pending Offline": "آف لائن زیر التوا",
    "Pending Sync": "سنک زیر التوا",
    "Shop Stock": "دکان کا اسٹاک",
    Language: "زبان",
    "Welcome, Shopkeeper!": "خوش آمدید، دکاندار!",
    "Demo record": "ڈیمو ریکارڈ",
    "Saved in this browser": "اس براؤزر میں محفوظ کیا گیا",
    "Awaiting server sync": "سرور سنک کا انتظار ہے",
    "Live browser connection status": "براؤزر کنکشن کی موجودہ حالت",
    "Demo beneficiary card": "ڈیمو مستفید کارڈ",
    "Demo OTP": "ڈیمو OTP",
    "Search beneficiaries, verify OTP, check entitlement, distribute ration, and view saved transactions.":
      "مستفیدین تلاش کریں، OTP کی تصدیق کریں، راشن کا حق چیک کریں، راشن تقسیم کریں اور محفوظ شدہ لین دین دیکھیں۔",
    "Beneficiary found successfully.": "مستفید کامیابی سے مل گیا۔",
    "Beneficiary not found. Try demo card RC1001.": "مستفید نہیں ملا۔ RC1001 ڈیمو کارڈ آزمائیں۔",
    "Search for a beneficiary first.": "پہلے مستفید کو تلاش کریں۔",
    "Please authenticate the beneficiary first.": "پہلے مستفید کی تصدیق کریں۔",
    "Demo OTP verified successfully.": "ڈیمو OTP کی کامیابی سے تصدیق ہو گئی۔",
    "Incorrect demo OTP. Use 123456.": "غلط ڈیمو OTP۔ 123456 استعمال کریں۔",
    "No transactions available yet.": "ابھی کوئی لین دین دستیاب نہیں ہے۔",
    "Sync completed.": "سنک مکمل ہو گیا۔",
    "Loading saved transactions...": "محفوظ شدہ لین دین لوڈ ہو رہے ہیں...",
    "Pending count": "زیر التوا تعداد",
    Verified: "تصدیق شدہ",
    "Not verified": "تصدیق نہیں ہوئی",
    "Rice (kg)": "چاول (کلو)",
    "Wheat (kg)": "گندم (کلو)",
    "No receipt available": "رسید دستیاب نہیں",
    "Ration Distribution Receipt": "راشن تقسیم کی رسید",
    "Ration Card": "راشن کارڈ",
    "Thank you!": "شکریہ!",
    "Print Receipt": "رسید پرنٹ کریں",
    "Back to Dashboard": "ڈیش بورڈ پر واپس جائیں",
    "You are offline. Transactions remain saved on this device.":
      "آپ آف لائن ہیں۔ لین دین اس آلے میں محفوظ رہیں گے۔",
    "There are no pending transactions to sync.": "سنک کرنے کے لیے کوئی زیر التوا لین دین نہیں ہے۔",
    "Saved locally. Starting server synchronization...": "مقامی طور پر محفوظ کیا گیا۔ سرور سنک شروع ہو رہا ہے...",
    "Saved safely on this device while offline.": "آف لائن ہونے پر اس آلے میں محفوظ طریقے سے محفوظ کیا گیا۔",
    "Insufficient stock available!": "کافی اسٹاک دستیاب نہیں ہے!",
    Storage: "ذخیرہ",
    Shopkeeper: "دکاندار",
    "Demo Shopkeeper": "ڈیمو دکاندار",
  },
};

const languages = Object.keys(translations);

const menuItems = [
  "Dashboard",
  "Beneficiary Search",
  "Authentication",
  "Entitlement",
  "Ration Distribution",
  "Transactions",
  "Pending Transactions",
  "Stock",
  "Settings",
];

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#f3f6f8",
    color: "#263238",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  sidebar: {
    width: "245px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #103b27, #087c67)",
    color: "white",
    padding: "24px 16px",
    boxSizing: "border-box",
    flexShrink: 0,
  },
  logo: {
    fontSize: "21px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "12px",
    opacity: 0.8,
    marginBottom: "20px",
  },
  menuButton: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "12px 14px",
    marginBottom: "7px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: "28px",
    boxSizing: "border-box",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "25px",
  },
  heading: {
    margin: 0,
    fontSize: "25px",
    color: "#183b2b",
  },
  muted: {
    color: "#718096",
    fontSize: "13px",
    marginTop: "7px",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },
  statNumber: {
    fontSize: "27px",
    fontWeight: "bold",
    color: "#087c67",
    marginTop: "12px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "7px",
  },
  input: {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #d5dde2",
    borderRadius: "7px",
    boxSizing: "border-box",
    marginBottom: "15px",
    fontSize: "14px",
  },
  button: {
    padding: "11px 17px",
    background: "#087c67",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "8px",
    marginTop: "5px",
  },
  secondaryButton: {
    padding: "10px 15px",
    background: "#e8f3ef",
    color: "#087c67",
    border: "1px solid #c8e1d8",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "550px",
    fontSize: "13px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    background: "#edf5f1",
    color: "#234b38",
    borderBottom: "1px solid #dce7e1",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #edf0f2",
  },
  message: {
    padding: "12px",
    borderRadius: "7px",
    background: "#e8f3ef",
    color: "#176447",
    marginTop: "14px",
    fontSize: "13px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "7px",
    border: "1px solid #d5dde2",
    marginBottom: "18px",
  },
};

function StatCard({ title, value, note }) {
  return (
    <div style={styles.card}>
      <div style={{ color: "#718096", fontSize: "13px" }}>
        {title}
      </div>

      <div style={styles.statNumber}>
        {value}
      </div>

      {note && (
        <div
          style={{
            color: "#718096",
            fontSize: "12px",
            marginTop: "6px",
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
}
function App() {
  const [page, setPage] = useState("Dashboard");
  const [language, setLanguage] = useState("English");
  const [online, setOnline] = useState(navigator.onLine);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const syncLock = useRef(false);

  const [searchCard, setSearchCard] = useState("");
  const [beneficiary, setBeneficiary] = useState(null);
  const [otp, setOtp] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [riceQty, setRiceQty] = useState("0");
  const [wheatQty, setWheatQty] = useState("0");
  const [distributionMessage, setDistributionMessage] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [receipt, setReceipt] = useState(null);

  const t = (key) => translations[language]?.[key] || key;

  const pendingTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) =>
          transaction.status === "Pending Offline" ||
          transaction.status === "Pending Sync"
      ),
    [transactions]
  );

  // Keep the connection status updated.
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load saved transactions from IndexedDB.
  useEffect(() => {
    let active = true;

    async function loadTransactions() {
      try {
        const saved = await getOfflineTransactions();

        console.log("TOTAL SAVED TRANSACTIONS:", saved.length);
        console.log("SAVED TRANSACTION DATA:", saved);

        if (active) {
          setTransactions(saved || []);
        }
      } catch (error) {
        console.error("Transaction loading error:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      active = false;
    };
  }, []);

  // Synchronize locally saved transactions with the backend.
  async function syncTransactions() {
    if (!navigator.onLine) {
      setSyncMessage(
        "You are offline. Transactions remain saved on this device."
      );
      return;
    }

    if (syncLock.current) return;

    const pending = transactions.filter(
      (transaction) =>
        transaction.status === "Pending Offline" ||
        transaction.status === "Pending Sync"
    );

    if (pending.length === 0) {
      setSyncMessage("There are no pending transactions to sync.");
      return;
    }

    syncLock.current = true;
    setSyncing(true);
    setSyncMessage("");

    try {
      console.log("SENDING TO BACKEND:", pending);
      console.log("PENDING COUNT:", pending.length);

      const response = await fetch(
        `${API_URL}/api/transactions/sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactions: pending,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.syncedIds)) {
        throw new Error("Invalid sync response from server.");
      }

      const syncedIds = new Set(result.syncedIds.map(String));

      const updatedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          if (syncedIds.has(String(transaction.id))) {
            const updated = {
              ...transaction,
              status: "Synced",
            };

            await saveOfflineTransaction(updated);
            return updated;
          }

          return transaction;
        })
      );

      setTransactions(updatedTransactions);

      setSyncMessage(
        `${syncedIds.size} transaction(s) synchronized successfully.`
      );
    } catch (error) {
      console.error("Transaction sync error:", error);

      setSyncMessage(
        "Sync failed: " + (error?.message || String(error))
      );
    } finally {
      syncLock.current = false;
      setSyncing(false);
    }
  }

  // Automatically try syncing when internet becomes available.
  useEffect(() => {
    if (online && !loading && pendingTransactions.length > 0) {
      syncTransactions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, loading, pendingTransactions.length]);

  // Search for the demo beneficiary.
  function handleSearch(event) {
    event.preventDefault();

    setSearchMessage("");
    setBeneficiary(null);
    setAuthenticated(false);
    setOtp("");

    if (searchCard.trim().toUpperCase() === DEMO_BENEFICIARY.card) {
      setBeneficiary(DEMO_BENEFICIARY);
      setSearchMessage("Beneficiary found successfully.");
    } else {
      setSearchMessage(
        "Beneficiary not found. Try demo card RC1001."
      );
    }
  }

  // Verify the beneficiary OTP.
  function handleAuthentication(event) {
    event.preventDefault();

    if (!beneficiary) {
      setSearchMessage("Search for a beneficiary first.");
      return;
    }

    if (otp === "123456") {
      setAuthenticated(true);
      setSearchMessage("Demo OTP verified successfully.");
    } else {
      setAuthenticated(false);
      setSearchMessage("Incorrect demo OTP. Use 123456.");
    }
  }

  // Save ration distribution locally before synchronization.
  async function handleDistribution(event) {
    event.preventDefault();
    setDistributionMessage("");

    if (!beneficiary || !authenticated) {
      setDistributionMessage(
        "Please authenticate the beneficiary first."
      );
      return;
    }

    const rice = Number(riceQty);
    const wheat = Number(wheatQty);

    if (
      !Number.isFinite(rice) ||
      !Number.isFinite(wheat) ||
      rice < 0 ||
      wheat < 0 ||
      rice > beneficiary.riceEntitlement ||
      wheat > beneficiary.wheatEntitlement ||
      (rice === 0 && wheat === 0)
    ) {
      setDistributionMessage(
        "Enter valid quantities. Maximum demo entitlement: 20 kg rice and 10 kg wheat."
      );
      return;
    }

    const availableRice = Number(
      localStorage.getItem("riceStock") ?? 500
    );

    const availableWheat = Number(
      localStorage.getItem("wheatStock") ?? 300
    );

    if (rice > availableRice || wheat > availableWheat) {
      setDistributionMessage("Insufficient stock available!");
      return;
    }

    const transaction = {
      id: "TXN" + Date.now(),
      beneficiary: beneficiary.name,
      card: beneficiary.card,
      rice,
      wheat,
      status: online ? "Pending Sync" : "Pending Offline",
      date: new Date().toLocaleString(),
    };

    try {
      // Save locally first, whether online or offline.
      await saveOfflineTransaction(transaction);

      // Deduct distributed ration from available stock.
      localStorage.setItem(
        "riceStock",
        String(availableRice - rice)
      );

      localStorage.setItem(
        "wheatStock",
        String(availableWheat - wheat)
      );

      // Record ration distribution in stock history.
      let existingStockHistory = [];

      try {
        const savedHistory = JSON.parse(
          localStorage.getItem("stockHistory") || "[]"
        );

        if (Array.isArray(savedHistory)) {
          existingStockHistory = savedHistory;
        }
      } catch {
        existingStockHistory = [];
      }

      localStorage.setItem(
        "stockHistory",
        JSON.stringify([
          {
            id: transaction.id,
            date: transaction.date,
            activity: "Distributed",
            rice: -rice,
            wheat: -wheat,
          },
          ...existingStockHistory,
        ])
      );

      setTransactions((previous) => [
        transaction,
        ...previous,
      ]);

      setDistributionMessage(
        online
          ? "Saved locally. Starting server synchronization..."
          : "Saved safely on this device while offline."
      );

      setReceipt(transaction);
      setRiceQty("0");
      setWheatQty("0");
      setPage("Receipt");
    } catch (error) {
      console.error("Transaction sync error:", error);

      setSyncMessage(
        "Synchronization failed: " +
          (error?.message || String(error))
      );
    }
  }

  function renderBeneficiaryDetails() {
    if (!beneficiary) return null;

    return (
      <div
        style={{
          ...styles.card,
          borderLeft: "4px solid #087c67",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {t("Beneficiary Details")}
        </h3>

        <p>
          <strong>{t("Name")}:</strong> {beneficiary.name}
        </p>

        <p>
          <strong>{t("Ration Card Number")}:</strong>{" "}
          {beneficiary.card}
        </p>

        <p>
          <strong>{t("Family")}:</strong> {beneficiary.family}
        </p>

        <p>
          <strong>{t("Village")}:</strong> {beneficiary.village}
        </p>
      </div>
    );
  }

  function renderSearch() {
    return (
      <>
        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>
            {t("Search Beneficiary")}
          </h3>

          <form onSubmit={handleSearch}>
            <label style={styles.label}>
              {t("Ration Card Number")}
            </label>

            <input
              style={styles.input}
              value={searchCard}
              onChange={(event) =>
                setSearchCard(event.target.value)
              }
              placeholder="RC1001"
            />

            <button style={styles.button} type="submit">
              {t("Search")}
            </button>
          </form>

          {searchMessage && (
            <div style={styles.message}>
              {t(searchMessage)}
            </div>
          )}
        </div>

        {renderBeneficiaryDetails()}
      </>
    );
  }

  function renderDashboard() {
    return (
      <>
        <div style={styles.grid}>
          <StatCard
            title={t("Total Beneficiaries")}
            value="1"
            note={t("Demo record")}
          />

          <StatCard
            title={t("Transactions")}
            value={transactions.length}
            note={t("Saved in this browser")}
          />

          <StatCard
            title={t("Pending Transactions")}
            value={pendingTransactions.length}
            note={t("Awaiting server sync")}
          />

          <StatCard
            title={t("Connection")}
            value={online ? t("Online") : t("Offline")}
            note={t("Live browser connection status")}
          />
        </div>

        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>
            {t("Welcome, Shopkeeper!")}
          </h3>

          <p>
            {t(
              "Search beneficiaries, verify OTP, check entitlement, distribute ration, and view saved transactions."
            )}
          </p>

          <p style={styles.muted}>
            {t("Demo beneficiary card")}:{" "}
            <strong>RC1001</strong>
          </p>

          <p style={styles.muted}>
            {t("Demo OTP")}: <strong>123456</strong>
          </p>

          <button
            style={styles.button}
            onClick={() => setPage("Beneficiary Search")}
          >
            {t("Search Beneficiary")}
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => setPage("Ration Distribution")}
          >
            {t("Ration Distribution")}
          </button>
        </div>
      </>
    );
  }

  function renderAuthentication() {
    return (
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>
          {t("Beneficiary Authentication")}
        </h3>

        {beneficiary ? (
          <>
            <p>
              {t("Beneficiary")}:{" "}
              <strong>{beneficiary.name}</strong>
            </p>

            <p>
              {t("Ration Card Number")}:{" "}
              <strong>{beneficiary.card}</strong>
            </p>

            <form onSubmit={handleAuthentication}>
              <label style={styles.label}>
                {t("Enter Demo OTP")}
              </label>

              <input
                style={styles.input}
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value)
                }
                placeholder="123456"
                inputMode="numeric"
                maxLength={6}
              />

              <button style={styles.button} type="submit">
                {t("Verify OTP")}
              </button>
            </form>

            <p style={styles.muted}>
              {t("Demo OTP")}: <strong>123456</strong>
            </p>

            {authenticated && (
              <div style={styles.message}>
                {t("Beneficiary authenticated successfully.")}
              </div>
            )}
          </>
        ) : (
          <p>{t("Search for a beneficiary first.")}</p>
        )}
      </div>
    );
  }

  function renderEntitlement() {
    return (
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>
          {t("Monthly Entitlement")}
        </h3>

        {beneficiary ? (
          <>
            <p>
              <strong>{t("Beneficiary")}:</strong>{" "}
              {beneficiary.name}
            </p>

            <p>
              <strong>{t("Ration Card Number")}:</strong>{" "}
              {beneficiary.card}
            </p>

            <div style={styles.grid}>
              <StatCard
                title={t("Rice Entitlement")}
                value={`${beneficiary.riceEntitlement} kg`}
              />

              <StatCard
                title={t("Wheat Entitlement")}
                value={`${beneficiary.wheatEntitlement} kg`}
              />
            </div>
          </>
        ) : (
          <p>{t("Search for a beneficiary first.")}</p>
        )}
      </div>
    );
  }

  function renderDistribution() {
    return (
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>
          {t("Ration Distribution")}
        </h3>

        {beneficiary ? (
          <>
            <p>
              <strong>{t("Beneficiary")}:</strong>{" "}
              {beneficiary.name}
            </p>

            <p>
              <strong>{t("Ration Card Number")}:</strong>{" "}
              {beneficiary.card}
            </p>

            <p>
              <strong>{t("Authentication")}:</strong>{" "}
              {authenticated ? t("Verified") : t("Not verified")}
            </p>

            <form onSubmit={handleDistribution}>
              <label style={styles.label}>
                {t("Rice Quantity (kg)")}
              </label>

              <input
                style={styles.input}
                type="number"
                min="0"
                max={beneficiary.riceEntitlement}
                step="0.1"
                value={riceQty}
                onChange={(event) =>
                  setRiceQty(event.target.value)
                }
              />

              <label style={styles.label}>
                {t("Wheat Quantity (kg)")}
              </label>

              <input
                style={styles.input}
                type="number"
                min="0"
                max={beneficiary.wheatEntitlement}
                step="0.1"
                value={wheatQty}
                onChange={(event) =>
                  setWheatQty(event.target.value)
                }
              />

              <button style={styles.button} type="submit">
                {t("Save Distribution")}
              </button>
            </form>
          </>
        ) : (
          <p>{t("Search for a beneficiary first.")}</p>
        )}

        {distributionMessage && (
          <div style={styles.message}>
            {t(distributionMessage)}
          </div>
        )}
      </div>
    );
  }
    function renderTransactions(list = transactions) {
    return (
      <div style={styles.card}>
        <div style={styles.topbar}>
          <h3 style={{ margin: 0 }}>
            {t("Transaction History")}
          </h3>

          <button
            style={styles.button}
            onClick={syncTransactions}
            disabled={
              !online ||
              syncing ||
              pendingTransactions.length === 0
            }
          >
            {syncing ? t("Syncing...") : t("Sync Now")}
          </button>
        </div>

        {syncMessage && (
          <div style={styles.message}>
            {syncMessage}
          </div>
        )}

        {loading ? (
          <p>{t("Loading saved transactions...")}</p>
        ) : list.length === 0 ? (
          <p>{t("No transactions available yet.")}</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    {t("Transaction ID")}
                  </th>

                  <th style={styles.th}>
                    {t("Beneficiary")}
                  </th>

                  <th style={styles.th}>
                    {t("Card Number")}
                  </th>

                  <th style={styles.th}>
                    {t("Rice (kg)")}
                  </th>

                  <th style={styles.th}>
                    {t("Wheat (kg)")}
                  </th>

                  <th style={styles.th}>
                    {t("Status")}
                  </th>

                  <th style={styles.th}>
                    {t("Date")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {list.map((transaction) => (
                  <tr key={transaction.id}>
                    <td style={styles.td}>
                      {transaction.id}
                    </td>

                    <td style={styles.td}>
                      {transaction.beneficiary}
                    </td>

                    <td style={styles.td}>
                      {transaction.card}
                    </td>

                    <td style={styles.td}>
                      {transaction.rice}
                    </td>

                    <td style={styles.td}>
                      {transaction.wheat}
                    </td>

                    <td style={styles.td}>
                      {t(transaction.status)}
                    </td>

                    <td style={styles.td}>
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  function renderPendingTransactions() {
    return (
      <>
        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>
            {t("Pending Transactions")}
          </h3>

          <p>
            {t("Saved in this browser")}.{" "}
            {t("Awaiting server sync")}.
          </p>

          <p>
            <strong>{t("Pending Transactions")}:</strong>{" "}
            {pendingTransactions.length}
          </p>

          <button
            style={styles.button}
            onClick={syncTransactions}
            disabled={!online || syncing}
          >
            {syncing ? t("Syncing...") : t("Sync Now")}
          </button>

          {syncMessage && (
            <div style={styles.message}>
              {syncMessage}
            </div>
          )}
        </div>

        {renderTransactions(pendingTransactions)}
      </>
    );
  }

  // Retained for compatibility with the existing app.
  // The actual Stock page is rendered using the Stock component.
  function renderStock() {
    return (
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>
          {t("Shop Stock")}
        </h3>

        <p>Stock management module is not connected yet.</p>

        <p style={styles.muted}>
          A backend stock database and stock validation will be needed here.
        </p>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>
          {t("Settings")}
        </h3>

        <label style={styles.label}>
          {t("Language")}
        </label>

        <select
          style={styles.select}
          value={language}
          onChange={(event) =>
            setLanguage(event.target.value)
          }
        >
          {languages.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <p>
          <strong>{t("Shopkeeper")}:</strong>{" "}
          {t("Demo Shopkeeper")}
        </p>

        <p>
          <strong>{t("Connection")}:</strong>{" "}
          {online ? t("Online") : t("Offline")}
        </p>

        <p>
          <strong>{t("Storage")}:</strong>{" "}
          Browser IndexedDB
        </p>

        <p style={styles.muted}>
          Login and beneficiary information are currently demo-only.
        </p>
      </div>
    );
  }

  function renderReceipt() {
    if (!receipt) {
      return (
        <div style={styles.card}>
          <h3>{t("No receipt available")}</h3>

          <button
            style={styles.button}
            onClick={() => setPage("Dashboard")}
          >
            {t("Back to Dashboard")}
          </button>
        </div>
      );
    }

    return (
      <div style={styles.card}>
        <h2>
          🍚 {t("Smart Ration Management System")}
        </h2>

        <h3>
          {t("Ration Distribution Receipt")}
        </h3>

        <hr />

        <p>
          <strong>{t("Transaction ID")}:</strong>{" "}
          {receipt.id}
        </p>

        <p>
          <strong>{t("Beneficiary")}:</strong>{" "}
          {receipt.beneficiary}
        </p>

        <p>
          <strong>{t("Ration Card")}:</strong>{" "}
          {receipt.card}
        </p>

        <p>
          <strong>{t("Rice (kg)")}:</strong>{" "}
          {receipt.rice} kg
        </p>

        <p>
          <strong>{t("Wheat (kg)")}:</strong>{" "}
          {receipt.wheat} kg
        </p>

        <p>
          <strong>{t("Date")}:</strong>{" "}
          {receipt.date}
        </p>

        <p>
          <strong>{t("Status")}:</strong>{" "}
          {t(receipt.status)}
        </p>

        <hr />

        <h3>{t("Thank you!")}</h3>

        <button
          style={styles.button}
          onClick={() => window.print()}
        >
          {t("Print Receipt")}
        </button>

        <button
          style={styles.secondaryButton}
          onClick={() => setPage("Dashboard")}
        >
          {t("Back to Dashboard")}
        </button>
      </div>
    );
  }

  function renderPage() {
    switch (page) {
      case "Dashboard":
        return renderDashboard();

      case "Beneficiary Search":
        return renderSearch();

      case "Authentication":
        return renderAuthentication();

      case "Entitlement":
        return renderEntitlement();

      case "Ration Distribution":
        return renderDistribution();

      case "Transactions":
        return renderTransactions();

      case "Receipt":
        return renderReceipt();

      case "Pending Transactions":
        return renderPendingTransactions();

      case "Stock":
        return <Stock />;

      case "Settings":
        return renderSettings();

      default:
        return renderDashboard();
    }
  }

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          🍚 Smart Ration
        </div>

        <div style={styles.subtitle}>
          {t("Shopkeeper Panel")}
        </div>

        <label
          style={{
            ...styles.label,
            color: "white",
          }}
        >
          {t("Language")}
        </label>

        <select
          style={styles.select}
          value={language}
          onChange={(event) =>
            setLanguage(event.target.value)
          }
        >
          {languages.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setPage(item)}
            style={{
              ...styles.menuButton,
              background:
                page === item
                  ? "rgba(255,255,255,0.22)"
                  : "transparent",
              fontWeight:
                page === item ? "bold" : "normal",
            }}
          >
            {t(item)}
          </button>
        ))}
      </aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.heading}>
              {t(page)}
            </h1>

            <p style={styles.muted}>
              {t("Smart Ration Management System")}
            </p>
          </div>

          <div
            style={{
              padding: "9px 13px",
              borderRadius: "20px",
              background: online
                ? "#e1f5e9"
                : "#fff0e0",
              color: online
                ? "#176b3a"
                : "#a45112",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            {online
              ? `● ${t("Online")}`
              : `● ${t("Offline")}`}
          </div>
        </div>

        {renderPage()}
      </main>
    </div>
  );
}

export default App;