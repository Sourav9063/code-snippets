import { useId } from "react";

export function ImgInput({
  children,
  className,
  id,
  accept = "image/*",
  onSelect,
}) {
  const inputId = useId();
  const select = (ef) => {
    const file = ef.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (el) => {
        console.log(el.target.result);
        onSelect({ file: file, src: el.target.result });
      };
      fileReader.readAsDataURL(file); // to invoke fileReader.onload event
    }
  };
  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      <label htmlFor={inputId}>{children}</label>
      <input
        id={inputId}
        accept={accept}
        style={{ display: "none" }}
        onChange={select}
        type="file"
      />
    </div>
  );
}
