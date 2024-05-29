import React, { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import FormInputGroup from "./FormInputGroup";

export function Form() {
  const [valorInicial, setValorInicial] = useState("");
  const [ipi, setIpi] = useState("");
  const [st, setSt] = useState("");
  const [icms, setIcms] = useState("18");
  const [lucro, setLucro] = useState(1.55);
  const [descontoFalso, setDescontoFalso] = useState("");
  const [precoFinal, setPrecoFinal] = useState("0,00");
  const [isCopied, setIsCopied] = useState(false);

  const estadosICMS = {
    AC: "7",
    AL: "7",
    AP: "7",
    AM: "7",
    BA: "7",
    CE: "7",
    DF: "7",
    ES: "7",
    GO: "7",
    MA: "7",
    MT: "7",
    MS: "7",
    MG: "12",
    PA: "7",
    PB: "7",
    PR: "12",
    PE: "7",
    PI: "7",
    RJ: "12",
    RN: "7",
    RS: "12",
    RO: "7",
    RR: "7",
    SC: "12",
    SE: "7",
    SP: "18",
    TO: "7",
  };

  useEffect(() => {
    const normalizeValue = (value) => {
      if (!value) return 0;
      return parseFloat(value.toString().replace(",", "."));
    };

    let valorBase = normalizeValue(valorInicial) || 0;
    let ipiCalculado = valorBase * (normalizeValue(ipi) / 100) + valorBase;
    let stCalculado = ipiCalculado * (normalizeValue(st) / 100) + ipiCalculado;
    let icmsCalculado =
      stCalculado * (normalizeValue(icms) / 100) + stCalculado;
    let total = icmsCalculado * normalizeValue(lucro);

    if (descontoFalso) {
      total = total / (1 - normalizeValue(descontoFalso) / 100);
    }

    setPrecoFinal(
      total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }, [valorInicial, ipi, st, icms, lucro, descontoFalso]);

  function handleInputChange(event, setFunction) {
    setFunction(event.target.value);
  }

  function copiarPrecoFinal() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(precoFinal)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        })
        .catch((err) => {
          console.error("Erro ao copiar preço final: ", err);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = precoFinal;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } catch (err) {
        console.error("Erro ao copiar preço final: ", err);
      }
      document.body.removeChild(textArea);
    }
  }

  function handleICMSSelection(event) {
    const estado = event.target.value.slice(0, 2);
    const icmsValue = estadosICMS[estado];
    if (icmsValue) {
      setIcms(icmsValue);
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <FormInputGroup
        text="Valor Inicial (R$)"
        placeholder="Digite o valor inicial"
        value={valorInicial}
        onInput={(e) => handleInputChange(e, setValorInicial)}
      />
      <FormInputGroup
        text="IPI (%)"
        placeholder="Digite a porcentagem do IPI"
        value={ipi}
        onInput={(e) => handleInputChange(e, setIpi)}
      />
      <FormInputGroup
        text="ST (%)"
        placeholder="Digite a porcentagem do ST"
        value={st}
        onInput={(e) => handleInputChange(e, setSt)}
      />
      <FormInputGroup
        list="icms-options"
        text="ICMS (%)"
        placeholder="Digite a porcentagem do ICMS ou escolha um estado"
        onChange={handleICMSSelection}
        value={icms}
        onInput={(e) => handleInputChange(e, setIcms)}
      />
      <datalist id="icms-options">
        {Object.entries(estadosICMS).map(([estado, icmsValue]) => (
          <option key={estado} value={`${estado} - ${icmsValue}`}>
            {`${estado} - ${icmsValue}%`}
          </option>
        ))}
      </datalist>
      <FormInputGroup
        text="Lucro (Multiplicador)"
        placeholder="Digite o multiplicador de lucro"
        value={lucro}
        onInput={(e) => handleInputChange(e, setLucro)}
      />
      <FormInputGroup
        text="Desconto Falso (%)"
        placeholder="Digite o 'desconto' falso (opcional)"
        value={descontoFalso}
        onInput={(e) => handleInputChange(e, setDescontoFalso)}
      />
      <div
        className={`alert alert-info fw-bold d-flex justify-content-between align-items-center copy-hover ${
          isCopied ? "bg-success text-white" : ""
        }`}
        style={{
          cursor: "pointer",
          transition: "background-color 0.3s, opacity 0.3s",
        }}
        onClick={copiarPrecoFinal}
      >
        Preço Final: R${precoFinal}
        <FaCopy className="ms-2" style={{ opacity: isCopied ? 0 : 0.6 }} />
        {isCopied && <span className="ms-2">Copiado!</span>}
      </div>
    </form>
  );
}
