const Footer = () => {
  return (
    <footer className="font-poppins flex items-center justify-between px-10 py-8">
      <div className="text-black/80">
        <span>&copy; {new Date().getFullYear()}.</span>
      </div>
      <div className="flex gap-x-4 text-sm text-black/80">
        <div>Terms Of Use</div>
        <div>Help Center</div>
      </div>
    </footer>
  )
}

export default Footer
