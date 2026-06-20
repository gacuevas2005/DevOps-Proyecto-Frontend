import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const FormDespacho = ({ venta, onClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/v1/ventas/${venta.idVenta}`, { despachoGenerado: true });
      await axios.post("/api/v1/despachos", {
        fechaDespacho: data.fechaDespacho,
        patenteCamion: data.patenteCamion,
        intento: 0,
        despachado: false,
        idCompra: venta.idVenta,
        direccionCompra: venta.direccionCompra,
        valorCompra: venta.valorCompra
      });
      Swal.fire({ title: "Registrado!", icon: "success" });
    } catch (error) { console.error(error); }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-10">
      <input type="date" {...register("fechaDespacho")} className="border mb-4 w-full" />
      <input type="text" placeholder="Patente" {...register("patenteCamion")} className="border mb-4 w-full" />
      <button type="submit" className="bg-teal-600 text-white p-2">Registrar</button>
    </form>
  );
};