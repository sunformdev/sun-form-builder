const { Flex, FlexItem, Icon, Button, ButtonGroup, Modal, TextControl, TabPanel, Tooltip, Text } = wp.components;
const { useState, useEffect, useMemo, useRef } = wp.element;
const { MediaUpload, MediaUploadCheck } = wp.blockEditor;
import { FixedSizeGrid } from 'react-window';
import { notAllowed, cloudUpload, lifesaver, lockOutline, lock } from '@wordpress/icons';
import icons from './lib/font-awesome';
import './icon.css';

/* ================= CONFIG ================= */
const COLUMN_WIDTH = 85.5;
const ROW_HEIGHT = 80;
const GRID_HEIGHT = 490;
const SEARCH_DEBOUNCE = 250;
/* ========================================= */

const formatLabel = (name) =>
    name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const IconControl = ({ label = 'Icon', attributes, setAttributes }) => {

    /* ================= STATE ================= */
    const iconType = attributes?.button?.icon?.type ?? 'none';
    const activeGroup = attributes?.state?.icon ?? 'brands';

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [gridWidth, setGridWidth] = useState(640);

    const gridRef = useRef(null);

    /* ================= ICON MAP ================= */
    const iconMap = {
        brands: (icons.brands || []).map(name => ({
            name,
            group: 'brands',
        })),
        solid: (icons.solid || []).map(name => ({
            name,
            group: 'solid',
        })),
        regular: (icons.regular || []).map(name => ({
            name,
            group: 'regular',
        })),
    };

    iconMap.all = [
        ...iconMap.brands,
        ...iconMap.solid,
        ...iconMap.regular,
    ];

    /* ================= SEARCH DEBOUNCE ================= */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.toLowerCase());
        }, SEARCH_DEBOUNCE);

        return () => clearTimeout(timer);
    }, [search]);

    /* ================= FILTER ICONS ================= */
    const filteredIcons = useMemo(() => {
        const list = iconMap[activeGroup] || [];

        if (!search) return list;

        return list.filter(icon =>
            icon.name.includes(search.toLowerCase())
        );
    }, [activeGroup, search]);

    /* ================= GRID SIZE ================= */
    const columnCount = Math.max(
        1,
        Math.floor(gridWidth / COLUMN_WIDTH)
    );

    const rowCount = Math.ceil(
        filteredIcons.length / columnCount
    );

    /* ================= RESIZE OBSERVER ================= */
    useEffect(() => {
        if (!gridRef.current) return;

        const observer = new ResizeObserver(entries => {
            setGridWidth(entries[0].contentRect.width);
        });

        observer.observe(gridRef.current);
        return () => observer.disconnect();
    }, []);

    /* ================= ACTIONS ================= */
    const setIconType = (type) => {
        setAttributes({
            button: {
                ...attributes.button,
                icon: {
                    ...attributes.button?.icon,
                    type,
                },
            },
        });

        if (type === 'icon_lib') {
            setIsOpen(true);
        }
    };

    const selectIcon = (icon) => {
        console.log('icon---> ', icon);
        setAttributes({
            button: {
                ...attributes.button,
                icon: {
                    type: 'icon_lib',
                    name: icon.name,
                    group: icon.group,
                },
            },
        });
    };

    const renderFAIcon = (icon) => {
        if (!icon || icon.type !== 'icon_lib') return null;

        return (
            <i
                className={`fa-${attributes?.button?.icon?.group} fa-${attributes?.button?.icon?.name}`}
                aria-hidden="true"
            />
        );
    };

    /* ================= GRID CELL ================= */
    const Cell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex;
        const icon = filteredIcons[index];

        if (!icon) return null;

        return (
            <div style={style}>
                <button
                    className={`wpf-icon-item${icon.name === attributes?.button?.icon?.name ? ' wpf-active' : ''}`}
                    title={formatLabel(icon.name)}
                    onClick={() => selectIcon(icon)}
                >
                    <span className='wpf-icon-content'>
                        <i className={`fa-${icon.group} fa-${icon.name}`} />
                    </span>
                    <span className="icon-label">
                        {formatLabel(icon.name)}
                    </span>
                </button>
            </div>
        );
    };

    /* ================= RENDER ================= */
    return (
        <>
            {/* ===== CONTROL BUTTONS ===== */}
            <Flex>
                <FlexItem>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '5px' }}>{label}</span>
                        {
                            <Tooltip
                                delay={0}
                                text={
                                    <>
                                        <span style={{display: 'block', marginBottom: '7px'}}>Upgrade now to access advanced features.</span>
                                        <Button title="Upgrade Now" variant="primary" size="small">Upgrade Now</Button>
                                    </>
                                }>
                                <Icon icon={lockOutline} size={20} />
                            </Tooltip>}
                    </label>
                </FlexItem>

                <FlexItem className="wpformbuilder-button-icon-pick">
                    <ButtonGroup style={{ display: 'flex', 'align-items': 'center' }}>
                        <Button
                            className={`wpformbuilder-button-icon${iconType === 'none' ? ' wpf-active' : ''}`}
                            onClick={() => setIconType('none')}
                            icon={<Icon icon={notAllowed} />}
                            title="None"
                        />
                        <MediaUploadCheck>
                            <MediaUpload
                                allowedTypes={['image/svg+xml']}
                                multiple={false}
                                onSelect={(media) => {
                                    setAttributes({
                                        button: {
                                            ...attributes.button,
                                            icon: {
                                                type: 'upload',
                                                id: media.id,
                                                url: media.url,
                                                mime: media.mime,
                                            },
                                        },
                                    });
                                }}
                                render={({ open }) => (
                                    <Button
                                        className={`wpformbuilder-button-icon${iconType === 'upload' ? ' wpf-active' : ''}`}
                                        onClick={open}
                                        icon={
                                            iconType === 'upload' && attributes?.button?.icon?.url
                                                ? <img src={attributes.button.icon.url} style={{ width: 18, height: 18 }} />
                                                : <Icon icon={cloudUpload} />
                                        }
                                        title="Upload SVG"
                                    />
                                )}
                            />
                        </MediaUploadCheck>
                        <Button
                            className={`wpformbuilder-button-icon${iconType === 'icon_lib' ? ' wpf-active' : ''}`}
                            onClick={() => setIconType('icon_lib')}
                            icon={
                                attributes?.button?.icon?.type === 'icon_lib' && attributes?.button?.icon?.name ? renderFAIcon(attributes?.button?.icon) : <Icon icon={lifesaver} />
                            }
                            title="Icon Library"
                        />
                    </ButtonGroup>
                </FlexItem>
            </Flex>

            {/* ===== MODAL ===== */}
            {isOpen && (
                <Modal
                    title="Font Awesome Icons"
                    onRequestClose={() => setIsOpen(false)}
                    className="wpf-icon-modal"
                    size="large"
                >
                    <Flex align="stretch" style={{ borderBottom: '1px solid #ccc' }}>

                        {/* LEFT TABS */}
                        <FlexItem style={{ minWidth: 160, paddingTop: '10px', borderRight: '1px solid #ccc', paddingRight: '10px' }}>
                            <TabPanel
                                orientation="vertical"
                                tabs={[
                                    { name: 'all', title: 'All Icons', className: 'wpformbuilder-panel-icon' },
                                    { name: 'brands', title: 'Brands', className: 'wpformbuilder-panel-icon' },
                                    { name: 'solid', title: 'Solid', className: 'wpformbuilder-panel-icon' },
                                    { name: 'regular', title: 'Regular', className: 'wpformbuilder-panel-icon' },
                                ]}
                                onSelect={(tab) =>
                                    setAttributes({
                                        state: {
                                            ...attributes.state,
                                            icon: tab,
                                        },
                                    })
                                }
                            >
                                {() => null}
                            </TabPanel>
                        </FlexItem>

                        {/* RIGHT CONTENT */}
                        <FlexItem style={{ flex: 1, paddingTop: '10px', display: 'flex', flexDirection: 'column' }}>

                            {/* CONTENT SCROLL */}
                            <div
                                className="wpf-icon-modal__body"
                                style={{
                                    flex: 1,
                                    paddingRight: '10px'
                                }}
                            >
                                <TextControl
                                    placeholder="Search icon..."
                                    value={search}
                                    onChange={setSearch}
                                />

                                <div ref={gridRef} style={{ height: GRID_HEIGHT }}>
                                    {gridWidth > 0 && filteredIcons.length > 0 && (
                                        <FixedSizeGrid
                                            columnCount={columnCount}
                                            columnWidth={COLUMN_WIDTH}
                                            height={GRID_HEIGHT}
                                            rowCount={rowCount}
                                            rowHeight={ROW_HEIGHT}
                                            width={gridWidth}
                                        >
                                            {Cell}
                                        </FixedSizeGrid>
                                    )}

                                    {filteredIcons.length === 0 && (
                                        <p style={{ padding: 10 }}>No icons found</p>
                                    )}
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div
                                className="wpf-icon-modal__footer"
                                style={{
                                    position: 'sticky',
                                    bottom: 0,
                                    background: '#fff',
                                    borderTop: '1px solid #ddd',
                                    padding: '12px',
                                    textAlign: 'right',
                                    zIndex: 10
                                }}
                            >
                                <Button
                                    variant="primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Insert
                                </Button>
                            </div>

                        </FlexItem>
                    </Flex>
                </Modal>
            )}
        </>
    );
};

export default IconControl;