import "./Toast.css";

export default function Toast({ toast, onClose }) {
  if (!toast.show) return null;

  return (
    <div className={`toast-box ${toast.type}`}>
      <div>
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>

      <button onClick={onClose}>×</button>
    </div>
  );
}