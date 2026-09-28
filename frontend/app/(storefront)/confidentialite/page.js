const sections = [
  {
    title: '1. Données collectées',
    body: `Lors de la création d'un compte ou de la passation d'une commande, BAYAM collecte les données
    nécessaires au traitement de votre demande : nom, prénom, numéro de téléphone, adresse email, adresse
    de livraison et historique de commandes.`,
  },
  {
    title: '2. Utilisation des données',
    body: `Ces données sont utilisées pour traiter vos commandes, assurer le suivi de livraison, gérer votre
    compte client et vous contacter en cas de besoin. Elles ne sont jamais revendues à des tiers à des fins
    commerciales.`,
  },
  {
    title: '3. Partage des données',
    body: `Vos données peuvent être partagées avec nos partenaires de livraison et de paiement (Mobile
    Money), dans la seule mesure nécessaire à l'exécution de votre commande.`,
  },
  {
    title: '4. Conservation des données',
    body: `Vos données sont conservées pendant la durée de votre relation avec BAYAM, puis archivées ou
    supprimées conformément aux obligations légales applicables.`,
  },
  {
    title: '5. Vos droits',
    body: `Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
    Vous pouvez exercer ces droits à tout moment depuis votre espace « Mon profil » ou en contactant notre
    service client.`,
  },
  {
    title: '6. Cookies',
    body: `Le site utilise des cookies pour améliorer votre expérience de navigation. Pour en savoir plus,
    consultez notre Politique de gestion des cookies.`,
  },
  {
    title: '7. Sécurité',
    body: `BAYAM met en œuvre les mesures techniques et organisationnelles nécessaires pour protéger vos
    données contre tout accès non autorisé, perte ou divulgation.`,
  },
]

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="text-2xl font-bold text-violet-deep sm:text-3xl">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-gray-500">Dernière mise à jour : janvier 2026</p>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-semibold text-violet-deep">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
