"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, User, FileText, Shield, Cookie } from "lucide-react"
import { usePolicyAcceptance } from "../hooks/usePolicyAcceptance"
import { PolicyAcceptanceModal } from "./PolicyAcceptanceModal"
import { VersionBadge } from "./VersionBadge"
import { DeadlineIndicator } from "./DeadlineIndicator"
import { getPolicyTypeInfo } from "../utils"

export const PolicyVersioningDemo: React.FC = () => {
  const { policyData, config } = usePolicyAcceptance()
  const [showModal, setShowModal] = useState(false)
  const [userCanAcceptForCompany, setUserCanAcceptForCompany] = useState(config.userCanAcceptForCompany ?? true)

  if (!policyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No policy data available.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentVersion = policyData.versions[0]
  const isCurrentAccepted = policyData.userAcceptances.some((a) => a.version === currentVersion.version)
  const lastAcceptedVersion = policyData.userAcceptances.sort(
    (a, b) => new Date(b.acceptedAt).getTime() - new Date(a.acceptedAt).getTime(),
  )[0]

  // Filter acceptances based on user permissions
  const getVisibleAcceptances = () => {
    if (userCanAcceptForCompany) {
      return policyData.userAcceptances
    } else {
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
                    const PolicyIcon =
                      policyTypeInfo.label === "Terms of Service"
                        ? FileText
                        : policyTypeInfo.label === "Privacy Policy"
                          ? Shield
                          : Cookie

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

        <PolicyAcceptanceModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  )
}
