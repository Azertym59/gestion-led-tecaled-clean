export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  try {
    const donnees = req.body
    
    // URL du webhook n8n (à remplacer par votre URL réelle)
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/calculer-specifications'
    
    // Envoyer les données à n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donnees)
    })
    
    if (!response.ok) {
      throw new Error(`Erreur n8n: ${response.status}`)
    }
    
    const resultats = await response.json()
    
    // Retourner les résultats calculés par n8n
    res.status(200).json(resultats)
    
  } catch (error) {
    console.error('Erreur lors de la communication avec n8n:', error)
    res.status(500).json({ 
      error: 'Erreur lors du calcul des spécifications',
      details: error.message 
    })
  }
}