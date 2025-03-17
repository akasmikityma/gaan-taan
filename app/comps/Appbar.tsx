// import React from 'react'
"use client"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
const Appbar = () => {
  const session = useSession();
  const getIn=()=>{
    if(session.data?.user){
      signOut();
    }else{
      signIn();
    }
  }
  return (
    <header className="px-4 lg:px-6 h-16 flex justify-between items-center border-b">
        <div>
          <Link className="flex items-center justify-center" href="#">
            <Music className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold">GroupBeats</span>
          </Link>
        </div>
        <div className="flex justify-center items-center">
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            FAQ
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          {/* <Link href="#">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link> */}
          <Link href="">
            <Button size="sm" onClick={()=>getIn()}>{session.data?.user?`log Out`:`sign In`}</Button>
          </Link>
        </div>
        </div>
    </header>
  )
}

export default Appbar