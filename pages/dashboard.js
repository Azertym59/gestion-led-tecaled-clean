import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push('/login')
      }
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-tech flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Dashboard - Gestion LED ERP</title>
        <meta name="description" content="Dashboard intelligent pour la gestion d'écrans LED" />
      </Head>

      <div className="min-h-screen bg-tech">
      {/* Header tech */}
<header className="header-tech">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-6">
      <div className="flex items-center">
        <div className="flex items-center space-x-6">
          <img 
            src="https://www.tecaled.fr/Logos/Logo%20rectangle%20V2.png"
            alt="TecaLED Logo"
            className="h-16 w-auto object-contain drop-shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">
              Gestion LED
            </h1>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className="text-lg font-semibold text-white">
            {user?.prenom} {user?.nom}
          </p>
          <p className="text-sm text-white/70 capitalize font-medium">
            {user?.role}
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-white/20 hover:bg-red-500/80 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold backdrop-blur-sm border border-white/30 hover:border-red-400 transform hover:scale-105"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </div>
</header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="animate-slideInUp">
            {/* Section d'accueil */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Bienvenue sur votre ERP
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Gérez vos projets d'écrans LED avec intelligence et efficacité
              </p>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-2xl">📈</span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Projets Actifs</p>
                    <p className="text-white text-2xl font-bold">12</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">En Attente</p>
                    <p className="text-white text-2xl font-bold">5</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-2xl">✅</span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Terminés</p>
                    <p className="text-white text-2xl font-bold">28</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards principales */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Card Commercial */}
  {user?.role === 'commercial' && (
    <div className="card-tech group hover-glow animate-float flex flex-col">
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex items-center mb-6">
          <div className="icon-tech icon-gradient-1 mr-4">
            <span className="text-white">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            Nouvelle Demande
          </h3>
        </div>
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          Créer une nouvelle demande client avec formulaire intelligent et calculs automatiques
        </p>
        <div className="space-y-3 mb-8 flex-grow">
          <div className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
            <span>Coordonnées client automatisées</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            <span>Calculs techniques intelligents</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
            <span>Envoi automatique fournisseurs</span>
          </div>
        </div>
        <button 
          onClick={() => router.push('/nouvelle-demande')}
          className="btn-primary w-full text-lg py-4 mt-auto"
        >
          Créer une demande
        </button>
      </div>
    </div>
  )}

  {/* Cards Admin */}
  {user?.role === 'admin' && (
    <>
      <div className="card-tech group hover-glow animate-float flex flex-col">
        <div className="p-8 flex-grow flex flex-col">
          <div className="flex items-center mb-6">
            <div className="icon-tech icon-gradient-1 mr-4">
              <span className="text-white">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              Nouvelle Demande
            </h3>
          </div>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            Créer une nouvelle demande client avec accès administrateur complet
          </p>
          <div className="space-y-3 mb-8 flex-grow">
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              <span>Accès administrateur</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              <span>Validation avancée</span>
            </div>
          </div>
          <button 
            onClick={() => router.push('/nouvelle-demande')}
            className="btn-primary w-full text-lg py-4 mt-auto"
          >
            Créer une demande
          </button>
        </div>
      </div>
      
      <div className="card-tech group hover-glow-cyan animate-float flex flex-col" style={{animationDelay: '0.2s'}}>
        <div className="p-8 flex-grow flex flex-col">
          <div className="flex items-center mb-6">
            <div className="icon-tech icon-gradient-2 mr-4">
              <span className="text-white">👥</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              Gestion Utilisateurs
            </h3>
          </div>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            Gérer les commerciaux, fournisseurs et transitaires du système
          </p>
          <div className="space-y-3 mb-8 flex-grow">
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
              <span>Gestion des rôles</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <span>Permissions avancées</span>
            </div>
          </div>
          <button className="btn-secondary w-full text-lg py-4 mt-auto">
            Gérer les utilisateurs
          </button>
        </div>
      </div>
    </>
  )}

  {/* Card commune - Mes Projets */}
  <div className="card-tech group hover-glow-purple animate-float flex flex-col" style={{animationDelay: '0.4s'}}>
    <div className="p-8 flex-grow flex flex-col">
      <div className="flex items-center mb-6">
        <div className="icon-tech icon-gradient-3 mr-4">
          <span className="text-white">📊</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">
          Mes Projets
        </h3>
      </div>
      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
        Voir tous mes projets en cours, terminés et leurs statuts détaillés
      </p>
      <div className="space-y-3 mb-8 flex-grow">
        <div className="flex items-center text-gray-600">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
          <span>Tableau de bord interactif</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
          <span>Suivi en temps réel</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
          <span>Historique complet</span>
        </div>
      </div>
      <button className="btn-accent w-full text-lg py-4 mt-auto">
        Voir les projets
      </button>
    </div>
  </div>

  {/* Card Statistiques */}
  <div className="card-tech group hover-glow animate-float flex flex-col" style={{animationDelay: '0.6s'}}>
    <div className="p-8 flex-grow flex flex-col">
      <div className="flex items-center mb-6">
        <div className="icon-tech icon-gradient-4 mr-4">
          <span className="text-white">📈</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">
          Analytics
        </h3>
      </div>
      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
        Analysez vos performances et optimisez votre activité
      </p>
      <div className="space-y-3 mb-8 flex-grow">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Taux de conversion</span>
          <span className="font-bold text-green-600">85%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Délai moyen</span>
          <span className="font-bold text-blue-600">12j</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Satisfaction</span>
          <span className="font-bold text-purple-600">4.8/5</span>
        </div>
      </div>
      <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 w-full text-lg mt-auto">
        Voir les statistiques
      </button>
    </div>
  </div>
</div>

            {/* Section activité récente */}
            <div className="mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Activité récente</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-white/10">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-green-400">✅</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Projet SARL-MARTIN terminé</p>
                        <p className="text-white/60 text-sm">Il y a 2 heures</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-medium">Succès</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-white/10">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-blue-400">📝</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Nouvelle demande créée</p>
                        <p className="text-white/60 text-sm">Il y a 5 heures</p>
                      </div>
                    </div>
                    <span className="text-blue-400 font-medium">En cours</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-purple-400">📊</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Rapport mensuel généré</p>
                        <p className="text-white/60 text-sm">Il y a 1 jour</p>
                      </div>
                    </div>
                    <span className="text-purple-400 font-medium">Terminé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}