// Language translations for CivicWorks
// Supported languages: English (en), Hindi (hi), Marathi (mr), Tamil (ta), Telugu (te), Bengali (bn), Gujarati (gu), Kannada (kn)

export const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

// Define translation type
type TranslationStrings = {
    feed: string;
    newComplaint: string;
    mapView: string;
    profile: string;
    about: string;
    logout: string;
    theme: string;
    light: string;
    dark: string;
    road: string;
    water: string;
    sewage: string;
    streetlight: string;
    bridge: string;
    building: string;
    park: string;
    other: string;
    pending: string;
    under_review: string;
    in_progress: string;
    resolved: string;
    rejected: string;
    low: string;
    medium: string;
    high: string;
    critical: string;
    submit: string;
    cancel: string;
    delete: string;
    edit: string;
    refresh: string;
    search: string;
    filter: string;
    clearFilters: string;
    viewOnMap: string;
    escalate: string;
    markAsEmergency: string;
    category: string;
    description: string;
    location: string;
    priority: string;
    noReports: string;
    noNotifications: string;
    loading: string;
    notifications: string;
    markAllRead: string;
    emergency: string;
    settings: string;
    language: string;
    allComplaints: string;
    nearbyComplaints: string;
    yourLocation: string;
    unavailable: string;
};

export type TranslationKey = keyof TranslationStrings;

const englishTranslations: TranslationStrings = {
    feed: 'Feed',
    newComplaint: 'New Complaint',
    mapView: 'Map View',
    profile: 'Profile',
    about: 'About',
    logout: 'Logout',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    road: 'Road',
    water: 'Water',
    sewage: 'Sewage',
    streetlight: 'Streetlight',
    bridge: 'Bridge',
    building: 'Building',
    park: 'Park',
    other: 'Other',
    pending: 'Pending',
    under_review: 'Under Review',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    submit: 'Submit',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    refresh: 'Refresh',
    search: 'Search',
    filter: 'Filter',
    clearFilters: 'Clear Filters',
    viewOnMap: 'View on Map',
    escalate: 'Escalate',
    markAsEmergency: 'Mark as Emergency',
    category: 'Category',
    description: 'Description',
    location: 'Location',
    priority: 'Priority',
    noReports: 'No reports yet. Be the first to report an issue!',
    noNotifications: 'No notifications yet',
    loading: 'Loading...',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    emergency: 'Emergency',
    settings: 'Settings',
    language: 'Language',
    allComplaints: 'All Complaints',
    nearbyComplaints: 'Nearby Complaints',
    yourLocation: 'Your Location',
    unavailable: 'Unavailable',
};

const hindiTranslations: TranslationStrings = {
    feed: 'फ़ीड',
    newComplaint: 'नई शिकायत',
    mapView: 'नक्शा दृश्य',
    profile: 'प्रोफ़ाइल',
    about: 'के बारे में',
    logout: 'लॉग आउट',
    theme: 'थीम',
    light: 'लाइट',
    dark: 'डार्क',
    road: 'सड़क',
    water: 'पानी',
    sewage: 'सीवेज',
    streetlight: 'स्ट्रीटलाइट',
    bridge: 'पुल',
    building: 'भवन',
    park: 'पार्क',
    other: 'अन्य',
    pending: 'लंबित',
    under_review: 'समीक्षाधीन',
    in_progress: 'प्रगति में',
    resolved: 'हल किया गया',
    rejected: 'अस्वीकृत',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    critical: 'गंभीर',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    refresh: 'रिफ्रेश',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    clearFilters: 'फ़िल्टर साफ़ करें',
    viewOnMap: 'मानचित्र पर देखें',
    escalate: 'एस्केलेट करें',
    markAsEmergency: 'आपातकाल के रूप में चिह्नित करें',
    category: 'श्रेणी',
    description: 'विवरण',
    location: 'स्थान',
    priority: 'प्राथमिकता',
    noReports: 'अभी कोई रिपोर्ट नहीं। पहले शिकायत दर्ज करें!',
    noNotifications: 'अभी कोई सूचना नहीं',
    loading: 'लोड हो रहा है...',
    notifications: 'सूचनाएं',
    markAllRead: 'सभी पढ़ा हुआ करें',
    emergency: 'आपातकाल',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    allComplaints: 'सभी शिकायतें',
    nearbyComplaints: 'आस-पास की शिकायतें',
    yourLocation: 'आपका स्थान',
    unavailable: 'अनुपलब्ध',
};

export const translations: Record<string, TranslationStrings> = {
    en: englishTranslations,
    hi: hindiTranslations,
    // Other languages fall back to English
    mr: englishTranslations,
    ta: englishTranslations,
    te: englishTranslations,
    bn: englishTranslations,
    gu: englishTranslations,
    kn: englishTranslations,
};

// Hook for using translations
export function useTranslation(language: string = 'en') {
    const t = (key: TranslationKey): string => {
        const lang = translations[language] || translations.en;
        return lang[key] || translations.en[key] || key;
    };

    return { t, language, languages: LANGUAGES };
}

// Get translation directly
export function getTranslation(language: string, key: TranslationKey): string {
    const lang = translations[language] || translations.en;
    return lang[key] || translations.en[key] || key;
}
