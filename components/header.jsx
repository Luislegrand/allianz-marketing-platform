// components/Header.jsx
import { useRouter } from 'next/router'
import { useAllianz } from '../context/AllianzContext'
import Logo from './Logo'

export default function Header({ title = 'Allianz Marketing', subtitle = '' }) {
  const { currentUser, handleLogout } = useAllianz()
  const router = useRouter()

  const onLogout = () => {
    handleLogout()
    router.push('/')
  }

  return (
    <header className="bg-gray-900 text-white p-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle ? (
              <p className="text-gray-400 text-sm">{subtitle}</p>
            ) : currentUser ? (
              <p className="text-gray-400 text-sm">Bem-vindo, {currentUser.name || currentUser.businessName}</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg transition border border-gray-700 hover:bg-gray-800 text-sm"
            >
              Sair
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
