import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";

// Si el frontend está en AWS y el backend sigue en local, 
// usa la URL del túnel. Si el backend ya está desplegado en AWS, usa la URL del Load Balancer.
const API_URL = "http://ab4c3407667b94f96af654877f77605c-2136966934.us-east-1.elb.amazonaws.com";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);

  const fetchDespachos = async () => {
    try {
      // Agregamos parámetros de no-cache para evitar el 304 Not Modified
      const response = await axios.get(`${API_URL}/api/v1/despachos`, {
        params: { t: new Date().getTime() }, 
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("Datos recibidos del backend:", response.data);

      // VALIDACIÓN CRÍTICA: Solo actualizamos si es un Array real.
      // Si recibimos HTML (string) por error del balanceador, ignoramos.
      if (Array.isArray(response.data)) {
        setDespachos(response.data);
      } else {
        console.warn("La respuesta no es un array, ignorando datos malformados.");
        setDespachos([]);
      }
    } catch (error) {
      console.error("Error al obtener despachos:", error);
      setDespachos([]);
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
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow h-full overflow-hidden">
            <table className="table-fixed w-full">
              <thead>
                <tr className="py-10">
                  <th className="pr-10">ID</th>
                  <th className="pr-10">Compra</th>
                  <th className="pr-10">Dirección</th>
                  <th className="pr-10">Fecha</th>
                  <th className="pr-10">Camión</th>
                  <th className="pr-10">Estado</th>
                  <th className="pr-10">Intentos</th>
                  <th className="pr-10">Acción</th>
                </tr>
              </thead>
              <tbody>
                {/* Si no hay datos, mostramos mensaje o simplemente nada */}
                {despachos.length > 0 ? (
                  despachos.map((despacho) => (
                    <tr key={despacho.idDespacho}>
                      <td className="pr-10 py-10">{despacho.idDespacho}</td>
                      <td className="pr-10 py-10">{despacho.idCompra}</td>
                      <td className="pr-10 py-10">{despacho.direccionCompra}</td>
                      <td className="pr-10 py-10">{despacho.fechaDespacho}</td>
                      <td className="pr-10 py-10">{despacho.patenteCamion}</td>
                      <td className="pr-10 py-10">
                        {despacho.despachado ? "Entregado" : "Pendiente"}
                      </td>
                      <td className="pr-10 py-10">{despacho.intento}</td>
                      <td>
                        <button
                          onClick={() => handleAbrirModal(despacho)}
                          className="py-1 bg-orange-200 px-4 rounded-xl shadow-md hover:bg-orange-300"
                        >
                          Cerrar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-10 text-gray-400">
                      Cargando datos o sin despachos registrados...
                    </td>
                  </tr>
                )}
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
              fetchDespachos();
            }}
          />
        )}
      </Modal>
    </>
  );
};