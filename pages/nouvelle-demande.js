import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import PhoneInput from '../components/PhoneInput'
import { FormSectionCard, SubSection, GarantieOption, FieldGrid } from '../components/FormSections'
import DeformationPreview from '../components/DeformationPreview'

export default function NouvelleDemande() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [showDeformationPreview, setShowDeformationPreview] = useState(false)
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
    ratioCible: '16:9', // NOUVEAU - ratio cible pour mode dimensions
    dimensionsPratiques: 'exactes', // 'exactes', '10cm', '25cm', '50cm' - NOUVEAU
    distanceVision: '',
    pitchCalcule: '',
    pitchManuel: '',
    pitchMode: 'auto', // 'auto' ou 'manuel'
    typeMedia: '',
    typeEcran: 'standard',
    typeInstallation: '', // 'fixe' ou 'mobile' - NOUVEAU
    formatDalleSelection: 'auto', // 'auto' ou format spécifique - NOUVEAU
    typeConditionnement: '6', // '6' ou '8' dalles par flight - NOUVEAU
    redondance: false,
    delaisSouhaite: '',
    besoinScaler: '', // 'oui' ou 'non' - NOUVEAU
    
    // Garantie et services
    typeGarantie: '',
    dureeGarantie: '1',
    optionsGarantie: [],
    
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
    typeConditionnementTexte: '', // NOUVEAU - texte descriptif du conditionnement
  })

  useEffect(() => {
    checkAuth()
  }, [])

  // DÉSACTIVÉ - Les calculs seront faits par n8n
  // useEffect(() => {
  //   calculerSpecifications()
  // }, [formData.largeur, formData.hauteur, formData.surface, formData.ratio, formData.modeCalcul, formData.distanceVision, formData.pitchCalcule, formData.pitchManuel, formData.pitchMode, formData.redondance, formData.besoinScaler, formData.typeInstallation, formData.typeConditionnement, formData.dimensionsPratiques])

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

  // Collecter les données pour n8n (sans calculs)
  // Envoyer les données à n8n et recevoir les calculs
  const envoyerVersN8N = async (donnees) => {
    try {
      const response = await fetch('/api/calculer-specifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donnees)
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors du calcul')
      }
      
      const resultats = await response.json()
      return resultats
    } catch (error) {
      console.error('Erreur n8n:', error)
      return null
    }
  }
  
  const collecterDonneesPourN8N = () => {
    return {
      // Informations client
      client: {
        nom: formData.nomClient,
        societe: formData.societeClient,
        email: formData.emailClient,
        telephone: formData.telephoneClient,
        adresse: {
          numeroRue: formData.numeroRue,
          nomRue: formData.nomRue,
          codePostal: formData.codePostal,
          ville: formData.ville,
          adresseComplete: formData.adresseComplete
        }
      },
      // Configuration écran
      ecran: {
        modeCalcul: formData.modeCalcul,
        largeur: parseFloat(formData.largeur) || null,
        hauteur: parseFloat(formData.hauteur) || null,
        surface: parseFloat(formData.surface) || null,
        ratio: formData.ratio,
        dimensionsPratiques: formData.dimensionsPratiques
      },
      // Spécifications techniques
      technique: {
        distanceVision: parseFloat(formData.distanceVision) || null,
        pitchMode: formData.pitchMode,
        pitchManuel: parseFloat(formData.pitchManuel) || null,
        typeMedia: formData.typeMedia,
        typeEcran: formData.typeEcran,
        typeInstallation: formData.typeInstallation,
        formatDalleSelection: formData.formatDalleSelection,
        typeConditionnement: formData.typeConditionnement,
        redondance: formData.redondance,
        besoinScaler: formData.besoinScaler
      },
      // Informations projet
      projet: {
        dateEcheance: formData.dateEcheance,
        budget: parseFloat(formData.budget) || null,
        delaisSouhaite: formData.delaisSouhaite
      },
      // Garantie et services
      services: {
        typeGarantie: formData.typeGarantie,
        dureeGarantie: formData.dureeGarantie,
        formation: formData.formation,
        installationSurSite: formData.installationSurSite,
        supportTechnique: formData.supportTechnique
      },
      // Métadonnées
      metadata: {
        dateCreation: new Date().toISOString(),
        version: '1.0'
      }
    }
  }
  
  // Ancienne fonction de calcul - DESACTIVEE (sera remplacée par n8n)
  const calculerSpecifications_OLD = () => {
    let largeurFinal = parseFloat(formData.largeur) || 0
    let hauteurFinal = parseFloat(formData.hauteur) || 0
    let ratioCalcule = 0
    let dimensionsOptimales = { largeur: 0, hauteur: 0 }
    
    // DEBUG - Afficher les valeurs initiales
    console.log('=== DEBUT CALCUL ===')
    console.log('Mode calcul:', formData.modeCalcul)
    console.log('Largeur saisie:', formData.largeur, '→ parsée:', largeurFinal)
    console.log('Hauteur saisie:', formData.hauteur, '→ parsée:', hauteurFinal)
    
    // Mode surface + ratio : calculer les dimensions optimales
    if (formData.modeCalcul === 'surface' && formData.surface) {
      const surface = parseFloat(formData.surface)
      const ratioValue = getRatioValue(formData.ratio)
      
      // Calcul mathématique exact selon le ratio
      const hauteurExacte = Math.sqrt(surface / ratioValue)
      const largeurExacte = hauteurExacte * ratioValue
      
      // Appliquer l'arrondi sélectionné pour les calculs de dalles
      switch(formData.dimensionsPratiques) {
        case '10cm':
          largeurFinal = Math.round(largeurExacte * 10) / 10
          hauteurFinal = Math.round(hauteurExacte * 10) / 10
          break
        case '25cm':
          largeurFinal = Math.round(largeurExacte * 4) / 4
          hauteurFinal = Math.round(hauteurExacte * 4) / 4
          break
        case '50cm':
          largeurFinal = Math.round(largeurExacte * 2) / 2
          hauteurFinal = Math.round(hauteurExacte * 2) / 2
          break
        default: // exactes
          largeurFinal = largeurExacte
          hauteurFinal = hauteurExacte
      }
      
      // Dimensions exactes pour l'affichage des suggestions
      dimensionsOptimales = {
        largeur: largeurExacte,
        hauteur: hauteurExacte
      }
      
      // Ratio reste parfait car on utilise le ratio sélectionné
      ratioCalcule = ratioValue
    }
    
    // Mode dimensions : calculer le ratio correspondant
    if (formData.modeCalcul === 'dimensions' && largeurFinal && hauteurFinal) {
      ratioCalcule = largeurFinal / hauteurFinal
      dimensionsOptimales = { largeur: largeurFinal, hauteur: hauteurFinal }
      // DEBUG - Vérifier que les dimensions sont correctes en mode dimensions
      console.log('Mode dimensions - Valeurs utilisées: L=' + largeurFinal + 'm, H=' + hauteurFinal + 'm')
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
    
    // Calcul dalles avec sélection intelligente du format
    let formatDalle, dallesLargeur, dallesHauteur, nombreDalles, surfaceReelleEcran, solutionsDalles
    
    // DEBUG - Afficher les dimensions utilisées pour le calcul
    console.log('=== CALCUL DALLES ===')
    console.log('Type installation:', formData.typeInstallation)
    console.log('Dimensions pour calcul dalles: L=' + largeurFinal + 'm, H=' + hauteurFinal + 'm')
    
    if (formData.typeInstallation === 'mobile') {
      // Pour mobile, on calcule les 3 solutions
      solutionsDalles = calculerSolutionsDalles(largeurFinal, hauteurFinal, formData.typeInstallation)
      // On prend la première solution (500x500) comme valeur par défaut pour la compatibilité
      const solutionDefaut = solutionsDalles[0]
      formatDalle = solutionDefaut.format
      dallesLargeur = solutionDefaut.dallesLargeur
      dallesHauteur = solutionDefaut.dallesHauteur
      nombreDalles = solutionDefaut.nombreDalles
      surfaceReelleEcran = solutionDefaut.surfaceReelle
      
      // DEBUG - Afficher le résultat du calcul
      console.log('Solution choisie:', solutionDefaut.nom)
      console.log('Calcul dalles: ' + largeurFinal + '/0.5=' + (largeurFinal/0.5) + ' → ' + dallesLargeur + ' dalles en largeur')
      console.log('Calcul dalles: ' + hauteurFinal + '/0.5=' + (hauteurFinal/0.5) + ' → ' + dallesHauteur + ' dalles en hauteur')
      console.log('Total: ' + dallesLargeur + ' × ' + dallesHauteur + ' = ' + nombreDalles + ' dalles')
    } else if (formData.typeInstallation === 'fixe') {
      // Pour fixe, on garde l'ancienne logique
      formatDalle = choisirFormatDalleOptimal(largeurFinal, hauteurFinal, formData.typeInstallation, formData.formatDalleSelection, pitchFinal)
      dallesLargeur = Math.ceil(largeurFinal / formatDalle.largeur)
      dallesHauteur = Math.ceil(hauteurFinal / formatDalle.hauteur)
      nombreDalles = dallesLargeur * dallesHauteur
      surfaceReelleEcran = dallesLargeur * formatDalle.largeur * dallesHauteur * formatDalle.hauteur
    } else {
      // Si typeInstallation n'est pas défini, utiliser des dalles 500x500 par défaut
      console.log('ATTENTION: typeInstallation non défini, utilisation de dalles 500x500 par défaut')
      formatDalle = { nom: '500x500mm', largeur: 0.5, hauteur: 0.5 }
      dallesLargeur = Math.ceil(largeurFinal / 0.5)
      dallesHauteur = Math.ceil(hauteurFinal / 0.5)
      nombreDalles = dallesLargeur * dallesHauteur
      surfaceReelleEcran = dallesLargeur * 0.5 * dallesHauteur * 0.5
      
      // DEBUG
      console.log('Calcul par défaut: ' + largeurFinal + '/0.5=' + Math.ceil(largeurFinal/0.5) + ' dalles en largeur')
      console.log('Calcul par défaut: ' + hauteurFinal + '/0.5=' + Math.ceil(hauteurFinal/0.5) + ' dalles en hauteur')
      console.log('Total par défaut: ' + dallesLargeur + ' × ' + dallesHauteur + ' = ' + nombreDalles + ' dalles')
    }
    
    // Calcul pixels basé sur les dimensions réelles de la dalle
    // Note: Les dalles font généralement 500x500mm ou 500x1000mm mais la taille exacte sera confirmée par le devis
    const pixelsLargeurDalle = Math.floor((formatDalle.largeur * 1000) / pitchFinal)
    const pixelsHauteurDalle = Math.floor((formatDalle.hauteur * 1000) / pitchFinal)
    const pixelsParDalle = pixelsLargeurDalle * pixelsHauteurDalle
    const totalPixels = nombreDalles * pixelsParDalle
    
    // Calcul équipements
    const nombreBumpers = dallesLargeur // Bumpers = nombre de dalles en largeur uniquement
    
    // Calcul des flightcases selon le type d'installation
    let nombreFlightcases = 0
    let typeConditionnementTexte = ''
    
    if (formData.typeInstallation === 'fixe') {
      // Installation fixe : caisses en bois, conditionnement variable
      nombreFlightcases = 0 // Sera déterminé selon le projet
      typeConditionnementTexte = 'Caisses bois sur mesure'
    } else {
      // Installation mobile : flightcases standard
      const dallesParFlight = parseInt(formData.typeConditionnement) || 6
      nombreFlightcases = Math.ceil(nombreDalles / dallesParFlight)
      typeConditionnementTexte = `Flightcases (${dallesParFlight} dalles/flight)`
    }
    
    // Filtrer les processeurs selon scaler
    const processeursFiltres = filtrerProcesseurs(formData.besoinScaler)
    
    // Processeur recommandé parmi les processeurs filtrés
    const processeurRecommande = trouverProcesseurOptimal(totalPixels, formData.redondance, processeursFiltres)
    const portsNecessaires = calculerPortsNecessaires(totalPixels, processeurRecommande, formData.redondance)
    
    // DEBUG - Afficher les valeurs finales avant mise à jour
    console.log('=== VALEURS FINALES ===')
    console.log('Dimensions finales: L=' + largeurFinal + 'm, H=' + hauteurFinal + 'm')
    console.log('Dalles calculées: ' + dallesLargeur + ' × ' + dallesHauteur + ' = ' + nombreDalles)
    console.log('Format dalle:', formatDalle)
    console.log('======================')
    
    setFormData(prev => ({
      ...prev,
      // En mode dimensions, ne pas écraser les valeurs saisies par l'utilisateur
      // En mode surface, mettre à jour avec les dimensions calculées
      ...(formData.modeCalcul === 'surface' ? {
        largeur: largeurFinal,
        hauteur: hauteurFinal,
      } : {}),
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
      typeConditionnementTexte,
      formatDalle,
      surfaceReelleEcran,
      solutionsDalles,
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

  // Analyser la déformation par rapport aux ratios standards
  // Définition complète des formats de dalles disponibles
  const formatsDallesDisponibles = {
    fixe: [
      { nom: '500x250mm', largeur: 0.5, hauteur: 0.25, surface: 0.125, pitch: ['1.9', '2.6', '3.9'] },
      { nom: '750x250mm', largeur: 0.75, hauteur: 0.25, surface: 0.1875, pitch: ['1.9', '2.6', '3.9'] },
      { nom: '1000x250mm', largeur: 1, hauteur: 0.25, surface: 0.25, pitch: ['1.9', '2.6', '3.9'] },
      { nom: '1250x250mm', largeur: 1.25, hauteur: 0.25, surface: 0.3125, pitch: ['1.9', '2.6', '3.9'] }
    ],
    mobile: [
      { nom: '500x500mm', largeur: 0.5, hauteur: 0.5, surface: 0.25, pitch: ['1.9', '2.6', '2.9', '3.9'] },
      { nom: '500x1000mm', largeur: 0.5, hauteur: 1, surface: 0.5, pitch: ['2.6', '3.9'] }
    ],
    broadcast: [
      { nom: '600x337.5mm (16:9)', largeur: 0.6, hauteur: 0.3375, surface: 0.2025, pitch: ['0.9', '1.2', '1.56'] }
    ]
  }
  
  const calculerSolutionsDalles = (largeur, hauteur, typeInstallation) => {
    const solutions = []
    
    // Solution 1: Uniquement des dalles 500x500
    const solution500x500 = {
      nom: 'Dalles 500x500mm uniquement',
      format: { nom: '500x500mm', largeur: 0.5, hauteur: 0.5 },
      dallesLargeur: Math.ceil(largeur / 0.5),
      dallesHauteur: Math.ceil(hauteur / 0.5),
      nombreDalles: 0,
      surfaceReelle: 0,
      configuration: []
    }
    solution500x500.nombreDalles = solution500x500.dallesLargeur * solution500x500.dallesHauteur
    solution500x500.surfaceReelle = solution500x500.dallesLargeur * 0.5 * solution500x500.dallesHauteur * 0.5
    solutions.push(solution500x500)
    
    // Solution 2: Uniquement des dalles 500x1000 (si possible)
    const dalles1000Largeur = Math.ceil(largeur / 0.5)
    const dalles1000Hauteur = Math.ceil(hauteur / 1)
    if (dalles1000Hauteur * 1 <= hauteur + 0.5) { // Vérifie si c'est raisonnable
      const solution500x1000 = {
        nom: 'Dalles 500x1000mm uniquement',
        format: { nom: '500x1000mm', largeur: 0.5, hauteur: 1 },
        dallesLargeur: dalles1000Largeur,
        dallesHauteur: dalles1000Hauteur,
        nombreDalles: dalles1000Largeur * dalles1000Hauteur,
        surfaceReelle: dalles1000Largeur * 0.5 * dalles1000Hauteur * 1,
        configuration: []
      }
      solutions.push(solution500x1000)
    }
    
    // Solution 3: Solution mixte optimisée
    const solutionMixte = calculerSolutionMixte(largeur, hauteur)
    if (solutionMixte) {
      solutions.push(solutionMixte)
    }
    
    return solutions
  }
  
  const calculerSolutionMixte = (largeur, hauteur) => {
    const dallesLargeur = Math.ceil(largeur / 0.5)
    
    // Calcul du nombre de lignes de 1000mm possibles
    const lignes1000 = Math.floor(hauteur / 1)
    const resteHauteur = hauteur - (lignes1000 * 1)
    
    // Calcul du nombre de lignes de 500mm nécessaires pour le reste
    const lignes500 = Math.ceil(resteHauteur / 0.5)
    
    if (lignes1000 === 0) return null // Pas de solution mixte intéressante
    
    const solution = {
      nom: 'Solution mixte optimisée',
      format: { nom: 'Mixte 500x500 + 500x1000', largeur: 0.5, hauteur: 'variable' },
      configuration: [],
      nombreDalles: 0,
      surfaceReelle: 0,
      details: []
    }
    
    // Ajouter les lignes de 500x1000
    if (lignes1000 > 0) {
      const dalles1000 = dallesLargeur * lignes1000
      solution.configuration.push({
        type: '500x1000mm',
        quantite: dalles1000,
        disposition: `${dallesLargeur} x ${lignes1000} dalles`
      })
      solution.nombreDalles += dalles1000
      solution.details.push(`${lignes1000} ligne(s) de dalles 500x1000mm`)
    }
    
    // Ajouter les lignes de 500x500
    if (lignes500 > 0) {
      const dalles500 = dallesLargeur * lignes500
      solution.configuration.push({
        type: '500x500mm',
        quantite: dalles500,
        disposition: `${dallesLargeur} x ${lignes500} dalles`
      })
      solution.nombreDalles += dalles500
      solution.details.push(`${lignes500} ligne(s) de dalles 500x500mm`)
    }
    
    solution.surfaceReelle = dallesLargeur * 0.5 * (lignes1000 * 1 + lignes500 * 0.5)
    solution.hauteurReelle = lignes1000 * 1 + lignes500 * 0.5
    solution.largeurReelle = dallesLargeur * 0.5
    
    return solution
  }
  
  const choisirFormatDalleOptimal = (largeur, hauteur, typeInstallation, formatManuel = 'auto', pitch = null) => {
    // Si un format manuel est spécifié, on le cherche dans la liste
    if (formatManuel !== 'auto') {
      const allFormats = [
        ...formatsDallesDisponibles.fixe,
        ...formatsDallesDisponibles.mobile,
        ...formatsDallesDisponibles.broadcast
      ]
      const formatTrouve = allFormats.find(f => f.nom === formatManuel)
      if (formatTrouve) {
        return formatTrouve
      }
    }
    
    // Sélection automatique basée sur le pitch pour les dalles broadcast
    if (pitch && ['0.9', '1.2', '1.56'].includes(pitch.toString())) {
      return formatsDallesDisponibles.broadcast[0] // 600x337.5mm
    }
    
    if (typeInstallation === 'mobile') {
      // Pour mobile, on utilise la nouvelle logique avec les 3 solutions
      const solutions = calculerSolutionsDalles(largeur, hauteur, typeInstallation)
      // Retourne la première solution (500x500) par défaut pour la compatibilité
      return solutions[0].format
    }
    
    // Pour fixe, on optimise
    const formats = formatsDallesDisponibles.fixe
    let meilleurFormat = formats[0]
    let meilleurScore = Infinity
    
    for (const format of formats) {
      const nbDallesLargeur = Math.ceil(largeur / format.largeur)
      const nbDallesHauteur = Math.ceil(hauteur / format.hauteur)
      const surfaceUtilisee = nbDallesLargeur * format.largeur * nbDallesHauteur * format.hauteur
      const surfaceDemandee = largeur * hauteur
      const gaspillage = surfaceUtilisee - surfaceDemandee
      const nbDallesTotal = nbDallesLargeur * nbDallesHauteur
      
      const score = gaspillage + (nbDallesTotal * 0.01)
      
      if (score < meilleurScore) {
        meilleurScore = score
        meilleurFormat = format
      }
    }
    
    return meilleurFormat
  }

  const analyserDeformation = (ratioCalcule, ratioCibleOverride = null) => {
    const ratiosStandards = [
      { nom: '16:9', valeur: 16/9, usage: 'Standard HD/4K' },
      { nom: '4:3', valeur: 4/3, usage: 'Classique' },
      { nom: '21:9', valeur: 21/9, usage: 'Ultra-large cinéma' }
    ]
    
    let plusProche
    let ecartMin
    
    // Si on a un ratio cible spécifique (mode dimensions)
    if (ratioCibleOverride && ratioCibleOverride !== 'autre') {
      plusProche = ratiosStandards.find(r => r.nom === ratioCibleOverride)
      ecartMin = Math.abs(ratioCalcule - plusProche.valeur)
    } else {
      // Sinon, trouver le ratio standard le plus proche
      plusProche = ratiosStandards[0]
      ecartMin = Math.abs(ratioCalcule - ratiosStandards[0].valeur)
      
      ratiosStandards.forEach(ratio => {
        const ecart = Math.abs(ratioCalcule - ratio.valeur)
        if (ecart < ecartMin) {
          ecartMin = ecart
          plusProche = ratio
        }
      })
    }
    
    // Calculer le pourcentage d'écart
    const pourcentageEcart = (ecartMin / plusProche.valeur * 100).toFixed(1)
    
    // Analyser le niveau de déformation
    if (pourcentageEcart < 2) {
      return (
        <div className="mt-2">
          <p className="text-sm text-green-600 font-medium">
            ✅ Ratio {plusProche.nom} ({plusProche.usage}) - Écart : {pourcentageEcart}%
          </p>
          <p className="text-xs text-green-600">Aucune déformation visible, ratio optimal</p>
        </div>
      )
    } else if (pourcentageEcart < 5) {
      return (
        <div className="mt-2">
          <p className="text-sm text-blue-600 font-medium">
            🔵 Proche du {plusProche.nom} ({plusProche.usage}) - Écart : {pourcentageEcart}%
          </p>
          <p className="text-xs text-blue-600">Déformation minime, à peine perceptible</p>
        </div>
      )
    } else if (pourcentageEcart < 10) {
      return (
        <div className="mt-2">
          <p className="text-sm text-orange-600 font-medium">
            ⚠️ Écart modéré avec {plusProche.nom} - Écart : {pourcentageEcart}%
          </p>
          <p className="text-xs text-orange-600">Déformation visible, contenu légèrement étiré/compressé</p>
          <p className="text-xs text-gray-600 mt-1">
            💡 Conseil : Ajustez à {(plusProche.valeur * parseFloat(formData.hauteur)).toFixed(2)}m × {formData.hauteur}m pour un ratio {plusProche.nom}
          </p>
        </div>
      )
    } else {
      return (
        <div className="mt-2">
          <p className="text-sm text-red-600 font-medium">
            ❌ Forte déformation - Écart : {pourcentageEcart}% avec {plusProche.nom}
          </p>
          <p className="text-xs text-red-600">Déformation importante, contenu fortement déformé</p>
          <p className="text-xs text-gray-600 mt-1">
            💡 Recommandation : {(plusProche.valeur * parseFloat(formData.hauteur)).toFixed(2)}m × {formData.hauteur}m pour {plusProche.nom}
          </p>
        </div>
      )
    }
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

  // Fonctions de formatage
  const formatNom = (text) => {
    return text.toUpperCase()
  }

  const formatPrenom = (text) => {
    // Gérer les prénoms composés (ex: Jean-Pierre, Marie-Claire)
    return text
      .split(/[\s-]/) // Séparer par espaces ou tirets
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(text.includes('-') ? '-' : ' ') // Rejoindre avec le même séparateur
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = type === 'checkbox' ? checked : value
    
    // Formatage automatique pour nom et prénom
    if (name === 'nomClient') {
      newValue = formatNom(value)
    } else if (name === 'prenomClient') {
      newValue = formatPrenom(value)
    }
    
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
                    <PhoneInput
                      label="Téléphone"
                      required
                      value={formData.telephoneClient}
                      onChange={handleInputChange}
                      defaultCountry="FR"
                    />
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
            <div className="space-y-6">
              {/* En-tête principale */}
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <span className="text-white text-3xl">🧮</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Spécifications Techniques</h2>
                  <p className="text-gray-600 text-lg">Configuration de l'écran LED avec calculs automatiques</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* SECTION 1 - Dimensions de l'écran */}
                <FormSectionCard
                  title="Dimensions de l'écran"
                  icon="📐"
                  iconBg="bg-gradient-to-r from-cyan-500 to-blue-600"
                >
                  {/* Mode de calcul */}
                  <div className="flex space-x-4 mb-6">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="modeCalcul" 
                        value="dimensions" 
                        checked={formData.modeCalcul === 'dimensions'} 
                        onChange={handleInputChange} 
                        className="mr-3" 
                      />
                      <span className="font-semibold">Mode 1 : Largeur × Hauteur</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="modeCalcul" 
                        value="surface" 
                        checked={formData.modeCalcul === 'surface'} 
                        onChange={handleInputChange} 
                        className="mr-3" 
                      />
                      <span className="font-semibold">Mode 2 : Surface + Ratio</span>
                    </label>
                  </div>

                  {formData.modeCalcul === 'dimensions' ? (
                    <div>
                      <FieldGrid columns={2}>
                        <div>
                          <label className="block font-bold text-gray-700 mb-2">Largeur (m) *</label>
                          <input 
                            type="number" 
                            step="0.1" 
                            name="largeur" 
                            value={formData.largeur} 
                            onChange={handleInputChange} 
                            className="input-tech" 
                            placeholder="4.5" 
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-2">Hauteur (m) *</label>
                          <input 
                            type="number" 
                            step="0.1" 
                            name="hauteur" 
                            value={formData.hauteur} 
                            onChange={handleInputChange} 
                            className="input-tech" 
                            placeholder="2.5" 
                          />
                        </div>
                      </FieldGrid>
                      
                      {/* Sélection du ratio cible */}
                      <div className="mt-4">
                        <label className="block font-bold text-gray-700 mb-2">Ratio cible souhaité</label>
                        <select 
                          name="ratioCible" 
                          value={formData.ratioCible} 
                          onChange={handleInputChange} 
                          className="input-tech w-full md:w-1/2"
                        >
                          <option value="16:9">16:9 (Standard HD/4K)</option>
                          <option value="4:3">4:3 (Format classique)</option>
                          <option value="21:9">21:9 (Ultra-large cinéma)</option>
                          <option value="autre">Autre (accepter le ratio actuel)</option>
                        </select>
                      </div>
                      {formData.ratioCalcule > 0 && (
                        <>
                          <div className="mt-4 p-4 bg-white/60 rounded-lg border border-gray-200">
                            <p className="font-bold text-gray-800">
                              📏 Surface : {formData.surfaceCalculee.toFixed(2)}m² | Ratio calculé : {formData.ratioCalcule.toFixed(3)}:1
                            </p>
                            {analyserDeformation(formData.ratioCalcule, formData.ratioCible)}
                          </div>
                          {/* Bouton pour afficher/masquer l'aperçu */}
                          {(() => {
                            const ratioCibleValue = formData.ratioCible === '16:9' ? 16/9 : 
                                                   formData.ratioCible === '4:3' ? 4/3 : 
                                                   formData.ratioCible === '21:9' ? 21/9 : 0;
                            return formData.ratioCible !== 'autre' && Math.abs(formData.ratioCalcule - ratioCibleValue) > 0.02;
                          })() && (
                            <button
                              type="button"
                              onClick={() => setShowDeformationPreview(!showDeformationPreview)}
                              className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                            >
                              <span className="mr-1">{showDeformationPreview ? '🔼' : '🔽'}</span>
                              {showDeformationPreview ? 'Masquer' : 'Voir'} l'aperçu de la déformation
                            </button>
                          )}
                          {/* Aperçu visuel de la déformation */}
                          {showDeformationPreview && (
                            <DeformationPreview 
                              largeur={formData.largeur}
                              hauteur={formData.hauteur}
                              ratioCalcule={formData.ratioCalcule}
                            />
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div>
                      <FieldGrid columns={2}>
                        <div>
                          <label className="block font-bold text-gray-700 mb-2">Surface (m²) *</label>
                          <input 
                            type="number" 
                            step="0.1" 
                            name="surface" 
                            value={formData.surface} 
                            onChange={handleInputChange} 
                            className="input-tech" 
                            placeholder="11.25" 
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-2">Ratio</label>
                          <select name="ratio" value={formData.ratio} onChange={handleInputChange} className="input-tech">
                            <option value="16:9">16:9 (Standard)</option>
                            <option value="4:3">4:3 (Classique)</option>
                            <option value="21:9">21:9 (Ultra-large)</option>
                          </select>
                        </div>
                      </FieldGrid>
                      
                      {/* Sélecteur de dimensions pratiques */}
                      {formData.dimensionsOptimales.largeur > 0 && (
                        <div className="mt-4">
                          <label className="block font-bold text-gray-700 mb-2">Dimensions à utiliser pour les calculs</label>
                          <select 
                            name="dimensionsPratiques" 
                            value={formData.dimensionsPratiques} 
                            onChange={handleInputChange} 
                            className="input-tech w-full"
                          >
                            <option value="exactes">Exactes : {formData.dimensionsOptimales.largeur.toFixed(2)}m × {formData.dimensionsOptimales.hauteur.toFixed(2)}m</option>
                            <option value="10cm">Arrondi 10cm : {(Math.round(formData.dimensionsOptimales.largeur * 10) / 10).toFixed(1)}m × {(Math.round(formData.dimensionsOptimales.hauteur * 10) / 10).toFixed(1)}m</option>
                            <option value="25cm">Arrondi 25cm : {(Math.round(formData.dimensionsOptimales.largeur * 4) / 4).toFixed(2)}m × {(Math.round(formData.dimensionsOptimales.hauteur * 4) / 4).toFixed(2)}m</option>
                            <option value="50cm">Arrondi 50cm : {(Math.round(formData.dimensionsOptimales.largeur * 2) / 2).toFixed(1)}m × {(Math.round(formData.dimensionsOptimales.hauteur * 2) / 2).toFixed(1)}m</option>
                          </select>
                        </div>
                      )}

                      {formData.dimensionsOptimales.largeur > 0 && (
                        <div className="mt-4 p-4 bg-white/60 rounded-lg border border-gray-200">
                          <p className="font-bold text-gray-800">
                            📏 Dimensions pour calculs : {formData.largeur}m × {formData.hauteur}m
                          </p>
                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={async () => {
                                const donnees = collecterDonneesPourN8N()
                                const resultats = await envoyerVersN8N(donnees)
                                if (resultats) {
                                  console.log('Résultats n8n:', resultats)
                                  // TODO: Mettre à jour l'interface avec les résultats
                                }
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Calculer via n8n
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </FormSectionCard>

                {/* SECTION 2 - Configuration technique */}
                <FormSectionCard
                  title="Configuration technique"
                  icon="⚙️"
                  iconBg="bg-gradient-to-r from-purple-500 to-pink-600"
                >
                  <SubSection title="Pitch et distance de vision">
                    <FieldGrid columns={2}>
                      <div>
                        <label className="block font-bold text-gray-700 mb-2">Distance de vision (m) *</label>
                        <input 
                          type="number" 
                          step="0.5" 
                          name="distanceVision" 
                          value={formData.distanceVision} 
                          onChange={handleInputChange} 
                          className="input-tech" 
                          placeholder="6" 
                        />
                        <p className="text-sm text-gray-500 mt-2">Distance des premiers spectateurs</p>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-2">Pitch (mm)</label>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="pitchMode" 
                              value="auto" 
                              checked={formData.pitchMode === 'auto'} 
                              onChange={handleInputChange} 
                              className="mr-2" 
                            />
                            <span>Automatique (Distance = Pitch)</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="pitchMode" 
                              value="manuel" 
                              checked={formData.pitchMode === 'manuel'} 
                              onChange={handleInputChange} 
                              className="mr-2" 
                            />
                            <span>Manuel</span>
                          </label>
                        </div>
                        {formData.pitchMode === 'manuel' ? (
                          <input 
                            type="number" 
                            step="0.1" 
                            name="pitchManuel" 
                            value={formData.pitchManuel} 
                            onChange={handleInputChange} 
                            className="input-tech mt-2" 
                            placeholder="6" 
                          />
                        ) : (
                          <div className="mt-2 p-3 bg-green-100 rounded-lg">
                            <span className="font-bold text-green-800">Pitch calculé : P{formData.pitchCalcule || 6}</span>
                          </div>
                        )}
                      </div>
                    </FieldGrid>
                  </SubSection>

                  <SubSection title="Type de média et écran">
                    <FieldGrid columns={2}>
                      <div>
                        <label className="block font-bold text-gray-700 mb-2">Type de média diffusé</label>
                        <select name="typeMedia" value={formData.typeMedia} onChange={handleInputChange} className="input-tech">
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
                      <div>
                        <label className="block font-bold text-gray-700 mb-2">Type d'écran</label>
                        <select name="typeEcran" value={formData.typeEcran} onChange={handleInputChange} className="input-tech">
                          <option value="standard">Écran standard</option>
                          <option value="cube">Cube LED</option>
                          <option value="transparent">Transparent</option>
                          <option value="floor">Dalle de sol</option>
                          <option value="semi-transparent">Semi-transparent</option>
                          <option value="flex">Flexible</option>
                          <option value="curved">Courbé</option>
                        </select>
                      </div>
                    </FieldGrid>
                  </SubSection>

                  <SubSection title="Type d'installation et conditionnement">
                    <FieldGrid columns={2}>
                      <div>
                        <label className="block font-bold text-gray-700 mb-2">Type d'installation *</label>
                        <select name="typeInstallation" value={formData.typeInstallation} onChange={handleInputChange} className="input-tech">
                          <option value="">Sélectionner...</option>
                          <option value="mobile">Installation mobile/événementiel</option>
                          <option value="fixe">Installation fixe/permanente</option>
                        </select>
                      </div>
                      {formData.typeInstallation === 'mobile' && (
                        <div>
                          <label className="block font-bold text-gray-700 mb-2">Dalles par flightcase</label>
                          <select name="typeConditionnement" value={formData.typeConditionnement} onChange={handleInputChange} className="input-tech">
                            <option value="6">6 dalles par flightcase (standard)</option>
                            <option value="8">8 dalles par flightcase (optimisé)</option>
                          </select>
                        </div>
                      )}
                    </FieldGrid>
                    
                    {formData.typeInstallation && (
                      <div className="mt-4">
                        <label className="block font-bold text-gray-700 mb-2">Format des dalles</label>
                        <select 
                          name="formatDalleSelection" 
                          value={formData.formatDalleSelection} 
                          onChange={handleInputChange} 
                          className="input-tech w-full"
                        >
                          <option value="auto">Sélection automatique (optimisée)</option>
                          <optgroup label="Installation fixe">
                            <option value="500x250mm">500×250mm</option>
                            <option value="750x250mm">750×250mm</option>
                            <option value="1000x250mm">1000×250mm</option>
                            <option value="1250x250mm">1250×250mm</option>
                          </optgroup>
                          <optgroup label="Installation mobile">
                            <option value="500x500mm">500×500mm</option>
                            <option value="500x1000mm">500×1000mm</option>
                          </optgroup>
                          <optgroup label="Broadcast (COB)">
                            <option value="600x337.5mm (16:9)">600×337.5mm (16:9 - Pitch 0.9/1.2/1.56)</option>
                          </optgroup>
                        </select>
                      </div>
                    )}
                    
                    {formData.typeInstallation && (
                      <div className="mt-4 p-4 bg-white/60 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">ℹ️ Information :</span>
                          {formData.typeInstallation === 'mobile' 
                            ? ' Utilisation de flightcases standards pour transport'
                            : ' Conditionnement en caisses bois sur mesure selon projet'
                          }
                        </p>
                      </div>
                    )}
                  </SubSection>
                </FormSectionCard>

                {/* SECTION 3 - Options matériel */}
                <FormSectionCard
                  title="Options matériel"
                  icon="🎛️"
                  iconBg="bg-gradient-to-r from-orange-500 to-red-600"
                >
                  <SubSection title="Besoin d'un scaler ?">
                    <p className="text-gray-600 mb-4">Le scaler permet la gestion avancée des sources et la mise à l'échelle des contenus</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center cursor-pointer p-4 bg-white/50 rounded-lg border-2 border-transparent hover:border-orange-300 transition-all">
                        <input 
                          type="radio" 
                          name="besoinScaler" 
                          value="oui" 
                          checked={formData.besoinScaler === 'oui'} 
                          onChange={handleInputChange} 
                          className="mr-3" 
                        />
                        <div>
                          <span className="font-semibold text-gray-800">Oui, avec scaler</span>
                          <p className="text-sm text-gray-600">Gammes : VX, MX, H Series</p>
                        </div>
                      </label>
                      <label className="flex items-center cursor-pointer p-4 bg-white/50 rounded-lg border-2 border-transparent hover:border-orange-300 transition-all">
                        <input 
                          type="radio" 
                          name="besoinScaler" 
                          value="non" 
                          checked={formData.besoinScaler === 'non'} 
                          onChange={handleInputChange} 
                          className="mr-3" 
                        />
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
                  </SubSection>

                  <SubSection title="Redondance">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="redondance" 
                        checked={formData.redondance} 
                        onChange={handleInputChange} 
                        className="mr-3" 
                      />
                      <div>
                        <span className="font-bold text-gray-700">Redondance nécessaire</span>
                        <p className="text-sm text-gray-500">Double les équipements pour sécurité maximale</p>
                      </div>
                    </label>
                  </SubSection>
                </FormSectionCard>

                {/* SECTION 4 - Garantie et services (NOUVEAU) */}
                <FormSectionCard
                  title="Garantie et services"
                  icon="🛡️"
                  iconBg="bg-gradient-to-r from-green-500 to-emerald-600"
                >
                  <SubSection title="Type de garantie">
                    <div className="space-y-4">
                      <GarantieOption
                        value="basique"
                        title="Basique"
                        description="Remplacement pièces uniquement"
                        features={[
                          "Remplacement des pièces défectueuses",
                          "Frais de port à la charge du client",
                          "Support technique par email"
                        ]}
                        price="Inclus"
                        checked={formData.typeGarantie === 'basique'}
                        onChange={handleInputChange}
                      />
                      <GarantieOption
                        value="standard"
                        title="Standard"
                        description="Pièces + Réparation modules"
                        features={[
                          "Remplacement des pièces défectueuses",
                          "Réparation des modules LED",
                          "Frais de port pris en charge",
                          "Support technique prioritaire"
                        ]}
                        price="+5%"
                        checked={formData.typeGarantie === 'standard'}
                        onChange={handleInputChange}
                      />
                      <GarantieOption
                        value="premium"
                        title="Premium"
                        description="Pièces + Réparation + Intervention sur site"
                        features={[
                          "Toutes les prestations Standard",
                          "Intervention sur site sous 48h",
                          "Main d'œuvre incluse",
                          "Hotline dédiée 7j/7"
                        ]}
                        price="+10%"
                        checked={formData.typeGarantie === 'premium'}
                        onChange={handleInputChange}
                      />
                      <GarantieOption
                        value="excellence"
                        title="Excellence"
                        description="Tout inclus + Assistance à distance"
                        features={[
                          "Toutes les prestations Premium",
                          "Maintenance préventive annuelle",
                          "Assistance à distance 24/7",
                          "Remplacement d'urgence sous 24h",
                          "Formation du personnel incluse"
                        ]}
                        price="+15%"
                        checked={formData.typeGarantie === 'excellence'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </SubSection>

                  <SubSection title="Durée de garantie">
                    <select 
                      name="dureeGarantie" 
                      value={formData.dureeGarantie} 
                      onChange={handleInputChange} 
                      className="input-tech"
                    >
                      <option value="1">1 an</option>
                      <option value="2">2 ans (+5%)</option>
                      <option value="3">3 ans (+10%)</option>
                      <option value="5">5 ans (+20%)</option>
                    </select>
                  </SubSection>
                </FormSectionCard>

                {/* SECTION 5 - Délais et livraison */}
                <FormSectionCard
                  title="Délais et livraison"
                  icon="📦"
                  iconBg="bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  <FieldGrid columns={2}>
                    <div>
                      <label className="block font-bold text-gray-700 mb-2">Délais souhaités</label>
                      <input 
                        type="text" 
                        name="delaisSouhaite" 
                        value={formData.delaisSouhaite} 
                        onChange={handleInputChange} 
                        className="input-tech" 
                        placeholder="Ex: 3 semaines" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-2">Conditions de livraison</label>
                      <select className="input-tech">
                        <option>Standard - Transporteur</option>
                        <option>Express - Livraison dédiée</option>
                        <option>Installation incluse</option>
                      </select>
                    </div>
                  </FieldGrid>
                </FormSectionCard>

                {/* Boutons de navigation */}
                <div className="flex justify-between pt-8">
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(1)} 
                    className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-gray-300/50 text-gray-700 rounded-xl hover:bg-white/90 transition-all duration-200 font-semibold text-lg"
                  >
                    ← Précédent
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary text-lg px-8 py-4 flex items-center"
                  >
                    Finaliser la demande 
                    <span className="ml-3 text-xl">✨</span>
                  </button>
                </div>
              </form>

              {/* Calculs automatiques - DESACTIVE (sera fait par n8n) */}
              {/* {formData.totalPixels > 0 && (
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
                          {formData.formatDalle && (
                            <div className="text-xs bg-white/50 px-3 py-1 rounded-full inline-block mt-2">
                              Format: {formData.formatDalle.nom}
                            </div>
                          )}
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
                          {formData.typeInstallation === 'fixe' ? (
                            <>
                              <div className="text-2xl font-bold text-orange-600 mb-2">📦</div>
                              <div className="text-gray-700 font-semibold mb-1">Caisses bois</div>
                              <div className="text-sm text-gray-500">Sur mesure selon projet</div>
                            </>
                          ) : (
                            <>
                              <div className="text-3xl font-bold text-orange-600 mb-2">{formData.nombreFlightcases}</div>
                              <div className="text-gray-700 font-semibold mb-1">Flightcases</div>
                              <div className="text-sm text-gray-500">{formData.typeConditionnementTexte}</div>
                            </>
                          )}
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

                    {formData.solutionsDalles && formData.typeInstallation === 'mobile' ? (
                      <div className="mt-6 space-y-4">
                        <h4 className="font-semibold text-gray-800 text-center">Options de configuration des dalles</h4>
                        {formData.solutionsDalles.map((solution, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50">
                            <h5 className="font-semibold text-gray-700 mb-2">{solution.nom}</h5>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <p>Nombre de dalles: {solution.nombreDalles}</p>
                              <p>Surface réelle: {solution.surfaceReelle.toFixed(2)} m²</p>
                              {solution.configuration && solution.configuration.map((config, i) => (
                                <p key={i} className="col-span-2">
                                  • {config.quantite} × {config.type} ({config.disposition})
                                </p>
                              ))}
                              {solution.details && solution.details.map((detail, i) => (
                                <p key={i} className="col-span-2 text-xs italic">→ {detail}</p>
                              ))}
                              {solution.hauteurReelle && (
                                <p className="col-span-2">Dimensions: {solution.largeurReelle.toFixed(2)}m × {solution.hauteurReelle.toFixed(2)}m</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : formData.surfaceReelleEcran && formData.surfaceCalculee && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50">
                        <div className="text-center">
                          <h4 className="font-semibold text-gray-800 mb-2">Dimensions réelles de l'écran</h4>
                          <div className="text-sm text-gray-600">
                            <p>Surface demandée: {formData.surfaceCalculee.toFixed(2)} m²</p>
                            <p>Surface réelle: {formData.surfaceReelleEcran.toFixed(2)} m²</p>
                            <p>Dimensions réelles: {(formData.dallesLargeur * formData.formatDalle.largeur).toFixed(2)}m × {(formData.dallesHauteur * formData.formatDalle.hauteur).toFixed(2)}m</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200/50">
                      <div className="flex items-start">
                        <span className="text-2xl mr-4">⚠️</span>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">Note importante</h4>
                          <p className="text-gray-700">Ces calculs sont des estimations basées sur des dalles standards (500×500mm ou 500×1000mm). La taille exacte des dalles et les spécifications finales seront confirmées par le devis du fournisseur chinois. Le pitch (P3.9, P6, etc.) indique l'espacement entre les pixels, pas la taille des dalles.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}