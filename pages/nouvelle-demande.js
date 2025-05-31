import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function NouvelleDemande() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  // États pour l'autocomplétion d'adresse
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [addressSearch, setAddressSearch] = useState('')

  // Données processeurs Novastar complètes (depuis CSV)
  const processeurs = [
    { serie: 'MCTRL', modele: 'MCTRL4K', pixelsMax: 8800000, ports: 16, capacitePort: 550000, type: 'Contrôleur LED' },
    { serie: 'MCTRL', modele: 'MCTRL700', pixelsMax: 2300000, ports: 6, capacitePort: 383333, type: 'Contrôleur LED' },
    { serie: 'MCTRL', modele: 'MCTRL660', pixelsMax: 1920000, ports: 4, capacitePort: 480000, type: 'Contrôleur LED' },
    { serie: 'MSD', modele: 'MSD300', pixelsMax: 1300000, ports: 2, capacitePort: 650000, type: 'Carte d\'envoi' },
    { serie: 'MSD', modele: 'MSD600', pixelsMax: 2300000, ports: 4, capacitePort: 575000, type: 'Carte d\'envoi' },
    { serie: 'MX', modele: 'MX20', pixelsMax: 659722, ports: 20, capacitePort: 659722, type: 'Contrôleur LED' },
    { serie: 'MX', modele: 'MX40 Pro', pixelsMax: 9000000, ports: 20, capacitePort: 659722, type: 'Contrôleur LED' },
    { serie: 'MX', modele: 'MX6000 Pro', pixelsMax: 141000000, ports: 32, capacitePort: 659722, type: 'Contrôleur LED' },
    { serie: 'VX', modele: 'VX400', pixelsMax: 2600000, ports: 4, capacitePort: 650000, type: 'Processeur tout-en-un' },
    { serie: 'VX', modele: 'VX600', pixelsMax: 3900000, ports: 6, capacitePort: 650000, type: 'Processeur tout-en-un' },
    { serie: 'VX', modele: 'VX1000', pixelsMax: 6500000, ports: 10, capacitePort: 650000, type: 'Processeur tout-en-un' },
    { serie: 'VX', modele: 'VX4S-N', pixelsMax: 2300000, ports: 4, capacitePort: 575000, type: 'Processeur tout-en-un' },
    { serie: 'H Series', modele: 'H_20xRJ45', pixelsMax: 13000000, ports: 20, capacitePort: 650000, type: 'Carte d\'envoi 4K' },
    { serie: 'H Series', modele: 'H_16xRJ45+2xFiber', pixelsMax: 10400000, ports: 16, capacitePort: 650000, type: 'Carte d\'envoi 4K' }
  ]

  // État du formulaire complet
  const [formData, setFormData] = useState({
    // Étape 1 - Coordonnées client
    nomClient: '',
    prenomClient: '',
    entrepriseClient: '',
    emailClient: '',
    telephoneClient: '',
    rechercheAdresse: '',
    numeroRue: '',
    nomRue: '',
    codePostal: '',
    ville: '',
    adresseComplete: '',
    dateEcheance: '',
    budget: '',
    
    // Étape 2 - Spécifications techniques
    modeCalcul: 'dimensions', // 'dimensions' ou 'surface'
    largeur: '',
    hauteur: '',
    surface: '',
    ratio: '16:9',
    distanceVision: '',
    pitchCalcule: '',
    pitchManuel: '',
    pitchMode: 'auto', // 'auto' ou 'manuel'
    typeMedia: '',
    typeEcran: 'standard',
    redondance: false,
    delaisSouhaite: '',
    besoinScaler: '', // 'oui' ou 'non' - NOUVEAU
    
    // Calculs automatiques
    surfaceCalculee: 0,
    ratioCalcule: 0, // NOUVEAU - ratio calculé en mode dimensions
    dimensionsOptimales: { largeur: 0, hauteur: 0 }, // NOUVEAU - dimensions optimales en mode surface
    nombreDalles: 0,
    dallesLargeur: 0,
    dallesHauteur: 0,
    pixelsParDalle: 0,
    totalPixels: 0,
    nombreBumpers: 0,
    nombreFlightcases: 0,
    processeurRecommande: null,
    portsNecessaires: 0,
    processeursFiltres: [], // NOUVEAU - processeurs filtrés selon scaler
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    calculerSpecifications()
  }, [formData.largeur, formData.hauteur, formData.surface, formData.ratio, formData.modeCalcul, formData.distanceVision, formData.pitchCalcule, formData.pitchManuel, formData.pitchMode, formData.redondance, formData.besoinScaler])

  const checkAuth = async () => {
    console.log('🔍 Vérification auth...')
    
    // Vérifier localStorage directement
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    console.log('Token:', token)
    console.log('UserData:', userData)
    
    if (!token || !userData) {
      console.log('❌ Pas de données localStorage - Redirection login')
      router.push('/login')
      return
    }
    
    try {
      const user = JSON.parse(userData)
      console.log('👤 User parsé:', user)
      
      if (user.role !== 'commercial' && user.role !== 'admin') {
        console.log('❌ Rôle non autorisé:', user.role)
        router.push('/dashboard')
        return
      }
      
      console.log('✅ Auth réussie - Garder design actuel')
      setUser(user)
      setLoading(false)
      
    } catch (error) {
      console.error('❌ Erreur parsing user:', error)
      router.push('/login')
    }
  }

  // Filtrer les processeurs selon le besoin de scaler
  const filtrerProcesseurs = (besoinScaler) => {
    if (besoinScaler === 'oui') {
      // Avec scaler : VX, MX, H Series
      return processeurs.filter(p => ['VX', 'MX', 'H Series'].includes(p.serie))
    } else if (besoinScaler === 'non') {
      // Sans scaler : MSD, MCTRL
      return processeurs.filter(p => ['MSD', 'MCTRL'].includes(p.serie))
    }
    return processeurs // Tous si pas encore sélectionné
  }

  // Calculs automatiques améliorés
  const calculerSpecifications = () => {
    let largeurFinal = parseFloat(formData.largeur) || 0
    let hauteurFinal = parseFloat(formData.hauteur) || 0
    let ratioCalcule = 0
    let dimensionsOptimales = { largeur: 0, hauteur: 0 }
    
    // Mode surface + ratio : calculer les dimensions optimales
    if (formData.modeCalcul === 'surface' && formData.surface) {
      const surface = parseFloat(formData.surface)
      const ratioValue = getRatioValue(formData.ratio)
      
      // Calcul mathématique exact selon le ratio
      hauteurFinal = Math.sqrt(surface / ratioValue)
      largeurFinal = hauteurFinal * ratioValue
      
      // Dimensions optimales arrondies pour respect du ratio
      dimensionsOptimales = {
        largeur: Math.round(largeurFinal * 2) / 2, // Arrondi au 0.5m
        hauteur: Math.round(hauteurFinal * 2) / 2
      }
    }
    
    // Mode dimensions : calculer le ratio correspondant
    if (formData.modeCalcul === 'dimensions' && largeurFinal && hauteurFinal) {
      ratioCalcule = largeurFinal / hauteurFinal
      dimensionsOptimales = { largeur: largeurFinal, hauteur: hauteurFinal }
    }
    
    if (!largeurFinal || !hauteurFinal) {
      setFormData(prev => ({
        ...prev,
        ratioCalcule,
        dimensionsOptimales,
        processeursFiltres: filtrerProcesseurs(formData.besoinScaler)
      }))
      return
    }

    const surfaceCalculee = largeurFinal * hauteurFinal
    
    // Calcul pitch optimal
    const distance = parseFloat(formData.distanceVision) || 0
    const pitchOptimal = distance > 0 ? distance : 6 // Par défaut P6
    const pitchFinal = formData.pitchMode === 'manuel' ? parseFloat(formData.pitchManuel) || pitchOptimal : pitchOptimal
    
    // Calcul dalles (500mm par défaut)
    const tailleDalle = 0.5 // 500mm
    const dallesLargeur = Math.ceil(largeurFinal / tailleDalle)
    const dallesHauteur = Math.ceil(hauteurFinal / tailleDalle)
    const nombreDalles = dallesLargeur * dallesHauteur
    
    // Calcul pixels
    const pixelsParDalle = Math.pow(Math.round(500 / pitchFinal), 2) // (500/pitch)²
    const totalPixels = nombreDalles * pixelsParDalle
    
    // Calcul équipements
    const nombreBumpers = dallesLargeur // Nombre de dalles en largeur
    const nombreFlightcases = Math.ceil(nombreDalles / 6) // 6 dalles par flightcase
    
    // Filtrer les processeurs selon scaler
    const processeursFiltres = filtrerProcesseurs(formData.besoinScaler)
    
    // Processeur recommandé parmi les processeurs filtrés
    const processeurRecommande = trouverProcesseurOptimal(totalPixels, formData.redondance, processeursFiltres)
    const portsNecessaires = calculerPortsNecessaires(totalPixels, processeurRecommande, formData.redondance)
    
    setFormData(prev => ({
      ...prev,
      surfaceCalculee,
      ratioCalcule,
      dimensionsOptimales,
      nombreDalles,
      dallesLargeur,
      dallesHauteur,
      pixelsParDalle,
      totalPixels,
      nombreBumpers,
      nombreFlightcases,
      processeurRecommande,
      portsNecessaires,
      pitchCalcule: pitchOptimal,
      processeursFiltres,
    }))
  }

  const getRatioValue = (ratio) => {
    switch(ratio) {
      case '16:9': return 16/9
      case '4:3': return 4/3
      case '21:9': return 21/9
      default: return 16/9
    }
  }

  const getRatioName = (ratioValue) => {
    if (Math.abs(ratioValue - 16/9) < 0.1) return '16:9'
    if (Math.abs(ratioValue - 4/3) < 0.1) return '4:3'
    if (Math.abs(ratioValue - 21/9) < 0.1) return '21:9'
    return `${ratioValue.toFixed(2)}:1`
  }

  const trouverProcesseurOptimal = (totalPixels, redondance, processeursFiltres) => {
    if (processeursFiltres.length === 0) return null
    
    // Facteur de redondance
    const facteur = redondance ? 2 : 1
    const pixelsNecessaires = totalPixels * facteur
    
    // Trouver le processeur le plus adapté parmi les filtrés
    const processeurAdapte = processeursFiltres
      .filter(p => p.pixelsMax >= pixelsNecessaires)
      .sort((a, b) => a.pixelsMax - b.pixelsMax)[0]
    
    return processeurAdapte || processeursFiltres.sort((a, b) => b.pixelsMax - a.pixelsMax)[0] // Plus puissant si aucun ne suffit
  }

  const calculerPortsNecessaires = (totalPixels, processeur, redondance) => {
    if (!processeur) return 0
    
    const facteur = redondance ? 2 : 1
    const pixelsNecessaires = totalPixels * facteur
    
    return Math.ceil(pixelsNecessaires / processeur.capacitePort)
  }

  // Recherche d'adresse
  const searchAddress = async (query) => {
    if (query.length < 3) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`)
      const data = await response.json()
      setAddressSuggestions(data.features || [])
      setShowSuggestions(true)
    } catch (error) {
      console.error('Erreur recherche adresse:', error)
      setAddressSuggestions([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    if (name === 'rechercheAdresse') {
      setAddressSearch(value)
      searchAddress(value)
    }
  }

  const selectAddress = (address) => {
    const properties = address.properties
    setFormData(prev => ({
      ...prev,
      numeroRue: properties.housenumber || '',
      nomRue: properties.street || '',
      codePostal: properties.postcode || '',
      ville: properties.city || '',
      adresseComplete: properties.label || ''
    }))
    setAddressSearch(properties.label || '')
    setShowSuggestions(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (currentStep === 1) {
      setCurrentStep(2)
    } else {
      console.log('Données complètes:', formData)
      alert('Demande complète créée ! (Prochaine étape : Sauvegarde en base de données)')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-tech flex items-center justify-center">
        <div className="text-center">
          <img 
            src="https://www.tecaled.fr/Logos/Logo%20rectangle%20V2.png"
            alt="TecaLED Logo"
            className="h-20 w-auto object-contain mx-auto mb-6 animate-pulse drop-shadow-lg"
          />
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
  <div className="nouvelle-demande"> {/* ← AJOUTER */}
    <Head>
      <title>Nouvelle Demande - TecaLED Gestion</title>
    </Head>

      <div className="min-h-screen bg-tech">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Header */}
        <header className="header-tech relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => currentStep > 1 ? setCurrentStep(1) : router.push('/dashboard')}
                  className="text-white/70 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                >
                  <span className="text-xl group-hover:-translate-x-1 transition-transform duration-200">←</span>
                  <span className="font-medium">{currentStep > 1 ? 'Étape Précédente' : 'Retour Dashboard'}</span>
                </button>
                <div className="h-8 w-px bg-white/20"></div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <span className="text-4xl mr-3">📝</span>
                  Nouvelle Demande Client
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-sm text-white/70 capitalize font-medium">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <span className={`flex items-center px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 ${
                    currentStep >= 1 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                      : 'bg-white/10 text-white/60 backdrop-blur-sm'
                  }`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                      currentStep >= 1 ? 'bg-white/20' : 'bg-white/10'
                    }`}>1</span>
                    Coordonnées Client
                  </span>
                  <span className="text-white/40">→</span>
                  <span className={`flex items-center px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 ${
                    currentStep >= 2 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                      : 'bg-white/10 text-white/60 backdrop-blur-sm'
                  }`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                      currentStep >= 2 ? 'bg-white/20' : 'bg-white/10'
                    }`}>2</span>
                    Spécifications
                  </span>
                  <span className="text-white/40">→</span>
                  <span className="flex items-center px-6 py-3 bg-white/10 text-white/60 rounded-full font-semibold backdrop-blur-sm">
                    <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                    Validation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          
         {/* ÉTAPE 1 - Version Professionnelle */}
          {currentStep === 1 && (
            <div className="card-tech animate-slideInUp">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-xl">📞</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Informations Client</h2>
                  <p className="text-gray-600">Collecte des coordonnées et détails du projet</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                
                {/* SECTION - Nom du projet */}
                <div className="projet-preview-pro">
                  <h3>
                    <svg className="icon-projet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Nom du projet (généré automatiquement)
                  </h3>
                  {formData.entrepriseClient ? (
                    <p className="text-indigo-700 font-semibold bg-white/70 px-4 py-2 rounded-lg">
                      Aperçu : <span className="font-mono text-indigo-800">{formData.entrepriseClient.toUpperCase().replace(/\s+/g, '-')}-{new Date().toLocaleDateString('fr-FR')}-001</span>
                    </p>
                  ) : (
                    <p className="text-gray-600">Le nom sera créé automatiquement après saisie du nom de l'entreprise</p>
                  )}
                </div>

                {/* SECTION - Identité */}
                <div className="section-form">
                  <div className="section-title-pro">
                    <svg className="icon-pro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3>Identité du Client</h3>
                  </div>
                  <div className="section-fields-pro grid-2">
                    <div>
                      <label>Nom du client *</label>
                      <input type="text" name="nomClient" required value={formData.nomClient} onChange={handleInputChange} className="input-tech" placeholder="Dupont" />
                    </div>
                    <div>
                      <label>Prénom du client *</label>
                      <input type="text" name="prenomClient" required value={formData.prenomClient} onChange={handleInputChange} className="input-tech" placeholder="Jean" />
                    </div>
                  </div>
                  <div className="section-fields-pro" style={{marginTop: '1.25rem'}}>
                    <div>
                      <label>Entreprise *</label>
                      <input type="text" name="entrepriseClient" required value={formData.entrepriseClient} onChange={handleInputChange} className="input-tech" placeholder="SARL Dupont, SAS TechLED, etc." />
                    </div>
                  </div>
                </div>

                {/* SECTION - Contact */}
                <div className="section-form">
                  <div className="section-title-pro">
                    <svg className="icon-pro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3>Informations de Contact</h3>
                  </div>
                  <div className="section-fields-pro grid-2">
                    <div>
                      <label>Email *</label>
                      <input type="email" name="emailClient" required value={formData.emailClient} onChange={handleInputChange} className="input-tech" placeholder="client@exemple.fr" />
                    </div>
                    <div>
                      <label>Téléphone *</label>
                      <input type="tel" name="telephoneClient" required value={formData.telephoneClient} onChange={handleInputChange} className="input-tech" placeholder="06 12 34 56 78" />
                    </div>
                  </div>
                </div>

                {/* SECTION - Adresse */}
                <div className="section-form">
                  <div className="section-title-pro">
                    <svg className="icon-pro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3>Adresse Client</h3>
                  </div>
                  <div className="section-fields-pro">
                    <div className="relative">
                      <label>Recherche d'adresse *</label>
                      <input type="text" name="rechercheAdresse" required value={addressSearch} onChange={handleInputChange} className="input-tech" placeholder="Tapez votre adresse" />
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 adresse-suggestions backdrop-blur-sm rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {addressSuggestions.map((suggestion, index) => (
                            <button key={index} type="button" onClick={() => selectAddress(suggestion)} className="w-full px-4 py-3 text-left transition-colors duration-200">
                              <div className="font-medium text-gray-800 text-sm">{suggestion.properties.label}</div>
                              <div className="text-xs text-gray-600 mt-1">{suggestion.properties.context}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {formData.adresseComplete && (
                      <div className="adresse-complete">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label>Numéro</label>
                            <input type="text" value={formData.numeroRue} readOnly />
                          </div>
                          <div className="md:col-span-2">
                            <label>Rue</label>
                            <input type="text" value={formData.nomRue} readOnly />
                          </div>
                          <div>
                            <label>Code Postal</label>
                            <input type="text" value={formData.codePostal} readOnly />
                          </div>
                          <div className="md:col-span-3">
                            <label>Ville</label>
                            <input type="text" value={formData.ville} readOnly />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION - Projet */}
                <div className="section-form">
                  <div className="section-title-pro">
                    <svg className="icon-pro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3>Informations Projet</h3>
                  </div>
                  <div className="section-fields-pro grid-2">
                    <div>
                      <label>Date d'échéance souhaitée</label>
                      <input type="date" name="dateEcheance" value={formData.dateEcheance} onChange={handleInputChange} className="input-tech" />
                    </div>
                    <div>
                      <label>Budget approximatif (€)</label>
                      <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} className="input-tech" placeholder="50000" />
                    </div>
                  </div>
                </div>

                {/* Boutons de navigation */}
                <div className="flex justify-between navigation-buttons">
                  <button type="button" onClick={() => router.push('/dashboard')} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary px-8 py-2.5 flex items-center">
                    Continuer → Spécifications
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ÉTAPE 2 - Spécifications Techniques */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Formulaire spécifications */}
              <div className="card-tech animate-slideInUp">
                <div className="p-8">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                      <span className="text-white text-3xl">🧮</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">Spécifications Techniques</h2>
                      <p className="text-gray-600 text-lg">Configuration de l'écran LED avec calculs automatiques</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Mode de calcul taille - AMÉLIORÉ */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-200/50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">📐 Dimensions de l'écran</h3>
                      <div className="flex space-x-4 mb-6">
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="modeCalcul" value="dimensions" checked={formData.modeCalcul === 'dimensions'} onChange={handleInputChange} className="mr-3" />
                          <span className="font-semibold">Mode 1 : Largeur × Hauteur</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="modeCalcul" value="surface" checked={formData.modeCalcul === 'surface'} onChange={handleInputChange} className="mr-3" />
                          <span className="font-semibold">Mode 2 : Surface + Ratio</span>
                        </label>
                      </div>

                      {formData.modeCalcul === 'dimensions' ? (
                        <div>
                          <div className="grid grid-cols-2 gap-6">
                            <div><label className="block font-bold text-gray-700 mb-2">Largeur (m) *</label><input type="number" step="0.1" name="largeur" value={formData.largeur} onChange={handleInputChange} className="input-tech" placeholder="4.5" /></div>
                            <div><label className="block font-bold text-gray-700 mb-2">Hauteur (m) *</label><input type="number" step="0.1" name="hauteur" value={formData.hauteur} onChange={handleInputChange} className="input-tech" placeholder="2.5" /></div>
                          </div>
                          {/* NOUVEAU - Affichage du ratio calculé */}
                          {formData.ratioCalcule > 0 && (
                            <div className="mt-4 p-4 bg-white/60 rounded-lg">
                              <p className="font-bold text-gray-800">📏 Surface : {formData.surfaceCalculee.toFixed(2)}m² | Ratio : {getRatioName(formData.ratioCalcule)}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {Math.abs(formData.ratioCalcule - 16/9) < 0.1 ? '✅ Ratio 16:9 parfait' : 
                                 Math.abs(formData.ratioCalcule - 4/3) < 0.1 ? '✅ Ratio 4:3 parfait' :
                                 Math.abs(formData.ratioCalcule - 21/9) < 0.1 ? '✅ Ratio 21:9 parfait' : 
                                 `⚠️ Ratio personnalisé (${formData.ratioCalcule.toFixed(2)}:1)`}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="grid grid-cols-2 gap-6">
                            <div><label className="block font-bold text-gray-700 mb-2">Surface (m²) *</label><input type="number" step="0.1" name="surface" value={formData.surface} onChange={handleInputChange} className="input-tech" placeholder="11.25" /></div>
                            <div><label className="block font-bold text-gray-700 mb-2">Ratio</label><select name="ratio" value={formData.ratio} onChange={handleInputChange} className="input-tech"><option value="16:9">16:9 (Standard)</option><option value="4:3">4:3 (Classique)</option><option value="21:9">21:9 (Ultra-large)</option></select></div>
                          </div>
                          {/* NOUVEAU - Affichage des dimensions optimales */}
                          {formData.dimensionsOptimales.largeur > 0 && (
                            <div className="mt-4 p-4 bg-white/60 rounded-lg">
                              <p className="font-bold text-gray-800">📏 Dimensions optimales : {formData.dimensionsOptimales.largeur.toFixed(1)}m × {formData.dimensionsOptimales.hauteur.toFixed(1)}m</p>
                              <p className="text-sm text-gray-600 mt-1">✅ Respect parfait du ratio {formData.ratio} avec surface de {formData.surface}m²</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Distance et pitch */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Distance de vision (m) *</label>
                        <input type="number" step="0.5" name="distanceVision" value={formData.distanceVision} onChange={handleInputChange} className="input-tech text-lg" placeholder="6" />
                        <p className="text-sm text-gray-500 mt-2">Distance des premiers spectateurs</p>
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Pitch (mm)</label>
                        <div className="space-y-3">
                          <label className="flex items-center"><input type="radio" name="pitchMode" value="auto" checked={formData.pitchMode === 'auto'} onChange={handleInputChange} className="mr-2" /><span>Automatique (Distance = Pitch)</span></label>
                          <label className="flex items-center"><input type="radio" name="pitchMode" value="manuel" checked={formData.pitchMode === 'manuel'} onChange={handleInputChange} className="mr-2" /><span>Manuel</span></label>
                        </div>
                        {formData.pitchMode === 'manuel' ? (
                          <input type="number" step="0.1" name="pitchManuel" value={formData.pitchManuel} onChange={handleInputChange} className="input-tech mt-2" placeholder="6" />
                        ) : (
                          <div className="mt-2 p-3 bg-green-100 rounded-lg"><span className="font-bold text-green-800">Pitch calculé : P{formData.pitchCalcule || 6}</span></div>
                        )}
                      </div>
                    </div>

                    {/* Type de média */}
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Type de média diffusé</label>
                      <select name="typeMedia" value={formData.typeMedia} onChange={handleInputChange} className="input-tech text-lg">
                        <option value="">Sélectionner...</option>
                        <option value="videos-hd">Vidéos HD/4K</option>
                        <option value="publicite">Publicité/Communication</option>
                        <option value="evenementiel">Événementiel/Concert</option>
                        <option value="retail">Retail/Commerce</option>
                        <option value="corporate">Corporate/Entreprise</option>
                        <option value="sport">Sport/Stade</option>
                        <option value="mapping">Mapping/Artistique</option>
                      </select>
                    </div>

                    {/* Type d'écran */}
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Type d'écran</label>
                      <select name="typeEcran" value={formData.typeEcran} onChange={handleInputChange} className="input-tech text-lg">
                        <option value="standard">Écran standard</option>
                        <option value="cube">Cube LED</option>
                        <option value="transparent">Transparent</option>
                        <option value="floor">Dalle de sol</option>
                        <option value="semi-transparent">Semi-transparent</option>
                        <option value="flex">Flexible</option>
                        <option value="curved">Courbé</option>
                      </select>
                    </div>

                    {/* NOUVEAU - Question Scaler */}
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200/50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="text-2xl mr-3">🎛️</span>
                        Besoin d'un scaler ?
                      </h3>
                      <p className="text-gray-600 mb-4">Le scaler permet la gestion avancée des sources et la mise à l'échelle des contenus</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center cursor-pointer p-4 bg-white/50 rounded-lg border-2 border-transparent hover:border-orange-300 transition-all">
                          <input type="radio" name="besoinScaler" value="oui" checked={formData.besoinScaler === 'oui'} onChange={handleInputChange} className="mr-3" />
                          <div>
                            <span className="font-semibold text-gray-800">Oui, avec scaler</span>
                            <p className="text-sm text-gray-600">Gammes : VX, MX, H Series</p>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer p-4 bg-white/50 rounded-lg border-2 border-transparent hover:border-orange-300 transition-all">
                          <input type="radio" name="besoinScaler" value="non" checked={formData.besoinScaler === 'non'} onChange={handleInputChange} className="mr-3" />
                          <div>
                            <span className="font-semibold text-gray-800">Non, sans scaler</span>
                            <p className="text-sm text-gray-600">Gammes : MSD, MCTRL</p>
                          </div>
                        </label>
                      </div>
                      {formData.processeursFiltres.length > 0 && (
                        <div className="mt-4 p-3 bg-white/70 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">
                            {formData.processeursFiltres.length} processeurs disponibles dans cette catégorie
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" name="redondance" checked={formData.redondance} onChange={handleInputChange} className="mr-3" />
                          <span className="text-lg font-bold text-gray-700">Redondance nécessaire</span>
                        </label>
                        <p className="text-sm text-gray-500 mt-1">Double les équipements pour sécurité</p>
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3">Délais souhaités</label>
                        <input type="text" name="delaisSouhaite" value={formData.delaisSouhaite} onChange={handleInputChange} className="input-tech text-lg" placeholder="Ex: 3 semaines" />
                      </div>
                    </div>

                    <div className="flex justify-between pt-8 border-t border-gray-200/50">
                      <button type="button" onClick={() => setCurrentStep(1)} className="px-8 py-4 bg-white/20 border border-gray-300/50 text-gray-700 rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold text-lg backdrop-blur-sm">← Précédent</button>
                      <button type="submit" className="btn-primary text-lg px-8 py-4 flex items-center">Finaliser la demande <span className="ml-3 text-xl">✨</span></button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Calculs automatiques - AMÉLIORÉS */}
              {formData.totalPixels > 0 && (
                <div className="card-tech animate-slideInUp" style={{animationDelay: '0.2s'}}>
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                        <span className="text-white text-3xl">⚡</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">Calculs Automatiques</h3>
                        <p className="text-gray-600 text-lg">Estimations techniques basées sur vos spécifications</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200/50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">{formData.nombreDalles}</div>
                          <div className="text-gray-700 font-semibold mb-1">Dalles nécessaires</div>
                          <div className="text-sm text-gray-500">{formData.dallesLargeur} × {formData.dallesHauteur} (L×H)</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200/50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-2">{formData.totalPixels.toLocaleString()}</div>
                          <div className="text-gray-700 font-semibold mb-1">Pixels total</div>
                          <div className="text-sm text-gray-500">{formData.pixelsParDalle.toLocaleString()} pixels/dalle</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">{formData.nombreBumpers}</div>
                          <div className="text-gray-700 font-semibold mb-1">Bumpers</div>
                          <div className="text-sm text-gray-500">Suspension dalles</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200/50">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600 mb-2">{formData.nombreFlightcases}</div>
                          <div className="text-gray-700 font-semibold mb-1">Flightcases</div>
                          <div className="text-sm text-gray-500">6 dalles par case</div>
                        </div>
                      </div>

                      {formData.processeurRecommande && (
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-200/50 md:col-span-2">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600 mb-2">{formData.processeurRecommande.serie} {formData.processeurRecommande.modele}</div>
                            <div className="text-gray-700 font-semibold mb-1">Processeur recommandé</div>
                            <div className="text-sm text-gray-500 mb-2">
                              {formData.portsNecessaires} ports RJ45 nécessaires sur {formData.processeurRecommande.ports} disponibles
                              {formData.redondance && " (avec redondance)"}
                            </div>
                            <div className="text-xs bg-white/50 px-3 py-1 rounded-full inline-block">
                              {formData.processeurRecommande.type} | {formData.processeurRecommande.pixelsMax.toLocaleString()} pixels max
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200/50">
                      <div className="flex items-start">
                        <span className="text-2xl mr-4">⚠️</span>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">Note importante</h4>
                          <p className="text-gray-700">Ces calculs sont des estimations basées sur des valeurs standards (dalles 500×500mm). Les spécifications exactes seront confirmées par le devis fournisseur chinois.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}