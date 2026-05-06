import { FloppyDisk } from "@phosphor-icons/react/dist/ssr"

type BookingProgressSaveProps = {
  message: string
}

export function BookingProgressSave({ message }: BookingProgressSaveProps) {
  return (
    <p className="text-muted-foreground flex items-center gap-2 text-xs">
      <FloppyDisk size={14} />
      {message}
    </p>
  )
}

