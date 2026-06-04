const { useEffect, useRef } = wp.element;
import $ from 'jquery';
import 'select2';

const WPFrombuilderSelect2 = ({ value, onChange, options }) => {
    const selectRef = useRef();

    useEffect(() => {
        const $select = $(selectRef.current);

        $select.select2({
            data: options,
            width: '100%',
            multiple: true,
        });

        $select.on('change', (event) => {
            onChange(event.target.value);
        });

        return () => {
            $select.select2('destroy');
        };
    }, [options]);

    return (
        <select ref={selectRef} defaultValue={value}>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.text}
                </option>
            ))}
        </select>
    );
};

export default WPFrombuilderSelect2;
