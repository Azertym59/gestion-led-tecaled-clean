export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }

  try {
    // Supprimer le cookie d'authentification
    res.setHeader('Set-Cookie', 'auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax')
    
    res.status(200).json({ message: 'Déconnexion réussie' })
  } catch (error) {
    console.error('Erreur logout:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}