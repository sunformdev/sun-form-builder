const { useState, useEffect, useRef } = wp.element;
import { useSelect } from '@wordpress/data';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-dreamweaver';
import './ace-editor.css';

const AceCode = ({ value, onChange, device, mode, placeholder }) => {
    const editorRef = useRef(null);
    
    useEffect(() => {
        const editor = ace.edit(editorRef.current);
        editor.setTheme('ace/theme/dreamweaver');
        editor.session.setMode(`ace/mode/${mode}`);
        editor.getSession().setUseWrapMode(true);
        editor.getSession().setUseWorker(false);
        editor.renderer.setShowGutter(false);
        editor.setValue(value || '');
        editor.setOptions({placeholder: placeholder});

        editor.on('change', () => {
            const newValue = editor.getValue();
            onChange(newValue, device);
        });

        return () => {
            editor.destroy();
        };
    }, [device]);

    useEffect(() => {
        const editor = ace.edit(editorRef.current);
        if (editor.getValue() !== value) {
            editor.setValue(value || '');
        }
    }, [value]);
    
    return (
        <>
            <div style={{ height: '310px', width: '100%' }}>
                <div ref={editorRef} style={{ width: '90%', height: '300px' }} className="wpformbuilder-ace-editor" data-device={device}></div>
            </div>
        </>
    );
};

export default AceCode;