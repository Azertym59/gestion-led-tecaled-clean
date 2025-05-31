// pages/api/auth.js
export default function handler(req, res) {
  console.log('🔍 API Auth appelée:', req.method, req.body)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { email, password } = req.body

  // Comptes de test
  const comptes = [
    {
      id: 1,
      email: 'admin@tecaled.fr',
      password: 'password',
      role: 'admin',
      nom: 'Admin',
      prenom: 'TecaLED'
    },
    {
      id: 2,
      email: 'commercial@tecaled.fr', 
      password: 'password',
      role: 'commercial',
      nom: 'Commercial',
      prenom: 'TecaLED'
    },
    {
      id: 3,
      email: 'fournisseur@tecaled.fr',
      password: 'password', 
      role: 'fournisseur',
      nom: 'Fournisseur',
      prenom: 'Test'
    }
  ]

  console.log('🔍 Recherche utilisateur pour:', email)
  
  // Vérifier l'utilisateur
  const utilisateur = comptes.find(u => u.email === email && u.password === password)
  
  if (!utilisateur) {
    console.log('❌ Utilisateur non trouvé')
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  }

  console.log('✅ Utilisateur trouvé:', utilisateur)

  // Générer un token simple (pour les tests)
  const token = `token_${utilisateur.id}_${Date.now()}`
  
  const response = {
    token: token,
    user: {
      id: utilisateur.id,
      email: utilisateur.email,
      role: utilisateur.role,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom
    }
  }

  console.log('🚀 Réponse envoyée:', response)
  
  res.status(200).json(response)
}