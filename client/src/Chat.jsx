import io from 'socket.io-client';

const socket = io('http://localhost:3000');


function App() {

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  socket.on('chat message', function(msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
  );

  

  return (
    <>
      <h1>Socket.io Chat App</h1>
      <div id="chat">
        <ul id="messages"></ul>
        <form id="form" action="">
          <input id="input" autoComplete="off" /><button>Send</button>
        </form>
      </div>      
    </>
  )
}

export default App
