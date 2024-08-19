import React, { useEffect, useState } from 'react';

type Setting = {
  apiKey?: string;
};

const Settings: React.FC = () => {
  const [setting, setSetting] = useState<Setting>({});
  // Load settings from storage when the component mounts
  useEffect(() => {
    chrome.storage.local.get(['apiKey'], (result) => {
      if (result['apiKey'] !== undefined) {
        setSetting({ ...setting, apiKey: result['apiKey'] });
      }
    });
  }, []);

  const handleSave = () => {
    // Save settings to chrome.storage
    chrome.storage.local.set(setting, () => {
      alert('Settings saved');
    });
  };

  return (
    <div>
      <label>
        ChatGPT API Key:
        <input
          type="text"
          value={setting.apiKey}
          onChange={(e) => {
            setSetting({ ...setting, apiKey: e.target.value });
          }}
        />
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Settings;
