# Policy Acceptance Component

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

A complete, drop-in policy acceptance system for Next.js React applications with advanced organizational support, version management, and compliance tracking.

## 🚀 Features

- ✅ **Multiple Organization Models**: Individual, Company-only, or Hybrid acceptance
- ✅ **Advanced User Management**: Roles, permissions, and company hierarchies
- ✅ **Version Management**: Track policy versions with diff comparison
- ✅ **Deadline Management**: Set acceptance deadlines with visual indicators
- ✅ **Compliance Tracking**: Audit logs, digital signatures, and retention policies
- ✅ **Flexible Data Sources**: Local state, API integration, or hybrid approach
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **TypeScript Support**: Fully typed for better development experience

## 📦 Installation

\`\`\`bash
npm install @your-org/policy-acceptance
\`\`\`
or
\`\`\`
yarn add @your-org/policy-acceptance
\`\`\`

## 🏢 Organization Models

### Individual Only

Perfect for freelancers, consultants, and personal accounts.

- Users accept policies for themselves only
- No company authority required
- Simple user experience

### Company Only

Ideal for enterprises and regulated industries.

- Designated users accept on behalf of organization
- Authority confirmation required
- Company-wide compliance tracking

### Hybrid Model

Best for complex organizations with mixed requirements.

- Supports both individual and company acceptance
- Role-based permissions
- Flexible compliance tracking

## 🚀 Quick Start

### 1. Individual Only Setup

\`\`\`tsx

import {
PolicyAcceptanceProvider,
PolicyVersioningDemo,
createIndividualOnlyConfig,
createUser,
createPolicyData
} from '@your-org/policy-acceptance'

// Create user
const currentUser = createUser(
"user-001",
"john@freelance.com",
"John Smith",
"user"
)

// Create policy data
const policies = [
createPolicyData(
"terms-001",
"terms",
"Terms of Service",
[{
id: "terms-v2.1",
version: "2.1",
date: "2024-12-15",
deadline: "2025-01-15T23:59:59Z",
content: "Your terms content here...",
changes: ["Added AI processing", "Updated privacy terms"],
isBreaking: true,
isActive: true,
createdBy: "legal-team"
}]
)
]

// Create configuration
const config = createIndividualOnlyConfig(currentUser, {
dataSource: {
type: "local",
localData: {
policies,
users: [currentUser],
companies: [],
currentUser
}
},
callbacks: {
onAcceptance: (acceptance) => {
console.log('Policy accepted:', acceptance)
}
}
})

// Use in your app
export default function App() {
return (
<PolicyAcceptanceProvider config={config}>
<PolicyVersioningDemo />
</PolicyAcceptanceProvider>
)
}
\`\`\`

### 2. Company Only Setup

\`\`\`tsx

import {
createCompanyOnlyConfig,
createUser,
createCompany
} from '@your-org/policy-acceptance'

// Create company
const company = createCompany(
"company-001",
"Acme Corporation",
["admin-001"], // Admin user IDs
{
requireAuthorityConfirmation: true,
requireTitleAndEmail: true,
allowDelegatedAcceptance: false,
notificationEmails: ["legal@acme.com"]
}
)

// Create admin user
const adminUser = createUser(
"admin-001",
"admin@acme.com",
"Legal Admin",
"company-admin",
"company-001",
true // Can accept for company
)

// Create configuration
const config = createCompanyOnlyConfig(adminUser, company, {
dataSource: {
type: "local",
localData: {
policies,
users: [adminUser],
companies: [company],
currentUser: adminUser
}
},
callbacks: {
onAcceptance: (acceptance) => {
// Handle company-wide acceptance
console.log('Company policy accepted:', acceptance)
}
}
})
\`\`\`

### 3. Hybrid Setup

\`\`\`tsx

import { createHybridConfig } from '@your-org/policy-acceptance'

const config = createHybridConfig(adminUser, company, {
organization: {
// Allow both individual and company acceptance
requireCompanyAcceptance: true,
allowIndividualAcceptance: true,
acceptanceScope: "both",

    // Configure who can accept for company
    whoCanAcceptForCompany: "designated-users",

    // Inheritance rules
    inheritanceRules: {
      newUsersInheritCompanyAcceptance: false,
      companyAcceptanceOverridesIndividual: false
    }

}
})
\`\`\`

## 🔧 Advanced Configuration

### API Integration

\`\`\`tsx

const config = {
dataSource: {
type: "api",
apiEndpoints: {
getPolicies: "/api/policies",
getPolicy: "/api/policies/:id",
submitAcceptance: "/api/policies/accept",
getUserAcceptances: "/api/policies/acceptances",
getUsers: "/api/users",
getCompanies: "/api/companies",
getOrganizationSettings: "/api/organization/settings"
}
},

// Organization settings
organization: {
requireCompanyAcceptance: true,
allowIndividualAcceptance: true,
requireAuthorityConfirmation: true,
whoCanAcceptForCompany: "designated-users",

    notifications: {
      enabled: true,
      reminderDays: [7, 3, 1],
      escalationChain: ["legal@company.com"],
      sendToManagers: true
    },

    auditSettings: {
      logAllActions: true,
      requireDigitalSignature: true,
      retentionPeriodYears: 10,
      exportFormat: "pdf"
    }

},

// UI customization
ui: {
theme: {
primaryColor: "#3b82f6",
borderRadius: "8px",
darkMode: false
},
features: {
showVersionHistory: true,
showDiffComparison: true,
showAcceptanceHistory: true,
allowPolicyDownload: true,
showDeadlineCountdown: true
}
},

// Behavior settings
behavior: {
autoShowOnLogin: true,
blockAccessUntilAccepted: true,
allowLaterReview: false,
requireScrollToBottom: true,
sessionTimeout: 1800000 // 30 minutes
},

// Integration hooks
integrations: {
analytics: {
trackAcceptance: (data) => {
// Send to analytics service
analytics.track('policy_accepted', data)
}
},
notifications: {
sendEmail: async (to, subject, body) => {
// Send email notification
await emailService.send({ to, subject, body })
}
},
audit: {
logAction: async (action, data) => {
// Log to audit system
await auditService.log(action, data)
}
}
}
}
\`\`\`

### Custom Components

\`\`\`tsx

import {
PolicyAcceptanceModal,
usePolicyAcceptance
} from '@your-org/policy-acceptance'

function CustomPolicyButton() {
const {
policies,
currentUser,
getPolicyAcceptanceStatus,
getRequiredPolicies
} = usePolicyAcceptance()

const [showModal, setShowModal] = useState(false)
const requiredPolicies = getRequiredPolicies(policies, currentUser, config.organization)

if (requiredPolicies.length === 0) {
return null
}

return (
<>
<Button
onClick={() => setShowModal(true)}
variant="destructive" >
{requiredPolicies.length} Policies Require Attention
</Button>

      <PolicyAcceptanceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>

)
}
\`\`\`

## 📊 Data Structures

### User Management

\`\`\`tsx
interface User {
id: string
email: string
name: string
role: "user" | "admin" | "legal" | "company-admin"
companyId?: string
canAcceptForCompany?: boolean
isActive: boolean
createdAt: string
}
\`\`\`

### Company Management

\`\`\`tsx

interface Company {
id: string
name: string
domain?: string
adminUsers: string[]
requiresCompanyAcceptance: boolean
allowIndividualAcceptance: boolean
settings: {
requireAuthorityConfirmation: boolean
requireTitleAndEmail: boolean
allowDelegatedAcceptance: boolean
notificationEmails: string[]
}
}
\`\`\`

### Policy Versions

\`\`\`tsx

interface PolicyVersion {
id: string
version: string
date: string
content: string
changes?: string[]
isBreaking?: boolean
deadline?: string
gracePeriodDays?: number
metadata?: {
wordCount: number
readingTimeMinutes: number
language: string
jurisdiction: string
}
}
\`\`\`

## 🛠 Utilities

\`\`\`tsx

import {
canUserAcceptForCompany,
getPolicyAcceptanceStatus,
getRequiredPolicies,
validateUser,
validateCompany,
generateSamplePolicies
} from '@your-org/policy-acceptance'

// Check permissions
const canAccept = canUserAcceptForCompany(user, company, organizationSettings)

// Get acceptance status
const status = getPolicyAcceptanceStatus(policy, user, organizationSettings)
// Returns: "accepted" | "pending" | "overdue" | "not-required"

// Get required policies for user
const required = getRequiredPolicies(policies, user, organizationSettings)

// Validation
const isValidUser = validateUser(user)
const isValidCompany = validateCompany(company)

// Generate sample data for testing
const samplePolicies = generateSamplePolicies()
\`\`\`

## 🔒 Security & Compliance

- **Audit Logging**: Track all policy interactions
- **Digital Signatures**: Optional cryptographic signatures
- **Data Retention**: Configurable retention periods
- **GDPR Compliance**: Built-in privacy controls
- **Role-based Access**: Granular permission system

## 📱 Responsive Design

The component is fully responsive and works across:

- Desktop browsers
- Tablet devices
- Mobile phones
- Screen readers (WCAG compliant)

## 🎨 Theming

Customize the appearance to match your brand:

\`\`\`tsx

const config = {
ui: {
theme: {
primaryColor: "#your-brand-color",
borderRadius: "12px",
fontFamily: "Inter, sans-serif",
darkMode: true
}
}
}
\`\`\`

## 📄 License

CC BY-NC-SA 4.0 License - see LICENSE file for details [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## 🤝 Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## 📞 Support

- Issues: [GitHub Issues](https://github.com/isaac12x/policies-acceptance-module/issues)
- Email: ialbetsram+policiesm [at] gmail [dot] com
