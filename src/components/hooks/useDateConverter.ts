import { useEffect, useState } from "react"
import { Message } from "../../interfaces/Message"

interface DateObj {
  hh: string | number
  mm: string | number
  ss: string | number
  day: string,
  curDay: string
}

export const useDateConverter = () => {
  const dateConverter = (timestamp: number) => {
    const date = new Date(timestamp)
    const currentDate = new Date(Date.now())

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const dateObj: DateObj = {
      hh: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
      mm: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
      ss: date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
      day: days[date.getDay()],
      curDay: days[currentDate.getDay()]
    }

    return dateObj
  }

  return { dateConverter }
}