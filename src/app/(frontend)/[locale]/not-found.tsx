import Link from "next/link"
import React from "react"

// import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="container flex h-screen items-center justify-center bg-gray-950 text-white">
            <div className="flex max-w-none flex-col items-center justify-center gap-y-8">
                <h1 className="mb-15 flex text-4xl font-bold">404</h1>
                <p className="mb-4 flex">This page could not be found.</p>
            </div>
            {/* <Button asChild variant="default">
        <Link href="/">Go home</Link>
      </Button> */}
        </div>
    )
}
