import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

// Notificación breve. variante: success | danger | warning | info
function Aviso({ texto, variante = 'success', onClose }) {
  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed">
      <Toast bg={variante} show={Boolean(texto)} onClose={onClose} delay={3500} autohide>
        <Toast.Body className={variante === 'warning' ? '' : 'text-white'}>{texto}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default Aviso;
