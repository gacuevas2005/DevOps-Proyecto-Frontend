import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

// URL del Load Balancer
const API_URL = "http://ab4c3407667b94f96af654877f77605c-2136966934.us-east-1.elb.amazonaws.com";

export const FormDespacho = ({ venta, onClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const jsonData = {
      fechaDespacho: data.fechaDespacho,
      patenteCamion: data.patenteCamion,
      intento: 0,
      entregado: false,
      idCompra: venta.idVenta,
      direccionCompra: venta.direccionCompra,
      valorCompra: venta.valorCompra,
    };

    const jsonDataSales = { despachoGenerado: true };

    try {
      await axios.put(`${API_URL}/api/v1/ventas/${venta.idVenta}`, jsonDataSales);
      await axios.post(`${API_URL}/api/v1/despachos`, jsonData, {
        headers: { 'Content-Type': 'application/json' }
      });
      Swal.fire({
        title: "Despacho registrado 🛻!",
        text: "El despacho ha sido generado con éxito en la base de datos",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
    onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center text-center px-24 text-xl">
        <div className="mx-auto text-3xl font-bold mb-10 text-teal-600">Ingreso de orden de despacho</div>
        <div className="mb-5">
          <label className="block font-bold mb-2">Fecha de despacho</label>
          <input type="date" className="border border-gray-300 rounded-lg block w-full p-1" {...register("fechaDespacho", { required: true })} />
        </div>
        <div className="mb-5">
          <label className="block font-bold mb-2">Patente de camión</label>
          <input type="text" className="border border-gray-300 rounded-lg block w-full p-1" {...register("patenteCamion", { required: true })} />
        </div>
        <div className="mb-5">
          <label className="block font-bold mb-2">Orden de compra asociado</label>
          <input type="number" disabled={true} value={venta.idVenta} className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1" />
        </div>
        <button className="py-6 px-14 rounded-lg bg-teal-600 text-white font-bold mb-14" type="submit">Asignar despacho</button>
      </form>
    </>
  );
};