"use client"

import { Button } from "@/components/ui/button"
import { VersionBadge } from "./version-badge"
import { Calendar, User, Eye, Building2, Clock, FileText, Shield, Cookie } from "lucide-react"
import type { PolicyVersion, PolicyAcceptance, PolicyType } from "../types"
import { DeadlineIndicator } from "./deadline-indicator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VersionHistoryProps {
  versions: PolicyVersion[]
  acceptances: PolicyAcceptance[]
  currentVersion: string
  onViewVersion: (version: string) => void
  onCompareVersions: (current: string, previous: string) => void
  policyType?: PolicyType
}

// Helper function to get policy type info
const getPolicyTypeInfo = (type: PolicyType) => {
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
    case "data-processing":
      return {
        label: "Data Processing Agreement",
        icon: FileText,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      }
    case "security":
      return {
        label: "Security Policy",
        icon: Shield,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      }
    case "custom":
      return {
        label: "Policy",
        icon: FileText,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
  }
}

export function VersionHistory({
  versions,
  acceptances,
  currentVersion,
  onViewVersion,
  onCompareVersions,
  policyType = "terms",
}: VersionHistoryProps) {
  const isVersionAccepted = (version: string) => {
    return acceptances.some((acceptance) => acceptance.version === version)
  }

  const getAcceptance = (version: string) => {
    return acceptances.find((a) => a.version === version)
  }

  const policyTypeInfo = getPolicyTypeInfo(policyType)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Version History</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          {versions.map((version, index) => {
            const acceptance = getAcceptance(version.version)
            const isAccepted = !!acceptance
            const isCurrent = version.version === currentVersion
            const previousVersion = versions[index + 1]
            const PolicyIcon = policyTypeInfo.icon

            return (
              <div key={version.version} className="border rounded-lg p-4 space-y-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <VersionBadge
                      version={version.version}
                      isAccepted={isAccepted}
                      isCurrent={isCurrent}
                      isBreaking={version.isBreaking}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Released: {version.date}
                      </div>
                      {version.deadline && (
                        <DeadlineIndicator deadline={version.deadline} isAccepted={isAccepted} className="text-xs" />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => onViewVersion(version.version)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {previousVersion && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCompareVersions(version.version, previousVersion.version)}
                      >
                        Compare
                      </Button>
                    )}
                  </div>
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

                {/* Acceptance Information */}
                {acceptance && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                      {acceptance.acceptanceType === "company" ? (
                        <Building2 className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span>
                        {acceptance.acceptanceType === "company" ? "Company Acceptance" : "Individual Acceptance"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-green-700">
                      <div>
                        <span className="font-medium">Accepted:</span>{" "}
                        {new Date(acceptance.acceptedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      {acceptance.acceptanceType === "company" && acceptance.companyInfo && (
                        <>
                          <div className="sm:col-span-2">
                            <span className="font-medium">Company:</span> {acceptance.companyInfo.companyName}
                          </div>
                          <div>
                            <span className="font-medium">Title:</span> {acceptance.companyInfo.acceptorTitle}
                          </div>
                          <div className="sm:col-span-2">
                            <span className="font-medium">Email:</span> {acceptance.companyInfo.acceptorEmail}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Changes Section */}
                {version.changes && version.changes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Changes in this version:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {version.changes.slice(0, 3).map((change, changeIndex) => (
                        <li key={changeIndex} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                          <span className="break-words">{change}</span>
                        </li>
                      ))}
                      {version.changes.length > 3 && (
                        <li className="text-xs text-muted-foreground ml-4">
                          +{version.changes.length - 3} more changes...
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
