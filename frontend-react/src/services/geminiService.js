// Adaugă aici cheia ta API Gemini
const API_KEY = '*******';

// URL corect pentru Gemini 2.5 Flash (modelul cel mai nou disponibil gratuit)
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const geminiService = {
  async sendMessage(message, conversationHistory = []) {
    try {
      // System prompt - instrucțiuni pentru chatbot
      const systemPrompt = `Ești un asistent virtual pentru o platformă de cursuri online SPECIFICĂ. 

REGULI CRITICE:
1. Vei primi în fiecare mesaj o secțiune "=== CONTEXT REAL AL PLATFORMEI ===" cu datele exacte din baza de date.
2. TREBUIE să răspunzi DOAR pe baza informațiilor din acel context!
3. NU inventa cursuri, profesori sau alte informații care nu sunt în context!
4. Când utilizatorul întreabă "ce cursuri aveți?" sau "ce profesori aveți?", listează EXACT ce găsești în context.
5. Dacă în context nu sunt cursuri, spune clar că momentan nu există cursuri disponibile.
6. Fii prietenos, profesionist și concis.
7. Răspunde ÎNTOTDEAUNA în limba română.

EXEMPLE DE RĂSPUNSURI CORECTE:
- "Avem următoarele cursuri: [lista exactă din context]"
- "Profesorul X predă cursul Y"
- "Momentan nu avem cursuri disponibile în platformă"

RĂSPUNSURI GREȘITE (NU face asta):
- "Avem cursuri de Python, Java, etc." (dacă acestea NU sunt în context)
- Să inventezi categorii sau cursuri generice`;

      // Construim conținutul pentru API
      const contents = [];
      
      // Adăugăm system prompt ca prim mesaj
      contents.push({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'Înțeles! Sunt gata să ajut utilizatorii platformei de cursuri online.' }]
      });
      
      // Adăugăm istoricul conversației
      conversationHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
      
      // Adăugăm mesajul curent
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      console.log('Calling Gemini API with URL:', API_URL);
      console.log('API Key (first 10 chars):', API_KEY.substring(0, 10) + '...');

      // Facem request la API
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Extragem textul din răspuns
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('Nu s-a primit răspuns de la API');
      }
      
      return text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  }
};