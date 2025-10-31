// pages/dashboard/client/index.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAllianz } from '../../../context/AllianzContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Calendar, Clock, CheckCircle, MessageSquare } from 'lucide-react'

export default function ClientDashboard() {
  const { currentUser, posts, handlePostAction } = useAllianz()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(null)

  if (!currentUser) {
    // se não estiver logado, volta pro login
    if (typeof window !== 'undefined') {
      router.push('/')
    }
    return null
  }

  const clientPosts = posts.filter((p) => p.clientId === currentUser.id)
  const pendingPosts = clientPosts.filter((p) => p.status === 'pending')

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header title={currentUser.businessName} subtitle="Painel do Cliente" />

      <main className="flex-1 max-w-4xl mx-auto p-4 w-full">
        {pendingPosts.length > 0 && (
          <div
            className="bg-gray-900 border-l-4 p-4 mb-6 rounded-lg border border-gray-800"
            style={{ borderLeftColor: '#ffa600' }}
          >
            <div className="flex items-center">
              <Clock className="mr-2" size={20} style={{ color: '#ffa600' }} />
              <p className="font-semibold text-white">
                Você tem {pendingPosts.length} post(s) aguardando aprovação
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {clientPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-800"
            >
              {/* imagem ajustada */}
              <div
                className="w-full bg-black flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedImage(post.image)}
              >
                <img
                  src={post.image}
                  alt="Post"
                  className="max-h-96 w-full object-contain bg-black"
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white mb-2">{post.caption}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar size={16} className="mr-1" />
                      Publicação: {new Date(post.scheduledDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.status === 'approved'
                        ? 'bg-green-900 text-green-300'
                        : post.status === 'pending'
                        ? 'bg-yellow-900 text-yellow-300'
                        : post.status === 'revision'
                        ? 'bg-orange-900 text-orange-300'
                        : 'bg-red-900 text-red-300'
                    }`}
                  >
                    {post.status === 'approved'
                      ? 'Aprovado'
                      : post.status === 'pending'
                      ? 'Pendente'
                      : post.status === 'revision'
                      ? 'Em Revisão'
                      : 'Rejeitado'}
                  </span>
                </div>

                {post.status === 'pending' && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => {
                        handlePostAction(post.id, 'approve')
                        alert('Post aprovado! Será publicado automaticamente na data agendada.')
                      }}
                      className="w-full text-black py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center"
                      style={{ background: '#ffa600' }}
                    >
                      <CheckCircle className="mr-2" size={20} />
                      Aprovar Post
                    </button>

                    <button
                      onClick={() => {
                        const obs = window.prompt('Digite suas observações para revisão:')
                        if (obs && obs.trim()) {
                          handlePostAction(post.id, 'revise', obs)
                          alert('Observações enviadas! A equipe fará os ajustes.')
                        }
                      }}
                      className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center border border-gray-700"
                    >
                      <MessageSquare className="mr-2" size={20} />
                      Solicitar Revisão
                    </button>
                  </div>
                )}

                {post.status === 'approved' && (
                  <div className="mt-4 pt-4 border-t border-gray-800 bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm flex items-center" style={{ color: '#ffa600' }}>
                      <CheckCircle className="mr-2" size={18} />
                      Este post será publicado automaticamente no Instagram em{' '}
                      {new Date(post.scheduledDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}

                {post.observations && post.status === 'revision' && (
                  <div className="mt-3 bg-orange-900/20 border-l-4 border-orange-400 p-3 rounded">
                    <p className="text-sm text-orange-200">
                      <strong>Observações do cliente:</strong> {post.observations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {clientPosts.length === 0 && (
            <p className="text-gray-400 text-sm">
              Nenhum post enviado pela agência para aprovação ainda.
            </p>
          )}
        </div>

        {/* Métricas do cliente */}
<div className="mt-6 bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800">
  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
    <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#ffa600' }} />
    Suas Métricas
  </h2>

  <div className="grid grid-cols-2 gap-4">
    <div className="bg-gray-800 p-4 rounded-lg border-l-4" style={{ borderColor: '#ffa600' }}>
      <p className="text-gray-400 text-xs mb-1">Alcance</p>
      <p className="text-2xl text-white font-bold">
        {currentUser?.metrics?.reach ?? 0}
      </p>
    </div>

    <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-gray-700">
      <p className="text-gray-400 text-xs mb-1">Visitas no Perfil</p>
      <p className="text-2xl text-white font-bold">
        {currentUser?.metrics?.profileVisits ?? 0}
      </p>
    </div>

    <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-gray-700">
      <p className="text-gray-400 text-xs mb-1">Novos Seguidores</p>
      <p className="text-2xl text-white font-bold">
        {currentUser?.metrics?.followers ?? 0}
      </p>
    </div>

    <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-gray-700">
      <p className="text-gray-400 text-xs mb-1">Campanhas</p>
      <p className="text-2xl text-white font-bold">
        {currentUser?.metrics?.campaigns ?? 0}
      </p>
    </div>
  </div>
</div>
        
      </main>

      {/* MODAL DE IMAGEM */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Post ampliado"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-gray-800"
          />
        </div>
      )}

      <Footer />
    </div>
  )
}
