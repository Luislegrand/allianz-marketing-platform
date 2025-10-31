import { useRouter } from 'next/router'
import { Instagram, Eye, TrendingUp, UserPlus, MessageSquare, BarChart3, DollarSign } from 'lucide-react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useAllianz } from '../../../context/AllianzContext'

export default function AgencyMetrics() {
  const router = useRouter()
  const { clients } = useAllianz()

  const mockMetrics = {
    instagram: { reach: 2803, profileVisits: 101, followers: 9, engagement: 4.2 },
    metaAds: { invested: 209.06, reach: 7050, clicks: 184, conversations: 27, costPerConversation: 7.74 }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header title="Allianz Marketing" subtitle="Dashboard de Métricas" />

      {/* Navigation */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex space-x-8">
          <button onClick={() => router.push('/dashboard/agency')} className="py-4 text-gray-400 hover:text-white">
            Posts
          </button>
          <button
            onClick={() => router.push('/dashboard/agency/metrics')}
            className="py-4 border-b-2 text-white font-medium"
            style={{ borderColor: '#ffa600' }}
          >
            Métricas
          </button>
          <button onClick={() => router.push('/dashboard/agency/clients')} className="py-4 text-gray-400 hover:text-white">
            Clientes
          </button>
          <button onClick={() => router.push('/dashboard/agency/tasks')} className="py-4 text-gray-400 hover:text-white">
            Tarefas
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto p-6 w-full">
        {/* Selecionar Cliente */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Selecionar Cliente</label>
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500">
            {clients.map((client) => (
              <option key={client.id}>{client.businessName}</option>
            ))}
          </select>
        </div>

        {/* Instagram */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Instagram className="mr-2" size={24} style={{ color: '#ffa600' }} />
            Movimento do Instagram
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Alcance</span>
                <Eye size={20} style={{ color: '#ffa600' }} />
              </div>
              <p className="text-2xl font-bold text-white">
                {mockMetrics.instagram.reach.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-gray-400 mt-1">mil pessoas</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Visitas no Perfil</span>
                <TrendingUp size={20} style={{ color: '#ffa600' }} />
              </div>
              <p className="text-2xl font-bold text-white">{mockMetrics.instagram.profileVisits}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Seguidores</span>
                <UserPlus size={20} style={{ color: '#ffa600' }} />
              </div>
              <p className="text-2xl font-bold text-white">+{mockMetrics.instagram.followers}</p>
              <p className="text-xs text-gray-400 mt-1" style={{ color: '#ffa600' }}>
                ↑ novos
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Engajamento</span>
                <MessageSquare size={20} style={{ color: '#ffa600' }} />
              </div>
              <p className="text-2xl font-bold text-white">{mockMetrics.instagram.engagement}%</p>
            </div>
          </div>
        </div>

        {/* Meta Ads */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <BarChart3 className="mr-2" size={24} style={{ color: '#ffa600' }} />
            Campanha de Mensagens (Meta Ads)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Investido</span>
                <DollarSign size={20} style={{ color: '#ffa600' }} />
              </div>
              <p className="text-xl font-bold text-white">
                R$ {mockMetrics.metaAds.invested.toFixed(2)}
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Alcance</span>
                <Eye size={20} style={{ color: '#ffa600' }} />
              </div>
              <p className="text-xl font-bold text-white">
                {mockMetrics.metaAds.reach.toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Cliques</span>
                <TrendingUp size={20} style={{ color: '#ffa600' }} />
              </div>
              <p className="text-xl font-bold text-white">{mockMetrics.metaAds.clicks}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Conversas</span>
                <MessageSquare size={20} style={{ color: '#ffa600' }} />
              </div>
              <p className="text-xl font-bold text-white">{mockMetrics.metaAds.conversations}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Custo/Conversa</span>
                <DollarSign size={20} style={{ color: '#ffa600' }} />
              </div>
              <p className="text-xl font-bold text-white">
                R$ {mockMetrics.metaAds.costPerConversation.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
