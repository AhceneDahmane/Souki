export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  items: { type: "feature" | "fix" | "change"; text: string }[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "2026-07-11",
    title: "Lancement officiel",
    items: [
      { type: "feature", text: "Landing page avec héros, fonctionnalités, offres et témoignages" },
      { type: "feature", text: "Inscription et connexion avec JWT + cookie HTTP-Only" },
      { type: "feature", text: "Trois rôles : visiteur, vendeur, organisateur" },
      { type: "feature", text: "Dashboard visiteur : souks à venir et historique d'enchères" },
      { type: "feature", text: "Dashboard vendeur : liste des souks et véhicules" },
      { type: "feature", text: "Dashboard organisateur : gestion des souks et inscriptions" },
      { type: "feature", text: "QR codes pour les inscriptions avec zoom plein écran" },
      { type: "feature", text: "Scanner QR intégré via caméra" },
      { type: "feature", text: "Création, modification, duplication et annulation de souks" },
      { type: "feature", text: "Gestion des véhicules (ajout, modification, suppression, duplication)" },
      { type: "feature", text: "Upload d'images pour les véhicules" },
      { type: "feature", text: "Statistiques organisateur et vendeur avec graphiques SVG" },
      { type: "feature", text: "Inscription des véhicules aux souks" },
      { type: "feature", text: "Filtres de recherche pour les souks" },
    ],
  },
];
