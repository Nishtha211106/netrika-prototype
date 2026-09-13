const API_BASE_URL = 'http://localhost:5000';

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze image');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data; // { doctor_report: "...", patient_report: "..." }
}