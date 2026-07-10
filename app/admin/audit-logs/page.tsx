"use client"

import { AdminLivePageSection } from "@/components/ops/admin-live-page-section"
import { opsPagesContent } from "@/content/ops-pages"
import { getAuditEvents } from "@/src/admin/ops/api"

export default function AdminAuditLogsPage() {
  return (
    <AdminLivePageSection
      title={opsPagesContent.adminAuditLogs.title}
      description={opsPagesContent.adminAuditLogs.description}
      cardTitle="Recent Audit Events"
      load={async () =>
        (await getAuditEvents()).slice(0, 20).map((event) => ({
          occurredAt: event.occurredAt,
          action: event.action,
          actor: event.actorUserId,
          target: event.targetId,
        }))
      }
    />
  )
}
