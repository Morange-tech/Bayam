const sections = [
  {
    title: '1. Qu’est-ce qu’un cookie ?',
    body: `Un cookie est un petit fichier texte déposé sur votre appareil lors de votre navigation sur le
    site. Il permet de reconnaître votre navigateur et de mémoriser certaines informations (préférences,
    contenu de votre panier, session de connexion).`,
  },
  {
    title: '2. Cookies utilisés sur BAYAM',
    body: `BAYAM utilise des cookies strictement nécessaires au fonctionnement du site (connexion, panier,
    favoris) ainsi que des cookies de mesure d'audience permettant de comprendre l'usage du site afin de
    l'améliorer.`,
  },
  {
    title: '3. Durée de conservation',
    body: `Les cookies de session sont supprimés à la fermeture de votre navigateur. Les cookies persistants
    (préférences, panier) sont conservés jusqu'à 12 mois maximum.`,
  },
  {
    title: '4. Gestion de vos préférences',
    body: `Vous pouvez à tout moment configurer votre navigateur pour accepter, refuser ou supprimer les
    cookies déposés. La désactivation de certains cookies peut toutefois limiter certaines fonctionnalités
    du site (connexion, panier persistant).`,
  },
]

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="text-2xl font-bold text-violet-deep sm:text-3xl">Politique de gestion des cookies</h1>
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
