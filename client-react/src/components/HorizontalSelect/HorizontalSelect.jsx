import { forwardRef } from "react";

function HorizontalSelect(
	{ label, defaultValue, required = false, disable, onChange = () => {}, children },
	selectRef,
) {
	return (
		<div className="row mb-3">
			<label htmlFor="" className="col-sm-3 col-form-label">
				{label}
			</label>
			<div className="col-sm-9">
				<select
					disabled={disable}
					required={required}
					ref={selectRef}
					onChange={onChange}
					className="form-select"
					defaultValue={defaultValue}
					aria-label={label}>
					{children}
				</select>
			</div>
		</div>
	);
}

export default forwardRef(HorizontalSelect);
