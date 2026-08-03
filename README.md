# Vainy (VaineBot) 🤖

<div align="center">
  <i>Le bot Discord multifonction exclusif à l'écosystème Vainerac.fr</i>
</div>

---

## 📑 Table des Matières

1. [À Propos du Projet](#-à-propos-du-projet)
2. [Fonctionnalités Principales](#-fonctionnalités-principales)
3. [Architecture et Technologies](#-architecture-et-technologies)
4. [Structure du Projet](#-structure-du-projet)
5. [Installation et Configuration](#-installation-et-configuration)
6. [Utilisation](#-utilisation)
7. [Licence](#-licence)

---

## 📖 À Propos du Projet

**Vainy** (ou VaineBot) est un assistant numérique complet développé sur mesure pour gérer et dynamiser la communauté **Vainerac.fr**. Bien plus qu'un simple bot de modération, il agit comme une véritable passerelle intelligente entre le serveur Discord communautaire, le site web officiel, et des applications tierces en temps réel.

Ce projet a été conçu pour automatiser les tâches administratives lourdes, sécuriser les accès à la communauté, et offrir une expérience utilisateur enrichie et immersive.

---

## 🚀 Fonctionnalités Principales

*   **🔗 Système d'Authentification OAuth2 :** 
    * Connexion sécurisée et liaison des comptes Discord au site web Vainerac.
    * Processus de vérification et d'intégration automatisé pour les membres.
*   **🚛 Intégration Télémétrie Jeux Vidéo (ETS2) :** 
    * Réception en temps réel des données de télémétrie de simulateurs (comme Euro Truck Simulator 2).
    * Mise à jour dynamique du statut d'activité du bot (ex: affichage de la livraison en cours, statut du trajet, etc.).
*   **🔐 Gestion Dynamique et Sécurisée des Rôles :** 
    * Synchronisation automatique des rôles Discord en fonction des permissions gérées depuis le panel d'administration centralisé.
    * Attribution intelligente des statuts (VIP, Développeurs, Streamers, etc.).
*   **📡 Monitoring et Alertes en Direct :** 
    * Surveillance continue de l'état des services web (latence, statut de disponibilité opérationnelle).
    * Diffusion d'alertes automatiques et maintien d'un tableau de bord de statut actualisé en direct sur Discord.
*   **⚙️ Architecture de Commandes Hybride :** 
    * Support des Slash Commands `/` interactives pour une navigation moderne.
    * Maintien des commandes classiques par préfixe pour des actions d'administration rapides.

---

## 🛠️ Architecture et Technologies

Le projet repose sur une pile technologique robuste et moderne :

*   **Environnement d'exécution :** Node.js
*   **Interaction Discord :** Discord.js (v14)
*   **Serveur et API Web :** Express.js (pour la gestion des webhooks et de l'OAuth de manière asynchrone)
*   **Requêtes HTTP :** Axios (pour la communication inter-services avec l'infrastructure web)
*   **Sécurité :** Dotenv (gestion stricte des variables d'environnement pour assurer la confidentialité des jetons)

---

## 📂 Structure du Projet

Le bot est organisé de manière modulaire pour faciliter sa maintenance et son évolution :

*   `/commands` : Modules contenant toutes les commandes exécutables par les utilisateurs (catégorisées par dossiers).
*   `/events` : Écouteurs d'événements Discord (connexion, réception de messages, interactions UI).
*   `/utils` : Fonctions utilitaires partagées à travers le projet.
*   `/Ressources` : Assets et fichiers statiques exploités par le bot.
*   `index.js` : Point d'entrée principal orchestrant les connexions Discord et le serveur d'écoute des données entrantes.
*   `deploy.js` : Script utilitaire permettant la synchronisation des commandes avec l'API globale Discord.

---

## 💻 Installation et Configuration

> **Note :** Ce bot étant destiné à un usage privé, ces instructions sont réservées aux développeurs de l'écosystème Vainerac.

1. **Cloner le projet** sur la machine hôte.
2. **Installer les dépendances Node :**
   ```bash
   npm install
   ```
3. **Configurer l'environnement :**
   Créer un fichier `.env` à la racine et y inclure les variables nécessaires à l'infrastructure (Tokens Discord, URIs de redirection, Clés d'API, etc.).
4. **Déployer les commandes :**
   ```bash
   node deploy.js
   ```
5. **Lancer le bot :**
   ```bash
   npm start
   ```
   *(Pour l'environnement de développement, utiliser `npm run dev` pour profiter du rechargement à chaud).*

---

## 🎮 Utilisation

Une fois le bot connecté, il initialise immédiatement ses modules et commence à écouter les événements. 
Les utilisateurs peuvent interagir avec l'assistant via le menu des applications Discord (`/`) ou via les commandes préfixées. Les flux de données externes (télémétrie, authentification web) sont traités de manière transparente en arrière-plan.

---

## 📜 Licence

Ce projet est sous licence **Creative Commons Attribution - Pas d'Utilisation Commerciale - Partage dans les Mêmes Conditions 4.0 International (CC BY-NC-SA 4.0)**.

*   L'utilisation commerciale de ce code est **strictement interdite**.
*   Toute modification ou partage de ce code source doit se faire sous les mêmes conditions.

Consultez le fichier [LICENSE](./LICENSE) à la racine du projet pour prendre connaissance de l'ensemble des termes légaux.
# MythoriaBot
