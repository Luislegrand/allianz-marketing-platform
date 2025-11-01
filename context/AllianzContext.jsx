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
  // CARREGAR DADOS INICIAIS
  // -------------------------
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log("🔄 Carregando dados iniciais...");

        // 🔹 Carrega CLIENTES do MongoDB
        const resClients = await fetch("/api/clients");
        if (!resClients.ok) {
          throw new Error(`Erro ao buscar clientes: ${resClients.status}`);
        }
        const clientsData = await resClients.json();
        console.log("✅ Clientes carregados do MongoDB:", clientsData.length);

        // 🔹 Mantém posts e tasks do localStorage (por enquanto)
        const storedPosts = localStorage.getItem("posts");
        const storedTasks = localStorage.getItem("tasks");

        setClients(clientsData || []);
        setPosts(storedPosts ? JSON.parse(storedPosts) : mockPosts);
        setTasks(storedTasks ? JSON.parse(storedTasks) : mockTasks);

        console.log("✅ Dados iniciais carregados com sucesso!");
      } catch (error) {
        console.error("❌ Erro ao carregar dados iniciais:", error);
        // Em caso de erro, usa dados mockados
        setClients([]);
        setPosts(mockPosts);
        setTasks(mockTasks);
      }
    };

    fetchInitialData();
  }, []);

  // -------------------------
  // SALVAR NO LOCALSTORAGE
  // -------------------------
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // -------------------------
  // LOGIN
  // -------------------------
  const handleLogin = (email, password) => {
    // Login da agência
    if (email === users.agency.email && password === users.agency.password) {
      setCurrentUser(users.agency);
      setView("agency-dashboard");
      return true;
    }

    // Login do cliente
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
      clientId: selectedClient._id || selectedClient.id,
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
      console.log("📤 Criando cliente no MongoDB:", newClient);

      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao salvar no banco de dados");
      }

      const savedClient = await res.json();
      console.log("✅ Cliente criado com sucesso:", savedClient);

      // Atualiza o estado com o novo cliente
      setClients((prev) => [...prev, savedClient]);

      return savedClient;
    } catch (error) {
      console.error("❌ Erro ao criar cliente:", error);
      throw error;
    }
  };

  // -------------------------
  // TAREFAS
  // -------------------------
  const handleCreateTask = (task) => {
    const client = clients.find(
      (c) => c._id === task.clientId || c.id === parseInt(task.clientId, 10)
    );
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
