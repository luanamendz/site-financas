import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [salario, setSalario] = useState("");
  const [limite, setLimite] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");

  const adicionarCategoria = () => {
    if (novaCategoria.trim() === "") return;
    setCategorias([...categorias, { nome: novaCategoria, gasto: "" }]);
    setNovaCategoria("");
  };

  const atualizarGasto = (index, valor) => {
    const novasCategorias = [...categorias];
    novasCategorias[index].gasto = valor;
    setCategorias(novasCategorias);
  };

  const gerarPlanilha = () => {
    const data = [
      ["Salário", salario],
      ["Limite Mensal", limite],
      [],
      ["Categoria", "Gasto"]
    ];

    categorias.forEach((cat) => {
      data.push([cat.nome, cat.gasto]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Finanças");

    XLSX.writeFile(wb, "planilha-financeira.xlsx");
  };

  const somaGastos = categorias.reduce((acc, cat) => acc + Number(cat.gasto || 0), 0);
  const limiteNum = Number(limite);

  return (
    <div className="container">
      <h1>Organizador Financeiro</h1>

      <div className="input-group">
        <label>Salário:</label>
        <input
          type="number"
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
          placeholder="Digite seu salário"
        />
      </div>

      <div className="input-group">
        <label>Limite Mensal:</label>
        <input
          type="number"
          value={limite}
          onChange={(e) => setLimite(e.target.value)}
          placeholder="Quanto quer gastar no máximo?"
        />
      </div>

      <div className="input-group">
        <label>Nova Categoria:</label>
        <input
          type="text"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          placeholder="Ex: Delivery, Transporte..."
        />
        <button onClick={adicionarCategoria}>Adicionar</button>
      </div>

      <h2>Gastos</h2>
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Gasto (R$)</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat, index) => {
            const valor = Number(cat.gasto || 0);
            let cor = "verde";

            if (somaGastos >= limiteNum) cor = "vermelho";
            else if (somaGastos >= limiteNum * 0.8) cor = "laranja";
            else if (somaGastos >= limiteNum * 0.5) cor = "amarelo";

            return (
              <tr key={index} className={cor}>
                <td>{cat.nome}</td>
                <td>
                  <input
                    type="number"
                    value={cat.gasto}
                    onChange={(e) => atualizarGasto(index, e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="resumo">
        <p>Total de Gastos: <strong>R$ {somaGastos.toFixed(2)}</strong></p>
        <p>Limite Definido: <strong>R$ {limite || 0}</strong></p>
      </div>

      <button onClick={gerarPlanilha} className="btn-gerar">
        Gerar Planilha
      </button>

      <style jsx>{`
        .container {
          max-width: 700px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial;
        }
        h1 {
          text-align: center;
        }
        .input-group {
          margin-bottom: 15px;
        }
        input[type="text"],
        input[type="number"] {
          padding: 8px;
          margin-right: 8px;
        }
        button {
          padding: 8px 16px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: center;
        }
        tr.verde {
          background-color: #d4edda;
        }
        tr.amarelo {
          background-color: #fff3cd;
        }
        tr.laranja {
          background-color: #ffeeba;
        }
        tr.vermelho {
          background-color: #f8d7da;
        }
        .resumo {
          margin-top: 15px;
          font-size: 1.1em;
        }
        .btn-gerar {
          margin-top: 15px;
          background-color: #4caf50;
          color: white;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
