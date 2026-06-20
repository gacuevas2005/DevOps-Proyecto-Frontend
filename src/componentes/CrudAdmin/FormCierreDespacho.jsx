import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const FormCierreDespacho = ({ despacho, onClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/v1/despachos/${despacho.idDespacho}`, {
        intento: data.intento,
        despachado: data.despachado === 'true'
      });
      Swal.fire({ title: "Modificado!", icon: "success" });
    } catch (error) { console.error(error); }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-10">
      <input type="number" {...register("intento")} className="border mb-4 w-full" />
      <select {...register("despachado")} className="border mb-4 w-full">
        <option value={false}>Abierto</option>
        <option value={true}>Cerrado</option>
      </select>
      <button type="submit" className="bg-teal-600 text-white p-2">Guardar</button>
    </form>
  );
};