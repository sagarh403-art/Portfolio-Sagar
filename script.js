/* Lando Norris Color Palette */
:root {
    --lando-yellow: #D2FF00; /* The signature neon yellow */
    --lando-black: #111112;
}

.button-container {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
}

/* 1. The Button Shell */
.lando-btn {
    position: relative;
    display: inline-block;
    padding: 1.5rem 3rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 100px; /* Fully rounded capsule */
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.2rem;
    overflow: hidden; /* Traps the fill animation inside */
    transition: transform 0.1s linear; /* Smooth movement */
    z-index: 10;
    cursor: pointer;
}

/* 2. The Text (Ensures it stays on top of the color) */
.btn-text {
    position: relative;
    z-index: 2; /* Puts text above the yellow fill */
    transition: color 0.3s ease;
}

/* 3. The "Swipe" Fill Effect */
.btn-fill {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--lando-yellow);
    z-index: 1; /* Behind the text */
    
    /* Start position: Hidden below the button */
    transform: translateY(100%); 
    transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1); /* "Expo" ease for snap */
    border-radius: 50%; /* Makes the fill look like a liquid bubble rising */
}

/* 4. Hover State Actions */
.lando-btn:hover .btn-fill {
    transform: translateY(0); /* Slides up to fill the button */
    border-radius: 0; /* Squares out to fill corners */
}

.lando-btn:hover .btn-text {
    color: var(--lando-black); /* Text turns black for contrast */
}

.lando-btn:hover {
    border-color: var(--lando-yellow);
}
