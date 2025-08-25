"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VersionBadge } from "./components/version-badge"
import PolicyVersioningModal from "./policy-versioning-modal"
import type { PolicyData, PolicyAcceptance } from "./types/policy"
import { DeadlineIndicator } from "./components/deadline-indicator"
import { Building2, User, FileText, Shield, Cookie } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const samplePolicyData: PolicyData = {
  type: "terms",
  title: "Terms of Service",
  versions: [
    {
      version: "2.1",
      date: "2024-12-15",
      deadline: "2025-01-15T23:59:59Z", // 30 days to accept
      gracePeriodDays: 7,
      content: `TERMS OF SERVICE - Version 2.1

1. ACCEPTANCE OF TERMS
By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. This includes our new AI-powered features and data processing capabilities.

2. USE LICENSE
Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This license now includes access to our mobile applications and API services.

3. AI AND DATA PROCESSING
We now use artificial intelligence to improve our services. By using our platform, you consent to:
- Analysis of your usage patterns for service improvement
- Automated content recommendations
- Enhanced security monitoring using AI systems

4. PRIVACY AND DATA PROTECTION
We are committed to protecting your privacy in accordance with GDPR and CCPA regulations. Your data will be processed securely and never sold to third parties.

5. DISCLAIMER
The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, regarding AI-generated content or recommendations.

6. LIMITATIONS
In no event shall our company be liable for any damages arising from the use of AI features or automated systems.

Contact: legal@company.com`,
      changes: [
        "Added AI and data processing section",
        "Updated privacy protections for GDPR/CCPA compliance",
        "Extended license to include mobile apps and API access",
        "Enhanced security and monitoring capabilities",
      ],
      isBreaking: true,
    },
    {
      version: "2.0",
      date: "2024-11-01",
      deadline: "2024-12-01T23:59:59Z", // Already passed
      content: `TERMS OF SERVICE - Version 2.0

1. ACCEPTANCE OF TERMS
By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.

2. USE LICENSE
Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.

3. ENHANCED FEATURES
We now offer premium features including advanced analytics and priority support.

4. DISCLAIMER
The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied.

5. LIMITATIONS
In no event shall our company be liable for any damages arising out of the use of our services.

Contact: legal@company.com`,
      changes: ["Added premium features section", "Updated service descriptions", "Simplified terms structure"],
    },
    {
      version: "2.0.1",
      date: "2024-11-10",
      content: `TERMS OF SERVICE - Version 2.0.1

Minor bug fixes and clarifications to version 2.0.`,
      changes: ["Fixed typos in section 3", "Clarified premium features language"],
    },
    {
      version: "1.5",
      date: "2024-09-15",
      content: `TERMS OF SERVICE - Version 1.5

1. ACCEPTANCE OF TERMS
By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.

2. USE LICENSE
Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.

3. DISCLAIMER
The materials on our website are provided on an 'as is' basis.

4. LIMITATIONS
In no event shall our company be liable for any damages.

Contact: legal@company.com`,
      changes: ["Simplified language throughout", "Removed outdated sections", "Updated contact information"],
    },
    {
      version: "1.4",
      date: "2024-08-01",
      content: `TERMS OF SERVICE - Version 1.4`,
      changes: ["Updated contact information", "Minor legal clarifications"],
    },
    {
      version: "1.3",
      date: "2024-07-01",
      content: `TERMS OF SERVICE - Version 1.3`,
      changes: ["Added new service features", "Updated liability terms"],
    },
  ],
  userAcceptances: [
    {
      version: "1.5",
      acceptedAt: "2024-09-20T10:30:00Z",
      userAgent: "Mozilla/5.0...",
      acceptanceType: "individual",
    },
    {
      version: "2.0",
      acceptedAt: "2024-11-05T14:15:00Z",
      userAgent: "Mozilla/5.0...",
      acceptanceType: "company",
      companyInfo: {
        companyName: "Acme Corporation",
        acceptorName: "John Smith",
        acceptorTitle: "Chief Technology Officer",
        acceptorEmail: "john.smith@acme.com",
      },
    },
    {
      version: "1.4",
      acceptedAt: "2024-08-15T09:20:00Z",
      userAgent: "Mozilla/5.0...",
      acceptanceType: "individual",
    },
    {
      version: "1.3",
      acceptedAt: "2024-07-10T16:45:00Z",
      userAgent: "Mozilla/5.0...",
      acceptanceType: "individual",
    },
  ],
}

// Helper function to get policy type info
const getPolicyTypeInfo = (type: "terms" | "privacy" | "cookies") => {
  switch (type) {
    case "terms":
      return {
        label: "Terms of Service",
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      }
    case "privacy":
      return {
        label: "Privacy Policy",
        icon: Shield,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      }
    case "cookies":
      return {
        label: "Cookie Policy",
        icon: Cookie,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      }
  }
}

export default function PolicyVersioningDemo() {
  const [showModal, setShowModal] = useState(false)
  const [policyData, setPolicyData] = useState(samplePolicyData)
  const [userCanAcceptForCompany, setUserCanAcceptForCompany] = useState(true) // Demo: user has company authority

  const handleAccept = (version: string, acceptanceType: "individual" | "company", companyInfo?: any) => {
    const newAcceptance: PolicyAcceptance = {
      version,
      acceptedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      acceptanceType,
      companyInfo,
    }

    setPolicyData((prev) => ({
      ...prev,
      userAcceptances: [...prev.userAcceptances, newAcceptance],
    }))

    setShowModal(false)
  }

  const handleDecline = () => {
    setShowModal(false)
  }

  const currentVersion = policyData.versions[0]
  const isCurrentAccepted = policyData.userAcceptances.some((a) => a.version === currentVersion.version)
  const lastAcceptedVersion = policyData.userAcceptances.sort(
    (a, b) => new Date(b.acceptedAt).getTime() - new Date(a.acceptedAt).getTime(),
  )[0]

  // Filter acceptances based on user permissions
  const getVisibleAcceptances = () => {
    if (userCanAcceptForCompany) {
      // User can see all acceptances (company authority)
      return policyData.userAcceptances
    } else {
      // User can only see their own individual acceptances
      return policyData.userAcceptances.filter((acceptance) => acceptance.acceptanceType === "individual")
    }
  }

  const visibleAcceptances = getVisibleAcceptances()
  const policyTypeInfo = getPolicyTypeInfo(policyData.type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Policy Version Management</h1>
          <p className="text-lg text-gray-600">Advanced policy acceptance with version tracking and diff comparison</p>
        </div>

        {/* Demo Controls */}
        <div className="flex justify-center">
          <Card className="w-fit">
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Demo Mode:</span>
                <Button
                  variant={userCanAcceptForCompany ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserCanAcceptForCompany(true)}
                >
                  Company Authority
                </Button>
                <Button
                  variant={!userCanAcceptForCompany ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserCanAcceptForCompany(false)}
                >
                  Individual User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Policy Status</span>
                <VersionBadge
                  version={currentVersion.version}
                  isAccepted={isCurrentAccepted}
                  isCurrent={true}
                  isBreaking={currentVersion.isBreaking}
                />
              </CardTitle>
              <CardDescription>
                {isCurrentAccepted
                  ? "You're up to date with the latest policy version"
                  : "Action required: Please review and accept the latest policy version"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Current Version</h4>
                  <div className="text-sm text-muted-foreground">
                    Version {currentVersion.version} • Released {currentVersion.date}
                  </div>
                  {currentVersion.isBreaking && (
                    <Badge variant="destructive" className="text-xs">
                      Breaking Changes
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Your Status</h4>
                  <div className="text-sm text-muted-foreground">
                    {lastAcceptedVersion
                      ? `Last accepted: v${lastAcceptedVersion.version}`
                      : "No versions accepted yet"}
                  </div>
                  {!isCurrentAccepted && (
                    <Badge variant="outline" className="text-xs">
                      Update Required
                    </Badge>
                  )}
                </div>
              </div>

              {currentVersion.changes && (
                <div className="space-y-2">
                  <h4 className="font-medium">Latest Changes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {currentVersion.changes.slice(0, 3).map((change, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {currentVersion.deadline && (
                <div className="space-y-2">
                  <h4 className="font-medium">Acceptance Deadline</h4>
                  <DeadlineIndicator deadline={currentVersion.deadline} isAccepted={isCurrentAccepted} />
                </div>
              )}

              <Button
                onClick={() => setShowModal(true)}
                className="w-full"
                variant={isCurrentAccepted ? "outline" : "default"}
              >
                {isCurrentAccepted ? "Review Policy" : "Accept Latest Version"}
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle>Version Acceptances</CardTitle>
              <CardDescription>
                {userCanAcceptForCompany ? "All policy acceptances you can view" : "Your individual policy acceptances"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
              <ScrollArea className="h-[400px] px-6 pb-6">
                <div className="space-y-4">
                  {policyData.versions.map((version) => {
                    const acceptance = visibleAcceptances.find((a) => a.version === version.version)
                    const isAccepted = !!acceptance
                    const isCurrent = version.version === currentVersion.version
                    const PolicyIcon = policyTypeInfo.icon

                    return (
                      <div key={version.version} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <VersionBadge
                              version={version.version}
                              isAccepted={isAccepted}
                              isCurrent={isCurrent}
                              isBreaking={version.isBreaking}
                            />
                            {version.deadline && (
                              <DeadlineIndicator
                                deadline={version.deadline}
                                isAccepted={isAccepted}
                                className="text-xs"
                              />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{version.date}</div>
                        </div>

                        {/* Policy Type Badge */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${policyTypeInfo.bgColor} ${policyTypeInfo.borderColor} border`}
                          >
                            <PolicyIcon className={`h-3 w-3 ${policyTypeInfo.color}`} />
                            <span className={policyTypeInfo.color}>{policyTypeInfo.label}</span>
                          </div>
                        </div>

                        {acceptance && (
                          <div className="bg-gray-50 rounded-md p-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              {acceptance.acceptanceType === "company" ? (
                                <Building2 className="h-4 w-4 text-blue-600" />
                              ) : (
                                <User className="h-4 w-4 text-green-600" />
                              )}
                              <span className="font-medium">
                                {acceptance.acceptanceType === "company" ? "Company" : "Individual"}
                              </span>
                            </div>

                            <div className="text-xs text-muted-foreground space-y-1">
                              <div>Accepted: {new Date(acceptance.acceptedAt).toLocaleDateString()}</div>
                              {acceptance.acceptanceType === "company" && acceptance.companyInfo && (
                                <div className="space-y-1">
                                  <div className="font-medium text-gray-700">{acceptance.companyInfo.companyName}</div>
                                  <div>By: {acceptance.companyInfo.acceptorTitle}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {!acceptance && (
                          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">Not yet accepted</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <PolicyVersioningModal
          isOpen={showModal}
          onAccept={handleAccept}
          onDecline={handleDecline}
          policyData={policyData}
          userCanAcceptForCompany={userCanAcceptForCompany}
        />
      </div>
    </div>
  )
}
