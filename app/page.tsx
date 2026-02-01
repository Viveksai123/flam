'use client';

import React, { useState } from 'react';
import { DrawingCanvas } from '@/components/canvas';
import { Landing } from '@/components/landing';

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return <DrawingCanvas />;
  }

  return <Landing onStart={() => setShowApp(true)} />;
}
