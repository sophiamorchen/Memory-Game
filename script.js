// === CONFIGURATION DU JEU ===

// Tableau contenant les URL des images des cartes uniques. Chaque image représente une carte différente.
const cards = [
    'https://picsum.photos/id/237/100/100', 
    'https://picsum.photos/id/238/100/100',
    'https://picsum.photos/id/239/100/100',
    'https://picsum.photos/id/240/100/100',
    'https://picsum.photos/id/241/100/100',
    'https://picsum.photos/id/242/100/100',
    'https://picsum.photos/id/243/100/100',
    'https://picsum.photos/id/244/100/100'
];

// Sélection de l'élément du DOM où le plateau de jeu sera affiché (une div avec l'ID "game-board").
const gameBoard = document.getElementById('game-board');

// Tableau temporaire pour stocker les deux cartes que le joueur sélectionne à chaque fois.
let selectedCard = [];

// Création d'un élément "div" pour afficher le temps restant à l'utilisateur pendant le jeu.
const timeDisplay = document.createElement('div');
timeDisplay.classList.add('time-display'); // On applique une classe CSS à cet élément.
document.body.appendChild(timeDisplay); // On ajoute cet élément au body du HTML.

// Création du bouton "Start Game" pour démarrer la partie.
const startButton = document.createElement('button');
startButton.classList.add('start-button'); // On applique une classe CSS au bouton.
startButton.textContent = 'Start Game'; // Le texte du bouton.
document.body.appendChild(startButton); // Ajout du bouton au DOM.

// === FONCTIONS UTILITAIRES ===

// Cette fonction crée une carte visuelle dans le DOM à partir de l'URL de l'image de la carte.
function createCard(CardUrl) {
    const card = document.createElement('div'); // Création d'une nouvelle div pour la carte.
    card.classList.add('card'); // Ajout d'une classe CSS "card" pour la styliser.
    card.dataset.value = CardUrl; // On stocke l'URL de l'image dans un attribut personnalisé "data-value".

    // Création de l'image de la carte.
    const cardContent = document.createElement('img');
    cardContent.classList.add('card-content'); // Classe CSS pour l'image.
    cardContent.src = CardUrl; // Définition de la source de l'image.

    card.appendChild(cardContent); // Ajout de l'image dans la div de la carte.
    card.addEventListener('click', onCardClick); // Ajout d'un écouteur d'événement pour le clic sur la carte.
    return card; // Retour de l'élément carte complet.
}

// Cette fonction duplique un tableau pour créer les paires de cartes. 
function duplicatedArray(arr) {
    return [...arr, ...arr]; // Crée un nouveau tableau avec deux fois les mêmes éléments.
}

// Mélange le tableau d'images de cartes de manière aléatoire.
function shuffleArray(array) {
    return array.sort(() => 0.5 - Math.random()); // Utilisation d'une fonction de tri aléatoire pour mélanger les éléments.
}

// === TIMER DU JEU ===

// Variables pour gérer le timer et la durée de la partie.
let timerId;
let timeStarted = false; // Indicateur pour savoir si le timer a déjà été lancé.
let endTimeStamp; // Le moment où le timer doit se terminer (fin du jeu).

// Fonction qui gère le timer : elle met à jour le temps restant chaque seconde.
function timer() {
    timerId = setInterval(() => {
        const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes depuis l'epoch (Unix timestamp).
        const remaining = endTimeStamp - now; // Temps restant avant la fin de la partie.
        
        // Si le temps restant est inférieur ou égal à 0, la partie est terminée.
        if (remaining <= 0) {
            clearInterval(timerId); // Arrêt du timer.
            alert('Game Over ! Vous avez perdu !'); // Affichage d'une alerte de fin de jeu.
        } else {
            timeDisplay.textContent = `Temps restant : ${remaining} secondes`; // Mise à jour du texte affichant le temps restant.
        }
    }, 1000); // Cette fonction s'exécute toutes les secondes (1000ms).
}

// === LOGIQUE DE JEU (CLIC SUR LES CARTES) ===

// Fonction déclenchée lorsqu'une carte est cliquée par le joueur.
function onCardClick(e) {
    const card = e.target.parentElement; // Cibler l'élément parent de l'image (la carte elle-même).
    card.classList.add('flip'); // Ajout de la classe "flip" pour retourner la carte visuellement.
    selectedCard.push(card); // Ajout de la carte sélectionnée dans le tableau des cartes sélectionnées.

    // Si deux cartes sont sélectionnées, on va les comparer.
    if (selectedCard.length === 2) {
        setTimeout(() => { // On attend 1 seconde pour permettre au joueur de voir les cartes retournées.
            // Si les deux cartes ont la même valeur (image), on les considère comme une paire.
            if (selectedCard[0].dataset.value === selectedCard[1].dataset.value) {
                // On marque ces cartes comme "trouvées" en leur ajoutant une classe "matched".
                selectedCard[0].classList.add("matched");
                selectedCard[1].classList.add("matched");
                selectedCard[0].removeEventListener('click', onCardClick); // On désactive le clic sur ces cartes.
                selectedCard[1].removeEventListener('click', onCardClick);

                // Vérification s'il reste encore des cartes non appariées.
                const cardsNotMatched = document.querySelectorAll('.card:not(.matched)');
                if (cardsNotMatched.length === 0) {
                    clearInterval(timerId); // Arrêt du timer si toutes les paires sont trouvées.
                    setTimeout(() => alert('Bravo ! Vous avez trouvé toutes les paires !'), 500); // Félicitation à l'utilisateur.
                }
            } else {
                // Si les cartes ne correspondent pas, on les retourne à nouveau.
                selectedCard[0].classList.remove('flip');
                selectedCard[1].classList.remove('flip');
            }
            selectedCard = []; // Réinitialisation du tableau des cartes sélectionnées pour le prochain tour.
        }, 1000); // Délai d'attente avant de retourner les cartes si elles ne correspondent pas.
    }
}

// === INITIALISATION DU JEU ===

// Dupliquer le tableau de cartes pour avoir des paires et mélanger les cartes.
let allCards = shuffleArray(duplicatedArray(cards));

// Ajouter chaque carte mélangée au plateau de jeu.
allCards.forEach(card => {
    const newCard = createCard(card); // Créer la carte DOM.
    gameBoard.appendChild(newCard);   // Ajouter la carte au DOM.
});

// Démarrage du jeu lorsque l'utilisateur clique sur le bouton "Start Game".
startButton.addEventListener('click', () => {
    if (!timeStarted) { // Vérifie si le timer n'a pas encore commencé.
        timer(); // Démarre le timer.
        endTimeStamp = Math.floor(Date.now() / 1000) + 60; // Définir la fin du jeu dans 60 secondes à partir du moment actuel.
        timeStarted = true; // Empêche le timer de se relancer à chaque clic.
    }
});
