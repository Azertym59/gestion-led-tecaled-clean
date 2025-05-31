import React from 'react'

// Composant de section uniforme pour le formulaire
export const FormSectionCard = ({ 
  title, 
  icon, 
  iconBg = 'bg-gradient-to-r from-indigo-500 to-purple-600',
  children, 
  className = '' 
}) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-6 ${className}`}>
      {title && (
        <div className="flex items-center mb-6">
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
            <span className="text-white text-2xl">{icon}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

// Composant de sous-section avec bordure subtile
export const SubSection = ({ title, children, className = '' }) => {
  return (
    <div className={`border-l-4 border-indigo-200 pl-6 py-2 ${className}`}>
      {title && (
        <h4 className="text-lg font-semibold text-gray-700 mb-4">{title}</h4>
      )}
      {children}
    </div>
  )
}

// Composant pour les options de garantie
export const GarantieOption = ({ 
  value, 
  title, 
  description, 
  features = [], 
  price, 
  checked, 
  onChange 
}) => {
  return (
    <label className={`block cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
      checked 
        ? 'border-indigo-500 bg-indigo-50/50' 
        : 'border-gray-200 hover:border-indigo-300 bg-white/50'
    }`}>
      <div className="flex items-start">
        <input
          type="radio"
          name="typeGarantie"
          value={value}
          checked={checked}
          onChange={onChange}
          className="mt-1 mr-4"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            {price && (
              <span className="text-lg font-bold text-indigo-600 ml-4">{price}</span>
            )}
          </div>
          {features.length > 0 && (
            <ul className="mt-3 space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </label>
  )
}

// Composant de champ avec icône
export const FieldWithIcon = ({ icon, children }) => {
  return (
    <div className="flex items-start space-x-3">
      <span className="text-gray-400 mt-2">{icon}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

// Grid responsive pour les champs
export const FieldGrid = ({ columns = 2, children, className = '' }) => {
  const gridClass = columns === 2 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
    : 'grid grid-cols-1 md:grid-cols-3 gap-6'
    
  return (
    <div className={`${gridClass} ${className}`}>
      {children}
    </div>
  )
}

export default {
  FormSectionCard,
  SubSection,
  GarantieOption,
  FieldWithIcon,
  FieldGrid
}