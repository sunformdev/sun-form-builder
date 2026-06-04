const { useState, useEffect } = wp.element;
const { useSelect } = wp.data;
const { Flex, FlexBlock, FlexItem, DropdownMenu, Icon, __experimentalToggleGroupControl, __experimentalToggleGroupControlOption } = wp.components;
import { desktop, tablet, mobile, background } from '@wordpress/icons';
// import { useSelect } from '@wordpress/data';
import './label-responsive.css';


const LabelResponsive = ({ label, attributes, setAttributes }) => { // Đang ở đây, mới thêm 2 thuộc tính attributes và setAttributes
    const [deviceIcon, setDeviceIcon] = useState(desktop)
    const [selectedItem, setSelectedItem] = useState('1');
    const deviceIcons = {
        desktop: desktop,
        tablet: tablet,
        mobile: mobile
    };
    //const [unitControl, setUnitControl] = useState('px');
    const currentDevice = useSelect((select) => {
        return select('core/edit-post').__experimentalGetPreviewDeviceType();
    }, []);

    useEffect(() => {
        setDeviceIcon(deviceIcons[currentDevice.toLowerCase()]);
        // setUnitControl('px');
    }, [currentDevice]);

    const handleSelectDropdown = (newDevice, newIcon) => {
        wp.data.dispatch('core/edit-post').__experimentalSetPreviewDeviceType(newDevice); // Không dùng nữa từ bản 6.5 và đc thay thế 6.7. Nhưng chưa có hàm, dùng tạm đã
        setDeviceIcon(newIcon);
    }
    return (
        <>
            <Flex justify="flex-start" align="center">
                {/* <FlexItem> */}
                <label>{label}</label>
                {/* </FlexItem> */}
                {/* <FlexItem className="wpformbuilder-label-icon"> */}
                <DropdownMenu
                    icon={<Icon icon={deviceIcon} size="18" />}
                    className="wpformbuilder-dropdow-responsive"
                    controls={
                        [ // Đang ở đây, Kiểm tra focus của dropdown menu hiện tại focus icon desktop đầu
                            {
                                icon: <Icon icon={desktop} size="18" />,
                                onClick: () => handleSelectDropdown('Desktop', desktop),
                            },
                            {
                                icon: <Icon icon={tablet} size="18" />,
                                onClick: () => handleSelectDropdown('Tablet', tablet),
                            },
                            {
                                icon: <Icon icon={mobile} size="18" />,
                                onClick: () => handleSelectDropdown('Mobile', mobile),
                            },
                        ]
                    }
                // onToggle={(isOpen) => {
                //     setMenuOpen(isOpen);
                // }}
                />
                {/* </FlexItem> */}

            </Flex>
        </>
    );
}
export default LabelResponsive;