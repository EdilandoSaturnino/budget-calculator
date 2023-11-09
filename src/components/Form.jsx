import React, { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import FormInputGroup from "./FormInputGroup";

export function Form() {
  const [valorInicial, setValorInicial] = useState("");
  const [ipi, setIpi] = useState(3.25);
  const [st, setSt] = useState("");
  const [icms, setIcms] = useState("");
  const [lucro, setLucro] = useState(1);
  const [descontoFalso, setDescontoFalso] = useState("");
  const [precoFinal, setPrecoFinal] = useState("0,00");
  const [isCopied, setIsCopied] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const estadosICMS = {
    AC: "17",
    AL: "18",
    AP: "18",
    AM: "18",
    BA: "18",
    CE: "18",
    DF: "18",
    ES: "17",
    GO: "17",
    MA: "18",
    MT: "17",
    MS: "17",
    MG: "18",
    PA: "17",
    PB: "18",
    PR: "18",
    PE: "18",
    PI: "18",
    RJ: "20",
    RN: "18",
    RS: "18",
    RO: "17.5",
    RR: "17",
    SC: "17",
    SP: "18",
    SE: "18",
    TO: "18",
  };

  useEffect(() => {
    let valorBase = Number(valorInicial);
    let ipiCalculado = valorBase * (Number(ipi) / 100) + valorBase;
    let stCalculado = ipiCalculado * (Number(st) / 100) + ipiCalculado;
    let icmsCalculado = stCalculado * (Number(icms) / 100) + stCalculado;
    let total = icmsCalculado * Number(lucro);

    if (descontoFalso) {
      total = total / (1 - Number(descontoFalso) / 100);
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
    navigator.clipboard
      .writeText(precoFinal)
      .then(() => {
        setIsCopied(true);
        setShowCopied(true);
        setTimeout(() => {
          setIsCopied(false);
          setShowCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Erro ao copiar preço final: ", err);
      });
  }

  function handleICMSSelection(event) {
    const estado = event.target.options[event.target.selectedIndex].value.slice(
      0,
      2
    );
    const icmsValue = estadosICMS[estado];
    setIcms(icmsValue);
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <FormInputGroup
        text="Valor Inicial (R$)"
        placeholder={"Digite o valor inicial"}
        value={valorInicial}
        onInput={(e) => handleInputChange(e, setValorInicial)}
      />
      <FormInputGroup
        text="IPI (%)"
        placeholder={"Digite a porcentagem do IPI"}
        value={ipi}
        onInput={(e) => handleInputChange(e, setIpi)}
      />
      <FormInputGroup
        text="ST (%)"
        placeholder={"Digite a porcentagem do ST"}
        value={st}
        onInput={(e) => handleInputChange(e, setSt)}
      />
      <FormInputGroup
        list="icms-options"
        text="ICMS (%)"
        placeholder={"Digite a porcentagem do ICMS ou escolha um estado"}
        onChange={handleICMSSelection}
        value={icms}
        onInput={(e) => handleInputChange(e, setIcms)}
      />
      <datalist id="icms-options">
        {Object.entries(estadosICMS).map(([estado, icmsValue]) => (
          <option
            key={estado}
            value={icmsValue}
          >{`${estado} - ${icmsValue}%`}</option>
        ))}
      </datalist>
      <FormInputGroup
        text="Lucro (Multiplicador)"
        placeholder={"Digite o multiplicador de lucro"}
        value={lucro}
        onInput={(e) => handleInputChange(e, setLucro)}
      />
      <FormInputGroup
        text="Desconto Falso (%)"
        placeholder={"Digite o 'desconto' falso (opcional)"}
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
        <FaCopy className="ms-2" style={{ opacity: isCopied ? 0 : 0.6 }} />{" "}
        {isCopied && <span className="ms-2">Copiado!</span>}
      </div>
    </form>
  );
}
