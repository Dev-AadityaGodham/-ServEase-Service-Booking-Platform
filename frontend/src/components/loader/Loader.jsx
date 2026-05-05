import "./Loader.css";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-box">
      <div className="loader-spinner"></div>
      <span>{text}</span>
    </div>
  );
}