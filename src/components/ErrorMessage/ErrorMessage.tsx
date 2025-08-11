import css from "./ErrorMessage.module.css";

interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  return (
    <div>
      <p className={css.text}>{message}</p>
    </div>
  );
}
