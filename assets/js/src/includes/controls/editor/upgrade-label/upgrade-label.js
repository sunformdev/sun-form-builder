const { Flex, FlexItem, Icon, Button } = wp.components;
import { plugins } from '@wordpress/icons';
import { attributes } from '../../../attributes';

const UpgradeLabel = ({ label, attributes }) => {
    return (
        <>
            <Flex>
                <FlexItem>{label}</FlexItem>
                <FlexItem>
                    <Button
                        isLink
                        href={attributes?.form?.upgrade?.link}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="wpformbuilder-button-upgrade"
                    >
                        <Icon icon={plugins} size={20} />
                        <span>Upgrade</span>
                    </Button>
                </FlexItem>
            </Flex>
        </>
    );
}
export default UpgradeLabel;