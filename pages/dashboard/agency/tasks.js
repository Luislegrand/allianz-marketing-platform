import { useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useAllianz } from '../../../context/AllianzContext'
import { Plus, Calendar, Users, Tag, AlertCircle, XCircle } from 'lucide-react'

export default function AgencyTasks() {
  const router = useRouter()
  const {
    tasks,
    clients,
    updateTaskStatus,
    setDraggedTask,
    draggedTask,
    handleCreateTask
  } = useAllianz()

  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [taskView, setTaskView] = useState('kanban')
  const teamMembers = ['Social Media 1', 'Social Media 2', 'Designer', 'Editor de Vídeos']

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    clientId: '',
    assignedTo: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    checklist: []
  })

  const todoTasks = tasks.filter((t) => t.status === 'todo')
  const doingTasks = tasks.filter((t) => t.status === 'doing')
  const doneTasks = tasks.filter((t) => t.status === 'done')

  const onSubmit = () => {
    if (!newTask.title || !newTask.clientId || !newTask.assignedTo) {
      alert('Preencha os campos obrigatórios')
      return
    }
    handleCreateTask(newTask)
    setShowNewTaskModal(false)
    setNewTask({
      title: '',
      description: '',
      clientId: '',
      assignedTo: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      checklist: []
    })
  }

  const TaskCard = ({ task }) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
    const completedItems = task.checklist.filter((item) => item.completed).length

    return (
      <div
        draggable
        onDragStart={(e) => {
          setDraggedTask(task)
          e.currentTarget.style.opacity = '0.5'
        }}
        onDragEnd={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
        className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 cursor-move"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-white text-sm">{task.title}</h3>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              task.priority === 'high'
                ? 'bg-red-900 text-red-300'
                : task.priority === 'medium'
                  ? 'bg-yellow-900 text-yellow-300'
                  : 'bg-blue-900 text-blue-300'
            }`}
          >
            {task.priority === 'high'
              ? 'Alta'
              : task.priority === 'medium'
                ? 'Média'
                : 'Baixa'}
          </span>
        </div>

        {task.description && <p className="text-xs text-gray-400 mb-3">{task.description}</p>}

        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>{task.clientName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={14} />
            <span>{task.assignedTo}</span>
          </div>
          {task.dueDate && (
            <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-400' : ''}`}>
              <Calendar size={14} />
              <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
              {isOverdue && <AlertCircle size={14} />}
            </div>
          )}
        </div>

        {task.checklist.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Progresso</span>
              <span style={{ color: '#ffa600' }}>
                {completedItems}/{task.checklist.length}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${(completedItems / task.checklist.length) * 100}%`,
                  background: '#ffa600'
                }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  const KanbanColumn = ({ title, status, tasks, count, color }) => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">{title}</h3>
          <span
            className="px-2 py-1 bg-gray-800 rounded text-sm"
            style={color ? { color } : { color: '#9ca3af' }}
          >
            {count}
          </span>
        </div>
        <div
          className="space-y-3 min-h-[400px] p-2 rounded-lg border-2 border-dashed border-gray-800 transition-colors"
          onDragOver={(e) => {
            e.preventDefault()
            e.currentTarget.style.borderColor = '#ffa600'
            e.currentTarget.style.backgroundColor = 'rgba(255, 166, 0, 0.05)'
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.borderColor = '#1f2937'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.currentTarget.style.borderColor = '#1f2937'
            e.currentTarget.style.backgroundColor = 'transparent'
            if (draggedTask && draggedTask.status !== status) {
              updateTaskStatus(draggedTask.id, status)
            }
            setDraggedTask(null)
          }}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header title="Allianz Marketing" subtitle="Gerenciador de Tarefas" />

      {/* Navigation */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex space-x-8">
          <button onClick={() => router.push('/dashboard/agency')} className="py-4 text-gray-400 hover:text-white">
            Posts
          </button>
          <button onClick={() => router.push('/dashboard/agency/metrics')} className="py-4 text-gray-400 hover:text-white">
            Métricas
          </button>
          <button onClick={() => router.push('/dashboard/agency/clients')} className="py-4 text-gray-400 hover:text-white">
            Clientes
          </button>
          <button
            onClick={() => router.push('/dashboard/agency/tasks')}
            className="py-4 border-b-2 text-white font-medium"
            style={{ borderColor: '#ffa600' }}
          >
            Tarefas
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setTaskView('kanban')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                taskView === 'kanban'
                  ? 'text-black'
                  : 'bg-gray-800 text-white border border-gray-700'
              }`}
              style={taskView === 'kanban' ? { background: '#ffa600' } : {}}
            >
              Kanban
            </button>
            <button
              onClick={() => setTaskView('list')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                taskView === 'list'
                  ? 'text-black'
                  : 'bg-gray-800 text-white border border-gray-700'
              }`}
              style={taskView === 'list' ? { background: '#ffa600' } : {}}
            >
              Lista
            </button>
          </div>

          <button
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center gap-2 text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            style={{ background: '#ffa600' }}
          >
            <Plus size={20} />
            Nova Tarefa
          </button>
        </div>

        {taskView === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KanbanColumn
                title="A Fazer"
                status="todo"
                tasks={todoTasks}
                count={todoTasks.length}
              />

              <KanbanColumn
                title="Em Andamento"
                status="doing"
                tasks={doingTasks}
                count={doingTasks.length}
                color="#ffa600"
              />

              <KanbanColumn
                title="Concluído"
                status="done"
                tasks={doneTasks}
                count={doneTasks.length}
                color="#22c55e"
              />
            </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Tarefa</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Cliente</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Responsável</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Prioridade</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Prazo</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-t border-gray-800 hover:bg-gray-800 transition">
                    <td className="px-4 py-3 text-white">{task.title}</td>
                    <td className="px-4 py-3 text-gray-300">{task.clientName}</td>
                    <td className="px-4 py-3 text-gray-300">{task.assignedTo}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          task.priority === 'high'
                            ? 'bg-red-900 text-red-300'
                            : task.priority === 'medium'
                              ? 'bg-yellow-900 text-yellow-300'
                              : 'bg-blue-900 text-blue-300'
                        }`}
                      >
                        {task.priority === 'high'
                          ? 'Alta'
                          : task.priority === 'medium'
                            ? 'Média'
                            : 'Baixa'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          task.status === 'done'
                            ? 'bg-green-900 text-green-300'
                            : task.status === 'doing'
                              ? 'bg-orange-900 text-orange-300'
                              : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {task.status === 'done'
                          ? 'Concluído'
                          : task.status === 'doing'
                            ? 'Andamento'
                            : 'A Fazer'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL NOVA TAREFA */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Nova Tarefa</h2>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Criar 5 posts para cliente X"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Descreva os detalhes da tarefa..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cliente *
                  </label>
                  <select
                    value={newTask.clientId}
                    onChange={(e) => setNewTask({ ...newTask, clientId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Selecione</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.businessName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Responsável *
                  </label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Selecione</option>
                    {teamMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onSubmit}
                  className="flex-1 text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
                  style={{ background: '#ffa600' }}
                >
                  Criar Tarefa
                </button>
                <button
                  onClick={() => setShowNewTaskModal(false)}
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
