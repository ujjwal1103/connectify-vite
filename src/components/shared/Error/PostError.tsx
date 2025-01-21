
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function PostNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen text-zinc-100">
      <div className="max-w-md w-full px-6 py-12 bg-background rounded-lg shadow-xl">
        <div className="flex flex-col items-center text-center">
          <ErrorSVG />
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-zinc-100">
            Post Not Found
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Sorry, we couldn't find the post you're looking for. It might have been removed or doesn't exist.
          </p>
          <Button asChild className="mt-8 bg-secondary hover:bg-secondary/50 text-zinc-100">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ErrorSVG() {
  return (
    <svg
      className="w-32 h-32 text-zinc-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

