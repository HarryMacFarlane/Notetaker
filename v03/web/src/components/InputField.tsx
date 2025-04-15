import { useField } from "formik";
import { InputHTMLAttributes } from "react"
import Form from "react-bootstrap/Form"

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    type: string
    placeholder: string
    name: string
};

const InputField : React.FC<InputFieldProps> = (props) => {
    const [ field, { error } ] = useField(props);
    return (
        <Form.Group>
            <Form.Label htmlFor={field.name}>{props.placeholder}</Form.Label>
            <Form.Control {...field} id={field.name} />
            {(!!error) ? <Form.Control.Feedback> {error} </Form.Control.Feedback> : null}
        </Form.Group>
    )
}

export default InputField;