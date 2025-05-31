import React, { useState, useEffect } from 'react'

// Liste des pays avec indicatifs et formats
const countries = [
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', format: '0X XX XX XX XX', placeholder: '06 12 34 56 78' },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪', format: '0XXX XX XX XX', placeholder: '0470 12 34 56' },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭', format: '0XX XXX XX XX', placeholder: '079 123 45 67' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺', format: 'XXX XXX XXX', placeholder: '621 123 456' },
  { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪', format: '0XXX XXXXXXXX', placeholder: '0151 12345678' },
  { code: 'IT', name: 'Italie', dialCode: '+39', flag: '🇮🇹', format: 'XXX XXX XXXX', placeholder: '333 123 4567' },
  { code: 'ES', name: 'Espagne', dialCode: '+34', flag: '🇪🇸', format: 'XXX XXX XXX', placeholder: '612 345 678' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧', format: '0XXXX XXXXXX', placeholder: '07123 456789' },
  { code: 'NL', name: 'Pays-Bas', dialCode: '+31', flag: '🇳🇱', format: '06 XXXX XXXX', placeholder: '06 1234 5678' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', format: 'XXX XXX XXX', placeholder: '912 345 678' },
  { code: 'AT', name: 'Autriche', dialCode: '+43', flag: '🇦🇹', format: '0XXX XXXXXXX', placeholder: '0664 1234567' },
  { code: 'PL', name: 'Pologne', dialCode: '+48', flag: '🇵🇱', format: 'XXX XXX XXX', placeholder: '512 345 678' },
  { code: 'SE', name: 'Suède', dialCode: '+46', flag: '🇸🇪', format: '0XX XXX XX XX', placeholder: '070 123 45 67' },
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸', format: '(XXX) XXX-XXXX', placeholder: '(555) 123-4567' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', format: '(XXX) XXX-XXXX', placeholder: '(514) 123-4567' },
  { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦', format: '0XXX XX XX XX', placeholder: '0612 34 56 78' },
  { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳', format: 'XX XXX XXX', placeholder: '98 123 456' },
  { code: 'DZ', name: 'Algérie', dialCode: '+213', flag: '🇩🇿', format: '0XXX XX XX XX', placeholder: '0555 12 34 56' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳', format: 'XX XXX XX XX', placeholder: '77 123 45 67' },
  { code: 'CI', name: "Côte d'Ivoire", dialCode: '+225', flag: '🇨🇮', format: 'XX XX XX XX XX', placeholder: '07 12 34 56 78' },
  { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲', format: 'X XX XX XX XX', placeholder: '6 12 34 56 78' },
  { code: 'AE', name: 'Émirats A.U.', dialCode: '+971', flag: '🇦🇪', format: '0X XXX XXXX', placeholder: '050 123 4567' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', format: 'XXXX XXXX', placeholder: '3312 3456' },
  { code: 'SA', name: 'Arabie Saoudite', dialCode: '+966', flag: '🇸🇦', format: '0X XXX XXXX', placeholder: '050 123 4567' },
  { code: 'RO', name: 'Roumanie', dialCode: '+40', flag: '🇷🇴', format: '0XXX XXX XXX', placeholder: '0712 345 678' },
  { code: 'GR', name: 'Grèce', dialCode: '+30', flag: '🇬🇷', format: 'XXX XXX XXXX', placeholder: '691 234 5678' },
  { code: 'TR', name: 'Turquie', dialCode: '+90', flag: '🇹🇷', format: '0XXX XXX XX XX', placeholder: '0532 123 45 67' },
]

export const PhoneInput = ({ 
  label = 'Téléphone', 
  required = false, 
  value = '', 
  onChange, 
  className = '',
  containerClassName = '',
  defaultCountry = 'FR'
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find(c => c.code === defaultCountry) || countries[0]
  )
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showCountryList, setShowCountryList] = useState(false)
  const [searchCountry, setSearchCountry] = useState('')

  // Formatage du numéro selon le pays
  const formatPhoneNumber = (input, country) => {
    // Supprimer tous les caractères non numériques
    const cleaned = input.replace(/\D/g, '')
    
    if (!cleaned) return ''
    
    // Obtenir le format du pays
    const format = country.format
    let result = ''
    let digitIndex = 0
    
    // Parcourir le format et remplacer X par les chiffres
    for (let i = 0; i < format.length && digitIndex < cleaned.length; i++) {
      const char = format[i]
      if (char === 'X' || char === '0') {
        result += cleaned[digitIndex]
        digitIndex++
      } else {
        // Ajouter les caractères de formatage (espaces, tirets, parenthèses)
        result += char
      }
    }
    
    return result
  }

  // Formater le numéro complet avec indicatif
  const formatFullNumber = (localNumber, country) => {
    if (!localNumber) return ''
    
    // Pour certains pays, on ajoute (0) après l'indicatif
    const countriesWithZero = ['FR', 'BE', 'CH', 'DE', 'IT', 'NL', 'AT', 'MA', 'DZ']
    
    if (countriesWithZero.includes(country.code) && localNumber.startsWith('0')) {
      // Format: +33 (0)6 31 93 96 35
      const numberWithoutZero = localNumber.substring(1)
      return `${country.dialCode} (0)${numberWithoutZero}`
    } else {
      // Format standard: +1 (555) 123-4567
      return `${country.dialCode} ${localNumber}`
    }
  }

  // Gérer le changement de numéro
  const handlePhoneChange = (e) => {
    const input = e.target.value
    const formatted = formatPhoneNumber(input, selectedCountry)
    setPhoneNumber(formatted)
    
    // Appeler onChange avec le numéro complet formaté
    if (onChange) {
      const fullNumber = formatFullNumber(formatted, selectedCountry)
      onChange({
        target: {
          name: e.target.name || 'telephoneClient',
          value: fullNumber
        }
      })
    }
  }

  // Gérer la sélection du pays
  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setShowCountryList(false)
    setSearchCountry('')
    
    // Reformater le numéro existant avec le nouveau format
    if (phoneNumber) {
      const cleaned = phoneNumber.replace(/\D/g, '')
      const formatted = formatPhoneNumber(cleaned, country)
      setPhoneNumber(formatted)
      
      if (onChange) {
        const fullNumber = formatFullNumber(formatted, country)
        onChange({
          target: {
            name: 'telephoneClient',
            value: fullNumber
          }
        })
      }
    }
  }

  // Filtrer les pays selon la recherche
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
    country.dialCode.includes(searchCountry)
  )

  // Gérer le clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.phone-input-container')) {
        setShowCountryList(false)
      }
    }
    
    if (showCountryList) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showCountryList])

  // Parser la valeur initiale si elle existe
  useEffect(() => {
    if (value) {
      // Essayer d'extraire l'indicatif et le numéro
      // Format possible : +33 (0)6 31 93 96 35 ou +33 631939635
      const match = value.match(/^(\+\d+)\s*(\(0\))?(.*)$/)
      if (match) {
        const dialCode = match[1]
        const hasZero = match[2] === '(0)'
        let number = match[3].trim()
        
        // Si on a trouvé (0), on rajoute le 0 au début du numéro
        if (hasZero) {
          number = '0' + number
        }
        
        const country = countries.find(c => c.dialCode === dialCode)
        if (country) {
          setSelectedCountry(country)
          // Enlever tous les caractères non numériques puis reformater
          const cleaned = number.replace(/\D/g, '')
          setPhoneNumber(formatPhoneNumber(cleaned, country))
        }
      }
    }
  }, [value])

  return (
    <div className={`phone-input-container ${containerClassName}`}>
      {label && (
        <label className="block font-semibold text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      <div className="flex">
        {/* Sélecteur de pays */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCountryList(!showCountryList)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-l-lg hover:bg-white hover:border-indigo-300 transition-all duration-300 h-[2.5rem] group"
          >
            <span className="text-xl">{selectedCountry.flag}</span>
            <span className="text-sm font-semibold text-gray-700">{selectedCountry.dialCode}</span>
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showCountryList ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Liste des pays */}
          {showCountryList && (
            <div className="absolute z-50 mt-1 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-hidden">
              {/* Recherche */}
              <div className="p-3 border-b bg-gray-50">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un pays..."
                    value={searchCountry}
                    onChange={(e) => setSearchCountry(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Liste */}
              <div className="overflow-y-auto max-h-72">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors flex items-center justify-between group ${
                        selectedCountry.code === country.code ? 'bg-indigo-100 hover:bg-indigo-100' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{country.name}</p>
                          <p className="text-xs text-gray-500">{country.format}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-700">{country.dialCode}</span>
                        {selectedCountry.code === country.code && (
                          <svg className="w-5 h-5 text-indigo-600 inline-block ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Aucun pays trouvé
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Input téléphone SANS drapeau */}
        <input
          type="tel"
          name="telephoneClient"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={selectedCountry.placeholder}
          className={`flex-1 px-3 py-2 bg-white/80 backdrop-blur-sm border border-l-0 border-gray-200/50 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white transition-all duration-300 placeholder-gray-400 ${className}`}
          style={{ height: '2.5rem' }}
        />
      </div>
      
      {/* Indicateur de format et aperçu en temps réel */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
          Format attendu : <span className="font-mono text-gray-600">{selectedCountry.format}</span>
        </p>
        {phoneNumber && (
          <div className="flex items-center space-x-2 animate-fadeIn">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-green-600 font-semibold">
              {formatFullNumber(phoneNumber, selectedCountry)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhoneInput