import styles from './CareerBoxMessage.module.scss';

const CareerBoxMessage = ({ data, onAskAI }) => {
    return (
        <div className={styles.messChatAI}>
            <img src="logo.png" alt="assistant-icon" className={`${styles.img}`} style={{ width: 35, height: 35 }} />
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <p>Chào bạn &#128075; Tôi có thể giúp gì cho bạn ?</p>
                {data.map((item, id) => (
                    <div
                        key={id}
                        className={`${styles.title} ${styles.message}`}
                        onClick={() => onAskAI(item.question)}
                    >
                        {item.question}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerBoxMessage;
