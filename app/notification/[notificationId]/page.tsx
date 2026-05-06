import { NotificationDetailClient } from "@/components/notifications/notification-detail-client"

type PageProps = {
  params: Promise<{ notificationId: string }>
}

export default async function NotificationDetailPage({ params }: PageProps) {
  const { notificationId } = await params
  return <NotificationDetailClient notificationId={notificationId} />
}
