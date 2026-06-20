import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = "http://ab4c3407667b94f96af654877f77605c-2136966934.us-east-1.elb.amazonaws.com";

export const FormCierreDespacho = ({ despacho, onClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const jsonData = {
      intento: data.intento,
      despachado: data.despachado === 'true', // Aseguramos que sea booleano
    };

    try {
      await axios.put(`${API_URL}/api/v1/despachos/${despacho.idDespacho}`, jsonData, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      Swal.fire({ title: "Despacho modificado 🛻!", icon: "success", confirmButtonText: "Aceptar" });
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center text-center px-24 text-xl">
      <div className="mx-auto text-3xl font-bold mb-10 text-teal-600">Editar y cierre de despacho</div>
      <div className="mb-5">
        <label className="block font-bold mb-2">ID despacho</label>
        <input disabled type="text" className="border rounded-lg w-full p-1 text-slate-400" value={despacho.idDespacho} />
      </div>
      <div className="mb-5">
        <label className="block font-bold mb-2">Intentos de entrega</label>
        <input type="number" defaultValue={despacho.intento} className="border rounded-lg w-full p-1" {...register("intento", { required: true })} />
      </div>
      <div className="mb-5">
        <label className="block font-bold mb-2">Estado</label>
        <select className="border rounded-lg w-full p-1" {...register("despachado", { required: true })}>
          <option value={false}>Despacho abierto</option>
          <option value={true}>Cerrar despacho</option>
        </select>
      </div>
      <button className="py-6 rounded-lg bg-teal-600 text-white font-bold" type="submit">Modificar Despacho</button>
    </form>
  );
};