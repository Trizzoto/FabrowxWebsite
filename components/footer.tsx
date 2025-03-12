export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
      <div className="container px-4 md:px-6">
        <p className="text-zinc-500 text-sm text-center">
          &copy; {new Date().getFullYear()} Elite FabWorx. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

