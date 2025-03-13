import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Users, Share2, Headphones, PlayCircle, ChevronRight, ArrowRight } from "lucide-react"
import Appbar from "./comps/Appbar"
import { Redirect } from "./comps/Redirect"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <header className="px-4 lg:px-6 h-16 flex items-center border-b">
      </header> */}
        <Appbar/>
        <Redirect/>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-purple-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center items-center text-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create the Perfect Playlist Together
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    GroupBeats lets you and your friends build collaborative playlists for parties, road trips,
                    workouts, or any occasion. Music is better when shared.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                  <Link href="#">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#">
                    <Button size="lg" variant="outline" className="gap-1">
                      See How It Works <PlayCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[300px] sm:h-[400px] sm:w-[350px] lg:h-[500px] lg:w-[400px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=500&width=400"
                    alt="GroupBeats app interface showing a collaborative playlist"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="w-full">
                      <h3 className="text-white text-lg font-bold">Road Trip Mix</h3>
                      <p className="text-white/80 text-sm">12 contributors • 45 tracks</p>
                      <div className="flex mt-2 -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden">
                            <Image
                              src={`/placeholder.svg?height=32&width=32&text=${i}`}
                              alt={`User ${i}`}
                              width={32}
                              height={32}
                            />
                          </div>
                        ))}
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-xs text-white font-medium">
                          +8
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features You&apos;ll Love</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to create the perfect shared music experience with friends, family, or colleagues.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Collaborative Playlists</h3>
                <p className="text-muted-foreground">
                  Invite friends to add songs, vote on tracks, and build the perfect playlist together in real-time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Share2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Easy Sharing</h3>
                <p className="text-muted-foreground">
                  Share your playlists with anyone through a simple link, QR code, or directly to social media.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Headphones className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Group Listening</h3>
                <p className="text-muted-foreground">
                  Listen together in sync, no matter where everyone is located. Perfect for virtual hangouts.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Creating the perfect group playlist is simple with GroupBeats.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold">Create a Playlist</h3>
                <p className="text-muted-foreground">
                  Start a new playlist and customize it with a name, cover image, and description.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold">Invite Friends</h3>
                <p className="text-muted-foreground">
                  Share a link with friends so they can join and contribute their favorite tracks.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold">Enjoy Together</h3>
                <p className="text-muted-foreground">
                  Listen to your collaborative playlist in sync or export it to your favorite music service.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Our Users Are Saying</h2>
                <div className="space-y-4">
                  <div className="rounded-lg bg-background p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm text-muted-foreground italic">
                        &quot;GroupBeats made planning music for our road trip so much easier. Everyone got to add their
                          favorites, and we discovered new music together!&quot;
                        </p>
                        <p className="mt-2 text-sm font-medium">Sarah K.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-background p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm text-muted-foreground italic">
                        &quot;We use GroupBeats for our office playlists. It&apos;s democratic and keeps everyone happy with the
                          music selection during work hours.&quot;
                        </p>
                        <p className="mt-2 text-sm font-medium">Michael T.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Ready to create your first group playlist?</h3>
                  <p className="text-muted-foreground">
                    Join thousands of music lovers who are creating better music experiences together.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex flex-col gap-2">
                    <Input type="email" placeholder="Enter your email" />
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Get Started For Free
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground">
                    No credit card required. Free plan includes up to 5 group playlists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t bg-gradient-to-t from-purple-50 to-white">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to transform how you share music?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join GroupBeats today and start creating collaborative playlists with your friends, family, and
                colleagues.
              </p>
            </div>
            <div className="mx-auto flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link href="#">
                <Button size="lg" className="gap-1">
                  Sign Up Free <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">© {new Date().getFullYear()} GroupBeats. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Terms
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

