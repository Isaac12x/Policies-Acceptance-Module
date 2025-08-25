// Main exports for the policy acceptance package
// 👇 add “.tsx” so the file is resolved in every environment
export { PolicyAcceptanceProvider } from "./provider/policy-acceptance-provider.tsx"
export { usePolicyAcceptance } from "./hooks/use-policy-acceptance"
export { PolicyAcceptanceModal } from "./components/policy-acceptance-modal"
export { PolicyVersioningDemo } from "./components/policy-versioning-demo"

// Types
export type {
  PolicyVersion,
  PolicyAcceptance,
  PolicyData,
  PolicyType,
  AcceptanceType,
  CompanyInfo,
  PolicyAcceptanceConfig,
  PolicyAcceptanceContextType,
  User,
  Company,
  OrganizationSettings,
} from "./types"

// Utilities
export {
  createPolicyData,
  createUser,
  createCompany,
  createIndividualOnlyConfig,
  createCompanyOnlyConfig,
  createHybridConfig,
  validatePolicyVersion,
  formatAcceptanceDate,
  generateSamplePolicies,
  generateSampleUsers,
  generateSampleCompanies,
  getPolicyTypeInfo,
} from "./utils"
