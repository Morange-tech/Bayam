const sections = [
  {
    title: '1. Objet',
    body: `Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits réalisées sur
    la plateforme BAYAM entre BAYAM et tout client (« l'Acheteur »). Toute commande passée sur le site
    implique l'acceptation sans réserve des présentes CGV.`,
  },
  {
    title: '2. Produits et prix',
    body: `Les produits proposés sont ceux figurant sur le site au jour de la consultation, dans la limite
    des stocks disponibles. Les prix sont indiqués en Francs CFA (XAF), toutes taxes comprises, hors frais
    de livraison précisés avant la validation de la commande.`,
  },
  {
    title: '3. Commande',
    body: `Toute commande suppose la création d'un compte et la validation d'un panier. BAYAM se réserve le
    droit d'annuler ou de refuser toute commande d'un client avec lequel existerait un litige relatif au
    paiement d'une commande antérieure.`,
  },
  {
    title: '4. Paiement',
    body: `Le paiement peut s'effectuer par Mobile Money (MTN Mobile Money, Orange Money) ou en espèces à la
    livraison, selon les options proposées lors du tunnel de commande. La commande est considérée comme
    définitive à réception de la confirmation de paiement.`,
  },
  {
    title: '5. Livraison',
    body: `Les délais de livraison sont communiqués à titre indicatif lors de la commande et peuvent varier
    selon la zone géographique. BAYAM ne saurait être tenu responsable des retards liés à des événements
    hors de son contrôle.`,
  },
  {
    title: '6. Droit de rétractation et retours',
    body: `L'Acheteur dispose d'un délai de 7 jours à compter de la réception de sa commande pour demander
    un retour ou un remboursement, sous réserve que le produit soit retourné dans son état d'origine. Les
    modalités détaillées sont précisées dans la rubrique Retours & remboursements.`,
  },
  {
    title: '7. Responsabilité',
    body: `BAYAM sélectionne et gère directement l'ensemble des produits vendus sur la plateforme. Sa
    responsabilité ne saurait toutefois être engagée en cas d'inexécution due à un cas de force majeure ou
    au fait imprévisible d'un tiers.`,
  },
  {
    title: '8. Litiges',
    body: `Les présentes CGV sont soumises au droit camerounais. En cas de litige, l'Acheteur est invité à
    contacter le service client avant toute action contentieuse.`,
  },
]

export default function CgvPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="text-2xl font-bold text-violet-deep sm:text-3xl">Conditions Générales de Vente</h1>
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
