import { useState, useRef, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import './Chatbot.css';

function Chatbot({ teachers = [], courses = [], enrollments = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bună! Sunt asistentul virtual al platformei de cursuri online. Cu ce te pot ajuta?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const buildContextPrompt = () => {
    let contextText = '\n\n=== IMPORTANT: CONTEXT REAL AL PLATFORMEI ===\n';
    
    contextText += `\n📊 STATISTICI REALE:\n`;
    contextText += `- Total profesori activi: ${teachers.length}\n`;
    contextText += `- Total cursuri disponibile: ${courses.length}\n`;
    contextText += `- Total studenți înscriși: ${enrollments.length}\n`;

    if (teachers.length > 0) {
      contextText += `\n👨‍🏫 LISTA COMPLETĂ DE PROFESORI:\n`;
      teachers.forEach(teacher => {
        const teacherCourses = courses.filter(c => c.teacher?.id === teacher.id);
        contextText += `- ${teacher.name} (Email: ${teacher.email})\n`;
        if (teacherCourses.length > 0) {
          contextText += `  Predă: ${teacherCourses.map(c => `"${c.title}"`).join(', ')}\n`;
        }
      });
    }

    if (courses.length > 0) {
      contextText += `\n📚 LISTA COMPLETĂ DE CURSURI DISPONIBILE:\n`;
      courses.forEach(course => {
        const courseEnrollments = enrollments.filter(e => e.course?.id === course.id);
        contextText += `\n▫️ "${course.title}"\n`;
        contextText += `   • Profesor: ${course.teacher?.name || 'Nespecificat'}\n`;
        contextText += `   • Categorie: ${course.categoryId ? `ID ${course.categoryId}` : 'Generală'}\n`;
        contextText += `   • Studenți înscriși: ${courseEnrollments.length}\n`;
      });
    }

    if (enrollments.length > 0) {
      contextText += `\n✍️ ÎNSCRIERI RECENTE:\n`;
      enrollments.slice(-5).forEach(enrollment => {
        contextText += `- ${enrollment.studentName} (${enrollment.email}) → "${enrollment.course?.title || 'Curs necunoscut'}"\n`;
      });
    }

    contextText += `\n=== INSTRUCȚIUNI CRITICE ===\n`;
    contextText += `TREBUIE să folosești DOAR informațiile de mai sus când răspunzi despre cursuri!\n`;
    contextText += `NU inventa cursuri care nu există în lista de mai sus!\n`;
    contextText += `Dacă utilizatorul întreabă "ce cursuri aveți?", listează EXACT cursurile din lista de mai sus!\n`;
    contextText += `Dacă nu există cursuri în baza de date, spune-i utilizatorului că momentan nu sunt cursuri disponibile.\n`;
    
    return contextText;
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .slice(1)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const contextPrompt = buildContextPrompt();
      const messageWithContext = currentInput + contextPrompt;

      console.log('=== CONTEXT TRIMIS CĂTRE GEMINI ===');
      console.log('Profesori:', teachers.length);
      console.log('Cursuri:', courses.length);
      console.log('Înscrieri:', enrollments.length);
      console.log('Context complet:', contextPrompt);

      const response = await geminiService.sendMessage(messageWithContext, conversationHistory);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      let errorMessage = 'Scuze, am întâmpinat o eroare.';
      
      if (error.message?.includes('API_KEY') || error.message?.includes('401')) {
        errorMessage = 'Eroare: API key invalid sau lipsă. Verifică configurația.';
      } else if (error.message?.includes('quota') || error.message?.includes('429')) {
        errorMessage = 'Eroare: Ai depășit limita de request-uri. Încearcă mai târziu.';
      } else if (error.message?.includes('404')) {
        errorMessage = 'Eroare: Modelul nu este disponibil. Verifică configurația API.';
      } else if (error.message) {
        errorMessage = `Eroare: ${error.message}`;
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>💬 Asistent Virtual</h3>
            <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && <div className="message assistant typing">Se scrie...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Scrie un mesaj..."
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || !inputMessage.trim()}>
              Trimite
            </button>
          </div>
        </div>
      )}
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Deschide asistentul virtual"
      >
        💬
      </button>
    </>
  );
}

export default Chatbot;