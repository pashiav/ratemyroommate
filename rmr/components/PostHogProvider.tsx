"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Main PostHog provider component for analytics initialization
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // Initialize PostHog with configuration
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false, // We capture pageviews manually
      capture_pageleave: true, // Enable pageleave capture
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

// Component to capture page view events for analytics
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogClient = usePostHog()

  // Track page views when route changes
  useEffect(() => {
    if (pathname && posthogClient) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) {
        url += "?" + search
      }
      posthogClient.capture("$pageview", { "$current_url": url })
    }
  }, [pathname, searchParams, posthogClient])

  return null
}

// Suspense wrapper for PostHog page view tracking
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
