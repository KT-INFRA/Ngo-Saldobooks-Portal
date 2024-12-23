import { useState } from 'react';

// ==============================|| HOOKS - Modal  ||============================== //

export default function useModal() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<null | any>();

  const openModal = (data: any = null) => {
    // Allow any type for data
    setOpen(true);
    setData(data);
  };
  const closeModal = () => {
    setOpen(false);
  };

  return {
    openModal,
    open,
    data,
    closeModal
  };
}
