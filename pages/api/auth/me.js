import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-temporaire-123'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }

  try {
    // Récupérer le token depuis les cookies
    const token = req.cookies['auth-token']

    if (!token) {
      return res.status(401).json({ message: 'Non authentifié' })
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Retourner les infos utilisateur
    res.status(200).json({
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      nom: decoded.nom,
      prenom: decoded.prenom
    })

  } catch (error) {
    console.error('Erreur vérification token:', error)
    res.status(401).json({ message: 'Token invalide' })
  }
}