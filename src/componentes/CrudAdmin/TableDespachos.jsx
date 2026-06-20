import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);

  const fetchDespachos = async () => {
    try {
      const response = await axios.get("/api/v1/despachos", {
        params: { t: new Date().getTime() }
      });
      if (Array.isArray(response.data)) setDespachos(response.data);
    } catch (error) {
      console.error("Error al obtener despachos:", error);
    }
  };

  useEffect(() => { fetchDespachos(); }, []);

  return (
    <table className="w-full text-center">
      <thead>
        <tr><th>ID</th><th>Compra</th><th>Dirección</th><th>Fecha</th><th>Camión</th><th>Estado</th></tr>
      </thead>
      <tbody>
        {despachos.map((d) => (
          <tr key={d.idDespacho}>
            <td>{d.idDespacho}</td><td>{d.idCompra}</td><td>{d.direccionCompra}</td>
            <td>{d.fechaDespacho}</td><td>{d.patenteCamion}</td>
            <td>{d.despachado ? "Entregado" : "Pendiente"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};