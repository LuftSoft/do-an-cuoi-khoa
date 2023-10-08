import { forwardRef, useId } from "react";

function TextAreaMe({ label, defaultValue, row = 3, required = false, spellCheck = false }, textAreaRef) {
	const id = useId();
	return (
		<div className="row mb-3">
			<label htmlFor={id} className="col-sm-3 col-form-label">
				{label}
			</label>
			<div className="col-sm-9">
				<textarea
					ref={textAreaRef}
					placeholder={label}
					defaultValue={defaultValue}
					required={required}
					rows={row}
					className="form-control"
					id={id}
					spellCheck={spellCheck}></textarea>
			</div>
		</div>
	);
}

export default forwardRef(TextAreaMe);
