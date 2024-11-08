// hooks/useSidebarWidth.ts
import { useState } from 'react';

const DEFAULT_DRAWER_WIDTH = 350;

export const useSidebarWidth = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_DRAWER_WIDTH);

  return {
    isOpen,
    setIsOpen,
    drawerWidth,
    setDrawerWidth,
    effectiveWidth: isOpen ? drawerWidth : 0
  };
};