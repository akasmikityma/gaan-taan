"use client"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

const Appbar = () => {
  const session = useSession();
  const getIn = () => {
    if (session.data?.user) {
      signOut();
    } else {
      signIn();
    }
  }

  return (
    <header className="px-4 lg:px-6 h-16 flex justify-between items-center border-b">
      <div>
        <Link className="flex items-center justify-center" href="#">
          <Music className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">GaanTaan</span>
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
            How It Works
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          <Link href="">
            <Button size="sm" onClick={() => getIn()}>{session.data?.user ? `Log Out` : `Sign In`}</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Appbar