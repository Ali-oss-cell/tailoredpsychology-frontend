import type { PrivacyPolicySection } from "@/content/legal/privacy-policy-au"
import { ENTITY_NAME, privacyPolicyEffectiveDate } from "@/content/legal/privacy-policy-au"

type PrivacyPolicyDocumentProps = {
  sections: PrivacyPolicySection[]
}

export function PrivacyPolicyDocument({ sections }: PrivacyPolicyDocumentProps) {
  return (
    <article className="max-w-none">
      <p className="text-muted-foreground rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed">
        <strong>Pending legal sign-off.</strong> This policy currently names{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">{ENTITY_NAME}</code>. Confirm legal owner, privacy
        officer contact details, and approval status in `frontend/docs/LEGAL_SIGNOFF_TRACKER.md` before treating this
        as binding policy text.
      </p>
      <p className="text-muted-foreground mt-4 text-sm">Last updated: {privacyPolicyEffectiveDate}</p>
      <hr className="my-8 border-border" />
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-10 scroll-mt-24">
          <h2 className="font-heading text-xl font-semibold tracking-tight">{section.title}</h2>
          <div className="text-muted-foreground mt-3 space-y-3 text-sm leading-relaxed md:text-base">
            {section.paragraphs.map((p, i) => (
              <p key={`${section.id}-p-${i}`}>{p}</p>
            ))}
          </div>
          {section.bullets && section.bullets.length > 0 ? (
            <ul className="text-muted-foreground mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed md:text-base">
              {section.bullets.map((b, i) => (
                <li key={`${section.id}-b-${i}`}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  )
}
