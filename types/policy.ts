export interface PolicyVersion {
  version: string
  date: string
  content: string
  changes?: string[]
  isBreaking?: boolean
  deadline?: string // ISO date string when acceptance is required by
  gracePeriodDays?: number // Days after deadline before service restrictions
}

export interface PolicyAcceptance {
  version: string
  acceptedAt: string
  userAgent?: string
  acceptanceType: "individual" | "company"
  companyInfo?: {
    companyName: string
    acceptorName: string
    acceptorTitle: string
    acceptorEmail: string
  }
}

export interface PolicyData {
  type: "terms" | "privacy" | "cookies"
  title: string
  versions: PolicyVersion[]
  userAcceptances: PolicyAcceptance[]
}
