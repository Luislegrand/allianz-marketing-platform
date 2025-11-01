import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  console.log("🔵 API /api/clients chamada - Método:", req.method);
  
  try {
    const client = await clientPromise;
    console.log("✅ MongoDB conectado");
    
    const db = client.db("allianz");
    const collection = db.collection("clients");

    // GET - Buscar todos os clientes
    if (req.method === "GET") {
      console.log("📥 Buscando clientes...");
      const clients = await collection.find({}).toArray();
      console.log("✅ Clientes encontrados:", clients.length);
      return res.status(200).json(clients);
    }

    // POST - Criar novo cliente
    if (req.method === "POST") {
      console.log("📤 Recebendo novo cliente:", req.body);
      
      const newClient = req.body;
      
      // Validação
      if (!newClient || !newClient.email) {
        console.error("❌ Dados inválidos:", newClient);
        return res.status(400).json({ error: "Dados inválidos" });
      }

      // Preparar dados do cliente
      const clientData = {
        ...newClient,
        createdAt: new Date(),
        metrics: {
          reach: 0,
          profileVisits: 0,
          followers: 0,
          campaigns: 0,
        },
      };

      // Salvar no MongoDB
      console.log("💾 Salvando no MongoDB:", clientData);
      const result = await collection.insertOne(clientData);
      console.log("✅ Cliente salvo com ID:", result.insertedId);

      return res.status(201).json({ 
        message: "Cliente criado com sucesso",
        id: result.insertedId 
      });
    }

    // Método não suportado
    return res.status(405).json({ error: "Método não permitido" });
    
  } catch (error) {
    console.error("❌ ERRO CRÍTICO no handler /api/clients:", error);
    console.error("Stack:", error.stack);
    return res.status(500).json({ 
      error: "Erro interno no servidor",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}
