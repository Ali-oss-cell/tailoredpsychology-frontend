/** Authoring shape for a spotlight step (maps to driver.js). */
export type TutorialStepDef = {
  id: string
  /** Value for `data-tutorial` on the shell (selector `[data-tutorial="${target}"]`). */
  target: string
  title: string
  body: string
  side?: "top" | "right" | "bottom" | "left" | "over"
  align?: "start" | "center" | "end"
  /** If set, step is only offered when pathname equals or starts with this value. */
  waitForRoute?: string
  /**
   * If non-empty, step is shown when pathname matches **any** of these (same rules as `waitForRoute`).
   * Takes precedence over `waitForRoute` when both are set.
   */
  waitForRoutes?: readonly string[]
  /**
   * When the user clicks Next on this step, navigate here first (then advance).
   * Use to move the patient between real pages while the shell tour continues.
   */
  pushPathOnNext?: string
}
