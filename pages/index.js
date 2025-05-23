import { useState } from "react";
import * as XLSX from "xlsx";
import "../public/style.css";

export default function Home() {
  const [salario, setSalario] = useState(0);
  const [limite, setLimite] = useState(0);
  const [gastos, setGastos] = useState([]);

  const categorias = [
    "Alimentação",
    "Transporte",
    "Lazer",
    "Delivery",
    "Educação",
    "Saúde",
    "Compras",
    "Investimentos",
    "Outros"
  ];

  const adicionarGasto = () => {
    const categoria = document.getElementById("categoria").value;
    const valor = parseFloat(document.getElementById("valor").value);

    if (!categoria || isNaN(valor)) {
      alert("Preencha todos os campos!");
      return;
    }

    const novoGasto = { categoria, valor };
    setGastos([...gastos, novoGasto]);

    document.getElementById("categoria").value = "";
    document.getElementById("valor").value = "";
  };

  const totalGastos = gastos.reduce((acc, item) => acc + item.valor, 0);

  const gerarPlanilha = () => {
    const ws = XLSX.utils.json_to_sheet(gastos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gastos");
    XLSX.writeFile(wb, "gastos.xlsx");
  };

  const corLinha = (valor) => {
    const porcentagem = (valor / limite) * 100;
    if (porcentagem <= 60) return "verde";
    if (porcentagem <= 80) return "amarelo";
    if (porcentagem <= 100) return "laranja";
    return "vermelho";
  };

  return (
    <div className="container">
      <h1>💰 Planejador de Gastos</h1>

      <div className="input-group">
        <label>💸 Salário:</label>
        <input
          type="number"
          placeholder="Seu salário"
          value={salario}
          onChange={(e) => setSalario(parseFloat(e.target.value))}
        />
      </div>

      <div className="input-group">
        <label>🎯 Limite de Gastos:</label>
        <input
          type="number"
          placeholder="Quanto pode gastar"
          value={limite}
          onChange={(e) => setLimite(parseFloat(e.target.value))}
        />
      </div>

      <h2>➕ Adicionar Gastos</h2>
      <div className="input-group">
        <label>Categoria:</label>
        <select id="categoria">
          <option value="">Selecione</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input type="number" id="valor" placeholder="Valor" />

        <button onClick={adicionarGasto}>Adicionar</button>
      </div>

      {gastos.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((item, index) => (
                <tr key={index} className={corLinha(item.valor)}>
                  <td>{item.categoria}</td>
                  <td>R$ {item.valor.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="resumo">
            <strong>Salário:</strong> R$ {salario.toFixed(2)} <br />
            <strong>Limite de Gastos:</strong> R$ {limite.toFixed(2)} <br />
            <strong>Total de Gastos:</strong> R$ {totalGastos.toFixed(2)} <br />
            <strong>Saldo Restante:</strong>{" "}
            R$ {(salario - totalGastos).toFixed(2)}
          </div>

          <button className="btn-gerar" onClick={gerarPlanilha}>
            📥 Gerar Planilha Excel
          </button>
        </>
      )}
    </div>
  );
}
