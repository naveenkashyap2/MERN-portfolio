export default function Footer(){
  return (
    <footer className="border-t bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
          <p className="text-muted text-center md:text-left">© 2026 YatraGenie AI — Crafted for Bharat Yatris.</p>
          <p className="font-medium text-charcoal flex items-center gap-1.5">
            Developer by <span className="font-bold text-primary-600">Naveen</span> 
            <span className="w-1 h-1 bg-border rounded-full inline-block"></span> 
            <span className="text-muted font-normal">Made with ❤️ in Kanpur</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
