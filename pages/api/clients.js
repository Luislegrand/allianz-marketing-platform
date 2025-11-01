import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("allianz");
  const collection = db.collection("clients");

  try {
    if (req.method === "GET") {
      const clients = await collection.find({}).toArray();
      return res.status(200).json(clients);
    }

    if (req.method === "POST") {
      const newClient = req.body;

      if (!newClient || !newClient.email) {
        return res.status(400).json({ error: "Dados inválidos" });
      }

      await collection.insertOne({
        ...newClient,
        createdAt: new Date(),
        metrics: {
          reach: 0,
          profileVisits: 0,
          followers: 0,
          campaigns: 0,
        },
      });

      return res.status(201).json({ message: "Cliente criado com sucesso" });
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Erro ao acessar MongoDB:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
