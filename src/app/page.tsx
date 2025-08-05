"use client"

import { Home } from "@/components/home"
import { AppProvider } from "@/components/provider"

export default function Main() {
    return (
        <AppProvider>
            <Home />
        </AppProvider>
    )
}
