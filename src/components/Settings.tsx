import React from 'react';

const Settings: React.FC = () => {
  const handleSave = () => {
    // Save logic here
  };

  return (
    <div>
      <label>
        Example Setting:
        <input type="checkbox" />
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Settings;
