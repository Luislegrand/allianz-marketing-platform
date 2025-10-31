// pages/index.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAllianz } from '../context/AllianzContext'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

export default function Home() {
  const { handleLogin } = useAllianz()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const ok = handleLogin(email, password)
    if (!ok) {
      setError('Credenciais inválidas')
      return
    }
    // se for agência
    if (email === 'agencia@allianz.com') {
      router.push('/dashboard/agency')
    } else {
      router.push('/dashboard/client')
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-800">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-white">Allianz Marketing</h1>
            <p className="text-gray-400 mt-2">Gestão de Conteúdo e Campanhas</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error ? <p className="text-red-400 text-sm">{error}</p> : null}

            <button
              type="submit"
              className="w-full text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              style={{ background: '#ffa600' }}
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg text-xs text-gray-400 border border-gray-700">
            <p className="font-semibold mb-2 text-gray-300">Teste com:</p>
            <p>Agência: agencia@allianz.com / 123</p>
            <p>Cliente: cliente1@email.com / 123</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
