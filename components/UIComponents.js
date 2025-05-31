import React from 'react'
import PhoneInput from './PhoneInput'

// ========================================
// COMPOSANTS DE BASE RÉUTILISABLES
// ========================================

// Card principale - utilisée partout
export const Card = ({ children, className = '', animate = true, delay = 0 }) => {
  const animationClass = animate ? 'animate-slideInUp' : ''
  const animationStyle = delay > 0 ? { animationDelay: `${delay}s` } : {}
  
  return (
    <div 
      className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/95 transition-all duration-300 ${animationClass} ${className}`}
      style={animationStyle}
    >
      {children}
    </div>
  )
}

// Card avec effet hover spécial
export const CardHover = ({ children, className = '', hoverEffect = 'indigo', delay = 0 }) => {
  const hoverClasses = {
    indigo: 'hover-glow',
    cyan: 'hover-glow-cyan',
    purple: 'hover-glow-purple'
  }
  
  return (
    <div 
      className={`card-hover group ${hoverClasses[hoverEffect]} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

// Header de page uniforme
export const PageHeader = ({ title, subtitle, icon, backButton, rightContent }) => {
  return (
    <header className="header-tech relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-6">
            {backButton && (
              <>
                {backButton}
                <div className="h-8 w-px bg-white/20"></div>
              </>
            )}
            <h1 className="text-3xl font-bold text-white flex items-center">
              {icon && <span className="text-4xl mr-3">{icon}</span>}
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/70 text-lg ml-4">{subtitle}</p>
            )}
          </div>
          {rightContent && (
            <div className="flex items-center space-x-4">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// Boutons uniformes
export const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  onClick, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white',
    secondary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white',
    accent: 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white',
    warning: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white',
    outline: 'bg-white/20 border border-gray-300/50 text-gray-700 hover:bg-white/30 backdrop-blur-sm',
    ghost: 'bg-white/20 hover:bg-red-500/80 text-white backdrop-blur-sm border border-white/30 hover:border-red-400'
  }
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3',
    large: 'px-8 py-4 text-lg'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Input uniforme
export const Input = ({ 
  label, 
  required = false, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block font-semibold text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
      )}
      <input 
        className={`w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${className}`}
        {...props}
      />
    </div>
  )
}

// Select uniforme
export const Select = ({ 
  label, 
  required = false, 
  className = '', 
  containerClassName = '',
  children,
  ...props 
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block font-semibold text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
      )}
      <select 
        className={`w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white transition-all duration-300 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

// Section de formulaire
export const FormSection = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`border-b border-gray-200/50 pb-8 mb-8 last:border-b-0 last:mb-0 last:pb-0 ${className}`}>
      {title && (
        <div className="flex items-center mb-6 pb-3 border-b-2 border-indigo-100">
          {icon && (
            <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {icon}
            </svg>
          )}
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="space-y-5">
        {children}
      </div>
    </div>
  )
}

// Stat Card pour dashboard
export const StatCard = ({ icon, iconBg, label, value, subtext, className = '' }) => {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${className}`}>
      <div className="flex items-center">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mr-4`}>
          <span className="text-white text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-white/70 text-sm font-medium">{label}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
          {subtext && <p className="text-white/60 text-xs mt-1">{subtext}</p>}
        </div>
      </div>
    </div>
  )
}

// Feature Card pour dashboard
export const FeatureCard = ({ 
  icon, 
  iconGradient, 
  title, 
  description, 
  features = [], 
  buttonText, 
  buttonVariant = 'primary',
  onButtonClick,
  className = '' 
}) => {
  return (
    <CardHover className={className}>
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex items-center mb-6">
          <div className={`icon-tech ${iconGradient} mr-4`}>
            <span className="text-white">{icon}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          {description}
        </p>
        
        {features.length > 0 && (
          <div className="space-y-3 mb-8 flex-grow">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-600">
                <span className={`w-2 h-2 ${feature.color || 'bg-indigo-500'} rounded-full mr-3`}></span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        )}
        
        {buttonText && (
          <Button 
            variant={buttonVariant} 
            size="large" 
            onClick={onButtonClick}
            className="w-full mt-auto"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </CardHover>
  )
}

// Progress Step
export const ProgressStep = ({ stepNumber, label, isActive, isCompleted }) => {
  const bgClass = isActive || isCompleted 
    ? isActive 
      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
    : 'bg-white/10 text-white/60 backdrop-blur-sm'
    
  return (
    <span className={`flex items-center px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 ${bgClass}`}>
      <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
        isActive || isCompleted ? 'bg-white/20' : 'bg-white/10'
      }`}>
        {stepNumber}
      </span>
      {label}
    </span>
  )
}

// Activity Item
export const ActivityItem = ({ icon, iconBg, title, time, status, statusColor }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/10 last:border-b-0">
      <div className="flex items-center">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mr-4`}>
          <span className={statusColor}>{icon}</span>
        </div>
        <div>
          <p className="text-white font-medium">{title}</p>
          <p className="text-white/60 text-sm">{time}</p>
        </div>
      </div>
      {status && (
        <span className={`${statusColor} font-medium`}>{status}</span>
      )}
    </div>
  )
}

// Grid Layout
export const GridLayout = ({ columns = 3, gap = 8, children, className = '' }) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }
  
  return (
    <div className={`grid ${colClasses[columns]} gap-${gap} ${className}`}>
      {children}
    </div>
  )
}

// Container
export const Container = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

// Section Container
export const Section = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
          )}
          {subtitle && (
            <p className="text-xl text-white/80 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// Loading State
export const LoadingScreen = ({ message = "Chargement de votre espace..." }) => {
  return (
    <div className="min-h-screen bg-tech flex items-center justify-center">
      <div className="text-center">
        <img 
          src="https://www.tecaled.fr/Logos/Logo%20rectangle%20V2.png"
          alt="TecaLED Logo"
          className="h-20 w-auto object-contain mx-auto mb-6 animate-pulse drop-shadow-lg"
        />
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}

// Export du composant PhoneInput
export { PhoneInput }

export default {
  Card,
  CardHover,
  PageHeader,
  Button,
  Input,
  Select,
  PhoneInput,
  FormSection,
  StatCard,
  FeatureCard,
  ProgressStep,
  ActivityItem,
  GridLayout,
  Container,
  Section,
  LoadingScreen
}