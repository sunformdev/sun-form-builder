const WPFormbuilderGetAPIData = async (service, attributes, setAttributes) => {
    const response = await wp.apiFetch({
        path: 'sunform/v1/integrations',
        method: 'POST',
        data: {
            service: service,
            settings: attributes?.action_submit_settings ?? {}
        }
    });
    console.log('response--121>: ', response);
    if (response.data) {
        setAttributes({
            action_submit_settings: {
                ...attributes?.action_submit_settings,
                [service]: {
                    ...attributes?.action_submit_settings?.[service],
                    ...response?.data
                }
            }
        });
    }
}
export { WPFormbuilderGetAPIData }