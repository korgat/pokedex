import style from './loader.module.scss';

const Loader = () => {
    return (
        <div className={style.loader}>
            <img id={style.plateLoader} src="pokeball.png" alt="loading" />
        </div>
    );
};

export default Loader;
