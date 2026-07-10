import type * as React from "react"
import {
  Books,
  Buildings,
  CalendarDots,
  CalendarPlus,
  ChartBar,
  ChatCircleDots,
  ClipboardText,
  CreditCard,
  CurrencyCircleDollar,
  Database,
  Gear,
  House,
  MagnifyingGlass,
  NotePencil,
  ShieldCheck,
  Stethoscope,
  User,
  UserCircleGear,
  UsersThree,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr"

export const NAV_ICON_MAP = {
  house: House,
  calendar: CalendarDots,
  calendarPlus: CalendarPlus,
  stethoscope: Stethoscope,
  creditCard: CreditCard,
  books: Books,
  shield: ShieldCheck,
  user: User,
  users: UsersThree,
  chat: ChatCircleDots,
  notes: NotePencil,
  profile: UserCircleGear,
  video: VideoCamera,
  buildings: Buildings,
  clipboard: ClipboardText,
  currency: CurrencyCircleDollar,
  search: MagnifyingGlass,
  database: Database,
  gear: Gear,
  chart: ChartBar,
} as const

export type NavIconKey = keyof typeof NAV_ICON_MAP

export function NavIcon({
  icon,
  size = 18,
  weight,
}: {
  icon: NavIconKey
  size?: number
  weight?: "bold" | "regular"
}) {
  const Icon = NAV_ICON_MAP[icon]
  return <Icon size={size} weight={weight} />
}
