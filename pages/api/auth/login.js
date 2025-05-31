import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Utilisateurs de test (en attendant la vraie BDD)
const users = [
  {
    id: 1,
    email: 'admin@tecaled.fr',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    nom: 'Admin',
    prenom: 'Système'
  },
  {
    id: 2,
    email: 'commercial@tecaled.fr',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'commercial',
    nom: 'Dupont',
    prenom: 'Jean'
  },
  {
    id: 3,
    email: 'fournisseur@tecaled.fr',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'fournisseur',
    nom: 'Chen',
    prenom: 'Li'
  }
]

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-temporaire-123'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' })
  }

  try {
    // Trouver l'utilisateur
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }

    // Vérifier le mot de passe
    const passwordValid = await bcrypt.compare(password, user.password)
    
    if (!passwordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }

    // Créer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        nom: user.nom,
        prenom: user.prenom
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Définir le cookie httpOnly
    res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`)

    // Réponse de succès
    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom
      }
    })

  } catch (error) {
    console.error('Erreur login:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}