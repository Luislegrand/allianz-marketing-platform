import { useState } from 'react'
import { useRouter } from 'next/router'
import { Plus, XCircle, Edit } from 'lucide-react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useAllianz } from '../../../context/AllianzContext'

const services = [
  'Gestão de Redes Sociais',
  'Tráfego Pago',
  'Design',
  'Edição de Vídeos',
  'Desenvolvimento de Site'
]

export default function AgencyClients() {
  const router = useRouter()
  const { clients, handleCreateClient } = useAllianz()
  const [showModal, setShowModal] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    cnpj: '',
    segment: '',
    services: [],
    contractStart: '',
    monthlyValue: '',
    paymentDay: '',
    goals: '',
    instagram: '',
    password: ''
  })

  const onSubmit = () => {
    if (!newClient.name || !newClient.businessName || !newClient.email || !newClient.password) {
      alert('Preencha os campos obrigatórios')
      return
    }
    handleCreateClient(newClient)
    setShowModal(false)
    setNewClient({
      name: '',
      businessName: '',
      email: '',
      phone: '',
      cnpj: '',
      segment: '',
      services: [],
      contractStart: '',
      monthlyValue: '',
      paymentDay: '',
      goals: '',
      instagram: '',
      password: ''
    })
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header title="Allianz Marketing" subtitle="Gestão de Clientes" />

      {/* Navigation */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex space-x-8">
          <button onClick={() => router.push('/dashboard/agency')} className="py-4 text-gray-400 hover:text-white">
            Posts
          </button>
          <button onClick={() => router.push('/dashboard/agency/metrics')} className="py-4 text-gray-400 hover:text-white">
            Métricas
          </button>
          <button
            onClick={() => router.push('/dashboard/agency/clients')}
            className="py-4 border-b-2 text-white font-medium"
            style={{ borderColor: '#ffa600' }}
          >
            Clientes
          </button>
          <button onClick={() => router.push('/dashboard/agency/tasks')} className="py-4 text-gray-400 hover:text-white">
            Tarefas
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Clientes ({clients.length})</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            style={{ background: '#ffa600' }}
          >
            <Plus size={20} />
            Novo Cliente
          </button>
        </div>

        <div className="grid gap-4">
          {clients.map((client) => (
            <div key={client.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{client.businessName}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-900 text-green-300">
                      Ativo
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Responsável</p>
                      <p className="text-white">{client.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="text-white">{client.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Telefone</p>
                      <p className="text-white">{client.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Instagram</p>
                      <p className="text-white">{client.instagram}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Serviços</p>
                      <p className="text-white">{client.services?.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Valor Mensal</p>
                      <p className="text-white">R$ {client.monthlyValue}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 border border-gray-700">
                    <Edit size={18} style={{ color: '#ffa600' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {clients.length === 0 && (
            <p className="text-gray-400 text-sm">Nenhum cliente cadastrado ainda.</p>
          )}
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Novo Cliente</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Responsável *
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="João Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    value={newClient.businessName}
                    onChange={(e) =>
                      setNewClient({ ...newClient, businessName: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Loja ABC"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="cliente@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Senha de Acesso *
                  </label>
                  <input
                    type="text"
                    value={newClient.password}
                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Digite a senha"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone/WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CNPJ</label>
                  <input
                    type="text"
                    value={newClient.cnpj}
                    onChange={(e) => setNewClient({ ...newClient, cnpj: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="00.000.000/0001-00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Segmento</label>
                <input
                  type="text"
                  value={newClient.segment}
                  onChange={(e) => setNewClient({ ...newClient, segment: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="E-commerce, Serviços, etc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Serviços Contratados
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-2 text-gray-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newClient.services.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewClient({
                              ...newClient,
                              services: [...newClient.services, service]
                            })
                          } else {
                            setNewClient({
                              ...newClient,
                              services: newClient.services.filter((s) => s !== service)
                            })
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Início do Contrato
                  </label>
                  <input
                    type="date"
                    value={newClient.contractStart}
                    onChange={(e) =>
                      setNewClient({ ...newClient, contractStart: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Valor Mensal (R$)
                  </label>
                  <input
                    type="number"
                    value={newClient.monthlyValue}
                    onChange={(e) =>
                      setNewClient({ ...newClient, monthlyValue: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dia de Pagamento
                  </label>
                  <input
                    type="number"
                    value={newClient.paymentDay}
                    onChange={(e) =>
                      setNewClient({ ...newClient, paymentDay: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="10"
                    min="1"
                    max="31"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                <input
                  type="text"
                  value={newClient.instagram}
                  onChange={(e) => setNewClient({ ...newClient, instagram: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="@empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Objetivos/Metas
                </label>
                <textarea
                  value={newClient.goals}
                  onChange={(e) => setNewClient({ ...newClient, goals: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Descreva os objetivos do cliente..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onSubmit}
                  className="flex-1 text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
                  style={{ background: '#ffa600' }}
                >
                  Cadastrar Cliente
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
