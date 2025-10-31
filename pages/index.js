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

const CLOUDINARY_UPLOAD_PRESET = "allianz_unsigned"; // o que você criou
const CLOUDINARY_CLOUD_NAME = "dbi6emnvr"; // o que apareceu no painel

export default function Home() {
  return <AllianzPlatform />;
}

function AllianzPlatform() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login");

  // dados da aplicação
  const [posts, setPosts] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);

  // estados de criação
  const [selectedClient, setSelectedClient] = useState(null);
  const [newPost, setNewPost] = useState({
    caption: "",
    scheduledDate: "",
    image: null, // url do cloudinary
  });

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // modais
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // tarefas
  const [taskView, setTaskView] = useState("kanban");
  const [draggedTask, setDraggedTask] = useState(null);

  // modal de imagem
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // criação de cliente
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

  // criação de tarefa
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

  // usuário da agência
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

  // MOCKS INICIAIS
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        clientId: 2,
        clientName: "Loja XYZ",
        caption: "Promoção imperdível! 50% OFF em toda loja 🔥",
        image:
          "https://via.placeholder.com/400x400/FF6B6B/ffffff?text=Post+1",
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
        image:
          "https://via.placeholder.com/400x400/4ECDC4/ffffff?text=Post+2",
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

    setPosts(mockPosts);
    setClients(mockClients);
    setTasks(mockTasks);
  }, []);

  // ========================
  // COMPONENTE LOGO (usa /public/logo.png)
  // ========================
  const Logo = () => (
    <img
      src="/logo.png"
      alt="Allianz Marketing"
      className="h-10 w-auto object-contain"
    />
  );

  // ========================
  // UPLOAD PRO CLOUDINARY
  // ========================
  const handleUploadImage = async (file) => {
    try:
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
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
      alert("Não foi possível enviar a imagem.");
      return null;
    }
  };

  // ========================
  // LOGIN
  // ========================
  const handleLogin = () => {
    if (
      loginEmail === users.agency.email &&
      loginPassword === users.agency.password
    ) {
      setCurrentUser(users.agency);
      setView("agency-dashboard");
    } else {
      const client = clients.find(
        (c) => c.email === loginEmail && c.password === loginPassword
      );
      if (client) {
        setCurrentUser(client);
        setView("client-dashboard");
      } else {
        alert("Credenciais inválidas");
      }
    }
  };

  // ========================
  // APROVAR / REVISAR POST
  // ========================
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

  // ========================
  // CRIAR POST (AGÊNCIA)
  // ========================
  const handleCreatePost = async () => {
    if (
      !newPost.caption ||
      !newPost.scheduledDate ||
      !selectedClient ||
      !newPost.image
    ) {
      alert("Preencha todos os campos (incluindo a imagem)");
      return;
    }

    const newPostObj = {
      id: posts.length + 1,
      clientId: selectedClient.id,
      clientName: selectedClient.businessName,
      caption: newPost.caption,
      image: newPost.image, // já vem do Cloudinary
      scheduledDate: newPost.scheduledDate,
      status: "pending",
      createdAt: new Date().toISOString(),
      observations: null,
    };

    setPosts((prev) => [newPostObj, ...prev]);
    setNewPost({ caption: "", scheduledDate: "", image: null });
    setSelectedClient(null);
    alert("Post enviado para aprovação! Notificação enviada ao cliente.");
  };

  // ========================
  // CRIAR CLIENTE
  // ========================
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

    setClients((prev) => [...prev, client]);
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

  // ========================
  // CRIAR TAREFA
  // ========================
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

    setTasks((prev) => [...prev, task]);
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

  // ========================
  // ATUALIZAR STATUS TAREFA (KANBAN)
  // ========================
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // ========================
  // LOGIN SCREEN
  // ========================
  if (view === "login") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-800">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Allianz Marketing
            </h1>
            <p className="text-gray-400 mt-2">
              Gestão de Conteúdo e Campanhas
            </p>
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
                onKeyDown={(e) => {
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

  // ========================
  // AGENCY DASHBOARD (POSTS)
  // ========================
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
                <p className="text-gray-400">
                  Bem-vindo, {currentUser?.name}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setView("login");
                setLoginEmail("");
                setLoginPassword("");
                setCurrentUser(null);
              }}
              className="px-4 py-2 rounded-lg transition border border-gray-700 hover:bg-gray-800"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Navigation */}
        <NavBar view={view} setView={setView} />

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
                    setNewPost((prev) => ({
                      ...prev,
                      caption: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Escreva a legenda do post..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                {/* DATA */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data de Publicação
                  </label>
                  <input
                    type="date"
                    value={newPost.scheduledDate}
                    onChange={(e) =>
                      setNewPost((prev) => ({
                        ...prev,
                        scheduledDate: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* IMAGEM */}
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
                  {newPost.image && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">
                        Prévia da imagem:
                      </p>
                      <img
                        src={newPost.image}
                        alt="Prévia do post"
                        className="h-32 w-auto rounded-lg border border-gray-700 object-cover bg-gray-800"
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
                    <img
                      src={
                        post.image ||
                        "https://via.placeholder.com/400x400/000000/ffffff?text=Sem+Imagem"
                      }
                      alt="Post"
                      className="w-24 h-24 rounded-lg object-cover bg-gray-900"
                      onClick={() => setImagePreviewUrl(post.image)}
                    />

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
            </div>
          </div>
        </div>

        {/* Modal de imagem geral */}
        {imagePreviewUrl && (
          <ImageModal
            src={imagePreviewUrl}
            onClose={() => setImagePreviewUrl(null)}
          />
        )}
      </div>
    );
  }

  // ========================
  // AGENCY METRICS
  // ========================
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
        {/* Header */}
        <Header
          currentUser={currentUser}
          onLogout={() => {
            setView("login");
            setLoginEmail("");
            setLoginPassword("");
            setCurrentUser(null);
          }}
        />

        {/* Nav */}
        <NavBar view={view} setView={setView} />

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
              {/* Alcance */}
              <MetricCard
                label="Alcance"
                value={mockMetrics.instagram.reach.toLocaleString("pt-BR")}
                icon={<Eye size={20} style={{ color: "#ffa600" }} />}
                hint="mil pessoas"
              />

              {/* Visitas */}
              <MetricCard
                label="Visitas no Perfil"
                value={mockMetrics.instagram.profileVisits}
                icon={<TrendingUp size={20} style={{ color: "#ffa600" }} />}
              />

              {/* Seguidores */}
              <MetricCard
                label="Seguidores"
                value={"+" + mockMetrics.instagram.followers}
                icon={<UserPlus size={20} style={{ color: "#ffa600" }} />}
                extra={
                  <p className="text-xs text-gray-400 mt-1" style={{ color: "#ffa600" }}>
                    ↑ novos
                  </p>
                }
              />

              {/* Engajamento */}
              <MetricCard
                label="Engajamento"
                value={mockMetrics.instagram.engagement + "%"}
                icon={<MessageSquare size={20} style={{ color: "#ffa600" }} />}
              />
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
              <MetricCard
                label="Investido"
                value={`R$ ${mockMetrics.metaAds.invested.toFixed(2)}`}
                icon={<DollarSign size={20} style={{ color: "#ffa600" }} />}
              />
              <MetricCard
                label="Alcance"
                value={mockMetrics.metaAds.reach.toLocaleString("pt-BR")}
                icon={<Eye size={20} style={{ color: "#ffa600" }} />}
              />
              <MetricCard
                label="Cliques"
                value={mockMetrics.metaAds.clicks}
                icon={<TrendingUp size={20} style={{ color: "#ffa600" }} />}
              />
              <MetricCard
                label="Conversas"
                value={mockMetrics.metaAds.conversations}
                icon={<MessageSquare size={20} style={{ color: "#ffa600" }} />}
              />
              <MetricCard
                label="Custo/Conversa"
                value={`R$ ${mockMetrics.metaAds.costPerConversation.toFixed(2)}`}
                icon={<DollarSign size={20} style={{ color: "#ffa600" }} />}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // AGENCY CLIENTS
  // ========================
  if (view === "agency-clients") {
    return (
      <div className="min-h-screen bg-black">
        <Header
          currentUser={currentUser}
          onLogout={() => {
            setView("login");
            setLoginEmail("");
            setLoginPassword("");
            setCurrentUser(null);
          }}
        />
        <NavBar view={view} setView={setView} />

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
                      <Info label="Responsável" value={client.name} />
                      <Info label="Email" value={client.email} />
                      <Info label="Telefone" value={client.phone} />
                      <Info label="Instagram" value={client.instagram} />
                      <Info
                        label="Serviços"
                        value={client.services.join(", ")}
                      />
                      <Info
                        label="Valor Mensal"
                        value={`R$ ${client.monthlyValue}`}
                      />
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
          <NewClientModal
            services={services}
            newClient={newClient}
            setNewClient={setNewClient}
            onClose={() => setShowNewClientModal(false)}
            onSave={handleCreateClient}
          />
        )}
      </div>
    );
  }

  // ========================
  // AGENCY TASKS
  // ========================
  if (view === "agency-tasks") {
    const todoTasks = tasks.filter((t) => t.status === "todo");
    const doingTasks = tasks.filter((t) => t.status === "doing");
    const doneTasks = tasks.filter((t) => t.status === "done");

    return (
      <div className="min-h-screen bg-black">
        <Header
          currentUser={currentUser}
          onLogout={() => {
            setView("login");
            setLoginEmail("");
            setLoginPassword("");
            setCurrentUser(null);
          }}
        />
        <NavBar view={view} setView={setView} />

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
                style={
                  taskView === "kanban" ? { background: "#ffa600" } : undefined
                }
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
                style={
                  taskView === "list" ? { background: "#ffa600" } : undefined
                }
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
            <div className="grid grid-cols-3 gap-6">
              <KanbanColumn
                title="A Fazer"
                status="todo"
                tasks={todoTasks}
                count={todoTasks.length}
                setDraggedTask={setDraggedTask}
                draggedTask={draggedTask}
                updateTaskStatus={updateTaskStatus}
              />

              <KanbanColumn
                title="Em Andamento"
                status="doing"
                tasks={doingTasks}
                count={doingTasks.length}
                setDraggedTask={setDraggedTask}
                draggedTask={draggedTask}
                updateTaskStatus={updateTaskStatus}
                color="#ffa600"
              />

              <KanbanColumn
                title="Concluído"
                status="done"
                tasks={doneTasks}
                count={doneTasks.length}
                setDraggedTask={setDraggedTask}
                draggedTask={draggedTask}
                updateTaskStatus={updateTaskStatus}
                color="#22c55e"
              />
            </div>
          ) : (
            <TaskTable tasks={tasks} />
          )}
        </div>

        {/* Modal Nova Tarefa */}
        {showNewTaskModal && (
          <NewTaskModal
            clients={clients}
            teamMembers={teamMembers}
            newTask={newTask}
            setNewTask={setNewTask}
            onClose={() => setShowNewTaskModal(false)}
            onSave={handleCreateTask}
          />
        )}
      </div>
    );
  }

  // ========================
  // CLIENT DASHBOARD
  // ========================
  if (view === "client-dashboard") {
    const clientPosts = posts.filter((p) => p.clientId === currentUser?.id);
    const pendingPosts = clientPosts.filter((p) => p.status === "pending");

    return (
      <div className="min-h-screen bg-black">
        {/* topo */}
        <div className="bg-gray-900 text-white p-6 shadow-lg border-b border-gray-800">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold">
                  {currentUser?.businessName}
                </h1>
                <p className="text-gray-400">Painel do Cliente</p>
              </div>
            </div>
            <button
              onClick={() => {
                setView("login");
                setLoginEmail("");
                setLoginPassword("");
                setCurrentUser(null);
              }}
              className="px-4 py-2 rounded-lg transition border border-gray-700 hover:bg-gray-800"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          {/* alerta de posts pendentes */}
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

          {/* lista de posts do cliente */}
          <div className="space-y-4">
            {clientPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-800"
              >
                <div className="relative">
                  <img
                    src={
                      post.image ||
                      "https://via.placeholder.com/1200x600/000000/ffffff?text=Sem+Imagem"
                    }
                    alt="Post"
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={() => setImagePreviewUrl(post.image)}
                  />
                </div>

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
                            alert("Observações enviadas! A equipe fará os ajustes.");
                          }
                        }}
                        className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center border border-gray-700"
                      >
                        <MessageSquare className="mr-2" size={20} />
                        Solicitar Revisão
                      </button>
                    </div>
                  )}

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
                </div>
              </div>
            ))}
          </div>

          {/* métricas do cliente */}
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
                  <Info label="Alcance" value="2.803" />
                  <Info label="Visitas no Perfil" value="101" />
                  <Info label="Novos Seguidores" value="+9" />
                  <Info label="Engajamento" value="4.2%" />
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
                  <Info label="Investido" value="R$ 209,06" />
                  <Info label="Alcance" value="7.050" />
                  <Info label="Cliques" value="184" />
                  <Info label="Conversas" value="27" />
                  <Info label="Custo/Conversa" value="R$ 7,74" />
                  <Info label="Taxa de Conversão" value="14.7%" />
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
                  <Info label="Alcance Total" value="9.853" />
                  <Info label="Total de Interações" value="211" />
                  <Info label="ROI Estimado" value="+342%" strong />
                  <Info label="Crescimento" value="+23%" strong />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* modal imagem */}
        {imagePreviewUrl && (
          <ImageModal
            src={imagePreviewUrl}
            onClose={() => setImagePreviewUrl(null)}
          />
        )}
      </div>
    );
  }

  // fallback
  return null;
}

// =========================================
// COMPONENTES AUXILIARES
// =========================================

function Header({ currentUser, onLogout }) {
  return (
    <div className="bg-gray-900 text-white p-6 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Allianz" className="h-10 w-auto" />
          <div>
            <h1 className="text-2xl font-bold">Allianz Marketing</h1>
            <p className="text-gray-400">
              {currentUser ? `Bem-vindo, ${currentUser.name}` : "Dashboard"}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-lg transition border border-gray-700 hover:bg-gray-800"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

function NavBar({ view, setView }) {
  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setView("agency-dashboard")}
            className={`py-4 ${
              view === "agency-dashboard"
                ? "border-b-2 text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
            style={view === "agency-dashboard" ? { borderColor: "#ffa600" } : {}}
          >
            Posts
          </button>
          <button
            onClick={() => setView("agency-metrics")}
            className={`py-4 ${
              view === "agency-metrics"
                ? "border-b-2 text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
            style={view === "agency-metrics" ? { borderColor: "#ffa600" } : {}}
          >
            Métricas
          </button>
          <button
            onClick={() => setView("agency-clients")}
            className={`py-4 ${
              view === "agency-clients"
                ? "border-b-2 text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
            style={view === "agency-clients" ? { borderColor: "#ffa600" } : {}}
          >
            Clientes
          </button>
          <button
            onClick={() => setView("agency-tasks")}
            className={`py-4 ${
              view === "agency-tasks"
                ? "border-b-2 text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
            style={view === "agency-tasks" ? { borderColor: "#ffa600" } : {}}
          >
            Tarefas
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, hint, extra }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {extra}
    </div>
  );
}

function Info({ label, value, strong }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className={`text-white ${strong ? "font-bold" : ""}`}>{value}</p>
    </div>
  );
}

function NewClientModal({
  services,
  newClient,
  setNewClient,
  onClose,
  onSave,
}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Novo Cliente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* linha 1 */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nome do Responsável *"
              value={newClient.name}
              onChange={(v) => setNewClient({ ...newClient, name: v })}
              placeholder="João Silva"
            />
            <InputField
              label="Nome da Empresa *"
              value={newClient.businessName}
              onChange={(v) => setNewClient({ ...newClient, businessName: v })}
              placeholder="Loja ABC"
            />
          </div>

          {/* linha 2 */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Email *"
              type="email"
              value={newClient.email}
              onChange={(v) => setNewClient({ ...newClient, email: v })}
              placeholder="cliente@email.com"
            />
            <InputField
              label="Senha de Acesso *"
              value={newClient.password}
              onChange={(v) => setNewClient({ ...newClient, password: v })}
              placeholder="Digite a senha"
            />
          </div>

          {/* linha 3 */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Telefone/WhatsApp"
              value={newClient.phone}
              onChange={(v) => setNewClient({ ...newClient, phone: v })}
              placeholder="(11) 98765-4321"
            />
            <InputField
              label="CNPJ"
              value={newClient.cnpj}
              onChange={(v) => setNewClient({ ...newClient, cnpj: v })}
              placeholder="00.000.000/0001-00"
            />
          </div>

          <InputField
            label="Segmento"
            value={newClient.segment}
            onChange={(v) => setNewClient({ ...newClient, segment: v })}
            placeholder="E-commerce, Serviços, etc"
          />

          {/* serviços */}
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
            <InputField
              type="date"
              label="Início do Contrato"
              value={newClient.contractStart}
              onChange={(v) => setNewClient({ ...newClient, contractStart: v })}
            />
            <InputField
              type="number"
              label="Valor Mensal (R$)"
              value={newClient.monthlyValue}
              onChange={(v) => setNewClient({ ...newClient, monthlyValue: v })}
              placeholder="2500"
            />
            <InputField
              type="number"
              label="Dia de Pagamento"
              value={newClient.paymentDay}
              onChange={(v) => setNewClient({ ...newClient, paymentDay: v })}
              placeholder="10"
            />
          </div>

          <InputField
            label="Instagram"
            value={newClient.instagram}
            onChange={(v) => setNewClient({ ...newClient, instagram: v })}
            placeholder="@empresa"
          />

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
              onClick={onSave}
              className="flex-1 text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              style={{ background: "#ffa600" }}
            >
              Cadastrar Cliente
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewTaskModal({
  clients,
  teamMembers,
  newTask,
  setNewTask,
  onClose,
  onSave,
}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Nova Tarefa</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <InputField
            label="Título da Tarefa *"
            value={newTask.title}
            onChange={(v) => setNewTask({ ...newTask, title: v })}
            placeholder="Ex: Criar 5 posts para cliente X"
          />

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

            <InputField
              type="date"
              label="Data de Vencimento"
              value={newTask.dueDate}
              onChange={(v) => setNewTask({ ...newTask, dueDate: v })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onSave}
              className="flex-1 text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              style={{ background: "#ffa600" }}
            >
              Criar Tarefa
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  ...rest
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}

function KanbanColumn({
  title,
  status,
  tasks,
  count,
  color,
  setDraggedTask,
  draggedTask,
  updateTaskStatus,
}) {
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
          e.currentTarget.style.backgroundColor =
            "rgba(255, 166, 0, 0.05)";
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
          <TaskCard
            key={task.id}
            task={task}
            setDraggedTask={setDraggedTask}
          />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, setDraggedTask }) {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";
  const completedItems = task.checklist.filter((item) => item.completed).length;

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
}

function TaskTable({ tasks }) {
  return (
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
              <td className="px-4 py-3 text-gray-300">{task.clientName}</td>
              <td className="px-4 py-3 text-gray-300">{task.assignedTo}</td>
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
  );
}

function ImageModal({ src, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-lg overflow-hidden max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt="Post grande" className="w-full h-auto" />
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-900 text-white text-center hover:bg-gray-800"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
