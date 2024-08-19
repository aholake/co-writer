import React from 'react';
import ReactDOM from 'react-dom/client';
import Settings from '../components/Settings';

const Options: React.FC = () => {
  return (
    <div>
      <h1>Extension Settings</h1>
      <Settings />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Options />);

export default Options;
