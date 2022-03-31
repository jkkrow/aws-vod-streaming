import './index.css';

interface InputProps {
  title: string;
  setTitle: (title: string) => void;
}

const Input: React.FC<InputProps> = ({ title, setTitle }) => {
  return (
    <label className="input">
      <div>Title</div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
    </label>
  );
};

export default Input;
