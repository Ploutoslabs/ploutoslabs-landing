import { useEffect, useState } from 'react';

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return { isOpen, toggle, close };
}