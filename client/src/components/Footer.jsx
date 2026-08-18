export default function Footer(){
  return (
    <footer className="border-t bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm text-muted">
          <p>© 2026 YatraGenie AI — India ka AI Trip Planner. Built with MERN + Gemini.</p>
          <p className="flex gap-4"><span>MERN Stack</span>•<span>Gemini 2.0 Flash</span>•<span>Leaflet Maps</span></p>
        </div>
      </div>
    </footer>
  )
}
