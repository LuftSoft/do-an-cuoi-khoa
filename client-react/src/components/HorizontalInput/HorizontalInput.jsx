import { forwardRef, useId } from "react";

function HorizontalInput({ label, defaultValue, type = "text", min, required = false, spellCheck = false }, inputRef) {
	const id = useId();
	return (
		<div className="row mb-3">
			<label htmlFor={id} className="col-sm-3 col-form-label">
				{label}
			</label>
			<div className="col-sm-9">
				<input
					ref={inputRef}
					placeholder={label}
					defaultValue={defaultValue}
					type={type}
					min={min}
					required={required}
					className="form-control"
					id={id}
					spellCheck={spellCheck}
				/>
			</div>
		</div>
	);
}
export default forwardRef(HorizontalInput);
