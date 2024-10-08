import React from 'react';
import ReactDOM from 'react-dom/client';
import Settings from '../components/Settings';

const Options: React.FC = () => {
  return (
    <div>
      <h1>AI Co-Writer Settings</h1>
      <Settings />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Options />);

export default Options;
