import { forwardRef, useId } from "react";

function Checkbox({ label, defaultChecked }, checkboxRef) {
	const id = useId();
	return (
		<div className="form-check">
			<input
				ref={checkboxRef}
				placeholder={label}
				className="form-check-input"
				type="checkbox"
				defaultChecked={defaultChecked}
				id={id}
			/>
			<label className="form-check-label" htmlFor={id}>
				{label}
			</label>
		</div>
	);
}

export default forwardRef(Checkbox);
