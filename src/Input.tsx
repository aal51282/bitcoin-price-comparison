import { ChangeEventHandler } from "react";

export type InputProps = {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    className?: string;
    placeholder?: string;
};

export default function Input(props: InputProps) {
    return (
        <input type="text"
            className={"border border-white/10 bg-blue-950 p-2 rounded-lg " + props.className}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}/>
    );
}