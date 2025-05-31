# Guide des Composants UI Uniformes

## 🎨 Principe de base
Tous les composants sont centralisés dans `components/UIComponents.js` pour garantir une apparence uniforme dans toute l'application.

## 📦 Import des composants
```javascript
import { Button, Card, Input, Select } from '../components/UIComponents'
```

## 🔧 Composants disponibles

### 1. Button
```javascript
<Button variant="primary">Cliquez-moi</Button>
<Button variant="secondary" size="large">Grand bouton</Button>
<Button variant="danger" size="small">Supprimer</Button>
```

**Variantes disponibles :**
- `primary` (indigo/purple)
- `secondary` (cyan/blue)
- `accent` (violet/purple)
- `danger` (rouge)
- `success` (vert)
- `warning` (orange/rouge)
- `outline` (bordure)
- `ghost` (transparent)

**Tailles :** `small`, `medium` (défaut), `large`

### 2. Card
```javascript
<Card className="p-8">
  <h2>Titre de la card</h2>
  <p>Contenu...</p>
</Card>

<CardHover hoverEffect="cyan" delay={0.2}>
  <p>Card avec effet hover</p>
</CardHover>
```

### 3. Input & Select
```javascript
<Input 
  label="Email" 
  type="email" 
  required 
  placeholder="exemple@email.com"
/>

<Select label="Type d'écran" required>
  <option value="standard">Standard</option>
  <option value="cube">Cube LED</option>
</Select>
```

### 4. PageHeader
```javascript
<PageHeader
  title="Mon Dashboard"
  icon="📊"
  subtitle="Gérez vos projets"
  backButton={<button>← Retour</button>}
  rightContent={<Button>Déconnexion</Button>}
/>
```

### 5. StatCard
```javascript
<StatCard
  icon="📈"
  iconBg="bg-gradient-to-r from-green-400 to-green-600"
  label="Projets Actifs"
  value="12"
  subtext="Cette semaine"
/>
```

### 6. FeatureCard
```javascript
<FeatureCard
  icon="📝"
  iconGradient="icon-gradient-1"
  title="Nouvelle Demande"
  description="Créer une demande client"
  features={[
    { text: "Calculs automatiques", color: "bg-indigo-500" },
    { text: "Envoi fournisseurs", color: "bg-purple-500" }
  ]}
  buttonText="Créer"
  buttonVariant="primary"
  onButtonClick={() => router.push('/nouvelle-demande')}
/>
```

### 7. FormSection
```javascript
<FormSection title="Informations Client" icon={<path d="..." />}>
  <Input label="Nom" required />
  <Input label="Email" type="email" required />
</FormSection>
```

### 8. GridLayout
```javascript
<GridLayout columns={3} gap={8}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</GridLayout>
```

## 🎯 Classes CSS uniformes

### Boutons
```html
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary btn-lg">Large Secondary</button>
```

### Cards
```html
<div className="card p-6">Card basique</div>
<div className="card-hover">Card avec hover effect</div>
<div className="stat-card">Statistique</div>
```

### Grilles
```html
<div className="grid-responsive-3">
  <!-- 3 colonnes sur desktop, responsive -->
</div>
```

### Inputs
```html
<input className="input" />
<select className="select">...</select>
<label className="label">Mon label</label>
```

## 🚀 Exemple complet
```javascript
import { 
  PageHeader, 
  Container, 
  Section, 
  GridLayout, 
  FeatureCard, 
  Button 
} from '../components/UIComponents'

export default function MaPage() {
  return (
    <div className="min-h-screen bg-tech">
      <PageHeader title="Ma Page" icon="🎯" />
      
      <Container>
        <Section title="Mes Fonctionnalités">
          <GridLayout columns={3}>
            <FeatureCard
              icon="📊"
              iconGradient="icon-gradient-1"
              title="Analytics"
              description="Analysez vos données"
              buttonText="Voir plus"
              buttonVariant="primary"
            />
            {/* Autres cards... */}
          </GridLayout>
        </Section>
      </Container>
    </div>
  )
}
```

## ✅ Avantages
- **Cohérence** : Même apparence partout
- **Maintenance** : Un seul fichier à modifier
- **Réutilisabilité** : Import simple
- **Personnalisation** : Props flexibles
- **Responsive** : Adapté mobile/desktop