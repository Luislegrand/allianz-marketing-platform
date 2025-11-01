import { createContext, useContext, useState, useEffect } from "react";

// =========================
// CONTEXTO GLOBAL ALLIANZ
// =========================

const AllianzContext = createContext();

export const AllianzProvider = ({ children }) => {
  // -------------------------
  // ESTADOS GERAIS
  // -------------------------
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login");
  const [posts, setPosts] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  // -------------------------
  // MOCKS INICIAIS
  // -------------------------
  const users = {
    agency: {
      id: 1,
      email: "agencia@allianz.com",
      password: "123",
      role: "agency",
      name: "Allianz Marketing",
    },
  };

  const mockClients = [
    {
      id: 2,
      name: "João Silva",
      businessName: "Loja XYZ",
      email: "cliente1@email.com",
      password: "123",
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
  ];

  // -------------------------
  // LOCAL STORAGE
  // -------------------------
  useEffect(() => {
  const fetchInitialData = async () => {
    try {
      // 🔹 Carrega os CLIENTES do banco MongoDB
      const resClients = await fetch("/api/clients");
      if (!resClients.ok) throw new Error("Erro ao buscar clientes");
      const clientsData = await resClients.json(); // ← aqui precisa do await ✅

      // 🔹 Mantém posts e tasks do localStorage (por enquanto)
      const storedPosts = JSON.parse(localStorage.getItem("posts"));
      const storedTasks = JSON.parse(localStorage.getItem("tasks"));

      setClients(clientsData || []);  // ← garante que só seta se houver dados
      setPosts(storedPosts || mockPosts);
      setTasks(storedTasks || mockTasks);
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
    }
  };

  fetchInitialData();
}, []);


  // -------------------------
  // LOGIN
  // -------------------------
  const handleLogin = (email, password) => {
    if (email === users.agency.email && password === users.agency.password) {
      setCurrentUser(users.agency);
      setView("agency-dashboard");
      return true;
    }
    const client = clients.find(
      (c) => c.email === email && c.password === password
    );
    if (client) {
      setCurrentUser(client);
      setView("client-dashboard");
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
  };

  // -------------------------
  // UPLOAD CLOUDINARY
  // -------------------------
  const handleUploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "allianz_unsigned");
      formData.append("cloud_name", "dbi6emnvr");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dbi6emnvr/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) return data.secure_url;
      return null;
    } catch (error) {
      console.error("Erro no upload:", error);
      return null;
    }
  };

  // -------------------------
  // POSTS
  // -------------------------
  const handleCreatePost = (newPost, selectedClient) => {
    const post = {
      id: posts.length + 1,
      clientId: selectedClient.id,
      clientName: selectedClient.businessName,
      caption: newPost.caption,
      image:
        newPost.image ||
        "https://via.placeholder.com/400x400/A8E6CF/ffffff?text=Novo+Post",
      scheduledDate: newPost.scheduledDate,
      status: "pending",
      createdAt: new Date().toISOString(),
      observations: null,
    };

    setPosts([post, ...posts]);
  };

  const handlePostAction = (postId, action, observation = null) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (action === "approve") return { ...post, status: "approved" };
          if (action === "revise")
            return { ...post, status: "revision", observations: observation };
        }
        return post;
      })
    );
  };

// -------------------------
// CLIENTES
// -------------------------
const handleCreateClient = async (newClient) => {
  try {
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient),
    });

    if (!res.ok) {
      throw new Error("Erro ao salvar no banco de dados");
    }

    const savedClient = await res.json();
    setClients((prev) => [...prev, savedClient]);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
  }
};

  // -------------------------
  // TAREFAS
  // -------------------------
  const handleCreateTask = (task) => {
    const client = clients.find((c) => c.id === parseInt(task.clientId, 10));
    const newTask = {
      id: tasks.length + 1,
      ...task,
      clientName: client?.businessName || "",
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const toggleChecklistItem = (taskId, checklistId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            checklist: task.checklist.map((item) =>
              item.id === checklistId
                ? { ...item, completed: !item.completed }
                : item
            ),
          };
        }
        return task;
      })
    );
  };

  // -------------------------
  // EXPORTAÇÃO
  // -------------------------
  return (
    <AllianzContext.Provider
      value={{
        currentUser,
        view,
        setView,
        posts,
        clients,
        tasks,
        selectedClient,
        setSelectedClient,
        draggedTask,
        setDraggedTask,
        handleLogin,
        handleLogout,
        handleUploadImage,
        handleCreatePost,
        handlePostAction,
        handleCreateClient,
        handleCreateTask,
        updateTaskStatus,
        toggleChecklistItem,
      }}
    >
      {children}
    </AllianzContext.Provider>
  );
};

export const useAllianz = () => useContext(AllianzContext);
