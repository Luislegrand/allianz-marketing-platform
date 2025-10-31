// pages/dashboard/agency/index.js
import { useState } from 'react'
import { useAllianz } from '../../../context/AllianzContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Upload, Calendar, Clock } from 'lucide-react'
import { useRouter } from 'next/router'

export default function AgencyDashboard() {
  const {
    clients,
    posts,
    selectedClient,
    setSelectedClient,
    handleUploadImage,
    handleCreatePost,
  } = useAllianz()

  const router = useRouter()
  const [newPost, setNewPost] = useState({ caption: '', scheduledDate: '', image: null })

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header title="Allianz Marketing" subtitle="Painel da Agência — Posts" />

      {/* Nav */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex space-x-8">
          <button
            onClick={() => router.push('/dashboard/agency')}
            className="py-4 border-b-2 text-white font-medium"
            style={{ borderColor: '#ffa600' }}
          >
            Posts
          </button>
          <button
            onClick={() => router.push('/dashboard/agency/metrics')}
            className="py-4 text-gray-400 hover:text-white"
          >
            Métricas
          </button>
          <button
            onClick={() => router.push('/dashboard/agency/clients')}
            className="py-4 text-gray-400 hover:text-white"
          >
            Clientes
          </button>
          <button
            onClick={() => router.push('/dashboard/agency/tasks')}
            className="py-4 text-gray-400 hover:text-white"
          >
            Tarefas
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto p-6 w-full">
        {/* Criar Post */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Upload className="mr-2" size={24} style={{ color: '#ffa600' }} />
            Criar Novo Post
          </h2>

          <div className="space-y-4">
            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cliente</label>
              <select
                value={selectedClient?.id || ''}
                onChange={(e) => {
                  const id = parseInt(e.target.value, 10)
                  const client = clients.find((c) => c.id === id)
                  setSelectedClient(client || null)
                }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.businessName}
                  </option>
                ))}
              </select>
            </div>

            {/* Legenda */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Legenda</label>
              <textarea
                value={newPost.caption}
                onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                rows="3"
                placeholder="Escreva a legenda do post..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data de Publicação
                </label>
                <input
                  type="date"
                  value={newPost.scheduledDate}
                  onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const imageUrl = await handleUploadImage(file)
                      if (imageUrl) {
                        setNewPost((prev) => ({ ...prev, image: imageUrl }))
                      }
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                />

                {newPost.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-1">Pré-visualização:</p>
                    <img
                      src={newPost.image}
                      alt="Prévia do post"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (!newPost.caption || !newPost.scheduledDate || !selectedClient) {
                  alert('Preencha todos os campos')
                  return
                }
                handleCreatePost(newPost, selectedClient)
                setNewPost({ caption: '', scheduledDate: '', image: null })
                alert('Post enviado para aprovação! Notificação enviada ao cliente.')
              }}
              className="w-full text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              style={{ background: '#ffa600' }}
            >
              Enviar para Aprovação
            </button>
          </div>
        </div>

        {/* Lista de Posts */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Posts Recentes</h2>

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-800 rounded-lg p-4 hover:shadow-md transition bg-gray-800"
              >
                <div className="flex gap-4">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-24 h-24 rounded-lg object-cover bg-gray-900"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{post.clientName}</h3>
                        <p className="text-sm text-gray-300">{post.caption}</p>
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

                    <div className="flex items-center text-sm text-gray-400 space-x-4">
                      <span className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {new Date(post.scheduledDate).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        Criado em {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {post.observations && (
                      <div
                        className="mt-2 p-2 bg-orange-900/30 border-l-4 rounded"
                        style={{ borderColor: '#ffa600' }}
                      >
                        <p className="text-sm" style={{ color: '#ffa600' }}>
                          <strong>Observações:</strong> {post.observations}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhum post criado ainda.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
