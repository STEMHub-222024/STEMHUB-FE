import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Heading.module.scss';

const cx = classNames.bind(styles);

function Heading({ className, onClick, children, ...passProps }) {
    let Comp = 'h1';

    const props = {
        onClick,
    };

    const classes = cx('wrapper', {
        [className]: className,
        ...passProps,
    });

    const arrayProps = Object.keys(passProps);

    for (const element of arrayProps) {
        switch (element) {
            case 'h2':
                Comp = 'h2';
                break;
            case 'h3':
                Comp = 'h3';
                break;
            case 'h4':
                Comp = 'h4';
                break;
            case 'h5':
                Comp = 'h5';
                break;
            case 'h6':
                Comp = 'h6';
                break;
            default:
                console.error('The parameter passed ' + element + ' is does not exist!');
                break;
        }
    }

    return (
        <Comp className={classes} {...props}>
            {children}
        </Comp>
    );
}

Heading.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    passProps: PropTypes.object,
};

export default Heading;
