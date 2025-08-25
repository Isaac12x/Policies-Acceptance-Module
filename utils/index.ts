import type {
  PolicyData,
  PolicyVersion,
  PolicyAcceptance,
  User,
  Company,
  OrganizationSettings,
  PolicyAcceptanceConfig,
} from "../types"

// Policy data creation and validation
export const createPolicyData = (
  id: string,
  type: "terms" | "privacy" | "cookies" | "data-processing" | "security" | "custom",
  title: string,
  versions: PolicyVersion[],
  userAcceptances: PolicyAcceptance[] = [],
  settings?: Partial<PolicyData["settings"]>,
): PolicyData => {
  const sortedVersions = versions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return {
    id,
    type,
    title,
    versions: sortedVersions,
    currentVersion: sortedVersions[0]?.version || "1.0",
    userAcceptances,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      requiresAcceptance: true,
      allowVersionRollback: false,
      retentionPeriodDays: 2555, // 7 years
      notificationSettings: {
        sendReminders: true,
        reminderDays: [7, 3, 1],
        escalationEmails: [],
      },
      ...settings,
    },
  }
}

export const createUser = (
  id: string,
  email: string,
  name: string,
  role: "user" | "admin" | "legal" | "company-admin" = "user",
  companyId?: string,
  canAcceptForCompany = false,
): User => ({
  id,
  email,
  name,
  role,
  companyId,
  canAcceptForCompany,
  isActive: true,
  createdAt: new Date().toISOString(),
})

export const createCompany = (
  id: string,
  name: string,
  adminUsers: string[] = [],
  settings?: Partial<Company["settings"]>,
): Company => ({
  id,
  name,
  adminUsers,
  requiresCompanyAcceptance: true,
  allowIndividualAcceptance: false,
  settings: {
    requireAuthorityConfirmation: true,
    requireTitleAndEmail: true,
    allowDelegatedAcceptance: false,
    notificationEmails: [],
    ...settings,
  },
  createdAt: new Date().toISOString(),
  isActive: true,
})

// Configuration presets for different organizational setups
export const createIndividualOnlyConfig = (
  currentUser: User,
  overrides?: Partial<PolicyAcceptanceConfig>,
): PolicyAcceptanceConfig => ({
  dataSource: {
    type: "local",
    localData: {
      policies: [],
      users: [currentUser],
      companies: [],
      currentUser,
    },
  },
  organization: {
    requireCompanyAcceptance: false,
    allowIndividualAcceptance: true,
    requireAuthorityConfirmation: false,
    whoCanAcceptForCompany: "any-user",
    requireManagerApproval: false,
    acceptanceScope: "individual",
    inheritanceRules: {
      newUsersInheritCompanyAcceptance: false,
      companyAcceptanceOverridesIndividual: false,
    },
    notifications: {
      enabled: true,
      reminderDays: [7, 3, 1],
      escalationChain: [],
      sendToManagers: false,
    },
    auditSettings: {
      logAllActions: true,
      requireDigitalSignature: false,
      retentionPeriodYears: 7,
      exportFormat: "json",
    },
  },
  currentUser,
  ui: {
    features: {
      showVersionHistory: true,
      showDiffComparison: true,
      showAcceptanceHistory: true,
      allowPolicyDownload: true,
      showDeadlineCountdown: true,
    },
    text: {
      defaultLanguage: "en",
    },
  },
  behavior: {
    autoShowOnLogin: false,
    blockAccessUntilAccepted: false,
    allowLaterReview: true,
    requireScrollToBottom: true,
  },
  callbacks: {},
  ...overrides,
})

export const createCompanyOnlyConfig = (
  currentUser: User,
  currentCompany: Company,
  overrides?: Partial<PolicyAcceptanceConfig>,
): PolicyAcceptanceConfig => ({
  dataSource: {
    type: "local",
    localData: {
      policies: [],
      users: [currentUser],
      companies: [currentCompany],
      currentUser,
    },
  },
  organization: {
    requireCompanyAcceptance: true,
    allowIndividualAcceptance: false,
    requireAuthorityConfirmation: true,
    whoCanAcceptForCompany: "designated-users",
    requireManagerApproval: false,
    acceptanceScope: "company-wide",
    inheritanceRules: {
      newUsersInheritCompanyAcceptance: true,
      companyAcceptanceOverridesIndividual: true,
    },
    notifications: {
      enabled: true,
      reminderDays: [14, 7, 3, 1],
      escalationChain: currentCompany.adminUsers,
      sendToManagers: true,
    },
    auditSettings: {
      logAllActions: true,
      requireDigitalSignature: true,
      retentionPeriodYears: 10,
      exportFormat: "pdf",
    },
  },
  currentUser,
  currentCompany,
  ui: {
    features: {
      showVersionHistory: true,
      showDiffComparison: true,
      showAcceptanceHistory: true,
      allowPolicyDownload: true,
      showDeadlineCountdown: true,
    },
    text: {
      defaultLanguage: "en",
    },
  },
  behavior: {
    autoShowOnLogin: true,
    blockAccessUntilAccepted: true,
    allowLaterReview: false,
    requireScrollToBottom: true,
  },
  callbacks: {},
  ...overrides,
})

export const createHybridConfig = (
  currentUser: User,
  currentCompany: Company,
  overrides?: Partial<PolicyAcceptanceConfig>,
): PolicyAcceptanceConfig => ({
  dataSource: {
    type: "local",
    localData: {
      policies: [],
      users: [currentUser],
      companies: [currentCompany],
      currentUser,
    },
  },
  organization: {
    requireCompanyAcceptance: true,
    allowIndividualAcceptance: true,
    requireAuthorityConfirmation: true,
    whoCanAcceptForCompany: "designated-users",
    requireManagerApproval: false,
    acceptanceScope: "both",
    inheritanceRules: {
      newUsersInheritCompanyAcceptance: false,
      companyAcceptanceOverridesIndividual: false,
    },
    notifications: {
      enabled: true,
      reminderDays: [7, 3, 1],
      escalationChain: currentCompany.adminUsers,
      sendToManagers: true,
    },
    auditSettings: {
      logAllActions: true,
      requireDigitalSignature: false,
      retentionPeriodYears: 7,
      exportFormat: "json",
    },
  },
  currentUser,
  currentCompany,
  ui: {
    features: {
      showVersionHistory: true,
      showDiffComparison: true,
      showAcceptanceHistory: true,
      allowPolicyDownload: true,
      showDeadlineCountdown: true,
    },
    text: {
      defaultLanguage: "en",
    },
  },
  behavior: {
    autoShowOnLogin: false,
    blockAccessUntilAccepted: false,
    allowLaterReview: true,
    requireScrollToBottom: true,
  },
  callbacks: {},
  ...overrides,
})

// Validation functions
export const validatePolicyVersion = (version: PolicyVersion): boolean => {
  return !!(
    version.id &&
    version.version &&
    version.date &&
    version.content &&
    new Date(version.date).toString() !== "Invalid Date"
  )
}

export const validateUser = (user: User): boolean => {
  return !!(user.id && user.email && user.name && user.email.includes("@") && user.role)
}

export const validateCompany = (company: Company): boolean => {
  return !!(company.id && company.name && Array.isArray(company.adminUsers))
}

// Permission and access control utilities
export const canUserAcceptForCompany = (
  user: User,
  company: Company,
  organizationSettings: OrganizationSettings,
): boolean => {
  if (!organizationSettings.requireCompanyAcceptance) {
    return false
  }

  switch (organizationSettings.whoCanAcceptForCompany) {
    case "admins-only":
      return user.role === "admin" || user.role === "company-admin"
    case "designated-users":
      return company.adminUsers.includes(user.id) || user.canAcceptForCompany
    case "any-user":
      return user.companyId === company.id
    default:
      return false
  }
}

export const getPolicyAcceptanceStatus = (
  policy: PolicyData,
  user: User,
  organizationSettings: OrganizationSettings,
): "accepted" | "pending" | "overdue" | "not-required" => {
  if (!policy.settings.requiresAcceptance) {
    return "not-required"
  }

  const currentVersion = policy.versions.find((v) => v.version === policy.currentVersion)
  if (!currentVersion) {
    return "not-required"
  }

  // Check if user has accepted current version
  const userAcceptance = policy.userAcceptances.find(
    (a) => a.userId === user.id && a.version === policy.currentVersion && a.isValid,
  )

  if (userAcceptance) {
    return "accepted"
  }

  // Check if company acceptance covers this user
  if (organizationSettings.inheritanceRules.newUsersInheritCompanyAcceptance && user.companyId) {
    const companyAcceptance = policy.userAcceptances.find(
      (a) =>
        a.acceptanceType === "company" &&
        a.companyInfo?.companyName &&
        a.version === policy.currentVersion &&
        a.isValid,
    )

    if (companyAcceptance) {
      return "accepted"
    }
  }

  // Check if overdue
  if (currentVersion.deadline) {
    const deadline = new Date(currentVersion.deadline)
    const now = new Date()
    if (now > deadline) {
      return "overdue"
    }
  }

  return "pending"
}

export const getRequiredPolicies = (
  policies: PolicyData[],
  user: User,
  organizationSettings: OrganizationSettings,
): PolicyData[] => {
  return policies.filter((policy) => {
    const status = getPolicyAcceptanceStatus(policy, user, organizationSettings)
    return status === "pending" || status === "overdue"
  })
}

export const getUserAcceptances = (policies: PolicyData[], userId: string): PolicyAcceptance[] => {
  return policies.flatMap((policy) =>
    policy.userAcceptances.filter((acceptance) => acceptance.userId === userId && acceptance.isValid),
  )
}

// Date and formatting utilities
export const formatAcceptanceDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const calculateDaysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export const isVersionOverdue = (deadline?: string): boolean => {
  if (!deadline) return false
  return calculateDaysUntilDeadline(deadline) < 0
}

export const getPolicyTypeInfo = (type: PolicyData["type"]) => {
  switch (type) {
    case "terms":
      return {
        label: "Terms of Service",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      }
    case "privacy":
      return {
        label: "Privacy Policy",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      }
    case "cookies":
      return {
        label: "Cookie Policy",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      }
    case "data-processing":
      return {
        label: "Data Processing Agreement",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      }
    case "security":
      return {
        label: "Security Policy",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      }
    case "custom":
      return {
        label: "Policy",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
  }
}

// Sample data generators for testing and demos
export const generateSamplePolicies = (): PolicyData[] => [
  createPolicyData("terms-001", "terms", "Terms of Service", [
    {
      id: "terms-v2.1",
      version: "2.1",
      date: "2024-12-15",
      deadline: "2025-01-15T23:59:59Z",
      content: "Sample terms content...",
      changes: ["Added AI processing section", "Updated privacy terms"],
      isBreaking: true,
      isActive: true,
      createdBy: "legal-team",
    },
  ]),
  createPolicyData("privacy-001", "privacy", "Privacy Policy", [
    {
      id: "privacy-v1.5",
      version: "1.5",
      date: "2024-11-01",
      content: "Sample privacy content...",
      changes: ["GDPR compliance updates"],
      isBreaking: false,
      isActive: true,
      createdBy: "legal-team",
    },
  ]),
]

export const generateSampleUsers = (): User[] => [
  createUser("user-001", "john@acme.com", "John Smith", "user", "company-001", false),
  createUser("user-002", "jane@acme.com", "Jane Doe", "company-admin", "company-001", true),
  createUser("user-003", "bob@freelance.com", "Bob Wilson", "user"),
]

export const generateSampleCompanies = (): Company[] => [
  createCompany("company-001", "Acme Corporation", ["user-002"], {
    requireAuthorityConfirmation: true,
    requireTitleAndEmail: true,
    allowDelegatedAcceptance: false,
    notificationEmails: ["legal@acme.com"],
  }),
]
