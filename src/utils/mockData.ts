import { Artist, Product, User } from "../types";

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Layla Ibrahim",
    email: "layla@example.com",
    isArtist: true,
    profilePicture: "https://randomuser.me/api/portraits/women/42.jpg",
  },
  {
    id: "user2",
    name: "Omar Nasser",
    email: "omar@example.com",
    isArtist: true,
    profilePicture: "https://randomuser.me/api/portraits/men/36.jpg",
  },
  {
    id: "user3",
    name: "Haya Al-Qasem",
    email: "haya@example.com",
    isArtist: true,
    profilePicture: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "user4",
    name: "Ahmad Khalil",
    email: "ahmad@example.com",
    isArtist: false,
  },
];

export const mockArtists: Artist[] = [
  {
    id: "artist1",
    userId: "user1",
    name: {
      en: "Layla Ibrahim",
      ar: "ليلى إبراهيم",
    },
    bio: {
      en: "Contemporary painter from Amman focusing on abstract expressionism inspired by Jordanian landscapes.",
      ar: "رسامة معاصرة من عمان تركز على التعبيرية التجريدية المستوحاة من المناظر الطبيعية الأردنية.",
    },
    profilePicture: "https://randomuser.me/api/portraits/women/42.jpg",
    coverImage:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: {
      en: "Amman, Jordan",
      ar: "عمان، الأردن",
    },
    socialLinks: {
      instagram: "https://instagram.com/layla",
      facebook: "https://facebook.com/laylart",
      website: "https://laylaibrahim.com",
    },
    tags: ["abstract", "expressionism", "landscape", "contemporary"],
    featured: true,
  },
  {
    id: "artist2",
    userId: "user2",
    name: {
      en: "Omar Nasser",
      ar: "عمر ناصر",
    },
    bio: {
      en: "Calligraphy artist merging traditional Arabic scripts with modern design elements.",
      ar: "فنان خط يدمج بين النصوص العربية التقليدية وعناصر التصميم الحديثة.",
    },
    profilePicture: "https://randomuser.me/api/portraits/men/36.jpg",
    coverImage:
      "https://images.unsplash.com/photo-1581851772610-3eb6a212b9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: {
      en: "Amman, Jordan",
      ar: "عمان، الأردن",
    },
    socialLinks: {
      instagram: "https://instagram.com/omarcalligraphy",
      twitter: "https://twitter.com/omarnasser",
    },
    tags: ["calligraphy", "arabic", "typography", "traditional"],
    featured: true,
  },
  {
    id: "artist3",
    userId: "user3",
    name: {
      en: "Haya Al-Qasem",
      ar: "هيا القاسم",
    },
    bio: {
      en: "Ceramic artist creating functional pottery with patterns inspired by Jordanian heritage.",
      ar: "فنانة سيراميك تصنع الفخار الوظيفي بأنماط مستوحاة من التراث الأردني.",
    },
    profilePicture: "https://randomuser.me/api/portraits/women/65.jpg",
    coverImage:
      "https://images.unsplash.com/photo-1565193566173-77a5b2732476?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: {
      en: "Zarqa, Jordan",
      ar: "الزرقاء، الأردن",
    },
    socialLinks: {
      instagram: "https://instagram.com/hayapottery",
      facebook: "https://facebook.com/hayacraft",
    },
    tags: ["pottery", "ceramics", "functional", "heritage"],
    featured: false,
  },
];

export const mockProducts: Product[] = [
  {
    id: "product1",
    artistId: "artist1",
    title: {
      en: "Desert Sunset",
      ar: "غروب الصحراء",
    },
    description: {
      en: "Abstract painting capturing the vibrant colors of a Jordanian desert sunset.",
      ar: "لوحة تجريدية تلتقط الألوان النابضة بالحياة لغروب الشمس في الصحراء الأردنية.",
    },
    price: 450,
    currency: "JOD",
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1552672444-70e8f8687eb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    ],
    category: "painting",
    medium: "acrylic",
    dimensions: {
      width: 90,
      height: 60,
      unit: "cm",
    },
    inStock: true,
    featured: true,
    dateCreated: "2023-04-15",
    dateAdded: "2023-05-01",
    tags: ["abstract", "landscape", "sunset", "desert"],
  },
  {
    id: "product2",
    artistId: "artist1",
    title: {
      en: "Petra by Night",
      ar: "البتراء ليلاً",
    },
    description: {
      en: "A moody interpretation of Petra's iconic treasury illuminated by candlelight.",
      ar: "تفسير مزاجي لخزنة البتراء الشهيرة مضاءة بضوء الشموع.",
    },
    price: 600,
    currency: "JOD",
    images: [
      "https://images.unsplash.com/photo-1563779815-a2ef09e3c1e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    ],
    category: "painting",
    medium: "oil",
    dimensions: {
      width: 100,
      height: 120,
      unit: "cm",
    },
    inStock: true,
    featured: false,
    dateCreated: "2023-03-10",
    dateAdded: "2023-03-15",
    tags: ["petra", "night", "historical", "atmospheric"],
  },
  {
    id: "product3",
    artistId: "artist2",
    title: {
      en: "Harmony",
      ar: "تناغم",
    },
    description: {
      en: 'Modern calligraphy piece featuring the word "Harmony" in flowing Arabic script.',
      ar: 'قطعة خط حديثة تعرض كلمة "تناغم" بخط عربي منساب.',
    },
    price: 350,
    currency: "JOD",
    images: [
      "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600006887935-9f50fb23661a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    ],
    category: "calligraphy",
    medium: "mixed_media",
    dimensions: {
      width: 50,
      height: 70,
      unit: "cm",
    },
    inStock: true,
    featured: true,
    dateCreated: "2023-06-20",
    dateAdded: "2023-06-25",
    tags: ["calligraphy", "arabic", "typography", "harmony"],
  },
  {
    id: "product4",
    artistId: "artist2",
    title: {
      en: "Love Letters",
      ar: "رسائل حب",
    },
    description: {
      en: "A collection of three mini calligraphy pieces featuring love poetry in Arabic.",
      ar: "مجموعة من ثلاث قطع خط صغيرة تضم أشعار الحب بالعربية.",
    },
    price: 275,
    currency: "JOD",
    images: [
      "https://images.unsplash.com/photo-1618828272145-97890b64334a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    ],
    category: "calligraphy",
    medium: "paper",
    dimensions: {
      width: 20,
      height: 30,
      unit: "cm",
    },
    inStock: true,
    featured: false,
    dateCreated: "2023-05-14",
    dateAdded: "2023-05-20",
    tags: ["calligraphy", "arabic", "poetry", "love"],
  },
  {
    id: "product5",
    artistId: "artist3",
    title: {
      en: "Heritage Serving Bowl",
      ar: "وعاء تقديم تراثي",
    },
    description: {
      en: "Handcrafted ceramic bowl with traditional Jordanian patterns in blue and turquoise.",
      ar: "وعاء سيراميك مصنوع يدويًا بأنماط أردنية تقليدية باللونين الأزرق والفيروزي.",
    },
    price: 85,
    currency: "JOD",
    images: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1577140149101-0b211b4b896a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    ],
    category: "pottery",
    medium: "ceramic",
    dimensions: {
      width: 25,
      height: 10,
      depth: 25,
      unit: "cm",
    },
    weight: {
      value: 800,
      unit: "g",
    },
    inStock: true,
    quantity: 3,
    featured: true,
    dateCreated: "2023-07-05",
    dateAdded: "2023-07-10",
    tags: ["pottery", "functional", "traditional", "bowl"],
  },
  {
    id: "product6",
    artistId: "artist3",
    title: {
      en: "Desert Bloom Vase",
      ar: "مزهرية ازدهار الصحراء",
    },
    description: {
      en: "Elegant ceramic vase inspired by desert flowers with a gradient glaze from sandy beige to soft pink.",
      ar: "مزهرية سيراميك أنيقة مستوحاة من زهور الصحراء مع طلاء متدرج من البيج الرملي إلى الوردي الناعم.",
    },
    price: 120,
    currency: "JOD",
    images: [
      "https://images.unsplash.com/photo-1578749271270-c8ed14a7b1ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    ],
    category: "pottery",
    medium: "ceramic",
    dimensions: {
      width: 15,
      height: 30,
      depth: 15,
      unit: "cm",
    },
    weight: {
      value: 1.2,
      unit: "kg",
    },
    inStock: true,
    quantity: 2,
    featured: false,
    dateCreated: "2023-08-12",
    dateAdded: "2023-08-18",
    tags: ["pottery", "vase", "desert", "floral"],
  },
];
