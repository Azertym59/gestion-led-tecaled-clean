import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🔍 Tentative de connexion:', email)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      console.log('📡 Réponse API status:', response.status)
      const data = await response.json()
      console.log('📡 Données reçues:', data)

      if (response.ok) {
        console.log('✅ Connexion réussie')
        
        // CORRECTION : Sauvegarder dans localStorage
        if (data.token && data.user) {
          console.log('💾 Sauvegarde token et user...')
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          
          // Vérification
          console.log('✅ Token sauvé:', localStorage.getItem('token'))
          console.log('✅ User sauvé:', localStorage.getItem('user'))
          
          router.push('/dashboard')
        } else {
          // Si l'API ne renvoie pas token/user, créer des données par défaut
          console.log('⚠️ Pas de token/user, création données par défaut...')
          
          // Déterminer le rôle selon l'email
          let role = 'commercial'
          if (email === 'admin@tecaled.fr') role = 'admin'
          else if (email === 'fournisseur@tecaled.fr') role = 'fournisseur'
          
          const userData = {
            id: 1,
            email: email,
            role: role,
            nom: role === 'admin' ? 'Admin' : role === 'commercial' ? 'Commercial' : 'Fournisseur',
            prenom: 'TecaLED'
          }
          
          const token = `token_${Date.now()}`
          
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(userData))
          
          console.log('✅ Données créées:', userData)
          router.push('/dashboard')
        }
      } else {
        console.log('❌ Erreur API:', data)
        setError(data.message || 'Erreur de connexion')
      }
    } catch (err) {
      console.error('❌ Erreur:', err)
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Connexion - TecaLED Gestion</title>
      </Head>

      <div className="min-h-screen bg-tech flex flex-col justify-center">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 max-w-md mx-auto px-4 w-full">
          {/* Logo et titre */}
          <div className="text-center mb-12">
            <img 
              src="https://www.tecaled.fr/Logos/Logo%20rectangle%20V2.png"
              alt="TecaLED Logo"
              className="h-16 w-auto object-contain mx-auto mb-8 drop-shadow-2xl animate-float"
            />
            <h1 className="text-4xl font-bold text-white mb-2">
              Connexion
            </h1>
            <p className="text-white/70 text-lg">
              Accédez à votre espace de gestion
            </p>
          </div>

          {/* Formulaire de connexion */}
          <div className="card-tech p-8 animate-slideInUp">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email professionnel
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-tech"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-tech"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center backdrop-blur-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Connexion en cours...
                  </div>
                ) : 'Se connecter'}
              </button>
            </form>

            {/* Comptes de test */}
            <div className="mt-8 pt-8 border-t border-gray-200/20">
              <p className="text-center text-sm font-medium text-gray-600 mb-4">
                Comptes de démonstration :
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                  <span className="text-gray-600 font-medium">Administrateur</span>
                  <span className="text-gray-800 font-mono">admin@tecaled.fr</span>
                </div>
                <div className="flex justify-between items-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                  <span className="text-gray-600 font-medium">Commercial</span>
                  <span className="text-gray-800 font-mono">commercial@tecaled.fr</span>
                </div>
                <div className="flex justify-between items-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                  <span className="text-gray-600 font-medium">Fournisseur</span>
                  <span className="text-gray-800 font-mono">fournisseur@tecaled.fr</span>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                Mot de passe : <span className="font-mono bg-gray-100 px-2 py-1 rounded">password</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/50 text-sm">
              © 2025 TecaLED - Gestion intelligente d'écrans LED
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}