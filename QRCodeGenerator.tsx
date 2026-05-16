/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { QRCodeGenerator } from './components/qrcode/QRCodeGenerator';

export default function App() {
  const [color1, setColor1] = useState('#000000');
  const [color2, setColor2] = useState('#3b82f6');
  const [cornerSquareColor, setCornerSquareColor] = useState('#000000');
  const [cornerDotColor, setCornerDotColor] = useState('#000000');

  return (
    <Layout>
      <QRCodeGenerator 
        externalColor1={color1} 
        externalColor2={color2} 
        externalCornerSquareColor={cornerSquareColor}
        externalCornerDotColor={cornerDotColor}
        onColor1Change={setColor1} 
        onColor2Change={setColor2} 
        onCornerSquareColorChange={setCornerSquareColor}
        onCornerDotColorChange={setCornerDotColor}
      />
    </Layout>
  );
}
