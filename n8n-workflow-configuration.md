# Configuration n8n pour Tecaled Configurator

## 1. Structure du Workflow n8n

### Étape 1 : Webhook (Trigger)
- **Node Type**: Webhook
- **HTTP Method**: POST
- **Path**: `/calculer-specifications`
- **Response Mode**: Last Node
- **Response Data**: JSON

### Étape 2 : Parser les données
- **Node Type**: Function
- **Code**:
```javascript
// Extraire les données du webhook
const data = $input.first().json;

// Données d'entrée
const client = data.client;
const ecran = data.ecran;
const technique = data.technique;
const projet = data.projet;

// Préparer les variables pour les calculs
let largeur = 0;
let hauteur = 0;
let surface = 0;

// Déterminer les dimensions selon le mode
if (ecran.modeCalcul === 'dimensions') {
  largeur = ecran.largeur || 0;
  hauteur = ecran.hauteur || 0;
  surface = largeur * hauteur;
} else if (ecran.modeCalcul === 'surface') {
  surface = ecran.surface || 0;
  const ratio = ecran.ratio === '16:9' ? 16/9 : 
                ecran.ratio === '4:3' ? 4/3 : 
                ecran.ratio === '21:9' ? 21/9 : 16/9;
  
  // Calcul des dimensions à partir de la surface et du ratio
  hauteur = Math.sqrt(surface / ratio);
  largeur = hauteur * ratio;
  
  // Arrondir selon la précision demandée
  if (ecran.dimensionsPratiques === '50cm') {
    largeur = Math.round(largeur * 2) / 2;
    hauteur = Math.round(hauteur * 2) / 2;
  } else if (ecran.dimensionsPratiques === '25cm') {
    largeur = Math.round(largeur * 4) / 4;
    hauteur = Math.round(hauteur * 4) / 4;
  } else if (ecran.dimensionsPratiques === '10cm') {
    largeur = Math.round(largeur * 10) / 10;
    hauteur = Math.round(hauteur * 10) / 10;
  }
}

return {
  json: {
    dimensionsCalculees: {
      largeur,
      hauteur,
      surface
    },
    ...data
  }
};
```

### Étape 3 : Déterminer le format de dalle
- **Node Type**: Function
- **Code**:
```javascript
const data = $input.first().json;
const technique = data.technique;
const dimensions = data.dimensionsCalculees;

// Formats disponibles
const formats = {
  fixe: [
    { nom: '500x250mm', largeur: 0.5, hauteur: 0.25 },
    { nom: '750x250mm', largeur: 0.75, hauteur: 0.25 },
    { nom: '1000x250mm', largeur: 1, hauteur: 0.25 },
    { nom: '1250x250mm', largeur: 1.25, hauteur: 0.25 }
  ],
  mobile: [
    { nom: '500x500mm', largeur: 0.5, hauteur: 0.5 },
    { nom: '500x1000mm', largeur: 0.5, hauteur: 1 }
  ],
  broadcast: [
    { nom: '600x337.5mm', largeur: 0.6, hauteur: 0.3375 }
  ]
};

let formatChoisi;

// Si format manuel sélectionné
if (technique.formatDalleSelection !== 'auto') {
  const allFormats = [...formats.fixe, ...formats.mobile, ...formats.broadcast];
  formatChoisi = allFormats.find(f => f.nom === technique.formatDalleSelection);
}

// Si pitch broadcast (0.9, 1.2, 1.56)
if (!formatChoisi && ['0.9', '1.2', '1.56'].includes(String(technique.pitchManuel))) {
  formatChoisi = formats.broadcast[0];
}

// Sinon, choisir automatiquement
if (!formatChoisi) {
  const typeFormats = formats[technique.typeInstallation] || formats.mobile;
  
  // Pour mobile, par défaut 500x500
  if (technique.typeInstallation === 'mobile') {
    formatChoisi = typeFormats[0]; // 500x500
  } else {
    // Pour fixe, optimiser
    let meilleurFormat = typeFormats[0];
    let meilleurScore = Infinity;
    
    typeFormats.forEach(format => {
      const nbDallesL = Math.ceil(dimensions.largeur / format.largeur);
      const nbDallesH = Math.ceil(dimensions.hauteur / format.hauteur);
      const surfaceReelle = nbDallesL * format.largeur * nbDallesH * format.hauteur;
      const gaspillage = surfaceReelle - dimensions.surface;
      const nbTotal = nbDallesL * nbDallesH;
      const score = gaspillage + (nbTotal * 0.01);
      
      if (score < meilleurScore) {
        meilleurScore = score;
        meilleurFormat = format;
      }
    });
    
    formatChoisi = meilleurFormat;
  }
}

return {
  json: {
    ...data,
    formatDalle: formatChoisi
  }
};
```

### Étape 4 : Calculer les dalles
- **Node Type**: Function  
- **Code**:
```javascript
const data = $input.first().json;
const dimensions = data.dimensionsCalculees;
const format = data.formatDalle;
const technique = data.technique;

// Calcul du nombre de dalles
const dallesLargeur = Math.ceil(dimensions.largeur / format.largeur);
const dallesHauteur = Math.ceil(dimensions.hauteur / format.hauteur);
const nombreDalles = dallesLargeur * dallesHauteur;

// Surface réelle de l'écran
const surfaceReelle = dallesLargeur * format.largeur * dallesHauteur * format.hauteur;

// Dimensions réelles
const largeurReelle = dallesLargeur * format.largeur;
const hauteurReelle = dallesHauteur * format.hauteur;

// Solutions alternatives pour mobile
let solutions = [];
if (technique.typeInstallation === 'mobile') {
  // Solution 1: 500x500 uniquement
  const sol500 = {
    nom: 'Dalles 500x500mm uniquement',
    dallesLargeur: Math.ceil(dimensions.largeur / 0.5),
    dallesHauteur: Math.ceil(dimensions.hauteur / 0.5),
    format: '500x500mm'
  };
  sol500.nombreDalles = sol500.dallesLargeur * sol500.dallesHauteur;
  sol500.surfaceReelle = sol500.dallesLargeur * 0.5 * sol500.dallesHauteur * 0.5;
  solutions.push(sol500);
  
  // Solution 2: 500x1000 uniquement (si possible)
  const sol1000H = Math.ceil(dimensions.hauteur / 1);
  if (sol1000H * 1 <= dimensions.hauteur + 0.5) {
    const sol1000 = {
      nom: 'Dalles 500x1000mm uniquement',
      dallesLargeur: Math.ceil(dimensions.largeur / 0.5),
      dallesHauteur: sol1000H,
      format: '500x1000mm'
    };
    sol1000.nombreDalles = sol1000.dallesLargeur * sol1000.dallesHauteur;
    sol1000.surfaceReelle = sol1000.dallesLargeur * 0.5 * sol1000.dallesHauteur * 1;
    solutions.push(sol1000);
  }
  
  // Solution 3: Mixte
  const lignes1000 = Math.floor(dimensions.hauteur / 1);
  const resteHauteur = dimensions.hauteur - (lignes1000 * 1);
  const lignes500 = Math.ceil(resteHauteur / 0.5);
  
  if (lignes1000 > 0) {
    const solMixte = {
      nom: 'Solution mixte optimisée',
      configuration: [],
      nombreDalles: 0
    };
    
    const dallesL = Math.ceil(dimensions.largeur / 0.5);
    
    if (lignes1000 > 0) {
      const nb1000 = dallesL * lignes1000;
      solMixte.configuration.push({
        type: '500x1000mm',
        quantite: nb1000,
        disposition: `${dallesL} x ${lignes1000}`
      });
      solMixte.nombreDalles += nb1000;
    }
    
    if (lignes500 > 0) {
      const nb500 = dallesL * lignes500;
      solMixte.configuration.push({
        type: '500x500mm',
        quantite: nb500,
        disposition: `${dallesL} x ${lignes500}`
      });
      solMixte.nombreDalles += nb500;
    }
    
    solMixte.hauteurReelle = lignes1000 * 1 + lignes500 * 0.5;
    solMixte.largeurReelle = dallesL * 0.5;
    solMixte.surfaceReelle = solMixte.largeurReelle * solMixte.hauteurReelle;
    
    solutions.push(solMixte);
  }
}

return {
  json: {
    ...data,
    dalles: {
      dallesLargeur,
      dallesHauteur,
      nombreDalles,
      surfaceReelle,
      largeurReelle,
      hauteurReelle,
      solutions
    }
  }
};
```

### Étape 5 : Calculer les pixels
- **Node Type**: Function
- **Code**:
```javascript
const data = $input.first().json;
const technique = data.technique;
const format = data.formatDalle;
const dalles = data.dalles;

// Déterminer le pitch
let pitch = technique.pitchMode === 'manuel' 
  ? technique.pitchManuel 
  : technique.distanceVision || 6;

// Calcul des pixels par dalle
const largeurDalleMm = format.largeur * 1000;
const hauteurDalleMm = format.hauteur * 1000;

const pixelsLargeur = Math.floor(largeurDalleMm / pitch);
const pixelsHauteur = Math.floor(hauteurDalleMm / pitch);
const pixelsParDalle = pixelsLargeur * pixelsHauteur;

// Total pixels
const totalPixels = dalles.nombreDalles * pixelsParDalle;

// Calcul pour chaque solution alternative
if (dalles.solutions) {
  dalles.solutions.forEach(sol => {
    if (sol.format === '500x500mm') {
      const pxCote = Math.floor(500 / pitch);
      sol.pixelsParDalle = pxCote * pxCote;
      sol.totalPixels = sol.nombreDalles * sol.pixelsParDalle;
    } else if (sol.format === '500x1000mm') {
      const pxL = Math.floor(500 / pitch);
      const pxH = Math.floor(1000 / pitch);
      sol.pixelsParDalle = pxL * pxH;
      sol.totalPixels = sol.nombreDalles * sol.pixelsParDalle;
    } else if (sol.nom === 'Solution mixte optimisée') {
      const px500 = Math.floor(500 / pitch) * Math.floor(500 / pitch);
      const px1000 = Math.floor(500 / pitch) * Math.floor(1000 / pitch);
      
      sol.totalPixels = 0;
      sol.configuration.forEach(conf => {
        if (conf.type === '500x500mm') {
          sol.totalPixels += conf.quantite * px500;
        } else if (conf.type === '500x1000mm') {
          sol.totalPixels += conf.quantite * px1000;
        }
      });
    }
  });
}

return {
  json: {
    ...data,
    pixels: {
      pitch,
      pixelsLargeur,
      pixelsHauteur,
      pixelsParDalle,
      totalPixels
    }
  }
};
```

### Étape 6 : Calculer les équipements
- **Node Type**: Function
- **Code**:
```javascript
const data = $input.first().json;
const dalles = data.dalles;
const technique = data.technique;
const pixels = data.pixels;

// Bumpers = nombre de dalles en largeur
const nombreBumpers = dalles.dallesLargeur;

// Flightcases
let nombreFlightcases = 0;
let typeConditionnement = '';

if (technique.typeInstallation === 'fixe') {
  typeConditionnement = 'Caisses bois sur mesure';
} else {
  const dallesParFlight = parseInt(technique.typeConditionnement) || 6;
  nombreFlightcases = Math.ceil(dalles.nombreDalles / dallesParFlight);
  typeConditionnement = `Flightcases (${dallesParFlight} dalles/flight)`;
}

// Processeurs disponibles
const processeurs = [
  { serie: 'VX', modele: '400', type: 'Avec scaler', pixelsMax: 2600000, ports: 4, pixelsParPort: 650000 },
  { serie: 'VX', modele: '600', type: 'Avec scaler', pixelsMax: 3900000, ports: 6, pixelsParPort: 650000 },
  { serie: 'VX', modele: '1000', type: 'Avec scaler', pixelsMax: 6500000, ports: 10, pixelsParPort: 650000 },
  { serie: 'VX', modele: '2S', type: 'Avec scaler', pixelsMax: 3900000, ports: 8, pixelsParPort: 487500 },
  { serie: 'VX', modele: '4S', type: 'Avec scaler', pixelsMax: 6500000, ports: 12, pixelsParPort: 541667 },
  { serie: 'VX', modele: '6S', type: 'Avec scaler', pixelsMax: 10400000, ports: 16, pixelsParPort: 650000 },
  { serie: 'MX', modele: '40', type: 'Avec scaler', pixelsMax: 2600000, ports: 4, pixelsParPort: 650000 },
  { serie: 'MX', modele: '50', type: 'Avec scaler', pixelsMax: 4200000, ports: 4, pixelsParPort: 1050000 },
  { serie: 'UHD', modele: 'JR', type: 'Sans scaler', pixelsMax: 8900000, ports: 8, pixelsParPort: 1112500 },
  { serie: 'MCTRL', modele: '300', type: 'Sans scaler', pixelsMax: 1300000, ports: 1, pixelsParPort: 1300000 },
  { serie: 'MCTRL', modele: '600', type: 'Sans scaler', pixelsMax: 1920000, ports: 2, pixelsParPort: 960000 },
  { serie: 'MCTRL', modele: '660', type: 'Sans scaler', pixelsMax: 2300000, ports: 4, pixelsParPort: 575000 },
  { serie: 'MCTRL', modele: '660 PRO', type: 'Sans scaler', pixelsMax: 2650000, ports: 4, pixelsParPort: 662500 },
  { serie: 'K', modele: 'K2', type: 'Sans scaler', pixelsMax: 2300000, ports: 2, pixelsParPort: 1150000 },
  { serie: 'K', modele: 'K6', type: 'Sans scaler', pixelsMax: 5200000, ports: 6, pixelsParPort: 866667 }
];

// Filtrer selon le besoin de scaler
let processeursDisponibles = processeurs;
if (technique.besoinScaler === 'oui') {
  processeursDisponibles = processeurs.filter(p => p.type === 'Avec scaler');
} else if (technique.besoinScaler === 'non') {
  processeursDisponibles = processeurs.filter(p => p.type === 'Sans scaler');
}

// Trouver le processeur optimal
const facteurRedondance = technique.redondance ? 2 : 1;
let processeurRecommande = null;

for (const proc of processeursDisponibles.sort((a, b) => a.pixelsMax - b.pixelsMax)) {
  const portsNecessaires = Math.ceil(pixels.totalPixels / proc.pixelsParPort) * facteurRedondance;
  if (portsNecessaires <= proc.ports) {
    processeurRecommande = {
      ...proc,
      portsNecessaires
    };
    break;
  }
}

return {
  json: {
    ...data,
    equipements: {
      nombreBumpers,
      nombreFlightcases,
      typeConditionnement,
      processeurRecommande
    }
  }
};
```

### Étape 7 : Formater la réponse finale
- **Node Type**: Function
- **Code**:
```javascript
const data = $input.first().json;

// Construire la réponse structurée
const reponse = {
  success: true,
  calculs: {
    dimensions: {
      largeur: data.dimensionsCalculees.largeur,
      hauteur: data.dimensionsCalculees.hauteur,
      surface: data.dimensionsCalculees.surface,
      largeurReelle: data.dalles.largeurReelle,
      hauteurReelle: data.dalles.hauteurReelle,
      surfaceReelle: data.dalles.surfaceReelle
    },
    dalles: {
      format: data.formatDalle,
      nombre: data.dalles.nombreDalles,
      disposition: `${data.dalles.dallesLargeur} × ${data.dalles.dallesHauteur}`,
      solutions: data.dalles.solutions
    },
    pixels: {
      pitch: data.pixels.pitch,
      parDalle: data.pixels.pixelsParDalle,
      total: data.pixels.totalPixels
    },
    equipements: {
      bumpers: data.equipements.nombreBumpers,
      flightcases: data.equipements.nombreFlightcases,
      conditionnement: data.equipements.typeConditionnement,
      processeur: data.equipements.processeurRecommande
    }
  },
  donneesBrutes: data
};

return {
  json: reponse
};
```

## 2. Configuration dans n8n

1. **Créer un nouveau workflow**
2. **Ajouter les nodes dans l'ordre ci-dessus**
3. **Connecter chaque node au suivant**
4. **Activer le workflow**
5. **Copier l'URL du webhook** (Production ou Test)

## 3. Variables d'environnement Next.js

Dans votre fichier `.env.local`:
```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxx-xxx-xxx
```

## 4. Structure de la réponse n8n

```json
{
  "success": true,
  "calculs": {
    "dimensions": {
      "largeur": 4.5,
      "hauteur": 2.5,
      "surface": 11.25,
      "largeurReelle": 4.5,
      "hauteurReelle": 2.5,
      "surfaceReelle": 11.25
    },
    "dalles": {
      "format": {
        "nom": "500x500mm",
        "largeur": 0.5,
        "hauteur": 0.5
      },
      "nombre": 45,
      "disposition": "9 × 5",
      "solutions": [...]
    },
    "pixels": {
      "pitch": 3.9,
      "parDalle": 16384,
      "total": 737280
    },
    "equipements": {
      "bumpers": 9,
      "flightcases": 8,
      "conditionnement": "Flightcases (6 dalles/flight)",
      "processeur": {
        "serie": "VX",
        "modele": "400",
        "portsNecessaires": 4
      }
    }
  }
}
```