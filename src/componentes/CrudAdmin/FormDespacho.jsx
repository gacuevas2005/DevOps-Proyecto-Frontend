import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = "http://ab4c3407667b94f96af654877f77605c-2136966934.us-east-1.elb.amazonaws.com";

export const FormDespacho = ({ venta, onClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const jsonData = {
      fechaDespacho: data.fechaDespacho,
      patenteCamion: data.patenteCamion,
      intento: 0,
      despachado: false,
      idCompra: venta.idVenta,
      direccionCompra: venta.direccionCompra,
      valorCompra: venta.valorCompra,
    };

    try {
      await axios.put(`${API_URL}/api/v1/ventas/${venta.idVenta}`, { despachoGenerado: true });
      await axios.post(`${API_URL}/api/v1/despachos`, jsonData);
      Swal.fire({ title: "Despacho registrado 🛻!", icon: "success", confirmButtonText: "Aceptar" });
    } catch (error) {
      console.error("Error:", error);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-24 text-xl">
      <div className="mx-auto text-3xl font-bold mb-10 text-teal-600">Ingreso de orden de despacho</div>
      <input type="date" className="border mb-5 w-full p-1" {...register("fechaDespacho", { required: true })} />
      <input type="text" placeholder="Patente" className="border mb-5 w-full p-1" {...register("patenteCamion", { required: true })} />
      <button className="py-6 bg-teal-600 text-white font-bold" type="submit">Asignar despacho</button>
    </form>
  );
};