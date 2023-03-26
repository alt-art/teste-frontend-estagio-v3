import { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ModalContext } from '../context/ModalContext';
import {
  getEquipmentById,
  getEquipmentModelById,
  getStatesByEquipmentId,
} from '../utils/api';

function ModalEquipment() {
  const { closeModal, modalId } = useContext(ModalContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeModal();
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [closeModal]);

  const [equipment] = useState(getEquipmentById(modalId));
  const [model] = useState(getEquipmentModelById(equipment?.equipmentModelId));
  const [states] = useState(getStatesByEquipmentId(modalId));

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-96 rounded bg-white p-5 shadow"
        ref={ref}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <div className="flex justify-end">
          <button
            className="rounded bg-red-500 px-2 py-1 text-white"
            onClick={closeModal}
          >
            Fechar
          </button>
        </div>
        <h1 className="text-2xl font-bold">{equipment?.name}</h1>
        <p className="font-bold opacity-70">{model?.name}</p>
        <div className="flex items-center">
          <p className="text-sm font-bold opacity-80">{states[0].name}</p>
          <div
            className="m-2 h-3 w-3 rounded-full"
            style={{ backgroundColor: states[0].color }}
          />
        </div>
        <div className="h-60 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left">Data</th>
                <th className="text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {states.map((state, i) => (
                <tr
                  key={i}
                  className="divide-x divide-gray-300 odd:bg-gray-200"
                >
                  <td>{new Date(state.date).toLocaleDateString()}</td>
                  <td>{state.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ModalEquipment;
