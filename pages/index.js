import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [salario, setSalario] = useState("");
  const [limiteTotal, setLimiteTotal] = useState("");
  const [categorias, setCategorias] = useState([
    { nome: "Comida", gasto: "" },
    { nome: "Delivery", gasto: "" },
    { nome: "Transporte", gasto: "" },
    { nome: "Roles", gasto: "" },
    { nome: "Diversão", gasto: "" },
  ]);
  const [novaCategoria, setNovaCategoria] = useState("");

  // Atualiza gasto de uma categoria
  const atualizarGasto = (index, valor) => {
    const novas = [...categorias];
    novas[index].gasto = valor;
    setCategorias(novas);
  };

  // Adiciona categoria nova
  const adicionarCategoria = () => {
    if (!novaCategoria.trim()) return;
    setCategorias([...categorias, { nome: novaCategoria.trim(), gasto: "" }]);
    setNovaCategoria("");
  };

  // Cores baseadas no gasto x limite
  // verde: gasto <= 70% limite
  // amarelo: 70% < gasto <= 90%
  // laranja: 90% < gasto <= 100%
  // vermelho: gasto > limite
  const corCelula = (gasto, limite) => {
    const gastoNum = parseFloat(gasto);
    const limiteNum = parseFloat(limite);
    if (isNaN(gastoNum) || isNaN(limiteNum)) return "transparent";
    const ratio = gastoNum / limiteNum;
    if (ratio > 1) return "#ff4d4d"; // vermelho
    if (ratio > 0.9) return "#ff944d"; // laranja
    if (ratio > 0.7) return "#ffeb3b"; // amarelo
    return "#b6fcd5"; // verde clarinho
  };

  // Gera planilha Excel pra baixar
  const gerarPlanilha = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ["Categoria", "Gasto", "Status"],
      ...categorias.map(({ nome, gasto }) => {
        const gastoNum = parseFloat(gasto) || 0;
        const limiteNum = parseFloat(limiteTotal) || 0;
        let status = "OK";
        const ratio = gastoNum / limiteNum;
        if (ratio > 1) status = "Estourado";
        else if (ratio > 0.9) status = "Quase lá";
        else if (ratio > 0.7) status = "Atenção";
        return [nome, gastoNum, status];
      }),
      ["Salário", salario, ""],
      ["Limite Total", limiteTotal, ""],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Controle Financeiro");
    XLSX.writeFile(wb, "planilha-financeira.xlsx");
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Gerador de Planilhas Financeiras</h1>

      <label style={{ display: "block", marginBottom: 10 }}>
        Salário Mensal:
        <input
          type="number"
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
          placeholder="Ex: 3500"
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 20 }}>
        Limite Total para Gastos:
        <input
          type="number"
          value={limiteTotal}
          onChange={(e) => setLimiteTotal(e.target.value)}
          placeholder="Ex: 2000"
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        />
      </label>

      <h3>Categorias e Gastos</h3>
      {categorias.map((cat, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <span>{cat.nome}:</span>
          <input
            type="number"
            value={cat.gasto}
            onChange={(e) => atualizarGasto(i, e.target.value)}
            placeholder="0"
            style={{
              marginLeft: 12,
              padding: 6,
              width: 120,
              backgroundColor: corCelula(cat.gasto, limiteTotal),
              border: "1px solid #ccc",
              borderRadius: 4,
              textAlign: "right",
            }}
          />
        </div>
      ))}

      <div style={{ marginTop: 15 }}>
        <input
          type="text"
          placeholder="Adicionar categoria"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          style={{ padding: 8, width: 200, marginRight: 10 }}
        />
        <button onClick={adicionarCategoria} style={{ padding: "8px 16px" }}>
          +
        </button>
      </div>

      <button
        onClick={gerarPlanilha}
        style={{
          marginTop: 30,
          padding: "12px 30px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        Gerar Planilha Excel
      </button>
    </div>
  );
}
