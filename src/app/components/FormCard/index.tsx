import React, {
	ChangeEvent,
	ComponentProps,
	Dispatch,
	MouseEvent,
	SetStateAction,
} from 'react';
import { Link } from 'react-router-dom';
import './FormCard.scss';

interface Field<T> {
	type: 'text' | 'password';
	label: string;
	value: keyof T & string;
	placeholder?: string;
	transform?(value: string): string;
	required?: boolean;
}

interface Props<T> {
	title: string;
	buttonLabel: string;
	alert?: string;
	data: T;
	setData: Dispatch<SetStateAction<T>>;
	onSubmit(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void;
	footer?: {
		text: string;
	} & ComponentProps<Link>;
	fields: Field<T>[];
}

function FormCard<T extends { [key: string]: string }>({
	title,
	buttonLabel,
	alert,
	onSubmit,
	data,
	setData,
	fields,
	footer,
}: Props<T>) {
	const handleChange = (
		e: ChangeEvent<HTMLInputElement>,
		field: Field<any>
	) => {
		const { name, value } = e.target;
		const final = field.transform ? field.transform(value) : value;

		setData({ ...data, [name]: final });
	};

	return (
		<div className="form-card">
			<h2>{title}</h2>
			<hr />

			<form>
				{fields.map((field, index) => {
					const { value, label, type } = field;
					return (
						<div className="form-group" key={index}>
							<label htmlFor={value}>{label}:</label>
							<br />

							<input
								type={type}
								name={value}
								id={value}
								value={data[value]}
								onChange={e => handleChange(e, field)}
							/>
						</div>
					);
				})}

				{alert && <p className="alert-text">{alert}</p>}

				<button
					onClick={onSubmit}
					className="btn purple-btn form-btn"
					disabled={fields.some(field => field.required && !data[field.value])}>
					{buttonLabel}
				</button>

				<br />
				{footer && (
					<Link className="card-link" {...footer}>
						{footer.text}
					</Link>
				)}
			</form>
		</div>
	);
}

export default FormCard;
