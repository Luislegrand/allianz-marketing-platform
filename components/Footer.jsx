// components/Footer.jsx
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-900 mt-10">
      <div className="max-w-7xl mx-auto py-6 flex flex-col items-center gap-2">
        <Logo size={110} />
        <p className="text-xs text-gray-500 text-center">
          © 2025 Allianz Marketing — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
