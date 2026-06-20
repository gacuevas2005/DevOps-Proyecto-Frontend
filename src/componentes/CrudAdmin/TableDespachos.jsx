import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";

// URL del Load Balancer
const API_URL = "http://ab4c3407667b94f96af654877f77605c-2136966934.us-east-1.elb.amazonaws.com";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);

  const fetchDespachos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/despachos`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("Datos recibidos del backend:", response.data);

      // Si la respuesta es un array, úsalo. Si es un objeto, intenta acceder a la propiedad correcta
      if (Array.isArray(response.data)) {
        setDespachos(response.data);
      } else if (response.data && typeof response.data === 'object') {
        // Si el backend te devuelve un objeto, prueba con la propiedad 'data' o 'content' si existe
        // Si no, asignamos el objeto tal cual si parece una lista o vaciamos
        setDespachos(response.data.content || []); 
      }
    } catch (error) {
      console.error("Error al obtener despachos:", error);
    }
  };

  useEffect(() => {
    fetchDespachos();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
    setOpenModal(true);
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white h-full overflow-hidden">
            <table className="table-fixed">
              <thead>
                <tr className="py-10">
                  <th className="pr-10">Orden de despacho</th>
                  <th className="pr-10">Orden de compra</th>
                  <th className="pr-10">Dirección de entrega</th>
                  <th className="pr-10">Fecha despacho</th>
                  <th className="pr-10">Patente Camión</th>
                  <th className="pr-10">Entregado</th>
                  <th className="pr-10">Intentos de entrega</th>
                </tr>
              </thead>
              <tbody>
                {/* VALIDACIÓN DE SEGURIDAD AQUÍ */}
                {Array.isArray(despachos) && despachos.map((despacho) => (
                  <tr key={despacho.idDespacho}>
                    <td className="pr-10 py-10 items-center">{despacho.idDespacho}</td>
                    <td className="pr-10 py-10 items-center">{despacho.idCompra}</td>
                    <td className="pr-10 py-10 items-center">{despacho.direccionCompra}</td>
                    <td className="pr-10 py-10 items-center">{despacho.fechaDespacho}</td>
                    <td className="pr-10 py-10 items-center">{despacho.patenteCamion}</td>
                    <td className="pr-10 py-10 items-center">
                      {despacho.despachado ? "Despacho entregado" : "Despacho pendiente"}
                    </td>
                    <td className="pr-10 py-10 items-center">{despacho.intento}</td>
                    <td>
                      <button
                        onClick={() => handleAbrirModal(despacho)}
                        className="py-1 bg-orange-200 px-8 rounded-xl shadow-md hover:bg-orange-300/70 transition-all duration-300"
                      >
                        Cerrar despacho
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      <Modal onClose={() => setOpenModal(false)} open={openModal}>
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => {
              setOpenModal(false);
              fetchDespachos(); // Recargar datos al cerrar modal
            }}
          />
        )}
      </Modal>
    </>
  );
};