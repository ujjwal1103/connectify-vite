import { type ClassValue, clsx } from 'clsx'
import moment from 'moment'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const readFileAsDataURL = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

export function blobToFile(blob: Blob, fileName: string, fileType: string) {
  const options = { type: fileType }
  const file = new File([blob], fileName, options)
  return file
}

export const tranformUrl = (url = '', width = 100) => {
  if (!url) return null
  const newUrl = url.replace('upload/', `upload/dpr_auto/w_${width}/`)
  return newUrl
}

export const formatInstagramDate = (dateString: string) => {
  const date = moment(dateString)
  const now = moment()

  const duration = moment.duration(now.diff(date))
  const seconds = duration.asSeconds()
  const minutes = duration.asMinutes()
  const hours = duration.asHours()
  const days = duration.asDays()
  const weeks = duration.asWeeks()

  if (seconds < 60) {
    return `${Math.floor(seconds)}s`
  } else if (minutes < 60) {
    return `${Math.floor(minutes)}m`
  } else if (hours < 24) {
    return `${Math.floor(hours)}hr`
  } else if (days < 7) {
    return `${Math.floor(days)}d`
  } else {
    return `${Math.floor(weeks)}w`
  }
}

export const formatDate = (dateString: string, showToday = false) => {
  const date = moment(dateString)
  const now = moment()

  // Check if the date is today's date
  if (date.isSame(now, 'day')) {
    return showToday ? 'Today' : date.format('HH:mm a')
  }

  // Check if the date is yesterday's date
  if (date.isSame(now.subtract(1, 'days'), 'day')) {
    return 'Yesterday'
  }

  // Check if the date is within the current week
  if (date.isSame(now, 'week')) {
    return date.format('dddd') // Returns the day name
  }

  // Default case: return date in dd/mm/yyyy format
  return date.format('DD/MM/YYYY')
}

export function getReadableTime(adate: string) {
  // if (!(date instanceof Date)) {
  //   return "Invalid Date";
  // }
  const date = new Date(adate)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const amOrPm = hours >= 12 ? 'PM' : 'AM'

  // Convert 24-hour time to 12-hour time
  const formattedHours = hours % 12 || 12

  // Add leading zeros to minutes if needed
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

  return `${formattedHours}:${formattedMinutes} ${amOrPm}`
}

function showNotification() {
  const notification = new Notification('Hello, World!', {
    body: 'This is a browser notification.',
    icon: 'https://example.com/icon.png', // Optional icon
  })

  // Optional: Handle notification click
  notification.onclick = () => {
    window.open('https://example.com')
  }
}

export const createNotification = (data: any) => {
  if (Notification.permission === 'granted') {
    showNotification()
  } else if (Notification.permission !== 'denied') {
    // Otherwise, we need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        showNotification()
      }
    })
  }
}
