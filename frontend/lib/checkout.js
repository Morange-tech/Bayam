export const CITIES = [
  { value: 'douala', label: 'Douala' },
  { value: 'yaounde', label: 'Yaoundé' },
  { value: 'bafoussam', label: 'Bafoussam' },
  { value: 'bamenda', label: 'Bamenda' },
  { value: 'garoua', label: 'Garoua' },
  { value: 'maroua', label: 'Maroua' },
  { value: 'ngaoundere', label: 'Ngaoundéré' },
  { value: 'bertoua', label: 'Bertoua' },
  { value: 'ebolowa', label: 'Ebolowa' },
  { value: 'kribi', label: 'Kribi' },
  { value: 'limbe', label: 'Limbé' },
  { value: 'buea', label: 'Buéa' },
  { value: 'edea', label: 'Edéa' },
  { value: 'kumba', label: 'Kumba' },
  { value: 'dschang', label: 'Dschang' },
  { value: 'foumban', label: 'Foumban' },
  { value: 'nkongsamba', label: 'Nkongsamba' },
  { value: 'sangmelima', label: 'Sangmélima' },
  { value: 'kousseri', label: 'Kousséri' },
  { value: 'guider', label: 'Guider' },
  { value: 'kumbo', label: 'Kumbo' },
  { value: 'mbalmayo', label: 'Mbalmayo' },
  { value: 'bafang', label: 'Bafang' },
  { value: 'meiganga', label: 'Meiganga' },
]

export const DELIVERY_MODES = [
  { value: 'standard', label: 'Standard', duration: '3 à 5 jours', price: 2500 },
  { value: 'express', label: 'Express', duration: '24 à 48h', price: 5000 },
]

export function getDeliveryFee(deliveryMode) {
  return DELIVERY_MODES.find((mode) => mode.value === deliveryMode)?.price ?? 0
}

export function generateOrderId() {
  const date = new Date()
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
    date.getDate()
  ).padStart(2, '0')}`
  const randomPart = Math.floor(1000 + Math.random() * 9000)
  return `BYM-${datePart}-${randomPart}`
}
