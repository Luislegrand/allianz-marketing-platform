import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Upload, BarChart3, Users, Instagram, TrendingUp, Eye, MessageSquare, DollarSign, UserPlus, Plus, Edit, Trash2, Search, Filter, Tag, AlertCircle } from 'lucide-react';

const AllianzPlatform = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [posts, setPosts] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newPost, setNewPost] = useState({ caption: '', scheduledDate: '', image: null });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [taskView, setTaskView] = useState('kanban');
  const [draggedTask, setDraggedTask] = useState(null);
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
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    clientId: '',
    assignedTo: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    checklist: []
  });

  // Dados mockados
  const users = {
    agency: { id: 1, email: 'agencia@allianz.com', password: '123', role: 'agency', name: 'Allianz Marketing' }
  };

  const services = [
    'Gestão de Redes Sociais',
    'Tráfego Pago',
    'Design',
    'Edição de Vídeos',
    'Desenvolvimento de Site'
  ];

  const teamMembers = [
    'Social Media 1',
    'Social Media 2',
    'Designer',
    'Editor de Vídeos'
  ];

  const mockPosts = [
    {
      id: 1,
      clientId: 2,
      clientName: 'Loja XYZ',
      caption: 'Promoção imperdível! 50% OFF em toda loja 🔥',
      image: 'https://via.placeholder.com/400x400/FF6B6B/ffffff?text=Post+1',
      scheduledDate: '2025-10-30',
      status: 'pending',
      createdAt: '2025-10-28T10:30:00',
      observations: null
    },
    {
      id: 2,
      clientId: 2,
      clientName: 'Loja XYZ',
      caption: 'Novidades chegando! Fique ligado 👀',
      image: 'https://via.placeholder.com/400x400/4ECDC4/ffffff?text=Post+2',
      scheduledDate: '2025-10-31',
      status: 'approved',
      createdAt: '2025-10-27T14:20:00',
      observations: null
    }
  ];

  const mockClients = [
    {
      id: 2,
      name: 'João Silva',
      businessName: 'Loja XYZ',
      email: 'cliente1@email.com',
      password: '123',
      role: 'client',
      phone: '(11) 98765-4321',
      cnpj: '12.345.678/0001-90',
      segment: 'E-commerce',
      services: ['Gestão de Redes Sociais', 'Tráfego Pago'],
      contractStart: '2025-01-15',
      monthlyValue: '2500',
      paymentDay: '10',
      goals: 'Aumentar vendas em 30% nos próximos 3 meses',
      instagram: '@lojaxyz',
      status: 'active',
      createdAt: '2025-01-15'
    }
  ];

  const mockTasks = [
    {
      id: 1,
      title: 'Criar 5 posts para Loja XYZ',
      description: 'Posts promocionais para Black Friday',
      clientId: 2,
      clientName: 'Loja XYZ',
      assignedTo: 'Social Media 1',
      priority: 'high',
      status: 'todo',
      dueDate: '2025-11-05',
      createdAt: '2025-10-28',
      checklist: [
        { id: 1, text: 'Brainstorm de ideias', completed: true },
        { id: 2, text: 'Criar artes', completed: false },
        { id: 3, text: 'Escrever legendas', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Revisar campanha Meta Ads',
      description: 'Analisar performance e otimizar',
      clientId: 2,
      clientName: 'Loja XYZ',
      assignedTo: 'Social Media 2',
      priority: 'medium',
      status: 'doing',
      dueDate: '2025-11-02',
      createdAt: '2025-10-27',
      checklist: []
    }
  ];

  useEffect(() => {
    setPosts(mockPosts);
    setClients(mockClients);
    setTasks(mockTasks);
  }, []);

  const handleLogin = () => {
    if (loginEmail === users.agency.email && loginPassword === users.agency.password) {
      setCurrentUser(users.agency);
      setView('agency-dashboard');
    } else {
      const client = clients.find(c => c.email === loginEmail && c.password === loginPassword);
      if (client) {
        setCurrentUser(client);
        setView('client-dashboard');
      } else {
        alert('Credenciais inválidas');
      }
    }
  };

  const handlePostAction = (postId, action, observation = null) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (action === 'approve') {
          return { ...post, status: 'approved' };
        } else if (action === 'revise') {
          return { ...post, status: 'revision', observations: observation };
        }
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (!newPost.caption || !newPost.scheduledDate || !selectedClient) {
      alert('Preencha todos os campos');
      return;
    }

    const post = {
      id: posts.length + 1,
      clientId: selectedClient.id,
      clientName: selectedClient.businessName,
      caption: newPost.caption,
      image: 'https://via.placeholder.com/400x400/A8E6CF/ffffff?text=Novo+Post',
      scheduledDate: newPost.scheduledDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
      observations: null
    };

    setPosts([post, ...posts]);
    setNewPost({ caption: '', scheduledDate: '', image: null });
    alert('Post enviado para aprovação! Notificação enviada ao cliente.');
  };

  const handleCreateClient = () => {
    if (!newClient.name || !newClient.businessName || !newClient.email || !newClient.password) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const client = {
      id: clients.length + 2,
      ...newClient,
      role: 'client',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setClients([...clients, client]);
    alert(`Cliente cadastrado!\n\nCredenciais de acesso:\nEmail: ${newClient.email}\nSenha: ${newClient.password}`);
    setShowNewClientModal(false);
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
    });
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.clientId || !newTask.assignedTo) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const client = clients.find(c => c.id === parseInt(newTask.clientId));
    const task = {
      id: tasks.length + 1,
      ...newTask,
      clientName: client?.businessName || '',
      createdAt: new Date().toISOString(),
      checklist: []
    };

    setTasks([...tasks, task]);
    setShowNewTaskModal(false);
    setNewTask({
      title: '',
      description: '',
      clientId: '',
      assignedTo: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      checklist: []
    });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const Logo = () => (
    <svg className="h-8" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L25 35H20L18 28H12L10 35H5L15 5ZM15 12L13 23H17L15 12Z" fill="#ffa600"/>
      <path d="M30 10H35V35H30V10Z" fill="#ffa600"/>
      <path d="M40 10H45V35H40V10Z" fill="#ffa600"/>
      <path d="M50 15C50 12 52 10 55 10C58 10 60 12 60 15V35H55V15H50V35H45V15C45 12 47 10 50 10Z" fill="#ffa600"/>
      <path d="M65 28C65 31 67 33 70 33C73 33 75 31 75 28V17C75 14 73 12 70 12C67 12 65 14 65 17V28ZM60 28C60 34 64 38 70 38C76 38 80 34 80 28V17C80 11 76 7 70 7C64 7 60 11 60 17V28Z" fill="#ffa600"/>
      <path d="M85 10H90V22L95 10H100L95 22L100 35H95L90 23V35H85V10Z" fill="#ffa600"/>
      <path d="M105 35L115 10H110L107 20L104 10H99L109 35H105V" fill="#ffa600"/>
    </svg>
  );

  // LOGIN SCREEN
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-800">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-white">Allianz Marketing</h1>
            <p className="text-gray-400 mt-2">Gestão de Conteúdo e Campanhas</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              style={{ background: '#ffa600' }}
            >
              Entrar
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg text-xs text-gray-400 border border-gray-700">
            <p className="font-semibold mb-2 text-gray-300">Teste com:</p>
            <p>Agência: agencia@allianz.com / 123</p>
            <p>Cliente: cliente1@email.com / 123</p>
          </div>
        </div>
      </div>
    );
  }

  // AGENCY DASHBOARD
  if (view === 'agency-dashboard') {
    return (
      <div className="min-h-screen bg-black">
        <div className="bg-gray-900 text-white p-6 shadow-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold">Allianz Marketing</h1>
                <p className="text-gray-400">Bem-vindo, {currentUser.name}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setView('login');
                setLoginEmail('');
                setLoginPassword('');
              }}
              className="px-4 py-2 rounded-lg transition border border-gray-700 hover:bg-gray-800"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setView('agency-dashboard')}
                className="py-4 border-b-2 text-white font-medium"
                style={{ borderColor: '#ffa600' }}
              >
                Posts
              </button>
              <button
                onClick={() => setView('agency-metrics')}
                className="py-4 text-gray-400 hover:text-white"
              >
                Métricas
              </button>
              <button
                onClick={() => setView('agency-clients')}
                className="py-4 text-gray-400 hover:text-white"
              >
                Clientes
              </button>
              <button
                onClick={() => setView('agency-tasks')}
                className="py-4 text-gray-400 hover:text-white"
              >
                Tarefas
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Upload className="mr-2" size={24} style={{ color: '#ffa600' }} />
              Criar Novo Post
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cliente</label>
                <select
                  value={selectedClient?.id || ''}
                  onChange={(e) => {
                    const client = clients.find(c => c.id === parseInt(e.target.value));
                    setSelectedClient(client);
                  }}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.businessName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Legenda</label>
                <textarea
                  value={newPost.caption}
                  onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Escreva a legenda do post..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Data de Publicação</label>
                  <input
                    type="date"
                    value={newPost.scheduledDate}
                    onChange={(e) => setNewPost({...newPost, scheduledDate: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Imagem</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                onClick={handleCreatePost}
                className="w-full text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
                style={{ background: '#ffa600' }}
              >
                Enviar para Aprovação
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Posts Recentes</h2>

            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border border-gray-800 rounded-lg p-4 hover:shadow-md transition bg-gray-800">
                  <div className="flex gap-4">
                    <img src={post.image} alt="Post" className="w-24 h-24 rounded-lg object-cover" />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-white">{post.clientName}</h3>
                          <p className="text-sm text-gray-300">{post.caption}</p>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          post.status === 'approved' ? 'bg-green-900 text-green-300' :
                          post.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                          post.status === 'revision' ? 'bg-orange-900 text-orange-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {post.status === 'approved' ? 'Aprovado' :
                           post.status === 'pending' ? 'Pendente' :
                           post.status === 'revision' ? 'Em Revisão' :
                           'Rejeitado'}
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
                        <div className="mt-2 p-2 bg-orange-900/30 border-l-4 rounded" style={{ borderColor: '#ffa600' }}>
                          <p className="text-sm" style={{ color: '#ffa600' }}>
                            <strong>Observações:</strong> {post.observations}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Restante do código continua...
  // (Por limitação de espaço, vou criar um segundo artifact com o restante)
  
  return <div className="min-h-screen bg-black text-white p-8">Carregando...</div>;
};

export default function Home() {
  return <AllianzPlatform />;
}
