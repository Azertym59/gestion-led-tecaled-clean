import React from 'react'

export const DeformationPreview = ({ largeur, hauteur, ratioCalcule }) => {
  // Ratios standards pour comparaison
  const ratiosStandards = [
    { nom: '16:9', valeur: 16/9 },
    { nom: '4:3', valeur: 4/3 },
    { nom: '21:9', valeur: 21/9 }
  ]
  
  // Trouver le ratio standard le plus proche
  let plusProche = ratiosStandards[0]
  let ecartMin = Math.abs(ratioCalcule - ratiosStandards[0].valeur)
  
  ratiosStandards.forEach(ratio => {
    const ecart = Math.abs(ratioCalcule - ratio.valeur)
    if (ecart < ecartMin) {
      ecartMin = ecart
      plusProche = ratio
    }
  })
  
  // Dimensions pour l'aperçu (normalisées sur une largeur de base)
  const baseWidth = 200
  const actualHeight = baseWidth / ratioCalcule
  const idealHeight = baseWidth / plusProche.valeur
  
  // Calculer la déformation en pourcentage
  const pourcentageEcart = ((ecartMin / plusProche.valeur) * 100).toFixed(1)
  const isStretched = ratioCalcule > plusProche.valeur // Plus large = étiré horizontalement
  
  // Image de test avec grille pour visualiser la déformation
  const GridPattern = ({ width, height, color, opacity = 1 }) => (
    <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, opacity }}>
      <defs>
        <pattern id={`grid-${color}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke={color} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#grid-${color})`} />
      {/* Cercle au centre pour montrer la déformation */}
      <circle 
        cx={width/2} 
        cy={height/2} 
        r={Math.min(width, height) * 0.3} 
        fill="none" 
        stroke={color} 
        strokeWidth="2"
      />
      {/* Lignes diagonales */}
      <line x1="0" y1="0" x2={width} y2={height} stroke={color} strokeWidth="1" />
      <line x1={width} y1="0" x2="0" y2={height} stroke={color} strokeWidth="1" />
    </svg>
  )
  
  // Contenu d'exemple avec visage et texte
  const SampleContent = ({ width, height }) => (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width, 
        height, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '12px',
        color: '#374151'
      }}
    >
      {/* Simulation d'un visage */}
      <div style={{ position: 'relative', marginBottom: '8px' }}>
        {/* Tête (cercle) */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid #6B7280',
          position: 'relative',
          backgroundColor: 'white'
        }}>
          {/* Yeux */}
          <div style={{ position: 'absolute', top: '12px', left: '10px', width: '4px', height: '4px', backgroundColor: '#374151', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', top: '12px', right: '10px', width: '4px', height: '4px', backgroundColor: '#374151', borderRadius: '50%' }}></div>
          {/* Bouche */}
          <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '8px', borderBottom: '2px solid #374151', borderRadius: '0 0 8px 8px' }}></div>
        </div>
      </div>
      {/* Texte */}
      <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>TECALED</div>
        <div style={{ fontSize: '10px', marginTop: '2px' }}>Écran LED</div>
      </div>
      {/* Barre horizontale pour tester l'étirement */}
      <div style={{ 
        width: '80%', 
        height: '4px', 
        backgroundColor: '#6B7280', 
        marginTop: '8px',
        borderRadius: '2px'
      }}></div>
    </div>
  )
  
  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🖼️</span>
        Aperçu de la déformation
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Écran avec ratio actuel */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Votre écran ({largeur}m × {hauteur}m)
          </p>
          <div className="relative bg-white rounded-lg shadow-md overflow-hidden" style={{ width: baseWidth, height: actualHeight }}>
            <GridPattern width={baseWidth} height={actualHeight} color="#EF4444" />
            <SampleContent width={baseWidth} height={actualHeight} />
            <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Ratio: {ratioCalcule.toFixed(3)}:1
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {isStretched ? '↔️ Image étirée horizontalement' : '↕️ Image étirée verticalement'}
          </p>
        </div>
        
        {/* Écran avec ratio idéal */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Ratio {plusProche.nom} idéal
          </p>
          <div className="relative bg-white rounded-lg shadow-md overflow-hidden" style={{ width: baseWidth, height: idealHeight }}>
            <GridPattern width={baseWidth} height={idealHeight} color="#10B981" />
            <SampleContent width={baseWidth} height={idealHeight} />
            <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Ratio: {plusProche.nom}
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            ✅ Proportions correctes
          </p>
        </div>
      </div>
      
      {/* Superposition pour comparaison */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Comparaison superposée
        </p>
        <div className="relative bg-gray-100 rounded-lg shadow-md" style={{ width: baseWidth, height: Math.max(actualHeight, idealHeight) }}>
          {/* Ratio idéal en vert semi-transparent */}
          <div className="absolute top-0 left-0" style={{ width: baseWidth, height: idealHeight }}>
            <GridPattern width={baseWidth} height={idealHeight} color="#10B981" opacity={0.3} />
          </div>
          {/* Ratio actuel en rouge semi-transparent */}
          <div className="absolute top-0 left-0" style={{ width: baseWidth, height: actualHeight }}>
            <GridPattern width={baseWidth} height={actualHeight} color="#EF4444" opacity={0.3} />
          </div>
          <div className="absolute bottom-2 left-2 flex items-center space-x-4 text-xs">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-500 opacity-30 rounded mr-1"></span>
              {plusProche.nom}
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-red-500 opacity-30 rounded mr-1"></span>
              Votre ratio
            </span>
          </div>
        </div>
      </div>
      
      {/* Explication visuelle */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Explication :</strong> {
            pourcentageEcart < 2 
              ? "La déformation est négligeable. Votre contenu s'affichera parfaitement."
              : pourcentageEcart < 5
              ? "Légère déformation visible sur les cercles qui apparaîtront légèrement ovales."
              : pourcentageEcart < 10
              ? "Déformation notable. Les visages et logos circulaires seront visiblement déformés."
              : "Forte déformation. Le contenu sera significativement étiré ou compressé."
          }
        </p>
      </div>
    </div>
  )
}

export default DeformationPreview