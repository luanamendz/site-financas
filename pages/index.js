import { useState } from "react";

export default function Home() {
  const [salario, setSalario] = useState("");
  const [categorias, setCategorias] = useState([
    { nome: "Alimentação", limite: "" },
    { nome: "Transporte", limite: "" },
    { nome: "Lazer", limite: "" },
  ]);

  const handleCategoriaChange = (index, value) => {
    const novasCategorias = [...categorias];
    novasCategorias[index].limite = value;
    setCategorias(novasCategorias);
  };

  const handleGerarPlanilha = () => {
    alert(
      `Salário: R$${salario}\n` +
        categorias
          .map((cat) => `${cat.nome}: R$${cat.limite || "0"}`)
          .join("\n") +
        `\n\nPlanilha gerada (simulação)!`
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Gerador de Planilhas Financeiras</h1>
      <div style={{ marginBottom: 20 }}>
        <label>
          Salário Mensal:{" "}
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            placeholder="Digite seu salário"
            style={{ width: "100%", padding: 8, marginTop: 5 }}
          />
        </label>
      </div>

      <h3>Defina seus limites por categoria:</h3>
      {categorias.map((cat, i) => (
        <div key={cat.nome} style={{ marginBottom: 15 }}>
          <label>
            {cat.nome}:{" "}
            <input
              type="number"
              value={cat.limite}
              onChange={(e) => handleCategoriaChange(i, e.target.value)}
              placeholder={`Limite para ${cat.nome}`}
              style={{ width: "100%", padding: 8, marginTop: 5 }}
            />
          </label>
        </div>
      ))}

      <button
        onClick={handleGerarPlanilha}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          borderRadius: 5,
        }}
      >
        Gerar Planilha
      </button>
    </div>
  );
}
