Voici un Document de Spécifications Produit (PRD) complet pour votre application **CoChef**.

---

# Product Requirement Document (PRD) - Application "CoChef"

## 1. Présentation du Projet

**CoChef** est une application web de restauration moderne permettant aux clients de commander en ligne, aux caissiers de gérer les flux en temps réel et aux gérants de piloter la performance financière.

### Stack Technique

* **Backend :** Python (FastAPI), SQL (PostgreSQL/MySQL), JWT (Authentification).
* **Frontend :** React JS (Approche **Mobile First**), Tailwind CSS.
* **Temps Réel :** WebSockets (pour les notifications caissier).

---

## 2. Architecture des Utilisateurs et Permissions

| Rôle | Accès & Fonctionnalités |
| --- | --- |
| **Client** | Consultation menu, inscription/connexion, commande personnalisée, historique (N° commande, date, état, prix). |
| **Caissier** | Dashboard temps réel, notifications sonores/visuelles, gestion du cycle de vie des commandes (En cours -> Prête). |
| **Gérant** | Dashboard analytique (KPI), export Excel, vue globale des ventes et statistiques. |

---

## 3. Spécifications Fonctionnelles (Frontend)

### A. Pages Publiques (Client)

* **Accueil :** * Bannière Full Width.
* Section "Chef du Jour" (Image + Bio).
* Blocs Responsives : Menu du jour, Menu de la semaine, Plat du jour (avec prix).
* Slider Partenaires (Animation React).
* Bannière interne "Contactez-nous".


* **Menus par Catégories :** Architecture en onglets pour Entrées, Plats, Sandwichs, Pizzas, Boissons.
* **Processus de Commande (Logique de personnalisation) :**
* *Catégorie Sandwich :* Sélection quantité (1-n), viandes, sauces, ingrédients, et suppléments payants.
* *Catégorie Plat :* Quantité et suppléments payants.



### B. Interface Caissier (Real-time)

* **Sidebar :** Nouvelles commandes, En cours, Clôturées.
* **Vue Flux :** Liste dynamique utilisant les **WebSockets** pour afficher les commandes sans recharger la page.
* **Actions :** Bouton "Prendre en charge" et "Marquer comme prête".

### C. Dashboard Gérant (La règle des 5 secondes)

Le dashboard répond à trois questions cruciales :

1. **Combien j’ai vendu ?** (Chiffre d'affaires affiché en grand + Bouton Export Excel).
2. **Que dois-je faire maintenant ?** (Actions rapides sur commandes en attente/livraison).
3. **Est-ce que tout va bien ?** (Graphiques de tendances et produits phares).

---

## 4. Structure du Menu (Data Model)

### Catégories et Sous-catégories

1. **Entrées :** Froides, Chaudes, Soupes, Salades.
2. **Plats principaux :** Traditionnels, Jour, Spécialités Chef, Vegan, Grillés, Pâtes, Riz.
3. **Sandwichs & Street Food :** Makloub, Sandwichs chauds, Shawarma/Kebab.
4. **Pizzas :** Classiques, Spéciales, Végétariennes, Personnalisées.
5. **Boissons :** Chaudes, Froides, Jus naturels, Sodas, Smoothies.

---

## 5. Spécifications Techniques (Backend & API)

### Modèle de Données (Base de données)

* **Users :** ID, nom, email, password (hash), rôle.
* **Products :** ID, nom, catégorie, prix de base, type (plat/sandwich).
* **Orders :** ID, user_id, total_price, status (pending, preparing, ready, closed), created_at.
* **OrderDetails :** ID, order_id, product_id, options (JSON pour les sauces/viandes), suppléments.

### Endpoints FastAPI (Exemples)

* `POST /auth/login` : Génération du token JWT.
* `GET /menu` : Récupère la liste des produits par catégorie.
* `POST /orders` : Création de commande (réservé aux connectés).
* `GET /admin/stats` : Données pour le dashboard gérant.
* `GET /admin/export` : Génération du fichier Excel (via bibliothèque `pandas` ou `xlsxwriter`).

---

## 6. Design & UX (Mobile First)

* **Header/Footer Dynamiques :** S'adaptent selon l'état de connexion (Login/Profil vs Login).
* **Notifications :** Utilisation de `react-toastify` ou sons système pour le caissier.
* **Responsive :** Grid layout pour les menus, menus "hamburger" sur mobile.

