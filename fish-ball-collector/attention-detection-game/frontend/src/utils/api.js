// API utility functions

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const sendDataToBackend = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending data to backend:', error);
    // Fallback: Store in localStorage if backend is unavailable
    storeDataLocally(data);
    return null;
  }
};

export const getSessionData = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data/session/${sessionId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching session data:', error);
    return null;
  }
};

export const getAttentionAnalysis = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/${sessionId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching attention analysis:', error);
    return null;
  }
};

// Local storage fallback
const storeDataLocally = (data) => {
  try {
    const storedData = JSON.parse(localStorage.getItem('attentionGameData') || '[]');
    storedData.push({
      ...data,
      storedLocally: true,
      localTimestamp: Date.now()
    });
    localStorage.setItem('attentionGameData', JSON.stringify(storedData));
  } catch (error) {
    console.error('Error storing data locally:', error);
  }
};

export const syncLocalData = async () => {
  try {
    const localData = JSON.parse(localStorage.getItem('attentionGameData') || '[]');
    const pendingData = localData.filter(item => item.storedLocally);
    
    for (const data of pendingData) {
      await sendDataToBackend(data);
    }
    
    // Clear successfully synced data
    localStorage.setItem('attentionGameData', JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error syncing local data:', error);
    return false;
  }
};