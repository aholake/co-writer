import { useEffect, useState } from 'react';

const useGetChatGPTResponse = (
  content: string,
  apiKey: string,
  model = 'gpt-4o',
): { result: string; loading: boolean } => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  useEffect(() => {
    if (!content || !apiKey) {
      return;
    }
    setLoading(true);
    const data = {
      model,
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    };

    // Make the API request
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        const improvedText = jsonResponse.choices?.[0]?.message?.content;
        setResult(improvedText || '');
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => setLoading(false));
  }, [content, apiKey]);
  return { loading, result };
};

export default useGetChatGPTResponse;
