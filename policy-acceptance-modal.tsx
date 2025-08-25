"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, FileText } from "lucide-react"

interface PolicyAcceptanceModalProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
  policyType: "terms" | "privacy" | "cookies"
  isRevision?: boolean
  lastUpdated: string
  policyContent: string
}

export default function PolicyAcceptanceModal({
  isOpen,
  onAccept,
  onDecline,
  policyType,
  isRevision = false,
  lastUpdated,
  policyContent,
}: PolicyAcceptanceModalProps) {
  const [hasReadPolicy, setHasReadPolicy] = useState(false)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  const policyTitles = {
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    cookies: "Cookie Policy",
  }

  const handleScrollChange = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    setIsScrolledToBottom(isAtBottom)
  }

  const canAccept = hasReadPolicy && isScrolledToBottom

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0" hideCloseButton>
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            {isRevision ? (
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            ) : (
              <FileText className="h-6 w-6 text-blue-500" />
            )}
            <div>
              <DialogTitle className="text-xl">
                {isRevision ? "Policy Update Required" : "Accept Our Policies"}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {isRevision
                  ? `We've updated our ${policyTitles[policyType].toLowerCase()}. Please review and accept the changes to continue using our service.`
                  : `Please read and accept our ${policyTitles[policyType].toLowerCase()} to continue.`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6">
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span className="font-medium">{policyTitles[policyType]}</span>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          <ScrollArea className="h-64 w-full border rounded-md p-4" onScrollCapture={handleScrollChange}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{policyContent}</div>
          </ScrollArea>

          {!isScrolledToBottom && (
            <p className="text-xs text-muted-foreground mt-2 text-center">Please scroll to the bottom to continue</p>
          )}
        </div>

        <div className="p-6 pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="policy-read"
              checked={hasReadPolicy}
              onCheckedChange={(checked) => setHasReadPolicy(checked as boolean)}
              disabled={!isScrolledToBottom}
            />
            <label
              htmlFor="policy-read"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and understand the {policyTitles[policyType].toLowerCase()}
            </label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={onDecline}
              className="text-destructive hover:text-destructive bg-transparent"
            >
              {isRevision ? "I'll review later" : "Decline"}
            </Button>
            <Button onClick={onAccept} disabled={!canAccept} className="min-w-24">
              Accept & Continue
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
