# Fxxtyschop Bénin 🇧🇯
**Boutique e-commerce haut de gamme spécialisée dans la vente d'iPhones, smartphones Samsung, MacBook et ordinateurs portables au Bénin.**

---

## 🎨 Charte Graphique Officielle
- **Couleur Primaire :** `#512264` (Violet Fxxtyschop profond)
- **Couleur Secondaire :** `#6B21A8` (Violet moderne)
- **Couleur Accent & CTA :** `#F37021` (Orange dynamique)
- **Arrière-plan :** `#F8F8FA`
- **Typographie & Contraste :** `#1E1B26` / `#4B5563` / `#E5E7EB`

---

## 🚀 Fonctionnalités Clés Réalisées

### 1. Vitrine & Expérience Client
- **En-tête Adaptatif (Sticky) :** Logo Fxxtyschop, barre de recherche en direct, panier avec compteur interactif, menu mobile tiroir et bandeau d'annonces personnalisable.
- **Pied de page professionnel :** Réassurance, zones desservies au Bénin (Cotonou, Abomey-Calavi, Porto-Novo, Ouidah, Parakou...), contact WhatsApp et mentions légales.
- **Page d'Accueil :** Hero banner percutant, cartes visuelles des catégories phares, grille des produits vedettes, section promotionnelle dynamique et avis clients locaux.
- **Catalogue `/boutique` :** Filtres multi-critères (catégories, marques Apple/Samsung/HP/Dell/Anker, promotions, en stock), tri par prix croissant/décroissant et recherche textuelle.
- **Fiches Produits `/produits/[slug]` :** Galerie d'images avec zoom, sélecteur de quantité borné au stock disponible, fiches techniques détaillées (RAM, SSD, processeur, caméra, batterie, état), bouton "Ajouter au panier", "Commander maintenant" et bouton direct WhatsApp.

### 2. Panier & Tunnel de Commande Adapté au Bénin
- **Panier dynamique persistant :** Synchronisation `localStorage`, tiroir coulissant (CartDrawer) et page dédiée `/panier`.
- **Checkout localisé `/commande` :**
  - Formulaire complet avec format de téléphone béninois (+229).
  - Sélection des zones géographiques : Cotonou (1 500 F), Abomey-Calavi (2 000 F), Porto-Novo (3 000 F), Ouidah (3 500 F), Parakou (5 000 F).
  - Modes de règlement à la livraison : Espèces ou Mobile Money (MTN MoMo / Moov Money).
  - Décrémentation automatique des stocks et génération du numéro de commande unique (`FX-YYYYMM-XXXX`).
- **Confirmation de commande :** Page `/commande/confirmation/[orderNumber]` avec récapitulatif financier et bouton de confirmation en 1 clic sur WhatsApp.

### 3. Authentification & Espace Client
- Sessions sécurisées avec cookies HTTP-Only et JWT signés (`jose`, `bcryptjs`).
- Pages `/connexion` et `/inscription` avec validation et redirection intelligente selon les rôles (`ADMIN` vs `CUSTOMER`).
- Espace Client `/compte` : Profil, numéro de contact et historique chronologique des commandes avec statuts en direct (En attente, Confirmée, En préparation, Expédiée, Livrée).

### 4. Back-Office d'Administration `/admin`
- **Dashboard Commercial :** Indicateurs KPIs (Chiffre d'affaires en FCFA, commandes en cours, volume de stock en magasin, alertes de rupture).
- **Gestion des Commandes `/admin/commandes` :** Recherche instantanée, filtrage par statut et sélecteur de changement d'état (remise en stock automatique si annulation).
- **Gestion du Catalogue `/admin/produits` :** Ajout de nouveaux modèles avec modal complet, édition rapide des prix/stocks et suppression.
- **Audit des Stocks `/admin/stocks` :** Enregistrement des ajustements manuels (+/-) avec motif obligatoire et journal chronologique inaltérable des mouvements.
- **Paramètres `/admin/parametres` :** Configuration du numéro WhatsApp de vente, coordonnées, bandeau d'annonces.

---

## 🔑 Comptes de Démonstration Pré-configurés

| Profil | Adresse E-mail | Mot de passe | Rôle |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `admin@fxxtyschop.bj` | `Admin@2026Fxxty` | Accès complet `/admin` |
| **Client Démo** | `client@fxxtyschop.bj` | `Client@2026` | Espace client `/compte` |

*(Des boutons de remplissage en 1 clic sont disponibles sur la page de connexion)*

---

## 🛠️ Stack Technique
- **Framework :** Next.js 16 (App Router, Server & Client Components)
- **Langage :** TypeScript (typage strict)
- **Styling :** Tailwind CSS 4 (palette de marque intégrée)
- **Icônes :** Lucide React
- **ORM & SGBD :** Prisma avec support Neon Serverless PostgreSQL (`prisma/schema.prisma`)
- **Sécurité :** Zod, Jose (JWT), Bcryptjs, Cookies HTTP-Only

---

## 🌐 Déploiement sur Vercel & Neon PostgreSQL

1. **Créer une base PostgreSQL sur [Neon.tech](https://neon.tech)** (Gratuit sans carte bancaire).
2. **Ajouter les variables d'environnement sur Vercel** :
   ```env
   DATABASE_URL="postgresql://user:password@ep-...neon.tech/fxxtyschop?sslmode=require"
   DIRECT_URL="postgresql://user:password@ep-...neon.tech/fxxtyschop?sslmode=require"
   JWT_SECRET="votre_cle_secrete_aleatoire"
   NEXT_PUBLIC_STORE_NAME="Fxxtyschop Bénin"
   NEXT_PUBLIC_WHATSAPP_NUMBER="+22962336142"
   NEXT_PUBLIC_PHONE_NUMBER="+22962336142"
   ```
3. **Lancer le déploiement CI/CD** via GitHub.
