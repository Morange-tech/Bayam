export const products = [
  {
    id: 'p1',
    slug: 'smartphone-android-128gb',
    name: 'Smartphone Android 128GB, 6.5" HD+',
    price: 149000,
    originalPrice: 179000,
    discount: 17,
    rating: 4.5,
    reviewCount: 128,
    soldCount: 432,
    image: '/images/products/smartphone-android.jpg',
    category: { slug: 'electronique', name: 'Électronique' },
    stock: 3,
    fastDelivery: true,
    shortDescription:
      'Smartphone Android 128GB avec écran 6.5" HD+, appareil photo double capteur et batterie longue durée.',
    description: `
      <p>Profitez d'un grand écran 6.5" HD+ pour vos vidéos, réseaux sociaux et jeux au quotidien. Avec 128 Go de stockage et 4 Go de RAM, ce smartphone garde vos photos, applications et souvenirs sans jamais manquer de place.</p>
      <ul>
        <li>Double capteur photo 13MP + 2MP pour des clichés nets en toutes circonstances</li>
        <li>Batterie 5000 mAh avec charge rapide 18W</li>
        <li>Double SIM, compatible 4G</li>
        <li>Déverrouillage par empreinte digitale et reconnaissance faciale</li>
      </ul>
      <p>Livré avec chargeur, câble USB-C et coque de protection offerte.</p>
    `,
    specifications: [
      { label: 'Marque', value: 'BAYAM Tech' },
      { label: 'Écran', value: '6.5" HD+ (720 x 1600)' },
      { label: 'Stockage', value: '128 Go' },
      { label: 'RAM', value: '4 Go' },
      { label: 'Batterie', value: '5000 mAh' },
      { label: 'Système d’exploitation', value: 'Android 13' },
      { label: 'Réseau', value: 'Double SIM, 4G' },
      { label: 'Garantie', value: '12 mois' },
    ],
    highlights: [
      'Grand écran 6.5" HD+ pour vos vidéos, réseaux sociaux et jeux',
      'Batterie 5000 mAh avec charge rapide 18W',
      'Double capteur photo 13MP + 2MP pour des clichés nets en toutes circonstances',
      'Double SIM, compatible 4G',
      'Déverrouillage par empreinte digitale et reconnaissance faciale',
    ],
    hasVariants: true,
    variants: [
      {
        id: 'couleur',
        label: 'Couleur',
        options: [
          { id: 'noir', label: 'Noir', value: '#111827' },
          { id: 'bleu', label: 'Bleu nuit', value: '#1D4ED8' },
          { id: 'or', label: 'Or', value: '#B8966E' },
        ],
      },
      {
        id: 'stockage',
        label: 'Stockage',
        options: [
          { id: '128', label: '128 Go' },
          { id: '256', label: '256 Go' },
        ],
      },
    ],
    images: [
      { url: 'https://placehold.co/700x700/EDE9FE/3A1868?text=Smartphone+1', alt: 'Smartphone Android, vue de face' },
      { url: 'https://placehold.co/700x700/EDE9FE/3A1868?text=Smartphone+2', alt: 'Smartphone Android, vue arrière' },
      { url: 'https://placehold.co/700x700/EDE9FE/3A1868?text=Smartphone+3', alt: 'Smartphone Android, vue de profil' },
      { url: 'https://placehold.co/700x700/EDE9FE/3A1868?text=Smartphone+4', alt: 'Smartphone Android, avec accessoires' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Jeanne Kamga',
        rating: 5,
        date: '2026-08-12',
        text: "Très bon rapport qualité-prix, la batterie tient largement une journée complète. Livraison rapide sur Douala.",
        verified: true,
      },
      {
        id: 'r2',
        author: 'Arnaud Fotso',
        rating: 4,
        date: '2026-07-30',
        text: "L'écran est agréable et l'appareil photo correct en journée. Un peu juste en basse lumière.",
        verified: true,
      },
      {
        id: 'r3',
        author: 'Sandrine Mballa',
        rating: 5,
        date: '2026-07-18',
        text: 'Exactement conforme à la description, le vendeur a bien suivi ma commande via WhatsApp.',
        verified: true,
      },
      {
        id: 'r4',
        author: 'Patrick Nguemo',
        rating: 3,
        date: '2026-06-25',
        text: 'Correct pour le prix mais le chargeur fourni est un peu lent.',
        verified: false,
      },
      {
        id: 'r5',
        author: 'Estelle Njoya',
        rating: 5,
        date: '2026-06-02',
        text: 'Mon deuxième achat chez BAYAM, toujours aussi fiable.',
        verified: true,
      },
      {
        id: 'r6',
        author: 'Yannick Talla',
        rating: 4,
        date: '2026-05-14',
        text: 'Bon téléphone, fluide au quotidien. Je recommande.',
        verified: true,
      },
    ],
    questions: [
      {
        id: 'q1',
        author: 'Cédric Mvondo',
        date: '2026-07-02',
        question: 'Est-ce que ce téléphone accepte deux puces de réseaux différents en même temps ?',
        answer: 'Oui, il est double SIM et les deux emplacements fonctionnent simultanément en 4G.',
      },
      {
        id: 'q2',
        author: 'Aminatou Bello',
        date: '2026-06-18',
        question: 'Le chargeur fourni permet-il vraiment une charge rapide ?',
        answer: 'Oui, le chargeur 18W fourni dans la boîte prend en charge la charge rapide.',
      },
    ],
  },
  {
    id: 'p2',
    slug: 'ecouteurs-bluetooth-sport',
    name: 'Écouteurs Bluetooth Sport, autonomie 20h',
    price: 15000,
    rating: 4.2,
    reviewCount: 64,
    soldCount: 189,
    image: '/images/products/ecouteurs-bluetooth.jpg',
    category: { slug: 'electronique', name: 'Électronique' },
    inStock: false,
    stock: 0,
    shortDescription: 'Écouteurs Bluetooth sport avec 20h d’autonomie et résistance à la transpiration.',
    description: `
      <p>Conçus pour le sport, ces écouteurs sans fil offrent un maintien sécurisé et une autonomie de 20h grâce à leur boîtier de charge.</p>
      <ul>
        <li>Bluetooth 5.0, faible latence</li>
        <li>Résistants à la transpiration (IPX4)</li>
        <li>Commandes tactiles</li>
      </ul>
    `,
    specifications: [
      { label: 'Marque', value: 'BAYAM Audio' },
      { label: 'Connectivité', value: 'Bluetooth 5.0' },
      { label: 'Autonomie', value: '20h avec boîtier' },
      { label: 'Étanchéité', value: 'IPX4' },
      { label: 'Garantie', value: '6 mois' },
    ],
    hasVariants: false,
    images: [
      { url: 'https://placehold.co/700x700/EDE9FE/3A1868?text=Ecouteurs+1', alt: 'Écouteurs Bluetooth Sport' },
      { url: 'https://placehold.co/700x700/EDE9FE/3A1868?text=Ecouteurs+2', alt: 'Écouteurs Bluetooth Sport avec boîtier' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Christelle Eyenga',
        rating: 4,
        date: '2026-05-20',
        text: 'Bon son pour le prix, tiennent bien pendant le sport.',
        verified: true,
      },
      {
        id: 'r2',
        author: 'Herve Ndongo',
        rating: 4,
        date: '2026-04-11',
        text: 'Autonomie annoncée respectée. Actuellement en rupture mais ça vaut le coup d’attendre.',
        verified: true,
      },
    ],
  },
  {
    id: 'p3',
    slug: 'robe-wax-elegante',
    name: 'Robe Wax élégante, coupe cintrée',
    price: 25000,
    rating: 4.8,
    reviewCount: 96,
    soldCount: 356,
    image: '/images/products/robe-wax.jpg',
    category: { slug: 'mode', name: 'Mode' },
    stock: 14,
    fastDelivery: true,
    shortDescription: 'Robe Wax élégante à coupe cintrée, disponible en plusieurs tailles et coloris.',
    description: `
      <p>Une robe Wax cousue à la main, coupe cintrée flatteuse et tissu 100% coton imprimé. Idéale pour les grandes occasions comme le quotidien chic.</p>
      <ul>
        <li>Tissu Wax 100% coton</li>
        <li>Doublure intérieure confortable</li>
        <li>Fermeture éclair invisible au dos</li>
      </ul>
    `,
    specifications: [
      { label: 'Matière', value: '100% coton Wax' },
      { label: 'Entretien', value: 'Lavage à la main recommandé' },
      { label: 'Origine', value: 'Confectionnée au Cameroun' },
      { label: 'Garantie', value: 'Échange sous 7 jours' },
    ],
    hasVariants: true,
    variants: [
      {
        id: 'taille',
        label: 'Taille',
        options: [
          { id: 's', label: 'S' },
          { id: 'm', label: 'M' },
          { id: 'l', label: 'L' },
          { id: 'xl', label: 'XL' },
        ],
      },
      {
        id: 'couleur',
        label: 'Couleur',
        options: [
          { id: 'orange', label: 'Orange', value: '#EA580C' },
          { id: 'violet', label: 'Violet', value: '#6D28D9' },
        ],
      },
    ],
    images: [
      { url: 'https://placehold.co/700x700/F3EAD8/3A1868?text=Robe+Wax+1', alt: 'Robe Wax élégante, vue de face' },
      { url: 'https://placehold.co/700x700/F3EAD8/3A1868?text=Robe+Wax+2', alt: 'Robe Wax élégante, vue de dos' },
      { url: 'https://placehold.co/700x700/F3EAD8/3A1868?text=Robe+Wax+3', alt: 'Robe Wax élégante, détail tissu' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Marie-Claire Abena',
        rating: 5,
        date: '2026-08-05',
        text: 'Magnifique robe, la coupe est parfaite et le tissu est de très bonne qualité.',
        verified: true,
      },
      {
        id: 'r2',
        author: 'Nadege Bella',
        rating: 5,
        date: '2026-07-22',
        text: 'Portée à un mariage, j’ai reçu énormément de compliments !',
        verified: true,
      },
      {
        id: 'r3',
        author: 'Odile Simo',
        rating: 4,
        date: '2026-06-30',
        text: 'Très belle robe, taille un peu petit donc prenez une taille au-dessus.',
        verified: false,
      },
    ],
  },
  {
    id: 'p4',
    slug: 'sneakers-urban',
    name: 'Sneakers Urban, semelle confort',
    price: 35000,
    originalPrice: 42000,
    discount: 17,
    rating: 4.3,
    reviewCount: 51,
    soldCount: 201,
    image: '/images/products/sneakers-urban.jpg',
    category: { slug: 'mode', name: 'Mode' },
    stock: 4,
    shortDescription: 'Sneakers urbaines à semelle confort, disponibles du 39 au 44.',
    description: `
      <p>Des sneakers polyvalentes, pensées pour la ville. Semelle intérieure mémoire de forme pour un confort toute la journée.</p>
      <ul>
        <li>Semelle extérieure antidérapante</li>
        <li>Tige en toile respirante</li>
        <li>Lacets renforcés</li>
      </ul>
    `,
    specifications: [
      { label: 'Matière', value: 'Toile et synthétique' },
      { label: 'Semelle', value: 'Caoutchouc antidérapant' },
      { label: 'Pointures disponibles', value: '39 à 44' },
      { label: 'Garantie', value: '6 mois' },
    ],
    hasVariants: true,
    variants: [
      {
        id: 'pointure',
        label: 'Pointure',
        options: [
          { id: '39', label: '39' },
          { id: '40', label: '40' },
          { id: '41', label: '41' },
          { id: '42', label: '42' },
          { id: '43', label: '43' },
          { id: '44', label: '44' },
        ],
      },
    ],
    images: [
      { url: 'https://placehold.co/700x700/F3EAD8/3A1868?text=Sneakers+1', alt: 'Sneakers Urban, vue de côté' },
      { url: 'https://placehold.co/700x700/F3EAD8/3A1868?text=Sneakers+2', alt: 'Sneakers Urban, vue de dessus' },
      { url: 'https://placehold.co/700x700/F3EAD8/3A1868?text=Sneakers+3', alt: 'Sneakers Urban, semelle' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Willy Ateba',
        rating: 4,
        date: '2026-08-01',
        text: 'Confortables et légères, parfaites pour marcher toute la journée.',
        verified: true,
      },
      {
        id: 'r2',
        author: 'Carine Owona',
        rating: 5,
        date: '2026-07-10',
        text: 'Très bon rapport qualité-prix, taille normalement.',
        verified: true,
      },
      {
        id: 'r3',
        author: 'Steve Biya',
        rating: 4,
        date: '2026-06-15',
        text: 'Bonne semelle, un peu bruyantes sur carrelage au début.',
        verified: false,
      },
    ],
  },
  {
    id: 'p5',
    slug: 'blender-mixeur-pro',
    name: 'Blender mixeur professionnel 1.5L',
    price: 28000,
    rating: 4.6,
    reviewCount: 73,
    soldCount: 298,
    image: '/images/products/blender-mixeur.jpg',
    category: { slug: 'maison', name: 'Maison & Cuisine' },
    stock: 22,
    isNew: true,
    fastDelivery: true,
    shortDescription: 'Blender mixeur professionnel 1.5L, idéal pour jus, smoothies et sauces.',
    description: `
      <p>Un blender puissant pour préparer jus, smoothies, sauces et purées en quelques secondes. Bol en verre trempé de 1.5L résistant aux chocs thermiques.</p>
      <ul>
        <li>Moteur 500W, 3 vitesses + fonction pulse</li>
        <li>Lames en acier inoxydable</li>
        <li>Bol gradué facile à nettoyer</li>
      </ul>
    `,
    specifications: [
      { label: 'Puissance', value: '500W' },
      { label: 'Capacité', value: '1.5 litre' },
      { label: 'Matière du bol', value: 'Verre trempé' },
      { label: 'Vitesses', value: '3 + pulse' },
      { label: 'Garantie', value: '12 mois' },
    ],
    hasVariants: false,
    images: [
      { url: 'https://placehold.co/700x700/EDE9FE/3A1868?text=Blender+1', alt: 'Blender mixeur professionnel' },
      { url: 'https://placehold.co/700x700/EDE9FE/3A1868?text=Blender+2', alt: 'Blender mixeur professionnel, bol gradué' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Larissa Fouda',
        rating: 5,
        date: '2026-08-18',
        text: 'Mixe très bien même les fruits durs, facile à nettoyer.',
        verified: true,
      },
      {
        id: 'r2',
        author: 'Thierry Onana',
        rating: 4,
        date: '2026-07-05',
        text: 'Bon appareil, un peu bruyant à pleine vitesse.',
        verified: true,
      },
    ],
  },
  {
    id: 'p6',
    slug: 'creme-hydratante-bio',
    name: 'Crème hydratante bio visage & corps',
    price: 8000,
    rating: 4.7,
    reviewCount: 210,
    soldCount: 745,
    image: '/images/products/creme-hydratante.jpg',
    category: { slug: 'beaute', name: 'Beauté & Santé' },
    stock: 35,
    isNew: true,
    fastDelivery: true,
    shortDescription: 'Crème hydratante bio pour visage et corps, formulée avec du beurre de karité.',
    description: `
      <p>Une crème nourrissante à base de beurre de karité et d’huiles naturelles, adaptée à tous types de peau.</p>
      <ul>
        <li>Formule bio, sans paraben</li>
        <li>Absorption rapide, non grasse</li>
        <li>Parfum léger</li>
      </ul>
    `,
    specifications: [
      { label: 'Contenance', value: '250 ml' },
      { label: 'Ingrédients clés', value: 'Beurre de karité, aloe vera' },
      { label: 'Type de peau', value: 'Tous types' },
      { label: 'Garantie', value: 'Satisfait ou remboursé 7 jours' },
    ],
    hasVariants: false,
    images: [
      { url: 'https://placehold.co/700x700/F3EAD8/3A1868?text=Creme+1', alt: 'Crème hydratante bio' },
      { url: 'https://placehold.co/700x700/F3EAD8/3A1868?text=Creme+2', alt: 'Crème hydratante bio, texture' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Ines Manga',
        rating: 5,
        date: '2026-08-22',
        text: 'Ma peau est beaucoup plus douce depuis que je l’utilise.',
        verified: true,
      },
      {
        id: 'r2',
        author: 'Brice Essomba',
        rating: 5,
        date: '2026-08-09',
        text: 'Odeur agréable, ne colle pas. Je rachète.',
        verified: true,
      },
      {
        id: 'r3',
        author: 'Chantal Nkolo',
        rating: 4,
        date: '2026-07-14',
        text: 'Très bonne crème, le flacon pourrait être plus grand.',
        verified: true,
      },
    ],
  },
  {
    id: 'p7',
    slug: 'ballon-football-taille-5',
    name: 'Ballon de football taille 5',
    price: 12000,
    rating: 4.4,
    reviewCount: 39,
    soldCount: 162,
    image: '/images/products/ballon-football.jpg',
    category: { slug: 'sport', name: 'Sport & Loisirs' },
    stock: 40,
    isNew: true,
    shortDescription: 'Ballon de football taille 5, résistant, pour terrain et salle.',
    description: `
      <p>Ballon de football taille officielle 5, conçu pour résister à une utilisation intensive sur terrain comme en salle.</p>
      <ul>
        <li>Revêtement PU résistant à l’abrasion</li>
        <li>Chambre à air butyle, bonne rétention de pression</li>
      </ul>
    `,
    specifications: [
      { label: 'Taille', value: '5 (officielle)' },
      { label: 'Matière', value: 'PU synthétique' },
      { label: 'Usage', value: 'Terrain et salle' },
      { label: 'Garantie', value: '3 mois' },
    ],
    hasVariants: false,
    images: [
      { url: 'https://placehold.co/700x700/EDE9FE/3A1868?text=Ballon+1', alt: 'Ballon de football taille 5' },
      { url: 'https://placehold.co/700x700/EDE9FE/3A1868?text=Ballon+2', alt: 'Ballon de football, détail du revêtement' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Junior Mbida',
        rating: 4,
        date: '2026-06-20',
        text: 'Bon ballon, garde bien la pression après plusieurs semaines.',
        verified: true,
      },
      {
        id: 'r2',
        author: 'Alain Tchoumi',
        rating: 5,
        date: '2026-05-28',
        text: 'Très résistant, utilisé sur terrain en terre battue sans souci.',
        verified: false,
      },
    ],
  },
  {
    id: 'p8',
    slug: 'riz-parfume-25kg',
    name: 'Riz parfumé premium, sac de 25kg',
    price: 32000,
    originalPrice: 36000,
    discount: 11,
    rating: 4.9,
    reviewCount: 180,
    soldCount: 683,
    image: '/images/products/riz-parfume.jpg',
    category: { slug: 'alimentation', name: 'Alimentation' },
    stock: 50,
    isNew: true,
    fastDelivery: true,
    shortDescription: 'Riz parfumé premium en sac de 25kg, qualité supérieure pour toute la famille.',
    description: `
      <p>Riz long grain parfumé, sélectionné pour sa qualité supérieure. Le sac de 25kg est idéal pour les familles nombreuses ou la revente.</p>
      <ul>
        <li>Grains longs et parfumés</li>
        <li>Faible taux de brisures</li>
        <li>Emballage refermable</li>
      </ul>
    `,
    specifications: [
      { label: 'Poids net', value: '25 kg' },
      { label: 'Type', value: 'Riz long grain parfumé' },
      { label: 'Origine', value: 'Importé' },
      { label: 'Conservation', value: 'Lieu sec, à l’abri de l’humidité' },
    ],
    hasVariants: false,
    images: [
      { url: 'https://placehold.co/700x700/F3EAD8/3A1868?text=Riz+1', alt: 'Sac de riz parfumé premium 25kg' },
      { url: 'https://placehold.co/700x700/F3EAD8/3A1868?text=Riz+2', alt: 'Riz parfumé, grains' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Solange Ekani',
        rating: 5,
        date: '2026-08-27',
        text: 'Excellent riz, très parfumé et peu de brisures.',
        verified: true,
      },
      {
        id: 'r2',
        author: 'Ferdinand Assiga',
        rating: 5,
        date: '2026-08-03',
        text: 'Je commande ce sac chaque mois, qualité constante.',
        verified: true,
      },
      {
        id: 'r3',
        author: 'Vivianne Mengue',
        rating: 4,
        date: '2026-07-19',
        text: 'Très bon riz, livraison un peu longue mais ça vaut le coup.',
        verified: true,
      },
    ],
  },
]
