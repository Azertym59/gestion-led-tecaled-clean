import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  PageHeader,
  Button,
  StatCard,
  FeatureCard,
  ActivityItem,
  GridLayout,
  Container,
  Section,
  LoadingScreen,
  Card
} from '../components/UIComponents'

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
    return <LoadingScreen />
  }

  return (
    <div>
      <Head>
        <title>Dashboard - Gestion LED ERP</title>
        <meta name="description" content="Dashboard intelligent pour la gestion d'écrans LED" />
      </Head>

      <div className="min-h-screen bg-tech">
        {/* Header avec logo TecaLED */}
        <PageHeader
          title={
            <div className="flex items-center space-x-6">
              <img 
                src="https://www.tecaled.fr/Logos/Logo%20rectangle%20V2.png"
                alt="TecaLED Logo"
                className="h-16 w-auto object-contain drop-shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">Gestion LED</h1>
              </div>
            </div>
          }
          rightContent={
            <>
              <div className="text-right">
                <p className="text-lg font-semibold text-white">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-sm text-white/70 capitalize font-medium">
                  {user?.role}
                </p>
              </div>
              <Button variant="ghost" onClick={logout}>
                Déconnexion
              </Button>
            </>
          }
        />

        {/* Main Content */}
        <main className="py-12">
          <Container>
            <div className="animate-slideInUp">
              {/* Section d'accueil */}
              <Section
                title="Bienvenue sur votre ERP"
                subtitle="Gérez vos projets d'écrans LED avec intelligence et efficacité"
              />

              {/* Stats rapides */}
              <GridLayout columns={3} className="mb-12">
                <StatCard
                  icon="📈"
                  iconBg="bg-gradient-to-r from-green-400 to-green-600"
                  label="Projets Actifs"
                  value="12"
                />
                <StatCard
                  icon="🎯"
                  iconBg="bg-gradient-to-r from-blue-400 to-blue-600"
                  label="En Attente"
                  value="5"
                />
                <StatCard
                  icon="✅"
                  iconBg="bg-gradient-to-r from-purple-400 to-purple-600"
                  label="Terminés"
                  value="28"
                />
              </GridLayout>

              {/* Cards principales */}
              <GridLayout columns={3}>
                {/* Card Commercial */}
                {user?.role === 'commercial' && (
                  <FeatureCard
                    icon="📝"
                    iconGradient="icon-gradient-1"
                    title="Nouvelle Demande"
                    description="Créer une nouvelle demande client avec formulaire intelligent et calculs automatiques"
                    features={[
                      { text: "Coordonnées client automatisées", color: "bg-indigo-500" },
                      { text: "Calculs techniques intelligents", color: "bg-purple-500" },
                      { text: "Envoi automatique fournisseurs", color: "bg-cyan-500" }
                    ]}
                    buttonText="Créer une demande"
                    onButtonClick={() => router.push('/nouvelle-demande')}
                  />
                )}

                {/* Cards Admin */}
                {user?.role === 'admin' && (
                  <>
                    <FeatureCard
                      icon="📝"
                      iconGradient="icon-gradient-1"
                      title="Nouvelle Demande"
                      description="Créer une nouvelle demande client avec accès administrateur complet"
                      features={[
                        { text: "Accès administrateur", color: "bg-indigo-500" },
                        { text: "Validation avancée", color: "bg-purple-500" }
                      ]}
                      buttonText="Créer une demande"
                      onButtonClick={() => router.push('/nouvelle-demande')}
                    />
                    
                    <FeatureCard
                      icon="👥"
                      iconGradient="icon-gradient-2"
                      title="Gestion Utilisateurs"
                      description="Gérer les commerciaux, fournisseurs et transitaires du système"
                      features={[
                        { text: "Gestion des rôles", color: "bg-cyan-500" },
                        { text: "Permissions avancées", color: "bg-blue-500" }
                      ]}
                      buttonText="Gérer les utilisateurs"
                      buttonVariant="secondary"
                      delay={0.2}
                    />
                  </>
                )}

                {/* Card commune - Mes Projets */}
                <FeatureCard
                  icon="📊"
                  iconGradient="icon-gradient-3"
                  title="Mes Projets"
                  description="Voir tous mes projets en cours, terminés et leurs statuts détaillés"
                  features={[
                    { text: "Tableau de bord interactif", color: "bg-green-500" },
                    { text: "Suivi en temps réel", color: "bg-yellow-500" },
                    { text: "Historique complet", color: "bg-purple-500" }
                  ]}
                  buttonText="Voir les projets"
                  buttonVariant="accent"
                  delay={0.4}
                />

                {/* Card Statistiques */}
                <FeatureCard
                  icon="📈"
                  iconGradient="icon-gradient-4"
                  title="Analytics"
                  description="Analysez vos performances et optimisez votre activité"
                  features={[
                    { text: "Taux de conversion: 85%", color: "bg-green-500" },
                    { text: "Délai moyen: 12j", color: "bg-blue-500" },
                    { text: "Satisfaction: 4.8/5", color: "bg-purple-500" }
                  ]}
                  buttonText="Voir les statistiques"
                  buttonVariant="warning"
                  delay={0.6}
                />
              </GridLayout>

              {/* Section activité récente */}
              <div className="mt-12">
                <Card className="bg-white/10 backdrop-blur-sm p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">Activité récente</h3>
                  <div className="space-y-4">
                    <ActivityItem
                      icon="✅"
                      iconBg="bg-green-500/20"
                      title="Projet SARL-MARTIN terminé"
                      time="Il y a 2 heures"
                      status="Succès"
                      statusColor="text-green-400"
                    />
                    <ActivityItem
                      icon="📝"
                      iconBg="bg-blue-500/20"
                      title="Nouvelle demande créée"
                      time="Il y a 5 heures"
                      status="En cours"
                      statusColor="text-blue-400"
                    />
                    <ActivityItem
                      icon="📊"
                      iconBg="bg-purple-500/20"
                      title="Rapport mensuel généré"
                      time="Il y a 1 jour"
                      status="Terminé"
                      statusColor="text-purple-400"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </div>
  )
}