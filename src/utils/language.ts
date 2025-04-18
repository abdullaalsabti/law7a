import { TranslatedText } from "../types";

/**
 * Get text in the current language
 */
export const getTextByLanguage = (
  text: TranslatedText,
  language: Language
): string => {
  return text[language];
};

/**
 * Format currency based on language and currency code
 */
export const formatCurrency = (
  price: number,
  currency: "JOD" | "USD",
  language: Language
): string => {
  const formatter = new Intl.NumberFormat(
    language === "en" ? "en-JO" : "ar-JO",
    {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }
  );

  return formatter.format(price);
};

/**
 * Format date based on language
 */
export const formatDate = (dateString: string, language: Language): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(language === "en" ? "en-JO" : "ar-JO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Get category name in the current language
 */
export const getCategoryName = (
  category: string,
  language: Language
): string => {
  const categories: Record<string, TranslatedText> = {
    painting: { en: "Painting", ar: "لوحة فنية" },
    pottery: { en: "Pottery", ar: "فخار" },
    calligraphy: { en: "Calligraphy", ar: "خط عربي" },
    digital: { en: "Digital Art", ar: "فن رقمي" },
    sculpture: { en: "Sculpture", ar: "نحت" },
    jewelry: { en: "Jewelry", ar: "مجوهرات" },
    photography: { en: "Photography", ar: "تصوير فوتوغرافي" },
    textile: { en: "Textile", ar: "المنسوجات" },
    other: { en: "Other", ar: "أخرى" },
  };

  return categories[category] ? categories[category][language] : category;
};

/**
 * Get medium name in the current language
 */
export const getMediumName = (medium: string, language: Language): string => {
  const mediums: Record<string, TranslatedText> = {
    oil: { en: "Oil", ar: "ألوان زيتية" },
    acrylic: { en: "Acrylic", ar: "أكريليك" },
    watercolor: { en: "Watercolor", ar: "ألوان مائية" },
    mixed_media: { en: "Mixed Media", ar: "وسائط متعددة" },
    ceramic: { en: "Ceramic", ar: "سيراميك" },
    wood: { en: "Wood", ar: "خشب" },
    metal: { en: "Metal", ar: "معدن" },
    digital: { en: "Digital", ar: "رقمي" },
    clay: { en: "Clay", ar: "طين" },
    glass: { en: "Glass", ar: "زجاج" },
    fabric: { en: "Fabric", ar: "قماش" },
    paper: { en: "Paper", ar: "ورق" },
    other: { en: "Other", ar: "أخرى" },
  };

  return mediums[medium] ? mediums[medium][language] : medium;
};

/**
 * Get common UI text translations
 */
export const getUIText = (key: string, language: Language): string => {
  const uiText: Record<string, TranslatedText> = {
    // Navigation
    home: { en: "Home", ar: "الرئيسية" },
    artists: { en: "Artists", ar: "الفنانون" },
    explore: { en: "Explore", ar: "استكشاف" },
    cart: { en: "Cart", ar: "السلة" },
    login: { en: "Login", ar: "تسجيل الدخول" },
    signup: { en: "Sign Up", ar: "إنشاء حساب" },
    search: { en: "Search", ar: "بحث" },
    logout: { en: "Logout", ar: "تسجيل الخروج" },

    // Product
    addToCart: { en: "Add to Cart", ar: "أضف إلى السلة" },
    buyNow: { en: "Buy Now", ar: "اشتر الآن" },
    outOfStock: { en: "Out of Stock", ar: "نفذ من المخزون" },
    price: { en: "Price", ar: "السعر" },
    dimensions: { en: "Dimensions", ar: "الأبعاد" },
    weight: { en: "Weight", ar: "الوزن" },
    description: { en: "Description", ar: "الوصف" },

    // Artist Profile
    bio: { en: "Biography", ar: "السيرة الذاتية" },
    artworks: { en: "Artworks", ar: "الأعمال الفنية" },
    contact: { en: "Contact", ar: "اتصل" },
    location: { en: "Location", ar: "الموقع" },

    // Cart
    yourCart: { en: "Your Cart", ar: "سلة التسوق الخاصة بك" },
    emptyCart: { en: "Your cart is empty", ar: "سلة التسوق فارغة" },
    subtotal: { en: "Subtotal", ar: "المجموع الفرعي" },
    checkout: { en: "Checkout", ar: "إتمام الشراء" },
    continueShopping: { en: "Continue Shopping", ar: "مواصلة التسوق" },

    // Filters
    filters: { en: "Filters", ar: "تصفية" },
    categories: { en: "Categories", ar: "الفئات" },
    priceRange: { en: "Price Range", ar: "نطاق السعر" },
    medium: { en: "Medium", ar: "الوسيط" },
    artist: { en: "Artist", ar: "الفنان" },
    applyFilters: { en: "Apply Filters", ar: "تطبيق الفلاتر" },
    resetFilters: { en: "Reset", ar: "إعادة تعيين" },

    // Homepage
    featuredArtists: { en: "Featured Artists", ar: "الفنانون المميزون" },
    featuredArtworks: { en: "Featured Artworks", ar: "الأعمال الفنية المميزة" },
    trendingNow: { en: "Trending Now", ar: "الرائج الآن" },
    exploreMore: { en: "Explore More", ar: "استكشاف المزيد" },

    // Upload
    upload: { en: "Upload", ar: "رفع" },
    uploadArtwork: { en: "Upload Artwork", ar: "رفع عمل فني" },
    title: { en: "Title", ar: "العنوان" },
    titleArabic: { en: "Title (Arabic)", ar: "العنوان (بالعربية)" },
    titleEnglish: { en: "Title (English)", ar: "العنوان (بالإنجليزية)" },
    descriptionArabic: { en: "Description (Arabic)", ar: "الوصف (بالعربية)" },
    descriptionEnglish: {
      en: "Description (English)",
      ar: "الوصف (بالإنجليزية)",
    },
    category: { en: "Category", ar: "الفئة" },
    uploadImages: { en: "Upload Images", ar: "رفع الصور" },
    save: { en: "Save", ar: "حفظ" },
    cancel: { en: "Cancel", ar: "إلغاء" },

    // Authentication
    email: { en: "Email", ar: "البريد الإلكتروني" },
    password: { en: "Password", ar: "كلمة المرور" },
    confirmPassword: { en: "Confirm Password", ar: "تأكيد كلمة المرور" },
    name: { en: "Name", ar: "الاسم" },
    createAccount: { en: "Create Account", ar: "إنشاء حساب" },
    forgotPassword: { en: "Forgot Password?", ar: "نسيت كلمة المرور؟" },
    loginToAccount: {
      en: "Login to Your Account",
      ar: "تسجيل الدخول إلى حسابك",
    },
    registerAsArtist: { en: "Register as Artist", ar: "التسجيل كفنان" },

    // Other
    loading: { en: "Loading...", ar: "جاري التحميل..." },
    noResults: { en: "No results found", ar: "لم يتم العثور على نتائج" },
    error: { en: "An error occurred", ar: "حدث خطأ" },
    success: { en: "Success", ar: "نجاح" },
  };

  return uiText[key] ? uiText[key][language] : key;
};

export type Language = "en" | "ar";

export const getTranslations = (language: Language) => {
  return {
    // Common
    back: language === "en" ? "Back" : "رجوع",
    continue: language === "en" ? "Continue" : "متابعة",
    submit: language === "en" ? "Submit" : "إرسال",

    // Checkout page
    checkout_title: language === "en" ? "Checkout" : "الدفع",
    checkout_empty_cart:
      language === "en" ? "Your cart is empty" : "عربة التسوق فارغة",
    checkout_empty_cart_msg:
      language === "en"
        ? "Please add some items to your cart before proceeding to checkout"
        : "الرجاء إضافة بعض العناصر إلى عربة التسوق قبل المتابعة إلى الدفع",
    checkout_empty_cart_message:
      language === "en"
        ? "Please add some items to your cart before proceeding to checkout"
        : "الرجاء إضافة بعض العناصر إلى عربة التسوق قبل المتابعة إلى الدفع",
    checkout_browse_products:
      language === "en" ? "Browse Products" : "تصفح المنتجات",
    checkout_return_to_shop:
      language === "en" ? "Return to Shop" : "العودة إلى المتجر",
    checkout_billing_info:
      language === "en" ? "Billing Information" : "معلومات الفواتير",
    checkout_payment_info:
      language === "en" ? "Payment Information" : "معلومات الدفع",
    checkout_shipping: language === "en" ? "Shipping" : "الشحن",
    checkout_payment: language === "en" ? "Payment" : "الدفع",
    checkout_confirmation: language === "en" ? "Confirmation" : "التأكيد",
    checkout_shipping_method:
      language === "en" ? "Shipping Method" : "طريقة الشحن",
    checkout_shipping_info:
      language === "en" ? "Shipping Information" : "معلومات الشحن",
    checkout_shipping_address:
      language === "en" ? "Shipping Address" : "عنوان الشحن",
    checkout_payment_method:
      language === "en" ? "Payment Method" : "طريقة الدفع",
    checkout_credit_card: language === "en" ? "Credit Card" : "بطاقة الائتمان",
    checkout_review_order:
      language === "en" ? "Review Your Order" : "مراجعة طلبك",
    checkout_review_your_order:
      language === "en" ? "Review Your Order" : "مراجعة طلبك",
    checkout_first_name: language === "en" ? "First Name" : "الاسم الأول",
    checkout_last_name: language === "en" ? "Last Name" : "اسم العائلة",
    checkout_email: language === "en" ? "Email" : "البريد الإلكتروني",
    checkout_phone: language === "en" ? "Phone" : "رقم الهاتف",
    checkout_address: language === "en" ? "Address" : "العنوان",
    checkout_city: language === "en" ? "City" : "المدينة",
    checkout_state: language === "en" ? "State/Province" : "الولاية/المقاطعة",
    checkout_zip: language === "en" ? "Zip/Postal Code" : "الرمز البريدي",
    checkout_postal_code: language === "en" ? "Postal Code" : "الرمز البريدي",
    checkout_country: language === "en" ? "Country" : "البلد",
    checkout_select_country:
      language === "en" ? "Select Country" : "اختر البلد",
    checkout_egypt: language === "en" ? "Egypt" : "مصر",
    checkout_saudi_arabia:
      language === "en" ? "Saudi Arabia" : "المملكة العربية السعودية",
    checkout_uae: language === "en" ? "UAE" : "الإمارات العربية المتحدة",
    checkout_kuwait: language === "en" ? "Kuwait" : "الكويت",
    checkout_qatar: language === "en" ? "Qatar" : "قطر",
    checkout_card_number: language === "en" ? "Card Number" : "رقم البطاقة",
    checkout_card_name:
      language === "en" ? "Name on Card" : "الاسم على البطاقة",
    checkout_name_on_card:
      language === "en" ? "Name on Card" : "الاسم على البطاقة",
    checkout_expiry:
      language === "en" ? "Expiration Date" : "تاريخ انتهاء الصلاحية",
    checkout_expiry_date:
      language === "en" ? "Expiration Date" : "تاريخ انتهاء الصلاحية",
    checkout_cvv: language === "en" ? "CVV" : "رمز التحقق",
    checkout_standard:
      language === "en" ? "Standard Shipping" : "الشحن القياسي",
    checkout_standard_shipping:
      language === "en" ? "Standard Shipping" : "الشحن القياسي",
    checkout_standard_shipping_time:
      language === "en" ? "5-7 business days" : "5-7 أيام عمل",
    checkout_express: language === "en" ? "Express Shipping" : "الشحن السريع",
    checkout_express_shipping:
      language === "en" ? "Express Shipping" : "الشحن السريع",
    checkout_express_shipping_time:
      language === "en" ? "2-3 business days" : "2-3 أيام عمل",
    checkout_premium: language === "en" ? "Premium Shipping" : "الشحن الممتاز",
    checkout_free_days:
      language === "en" ? "5-7 business days" : "5-7 أيام عمل",
    checkout_express_days:
      language === "en" ? "3-5 business days" : "3-5 أيام عمل",
    checkout_premium_days:
      language === "en" ? "1-2 business days" : "1-2 يوم عمل",
    checkout_free: language === "en" ? "Free" : "مجاني",
    checkout_order_summary: language === "en" ? "Order Summary" : "ملخص الطلب",
    checkout_order_items: language === "en" ? "Your Order Items" : "عناصر طلبك",
    checkout_subtotal: language === "en" ? "Subtotal" : "المجموع الفرعي",
    checkout_tax: language === "en" ? "Tax" : "الضريبة",
    checkout_total: language === "en" ? "Total" : "المجموع",
    checkout_place_order: language === "en" ? "Place Order" : "إرسال الطلب",
    checkout_thank_you:
      language === "en" ? "Thank you for your order!" : "شكرًا لطلبك!",
    checkout_order_number: language === "en" ? "Order #" : "رقم الطلب #",
    checkout_order_confirmation:
      language === "en"
        ? "Your order has been placed successfully. We've sent a confirmation email to"
        : "تم تقديم طلبك بنجاح. لقد أرسلنا رسالة تأكيد إلى",
    checkout_order_tracking:
      language === "en"
        ? "You can track your order status in your account dashboard."
        : "يمكنك تتبع حالة طلبك في لوحة تحكم حسابك.",
    checkout_continue_shopping:
      language === "en" ? "Continue Shopping" : "متابعة التسوق",
    checkout_print_receipt:
      language === "en" ? "Print Receipt" : "طباعة الإيصال",
    checkout_continue_to_payment:
      language === "en" ? "Continue to Payment" : "متابعة إلى الدفع",
    checkout_back: language === "en" ? "Back" : "رجوع",
    checkout_processing:
      language === "en" ? "Processing..." : "جاري المعالجة...",
    checkout_all_fields_required:
      language === "en" ? "All fields are required" : "جميع الحقول مطلوبة",
    checkout_invalid_email:
      language === "en"
        ? "Please enter a valid email address"
        : "يرجى إدخال عنوان بريد إلكتروني صالح",
    checkout_invalid_card_number:
      language === "en"
        ? "Please enter a valid card number"
        : "يرجى إدخال رقم بطاقة صالح",
    checkout_invalid_expiry:
      language === "en"
        ? "Please enter a valid expiration date"
        : "يرجى إدخال تاريخ انتهاء صلاحية صالح",
    checkout_invalid_cvv:
      language === "en"
        ? "Please enter a valid CVV"
        : "يرجى إدخال رمز تحقق صالح",
    checkout_error:
      language === "en"
        ? "An error occurred during checkout. Please try again."
        : "حدث خطأ أثناء الدفع. يرجى المحاولة مرة أخرى.",
    checkout_payment_failed:
      language === "en"
        ? "Payment validation failed. Please check your card details and try again."
        : "فشل التحقق من الدفع. يرجى التحقق من تفاصيل بطاقتك والمحاولة مرة أخرى.",
    checkout_order_complete:
      language === "en" ? "Order Complete!" : "تم إكمال الطلب!",
    checkout_order_confirmation_email:
      language === "en"
        ? "We've sent a confirmation email with your order details."
        : "لقد أرسلنا بريدًا إلكترونيًا للتأكيد مع تفاصيل طلبك.",

    // Cart
    cart_subtotal: language === "en" ? "Subtotal" : "المجموع الفرعي",
    cart_total: language === "en" ? "Total" : "المجموع",
    cart_quantity: language === "en" ? "Quantity" : "الكمية",
  };
};
