type TLoadButtonProps = {
  clickFn: () => void;
};

function LoadButton({ clickFn }: TLoadButtonProps) {
  return (
    <button type="button" className="main__load-btn" onClick={clickFn}>
      Load More
    </button>
  );
}

export default LoadButton;
