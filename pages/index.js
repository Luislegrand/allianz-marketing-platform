// pages/index.js
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  BarChart3,
  Users,
  Instagram,
  TrendingUp,
  Eye,
  MessageSquare,
  DollarSign,
  UserPlus,
  Plus,
  Edit,
  Tag,
  AlertCircle,
} from "lucide-react";

const AllianzPlatform = () => {
  // =========================================================
  // STATES
  // =========================================================
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login");
  const [posts, setPosts] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newPost, setNewPost] = useState({
    caption: "",
    scheduledDate: "",
    image: null, // agora é obrigatório
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [taskView, setTaskView] = useState("kanban");
  const [draggedTask, setDraggedTask] = useState(null);

  const [newClient, setNewClient] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    cnpj: "",
    segment: "",
    services: [],
    contractStart: "",
    monthlyValue: "",
    paymentDay: "",
    goals: "",
    instagram: "",
    password: "",
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    clientId: "",
    assignedTo: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
    checklist: [],
  });

  // =========================================================
  // MOCKS
  // =========================================================
  const users = {
    agency: {
      id: 1,
      email: "agencia@allianz.com",
      password: "123",
      role: "agency",
      name: "Allianz Marketing",
    },
  };

  const services = [
    "Gestão de Redes Sociais",
    "Tráfego Pago",
    "Design",
    "Edição de Vídeos",
    "Desenvolvimento de Site",
  ];

  const teamMembers = [
    "Social Media 1",
    "Social Media 2",
    "Designer",
    "Editor de Vídeos",
  ];

  const mockPosts = [
    {
      id: 1,
      clientId: 2,
      clientName: "Loja XYZ",
      caption: "Promoção imperdível! 50% OFF em toda loja 🔥",
      image: "https://via.placeholder.com/400x400/FF6B6B/ffffff?text=Post+1",
      scheduledDate: "2025-10-30",
      status: "pending",
      createdAt: "2025-10-28T10:30:00",
      observations: null,
    },
    {
      id: 2,
      clientId: 2,
      clientName: "Loja XYZ",
      caption: "Novidades chegando! Fique ligado 👀",
      image: "https://via.placeholder.com/400x400/4ECDC4/ffffff?text=Post+2",
      scheduledDate: "2025-10-31",
      status: "approved",
      createdAt: "2025-10-27T14:20:00",
      observations: null,
    },
  ];

  const mockClients = [
    {
      id: 2,
      name: "João Silva",
      businessName: "Loja XYZ",
      email: "cliente1@email.com",
      password: "123",
      role: "client",
      phone: "(11) 98765-4321",
      cnpj: "12.345.678/0001-90",
      segment: "E-commerce",
      services: ["Gestão de Redes Sociais", "Tráfego Pago"],
      contractStart: "2025-01-15",
      monthlyValue: "2500",
      paymentDay: "10",
      goals: "Aumentar vendas em 30% nos próximos 3 meses",
      instagram: "@lojaxyz",
      status: "active",
      createdAt: "2025-01-15",
    },
  ];

  const mockTasks = [
    {
      id: 1,
      title: "Criar 5 posts para Loja XYZ",
      description: "Posts promocionais para Black Friday",
      clientId: 2,
      clientName: "Loja XYZ",
      assignedTo: "Social Media 1",
      priority: "high",
      status: "todo",
      dueDate: "2025-11-05",
      createdAt: "2025-10-28",
      checklist: [
        { id: 1, text: "Brainstorm de ideias", completed: true },
        { id: 2, text: "Criar artes", completed: false },
        { id: 3, text: "Escrever legendas", completed: false },
      ],
    },
    {
      id: 2,
      title: "Revisar campanha Meta Ads",
      description: "Analisar performance e otimizar",
      clientId: 2,
      clientName: "Loja XYZ",
      assignedTo: "Social Media 2",
      priority: "medium",
      status: "doing",
      dueDate: "2025-11-02",
      createdAt: "2025-10-27",
      checklist: [],
    },
  ];

  // =========================================================
  // EFFECT: carregar mocks
  // =========================================================
  useEffect(() => {
    setPosts(mockPosts);
    setClients(mockClients);
    setTasks(mockTasks);
  }, []);

  // =========================================================
  // LOGO COMPONENT (agora usando /logo.png)
  // =========================================================
  const Logo = () => (
    <img src="/logo.png" alt="Allianz Logo" className="h-10" />
  );

  // =========================================================
  // FUNÇÃO DE UPLOAD (Cloudinary) - unsigned
  // =========================================================
  const handleUploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      // seu preset criado lá
      formData.append("upload_preset", "allianz_unsigned");
      // seu cloud name
      const cloudName = "dbi6emnvr";

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error("Erro no upload Cloudinary:", data);
        alert("Erro ao enviar imagem. Verifique o preset no Cloudinary.");
        return null;
      }
    } catch (err) {
      console.error("Falha no upload:", err);
      alert("Falha no upload da imagem.");
      return null;
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================
  const handleLogin = () => {
    // agência
    if (
      loginEmail === users.agency.email &&
      loginPassword === users.agency.password
    ) {
      setCurrentUser(users.agency);
      setView("agency-dashboard");
      return;
    }

    // cliente
    const client = clients.find(
      (c) => c.email === loginEmail && c.password === loginPassword
    );
    if (client) {
      setCurrentUser(client);
      setView("client-dashboard");
      return;
    }

    alert("Credenciais inválidas");
  };

  // =========================================================
  // AÇÕES DE POST (aprovar / revisar)
  // =========================================================
  const handlePostAction = (postId, action, observation = null) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          if (action === "approve") {
            return { ...post, status: "approved" };
          }
          if (action === "revise") {
            return { ...post, status: "revision", observations: observation };
          }
        }
        return post;
      })
    );
  };

  // =========================================================
  // CRIAR POST (agência)
  // =========================================================
  const handleCreatePost = () => {
    if (
      !newPost.caption ||
      !newPost.scheduledDate ||
      !selectedClient ||
      !newPost.image
    ) {
      alert("Preencha todos os campos (incluindo a imagem).");
      return;
    }

    const post = {
      id: posts.length + 1,
      clientId: selectedClient.id,
      clientName: selectedClient.businessName,
      caption: newPost.caption,
      image: newPost.image, // ✅ agora vem do Cloudinary
      scheduledDate: newPost.scheduledDate,
      status: "pending",
      createdAt: new Date().toISOString(),
      observations: null,
    };

    setPosts([post, ...posts]);
    setNewPost({ caption: "", scheduledDate: "", image: null });
    alert("Post enviado para aprovação! Notificação enviada ao cliente.");
  };

  // =========================================================
  // CRIAR CLIENTE
  // =========================================================
  const handleCreateClient = () => {
    if (
      !newClient.name ||
      !newClient.businessName ||
      !newClient.email ||
      !newClient.password
    ) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const client = {
      id: clients.length + 2,
      ...newClient,
      role: "client",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    setClients([...clients, client]);
    alert(
      `Cliente cadastrado!\n\nCredenciais de acesso:\nEmail: ${newClient.email}\nSenha: ${newClient.password}`
    );
    setShowNewClientModal(false);
    setNewClient({
      name: "",
      businessName: "",
      email: "",
      phone: "",
      cnpj: "",
      segment: "",
      services: [],
      contractStart: "",
      monthlyValue: "",
      paymentDay: "",
      goals: "",
      instagram: "",
      password: "",
    });
  };

  // =========================================================
  // CRIAR TAREFA
  // =========================================================
  const handleCreateTask = () => {
    if (!newTask.title || !newTask.clientId || !newTask.assignedTo) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const client = clients.find(
      (c) => c.id === parseInt(newTask.clientId, 10)
    );
    const task = {
      id: tasks.length + 1,
      ...newTask,
      clientName: client?.businessName || "",
      createdAt: new Date().toISOString(),
      checklist: [],
    };

    setTasks([...tasks, task]);
    setShowNewTaskModal(false);
    setNewTask({
      title: "",
      description: "",
      clientId: "",
      assignedTo: "",
      priority: "medium",
      status: "todo",
      dueDate: "",
      checklist: [],
    });
  };

  // =========================================================
  // ATUALIZAR STATUS DA TAREFA (drag)
  // =========================================================
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // =========================================================
  // LOGIN SCREEN
  // =========================================================
  if (view === "login") {
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              style={{ background: "#ffa600" }}
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

  // =========================================================
  // AGENCY DASHBOARD (CRIAR POST)
  // =========================================================
  if (view === "agency-dashboard") {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
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
                setView("login");
                setLoginEmail("");
                setLoginPassword("");
              }}
              className="px-4 py-2 rounded-lg transition border border-gray-700 hover:bg-gray-800"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setView("agency-dashboard")}
                className="py-4 border-b-2 text-white font-medium"
                style={{ borderColor: "#ffa600" }}
              >
                Posts
              </button>
              <button
                onClick={() => setView("agency-metrics")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Métricas
              </button>
              <button
                onClick={() => setView("agency-clients")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Clientes
              </button>
              <button
                onClick={() => setView("agency-tasks")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Tarefas
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-6">
          {/* Create Post Section */}
          <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Upload className="mr-2" size={24} style={{ color: "#ffa600" }} />
              Criar Novo Post
            </h2>

            <div className="space-y-4">
              {/* CLIENTE */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cliente
                </label>
                <select
                  value={selectedClient?.id || ""}
                  onChange={(e) => {
                    const client = clients.find(
                      (c) => c.id === parseInt(e.target.value, 10)
                    );
                    setSelectedClient(client || null);
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

              {/* LEGENDA */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Legenda
                </label>
                <textarea
                  value={newPost.caption}
                  onChange={(e) =>
                    setNewPost({ ...newPost, caption: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Escreva a legenda do post..."
                />
              </div>

              {/* DATA + IMAGEM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data de Publicação
                  </label>
                  <input
                    type="date"
                    value={newPost.scheduledDate}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        scheduledDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Imagem
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await handleUploadImage(file);
                      if (url) {
                        setNewPost((prev) => ({ ...prev, image: url }));
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  {/* preview */}
                  {newPost.image && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-1">
                        Pré-visualização:
                      </p>
                      <img
                        src={newPost.image}
                        alt="Preview"
                        className="max-h-48 rounded-lg object-contain bg-gray-950"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCreatePost}
                className="w-full text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
                style={{ background: "#ffa600" }}
              >
                Enviar para Aprovação
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Posts Recentes</h2>

            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-800 rounded-lg p-4 hover:shadow-md transition bg-gray-800"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-white">
                            {post.clientName}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {post.caption}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            post.status === "approved"
                              ? "bg-green-900 text-green-300"
                              : post.status === "pending"
                              ? "bg-yellow-900 text-yellow-300"
                              : post.status === "revision"
                              ? "bg-orange-900 text-orange-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {post.status === "approved"
                            ? "Aprovado"
                            : post.status === "pending"
                            ? "Pendente"
                            : post.status === "revision"
                            ? "Em Revisão"
                            : "Rejeitado"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-400 space-x-4">
                        <span className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          {new Date(post.scheduledDate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          Criado em{" "}
                          {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      {post.observations && (
                        <div
                          className="mt-2 p-2 bg-orange-900/30 border-l-4 rounded"
                          style={{ borderColor: "#ffa600" }}
                        >
                          <p className="text-sm" style={{ color: "#ffa600" }}>
                            <strong>Observações:</strong> {post.observations}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-gray-400 text-sm">
                  Nenhum post criado ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // AGENCY METRICS
  // =========================================================
  if (view === "agency-metrics") {
    const mockMetrics = {
      instagram: {
        reach: 2803,
        profileVisits: 101,
        followers: 9,
        engagement: 4.2,
      },
      metaAds: {
        invested: 209.06,
        reach: 7050,
        clicks: 184,
        conversations: 27,
        costPerConversation: 7.74,
      },
    };

    return (
      <div className="min-h-screen bg-black">
        <div className="bg-gray-900 text-white p-6 shadow-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold">Allianz Marketing</h1>
                <p className="text-gray-400">Dashboard de Métricas</p>
              </div>
            </div>
            <button
              onClick={() => {
                setView("login");
                setLoginEmail("");
                setLoginPassword("");
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
                onClick={() => setView("agency-dashboard")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Posts
              </button>
              <button
                onClick={() => setView("agency-metrics")}
                className="py-4 border-b-2 text-white font-medium"
                style={{ borderColor: "#ffa600" }}
              >
                Métricas
              </button>
              <button
                onClick={() => setView("agency-clients")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Clientes
              </button>
              <button
                onClick={() => setView("agency-tasks")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Tarefas
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Selecionar Cliente
            </label>
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500">
              {clients.map((client) => (
                <option key={client.id}>{client.businessName}</option>
              ))}
            </select>
          </div>

          {/* INSTAGRAM */}
          <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Instagram
                className="mr-2"
                size={24}
                style={{ color: "#ffa600" }}
              />
              Movimento do Instagram
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Alcance</span>
                  <Eye size={20} style={{ color: "#ffa600" }} />
                </div>
                <p className="text-2xl font-bold text-white">
                  {mockMetrics.instagram.reach.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-gray-400 mt-1">mil pessoas</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Visitas no Perfil</span>
                  <TrendingUp size={20} style={{ color: "#ffa600" }} />
                </div>
                <p className="text-2xl font-bold text-white">
                  {mockMetrics.instagram.profileVisits}
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Seguidores</span>
                  <UserPlus size={20} style={{ color: "#ffa600" }} />
                </div>
                <p className="text-2xl font-bold text-white">
                  +{mockMetrics.instagram.followers}
                </p>
                <p className="text-xs text-gray-400 mt-1" style={{ color: "#ffa600" }}>
                  ↑ novos
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Engajamento</span>
                  <MessageSquare size={20} style={{ color: "#ffa600" }} />
                </div>
                <p className="text-2xl font-bold text-white">
                  {mockMetrics.instagram.engagement}%
                </p>
              </div>
            </div>
          </div>

          {/* META ADS */}
          <div className="bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <BarChart3
                className="mr-2"
                size={24}
                style={{ color: "#ffa600" }}
              />
              Campanha de Mensagens (Meta Ads)
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Investido</span>
                  <DollarSign size={20} style={{ color: "#ffa600" }} />
                </div>
                <p className="text-xl font-bold text-white">
                  R$ {mockMetrics.metaAds.invested.toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Alcance</span>
                  <Eye size={20} style={{ color: "#ffa600" }} />
                </div>
                <p className="text-xl font-bold text-white">
                  {mockMetrics.metaAds.reach.toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Cliques</span>
                  <TrendingUp size={20} style={{ color: "#ffa600" }} />
                </div>
                <p className="text-xl font-bold text-white">
                  {mockMetrics.metaAds.clicks}
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Conversas</span>
                  <MessageSquare size={20} style={{ color: "#ffa600" }} />
                </div>
                <p className="text-xl font-bold text-white">
                  {mockMetrics.metaAds.conversations}
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Custo/Conversa</span>
                  <DollarSign size={20} style={{ color: "#ffa600" }} />
                </div>
                <p className="text-xl font-bold text-white">
                  R$ {mockMetrics.metaAds.costPerConversation.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // AGENCY CLIENTS
  // =========================================================
  if (view === "agency-clients") {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 shadow-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold">Allianz Marketing</h1>
                <p className="text-gray-400">Gestão de Clientes</p>
              </div>
            </div>
            <button
              onClick={() => {
                setView("login");
                setLoginEmail("");
                setLoginPassword("");
              }}
              className="px-4 py-2 rounded-lg transition border border-gray-700 hover:bg-gray-800"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setView("agency-dashboard")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Posts
              </button>
              <button
                onClick={() => setView("agency-metrics")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Métricas
              </button>
              <button
                onClick={() => setView("agency-clients")}
                className="py-4 border-b-2 text-white font-medium"
                style={{ borderColor: "#ffa600" }}
              >
                Clientes
              </button>
              <button
                onClick={() => setView("agency-tasks")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Tarefas
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Clientes ({clients.length})
            </h2>
            <button
              onClick={() => setShowNewClientModal(true)}
              className="flex items-center gap-2 text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              style={{ background: "#ffa600" }}
            >
              <Plus size={20} />
              Novo Cliente
            </button>
          </div>

          <div className="grid gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {client.businessName}
                      </h3>
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
                        <p className="text-white">
                          {client.services.join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Valor Mensal</p>
                        <p className="text-white">R$ {client.monthlyValue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 border border-gray-700">
                      <Edit size={18} style={{ color: "#ffa600" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Novo Cliente */}
        {showNewClientModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Novo Cliente</h2>
                <button
                  onClick={() => setShowNewClientModal(false)}
                  className="text-gray-400 hover:text-white"
                >
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
                      onChange={(e) =>
                        setNewClient({ ...newClient, name: e.target.value })
                      }
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
                        setNewClient({
                          ...newClient,
                          businessName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Loja ABC"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newClient.email}
                      onChange={(e) =>
                        setNewClient({ ...newClient, email: e.target.value })
                      }
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
                      onChange={(e) =>
                        setNewClient({ ...newClient, password: e.target.value })
                      }
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
                      onChange={(e) =>
                        setNewClient({ ...newClient, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="(11) 98765-4321"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={newClient.cnpj}
                      onChange={(e) =>
                        setNewClient({ ...newClient, cnpj: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Segmento
                  </label>
                  <input
                    type="text"
                    value={newClient.segment}
                    onChange={(e) =>
                      setNewClient({ ...newClient, segment: e.target.value })
                    }
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
                                services: [...newClient.services, service],
                              });
                            } else {
                              setNewClient({
                                ...newClient,
                                services: newClient.services.filter(
                                  (s) => s !== service
                                ),
                              });
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
                        setNewClient({
                          ...newClient,
                          contractStart: e.target.value,
                        })
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
                        setNewClient({
                          ...newClient,
                          monthlyValue: e.target.value,
                        })
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
                        setNewClient({
                          ...newClient,
                          paymentDay: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="10"
                      min="1"
                      max="31"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={newClient.instagram}
                    onChange={(e) =>
                      setNewClient({ ...newClient, instagram: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewClient({ ...newClient, goals: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder="Descreva os objetivos do cliente..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateClient}
                    className="flex-1 text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    style={{ background: "#ffa600" }}
                  >
                    Cadastrar Cliente
                  </button>
                  <button
                    onClick={() => setShowNewClientModal(false)}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================
  // AGENCY TASKS
  // =========================================================
  if (view === "agency-tasks") {
    const todoTasks = tasks.filter((t) => t.status === "todo");
    const doingTasks = tasks.filter((t) => t.status === "doing");
    const doneTasks = tasks.filter((t) => t.status === "done");

    const TaskCard = ({ task }) => {
      const isOverdue =
        task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";
      const completedItems = task.checklist.filter((i) => i.completed).length;

      return (
        <div
          draggable
          onDragStart={(e) => {
            setDraggedTask(task);
            e.currentTarget.style.opacity = "0.5";
          }}
          onDragEnd={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 cursor-move"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white text-sm">{task.title}</h3>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                task.priority === "high"
                  ? "bg-red-900 text-red-300"
                  : task.priority === "medium"
                  ? "bg-yellow-900 text-yellow-300"
                  : "bg-blue-900 text-blue-300"
              }`}
            >
              {task.priority === "high"
                ? "Alta"
                : task.priority === "medium"
                ? "Média"
                : "Baixa"}
            </span>
          </div>

          {task.description && (
            <p className="text-xs text-gray-400 mb-3">{task.description}</p>
          )}

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
              <div
                className={`flex items-center gap-2 ${
                  isOverdue ? "text-red-400" : ""
                }`}
              >
                <Calendar size={14} />
                <span>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                {isOverdue && <AlertCircle size={14} />}
              </div>
            )}
          </div>

          {task.checklist.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Progresso</span>
                <span style={{ color: "#ffa600" }}>
                  {completedItems}/{task.checklist.length}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${(completedItems / task.checklist.length) * 100}%`,
                    background: "#ffa600",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      );
    };

    const KanbanColumn = ({ title, status, tasks, count, color }) => {
      return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">{title}</h3>
            <span
              className="px-2 py-1 bg-gray-800 rounded text-sm"
              style={color ? { color } : { color: "#9ca3af" }}
            >
              {count}
            </span>
          </div>
          <div
            className="space-y-3 min-h-[400px] p-2 rounded-lg border-2 border-dashed border-gray-800 transition-colors"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "#ffa600";
              e.currentTarget.style.backgroundColor = "rgba(255, 166, 0, 0.05)";
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = "#1f2937";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "#1f2937";
              e.currentTarget.style.backgroundColor = "transparent";
              if (draggedTask && draggedTask.status !== status) {
                updateTaskStatus(draggedTask.id, status);
              }
              setDraggedTask(null);
            }}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 shadow-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold">Allianz Marketing</h1>
                <p className="text-gray-400">Gerenciador de Tarefas</p>
              </div>
            </div>
            <button
              onClick={() => {
                setView("login");
                setLoginEmail("");
                setLoginPassword("");
              }}
              className="px-4 py-2 rounded-lg transition border border-gray-700 hover:bg-gray-800"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setView("agency-dashboard")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Posts
              </button>
              <button
                onClick={() => setView("agency-metrics")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Métricas
              </button>
              <button
                onClick={() => setView("agency-clients")}
                className="py-4 text-gray-400 hover:text-white"
              >
                Clientes
              </button>
              <button
                onClick={() => setView("agency-tasks")}
                className="py-4 border-b-2 text-white font-medium"
                style={{ borderColor: "#ffa600" }}
              >
                Tarefas
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setTaskView("kanban")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  taskView === "kanban"
                    ? "text-black"
                    : "bg-gray-800 text-white border border-gray-700"
                }`}
                style={taskView === "kanban" ? { background: "#ffa600" } : {}}
              >
                Kanban
              </button>
              <button
                onClick={() => setTaskView("list")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  taskView === "list"
                    ? "text-black"
                    : "bg-gray-800 text-white border border-gray-700"
                }`}
                style={taskView === "list" ? { background: "#ffa600" } : {}}
              >
                Lista
              </button>
            </div>

            <button
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center gap-2 text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              style={{ background: "#ffa600" }}
            >
              <Plus size={20} />
              Nova Tarefa
            </button>
          </div>

          {taskView === "kanban" ? (
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Tarefa
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Responsável
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Prioridade
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Prazo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-gray-800 hover:bg-gray-800"
                    >
                      <td className="px-4 py-3 text-white">{task.title}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {task.clientName}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {task.assignedTo}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            task.priority === "high"
                              ? "bg-red-900 text-red-300"
                              : task.priority === "medium"
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-blue-900 text-blue-300"
                          }`}
                        >
                          {task.priority === "high"
                            ? "Alta"
                            : task.priority === "medium"
                            ? "Média"
                            : "Baixa"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            task.status === "done"
                              ? "bg-green-900 text-green-300"
                              : task.status === "doing"
                              ? "bg-orange-900 text-orange-300"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {task.status === "done"
                            ? "Concluído"
                            : task.status === "doing"
                            ? "Andamento"
                            : "A Fazer"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("pt-BR")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Nova Tarefa */}
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
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: Criar 5 posts para cliente X"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
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
                      onChange={(e) =>
                        setNewTask({ ...newTask, clientId: e.target.value })
                      }
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
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignedTo: e.target.value })
                      }
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
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
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
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateTask}
                    className="flex-1 text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    style={{ background: "#ffa600" }}
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
      </div>
    );
  }

  // =========================================================
  // CLIENT DASHBOARD (onde aparecia cortado)
  // =========================================================
  if (view === "client-dashboard") {
    const clientPosts = posts.filter((p) => p.clientId === currentUser.id);
    const pendingPosts = clientPosts.filter((p) => p.status === "pending");

    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 shadow-lg border-b border-gray-800">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold">
                  {currentUser.businessName}
                </h1>
                <p className="text-gray-400">Painel do Cliente</p>
              </div>
            </div>
            <button
              onClick={() => {
                setView("login");
                setLoginEmail("");
                setLoginPassword("");
              }}
              className="px-4 py-2 rounded-lg transition border border-gray-700 hover:bg-gray-800"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="max-w-4xl mx-auto p-4">
          {pendingPosts.length > 0 && (
            <div
              className="bg-gray-900 border-l-4 p-4 mb-6 rounded-lg border border-gray-800"
              style={{ borderLeftColor: "#ffa600" }}
            >
              <div className="flex items-center">
                <Clock
                  className="mr-2"
                  size={20}
                  style={{ color: "#ffa600" }}
                />
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
                {/* IMAGEM ADAPTÁVEL E CLICÁVEL */}
                {post.image ? (
                  <div
                    onClick={() => window.open(post.image, "_blank")}
                    className="relative bg-gray-950 flex justify-center items-center cursor-pointer group overflow-hidden"
                    style={{ minHeight: "240px" }}
                  >
                    <img
                      src={post.image}
                      alt="Post"
                      className="max-h-[650px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <span className="text-xs md:text-sm text-white bg-black/60 px-3 py-1 rounded-lg">
                        Clique para abrir em nova aba
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900 h-56 flex items-center justify-center text-gray-500 text-sm">
                    (Sem imagem)
                  </div>
                )}

                {/* CONTEÚDO */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white mb-2">{post.caption}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar size={16} className="mr-1" />
                        Publicação:{" "}
                        {new Date(post.scheduledDate).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.status === "approved"
                          ? "bg-green-900 text-green-300"
                          : post.status === "pending"
                          ? "bg-yellow-900 text-yellow-300"
                          : post.status === "revision"
                          ? "bg-orange-900 text-orange-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {post.status === "approved"
                        ? "Aprovado"
                        : post.status === "pending"
                        ? "Pendente"
                        : post.status === "revision"
                        ? "Em Revisão"
                        : "Rejeitado"}
                    </span>
                  </div>

                  {/* AÇÕES DO CLIENTE */}
                  {post.status === "pending" && (
                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-800">
                      <button
                        onClick={() => {
                          handlePostAction(post.id, "approve");
                          alert(
                            "Post aprovado! Será publicado automaticamente na data agendada."
                          );
                        }}
                        className="w-full text-black py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center"
                        style={{ background: "#ffa600" }}
                      >
                        <CheckCircle className="mr-2" size={20} />
                        Aprovar Post
                      </button>

                      <button
                        onClick={() => {
                          const obs = window.prompt(
                            "Digite suas observações para revisão:"
                          );
                          if (obs && obs.trim()) {
                            handlePostAction(post.id, "revise", obs);
                            alert(
                              "Observações enviadas! A equipe fará os ajustes."
                            );
                          }
                        }}
                        className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center border border-gray-700"
                      >
                        <MessageSquare className="mr-2" size={20} />
                        Solicitar Revisão
                      </button>
                    </div>
                  )}

                  {/* INFO DE APROVADO */}
                  {post.status === "approved" && (
                    <div className="mt-4 pt-4 border-t border-gray-800 bg-gray-800 p-3 rounded-lg">
                      <p
                        className="text-sm flex items-center"
                        style={{ color: "#ffa600" }}
                      >
                        <CheckCircle className="mr-2" size={18} />
                        Este post será publicado automaticamente no Instagram em{" "}
                        {new Date(post.scheduledDate).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  )}

                  {/* OBS DO CLIENTE */}
                  {post.observations && (
                    <div className="mt-3 bg-orange-900/20 border-l-4 border-orange-500 p-3 rounded">
                      <p className="text-sm text-orange-200">
                        <strong>Observações do cliente:</strong>{" "}
                        {post.observations}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {clientPosts.length === 0 && (
              <p className="text-gray-400 text-sm">
                Nenhum post enviado ainda.
              </p>
            )}
          </div>

          {/* MÉTRICAS RESUMO */}
          <div className="mt-6 bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <BarChart3
                className="mr-2"
                size={24}
                style={{ color: "#ffa600" }}
              />
              Suas Métricas
            </h2>

            <div className="space-y-4">
              <div
                className="bg-gray-800 p-4 rounded-lg border-l-4"
                style={{ borderLeftColor: "#ffa600" }}
              >
                <h3 className="font-semibold text-white mb-3 flex items-center">
                  <Instagram
                    className="mr-2"
                    size={20}
                    style={{ color: "#ffa600" }}
                  />
                  Instagram Orgânico
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Alcance</p>
                    <p className="text-xl font-bold text-white">2.803</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Visitas no Perfil
                    </p>
                    <p className="text-xl font-bold text-white">101</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Novos Seguidores
                    </p>
                    <p className="text-xl font-bold text-white">+9</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Engajamento</p>
                    <p className="text-xl font-bold text-white">4.2%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-gray-700">
                <h3 className="font-semibold text-white mb-3 flex items-center">
                  <DollarSign
                    className="mr-2"
                    size={20}
                    style={{ color: "#ffa600" }}
                  />
                  Campanha Meta Ads
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Investido</p>
                    <p className="text-xl font-bold text-white">R$ 209,06</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Alcance</p>
                    <p className="text-xl font-bold text-white">7.050</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Cliques</p>
                    <p className="text-xl font-bold text-white">184</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Conversas</p>
                    <p className="text-xl font-bold text-white">27</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Custo/Conversa
                    </p>
                    <p className="text-xl font-bold text-white">R$ 7,74</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Taxa de Conversão
                    </p>
                    <p className="text-xl font-bold text-white">14.7%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-gray-700">
                <h3 className="font-semibold text-white mb-3 flex items-center">
                  <TrendingUp
                    className="mr-2"
                    size={20}
                    style={{ color: "#ffa600" }}
                  />
                  Resumo Geral
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Alcance Total</p>
                    <p className="text-xl font-bold text-white">9.853</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Total de Interações
                    </p>
                    <p className="text-xl font-bold text-white">211</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">ROI Estimado</p>
                    <p className="text-xl font-bold" style={{ color: "#ffa600" }}>
                      +342%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Crescimento</p>
                    <p className="text-xl font-bold" style={{ color: "#ffa600" }}>
                      +23%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // fallback
  return null;
};

export default function Home() {
  return <AllianzPlatform />;
}
