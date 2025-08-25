"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PolicyAcceptanceModal from "./policy-acceptance-modal"

const samplePolicyContent = `TERMS OF SERVICE

Last Updated: December 15, 2024

1. ACCEPTANCE OF TERMS
By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.

2. USE LICENSE
Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
- modify or copy the materials
- use the materials for any commercial purpose or for any public display
- attempt to reverse engineer any software contained on the website
- remove any copyright or other proprietary notations from the materials

3. DISCLAIMER
The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

4. LIMITATIONS
In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.

5. ACCURACY OF MATERIALS
The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current.

6. LINKS
We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site.

7. MODIFICATIONS
We may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.

8. GOVERNING LAW
These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.

Contact Information:
If you have any questions about these Terms of Service, please contact us at legal@company.com`

export default function PolicyDemo() {
  const [showModal, setShowModal] = useState(false)
  const [policyType, setPolicyType] = useState<"terms" | "privacy" | "cookies">("terms")
  const [isRevision, setIsRevision] = useState(false)
  const [acceptedPolicies, setAcceptedPolicies] = useState<string[]>([])

  const handleAccept = () => {
    const policyKey = `${policyType}-${isRevision ? "revision" : "initial"}`
    setAcceptedPolicies((prev) => [...prev, policyKey])
    setShowModal(false)
  }

  const handleDecline = () => {
    setShowModal(false)
    // In a real app, you might redirect to a different page or show a message
    alert("You must accept our policies to continue using the service.")
  }

  const openModal = (type: "terms" | "privacy" | "cookies", revision = false) => {
    setPolicyType(type)
    setIsRevision(revision)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Policy Acceptance Demo</h1>
          <p className="text-muted-foreground">Test the policy acceptance modal with different scenarios</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Initial Policy Acceptance</CardTitle>
              <CardDescription>Show policy acceptance for new users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => openModal("terms", false)} className="w-full">
                Accept Terms of Service
              </Button>
              <Button onClick={() => openModal("privacy", false)} variant="outline" className="w-full">
                Accept Privacy Policy
              </Button>
              <Button onClick={() => openModal("cookies", false)} variant="outline" className="w-full">
                Accept Cookie Policy
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policy Revisions</CardTitle>
              <CardDescription>Show policy updates for existing users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => openModal("terms", true)} variant="secondary" className="w-full">
                Terms Update Required
              </Button>
              <Button onClick={() => openModal("privacy", true)} variant="secondary" className="w-full">
                Privacy Policy Update
              </Button>
              <Button onClick={() => openModal("cookies", true)} variant="secondary" className="w-full">
                Cookie Policy Update
              </Button>
            </CardContent>
          </Card>
        </div>

        {acceptedPolicies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Accepted Policies</CardTitle>
              <CardDescription>Policies that have been accepted in this session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {acceptedPolicies.map((policy, index) => (
                  <Badge key={index} variant="secondary">
                    {policy.replace("-", " ").replace("initial", "(initial)").replace("revision", "(updated)")}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <PolicyAcceptanceModal
          isOpen={showModal}
          onAccept={handleAccept}
          onDecline={handleDecline}
          policyType={policyType}
          isRevision={isRevision}
          lastUpdated="December 15, 2024"
          policyContent={samplePolicyContent}
        />
      </div>
    </div>
  )
}
